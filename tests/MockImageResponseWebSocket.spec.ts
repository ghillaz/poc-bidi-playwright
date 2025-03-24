import { test, expect } from "@playwright/test";
import * as fs from "fs";

/*
 * This test file is for learning purposes and may not be fully functional
 */

// Enable headed mode for debugging
test.use({ headless: false });

test("Mock image response via WebSocket on CoinMarketCap using custom WebSocket server", async ({ page }) => {
  const imagePath = "iologo.png"; // Change this to your actual image path
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64"); // Convert image to base64

  let wsOpened = false; // Flag to ensure WebSocket is opened only once

  // Listen for WebSocket connections and intercept messages
  page.on("websocket", (ws) => {
    if (!wsOpened) {
      console.log("WebSocket opened");
      wsOpened = true; // Ensure we log only once
    }

    ws.on("message", (message: string | Buffer) => {
      console.log("WebSocket message received:", message);

      // If the message is a request for an image (assuming 'request-image' is sent from the client)
      if (message.toString() === "request-image") {
        console.log("Sending image via WebSocket...");
        // Send the base64 image as a response
        const responseMessage = JSON.stringify({
          image: base64Image,
          contentType: "image/png",
        });
        console.log(`Response message: ${responseMessage.slice(0, 100)}...`); // Logging for sanity check
        (ws as WebSocket).send(responseMessage);
        console.log("Image sent via WebSocket");
      }
    });
  });

  // Start WebSocket communication in the page
  await page.goto("https://coinmarketcap.com/currencies/bitcoin/");

  // Wait for the image to be visible within the div containing it
  const targetImageSelector = "#section-coin-overview img"; // General selector for any image within the section
  await page.waitForSelector(targetImageSelector, { timeout: 5000 });

  console.log("Target image found, proceeding with WebSocket connection");

  // Establish WebSocket connection to the server and replace the image
  await page.evaluate(async () => {
    const socket = new WebSocket("ws://localhost:8085"); // Connect to the custom WebSocket server
    console.log("WebSocket connection opened on page"); // Debugging log

    socket.onmessage = (event: MessageEvent) => {
      console.log("WebSocket message received on page:", event.data); // Debugging log
      const data = JSON.parse(event.data);
      console.log("Parsed message:", data); // Log parsed message

      if (data.image) {
        // Find the target image within its parent div
        const targetImage = document.querySelector("#section-coin-overview img");
        if (targetImage) {
          console.log("Replacing image with new base64 data");
          targetImage.src = ""; // Clear the source to force reload
          targetImage.src = `data:${data.contentType};base64,${data.image}`; // Set new image source

          targetImage.onload = async () => {
            console.log("New image loaded");
            // Take screenshot after the image is loaded
            await page.screenshot({ path: "screenshot_after_image_replacement.png" });
            console.log("Screenshot saved after image replacement");
          };

          targetImage.onerror = () => {
            console.error("Error loading new image");
          };
        } else {
          console.error("Target image not found");
        }
      }
    };
  });
});
