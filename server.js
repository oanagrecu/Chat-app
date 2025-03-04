require("dotenv").config();
const API_URL = "https://chat-app-78ko.onrender.com";

var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const cors = require("cors");
var app = express();
var http = require("http").Server(app);
const io = require("socket.io")(http, {
	cors: {
		origin: "https://oanagrecu.github.io/Chat-app",
		methods: ["GET", "POST"],
	},
});

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const corsOptions = {
	origin: "https://oanagrecu.github.io/Chat-app",
	methods: ["GET", "POST"], // Allow specific methods if needed
	allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
const MONGO_URI = process.env.MONGO_URI;

var Message = mongoose.model("Message", {
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
		await mongoose.connect(MONGO_URI);
		console.log("✅ Conectat la MongoDB!");
	} catch (err) {
		console.error("❌ Eroare la conectare:", err);
	}
}

connectToDB();

const PORT = process.env.PORT || 3000;
var server = http.listen(PORT, () => {
	console.log("Server is listening on port", PORT);
});

// async MyFunction(){
// 	try {
// let result = await request()
// console.log(result)
//  } catch (err) {
// 		console.log(err)
// }
// }
