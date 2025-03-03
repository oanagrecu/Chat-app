require("dotenv").config();

var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

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

var server = http.listen(3000, () => {
	console.log("server is listening on port", server.address().port);
});
// async MyFunction(){
// 	try {
// let result = await request()
// console.log(result)
//  } catch (err) {
// 		console.log(err)
// }
// }
