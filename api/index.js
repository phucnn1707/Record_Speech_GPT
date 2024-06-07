const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
const bodyParser = require("body-parser");
const cors = require("cors");

// Load environment variables from a .env file if available
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use environment variable for the API key
});

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "/Phuc_Intern/RecordSpeech/api/uploads");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

// Set up multer for file uploads
// const upload = multer({ dest: "uploads/" });

app.post("/upload-audio", upload.single("audio"), async(req, res) => {
    try {
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(req.file.path),
            model: "whisper-1",
        });

        console.log(transcription.text);

        const response = await openai.chat.completions.create({
            messages: [{ role: "user", content: transcription.text }],
            model: "gpt-3.5-turbo",
        });

        console.log(response.choices[0].message.content);

        res.json(response.choices[0]);
    } catch (error) {
        console.error("Error during transcription:", error);
        res.status(500).json({ error: "Transcription failed" });
    }
});

// app.post("/text2text", async (req, res) => {
//   try {
//     console.log("text req", req.body)
//     const { message } = req.body;

//     const response = await openai.chat.completions.create({
//       messages: [{ role: "user", content: message }],
//       model: "gpt-3.5-turbo",
//     });

//     console.log(response.choices[0].message.content);
//     res.json(response.choices[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "failed" });
//   }
// });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Endpoint to test the server
app.get("/", (req, res) => {
    res.send("Welcome to the audio transcription service!");
});