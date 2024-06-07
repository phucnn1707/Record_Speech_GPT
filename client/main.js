const button = document.querySelector("button");
const recorder = new MicRecorder({
    bitRate: 128,
});

button.addEventListener("click", startRecording);

function startRecording() {
    recorder
        .start()
        .then(() => {
            button.textContent = "Stop recording";
            button.classList.toggle("btn-danger");
            button.removeEventListener("click", startRecording);
            button.addEventListener("click", stopRecording);
        })
        .catch((e) => {
            console.error(e);
        });
}

function stopRecording() {
    recorder
        .stop()
        .getMp3()
        .then(async([buffer, blob]) => {
            console.log(buffer, blob);

            // const file = new File(buffer, "music.mp3", {
            //   type: blob.type,
            //   lastModified: Date.now(),
            // });

            // const li = document.createElement("li");
            // const player = new Audio(URL.createObjectURL(file));
            // player.controls = true;
            // li.appendChild(player);
            // document.querySelector("#playlist").appendChild(li);

            // const text = "test";
            // document.getElementById("chat-output").innerHTML = text;

            const formData = new FormData();
            formData.append("audio", blob, "music.mp3");

            try {
                const response = await fetch("http://localhost:3000/upload-audio", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Transcription:", data);

                document.getElementById("chat-output").innerHTML =
                    data.transcription || "No transcription available";
            } catch (error) {
                console.error("Error:", error);
                document.getElementById("chat-output").innerHTML = "Error occurred";
            }

            button.textContent = "Start recording";
            button.classList.toggle("btn-danger");
            button.removeEventListener("click", stopRecording);
            button.addEventListener("click", startRecording);
        })
        .catch((e) => {
            console.error(e);
        });
}