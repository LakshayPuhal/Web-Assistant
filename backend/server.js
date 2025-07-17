const express = require("express");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const cors = require("cors");

puppeteer.use(StealthPlugin());

const app = express();
app.use(express.json());
app.use(cors());

const siteUrls = {
  youtube: "https://www.youtube.com/",
  google: "https://www.google.com/",
  spotify: "https://www.spotify.com/",
  codeforces: "https://www.codeforces.com/",
};

const getWebsiteUrl = (siteName) => {
  return siteUrls[siteName.toLowerCase()] || `https://www.${siteName}.com/`;
};

// 🎤 API to process voice commands
app.post("/api/command", async (req, res) => {
  const { command } = req.body;
  console.log("Received command:", command);

  if (!command) return res.json({ response: "No command received" });

  try {
    if (command.includes("what is the time")) {
      const time = new Date().toLocaleTimeString();
      return res.json({ response: `The current time is ${time}` });
    }

    if (command.includes("what is the date")) {
      const date = new Date().toISOString().split("T")[0];
      return res.json({ response: `Today's date is ${date}` });
    }

    if (command.includes("search website")) {
      const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
      const page = await browser.newPage();

      const siteName = command.replace("search website", "").trim();
      const url = getWebsiteUrl(siteName);
      await page.goto(url);
      await browser.close();

      return res.json({ response: `Opened ${siteName} successfully.` });
    }

    return res.json({ response: "Sorry, I didn't understand that command." });
  } catch (error) {
    console.error("Error processing command:", error);
    return res.json({ response: "Error processing command." });
  }
});

app.listen(8000, () => console.log("Server running on port 8000"));
