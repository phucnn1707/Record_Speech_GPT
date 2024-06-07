const OpenAI = require("openai");
const fs = require("fs");
const openai = new OpenAI({
  apiKey: "",
});

const audiofun = async () => {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream("xyz.mp3"),
    model: "whisper-1",
    timeout: 60000,
  });
  console.log(transcription.text);
};

//audiofun();

const text2textFun = async () => {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: "What is the capital of VietNam" },
    ],
    model: "gpt-3.5-turbo",
  });
  console.log(completion.choices[0]);
};

text2textFun();
