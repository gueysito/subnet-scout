import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.IONET_API_KEY;

async function testIONetAPI() {
  try {
    const res = await fetch("https://api.io.net/v1/agents", {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(`Status ${res.status}`);

    const data = await res.json();
    console.log("✅ Successfully fetched io.net agents:");
    console.log(data);
  } catch (err) {
    console.error("❌ Error connecting to io.net:", err.message);
  }
}

testIONetAPI();