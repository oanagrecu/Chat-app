require("dotenv").config();

const API_URL = "https://chat-app-78ko.onrender.com";

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const http = require("http").Server(app);

const corsOptions = {
	origin: "https://oanagrecu.github.io/Chat-app",
	methods: ["GET", "POST"],
	allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const io = require("socket.io")(http, {
	cors: {
		origin: "https://oanagrecu.github.io/Chat-app",
		methods: ["GET", "POST"],
	},
});

const MONGO_URI = process.env.MONGO_URI;

const Message = mongoose.model("Message", {
	name: String,
	message: String,
});

// var messages = [
// 	{name: "Tim", message: "Hi"},
// 	{name: "Helene", message: "Bonjour"},
// ];

app.get("/messages", async (req, res) => {
	try {
		const messages = await Message.find();
		res.send(messages);
	} catch (err) {
		console.error("error", err);
		res.sendStatus(500);
	}
});
app.get("/messages/:user", async (req, res) => {
	try {
		var user = req.params.user;
		const messages = await Message.find({name: user});
		res.send(messages);
	} catch (err) {
		console.error("error", err);
		res.sendStatus(500);
	}
});

app.post("/messages", async (req, res) => {
	try {
		var message = new Message(req.body);
		var savedMessage = await message.save();

		console.log("Message saved:");
		var censored = await Message.findOne({message: "badword"});

		if (censored) {
			await Message.deleteOne({_id: censored.id});
		} else {
			io.emit("message", req.body);
			res.sendStatus(200);
		}
	} catch (error) {
		res.sendStatus(500);
		console.error(error);
	}
});

io.on("connection", (socket) => {
	console.log("A user connected");
});

async function connectToDB() {
	try {
		console.log("Connecting to:", MONGO_URI);
		await mongoose.connect(MONGO_URI);
		console.log("✅ Connected to MongoDB!");
	} catch (err) {
		console.error("❌ MongoDB Connection Error:", err);
	}
}

connectToDB();

const PORT = process.env.PORT || 3000;
var server = http.listen(PORT, () => {
	console.log("Server is listening on port", PORT);
});
