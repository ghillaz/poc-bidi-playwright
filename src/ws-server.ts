// ws-server.ts
import WebSocket from "ws";
import * as fs from "fs";

const wss = new WebSocket.Server({ port: 8085 }); // WebSocket server on port 8080

wss.on("connection", (ws) => {
  console.log("New WebSocket connection established");

  // Read the image and convert it to base64
  const imagePath = "iologo.png"; // Change to your image path
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64"); // Convert image to base64

  // Listen for messages from the client
  ws.on("message", (message) => {
    console.log("Message received:", message);

    // If the message is "request-image", send the base64 image
    if (message === "request-image") {
      console.log("Sending image via WebSocket...");
      const responseMessage = JSON.stringify({
        image: base64Image,
        contentType: "image/png",
      });
      ws.send(responseMessage);
      console.log("Image sent via WebSocket");
    }
  });
});

console.log("WebSocket server listening on ws://localhost:8085");
