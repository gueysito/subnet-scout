// test_tau_v1.js
import fetch from 'node-fetch';
import 'dotenv/config';

async function test() {
  const key = process.env.TAOSTATS_API_KEY;
  if (!key) return console.error("❌ Missing TAOSTATS_API_KEY in .env");

  const url = `https://api.taostats.io/api/dtao/pool/history/v1?netuid=64&frequency=by_hour&block_start=5806712&block_end=5816712&page=1&order=block_number_desc`;

  try {
    const res = await fetch(url, {
      headers: {
        accept: 'application/json',
        Authorization: key
      }
    });
    if (!res.ok) {
      console.error(`❌ Taostats v1 error: HTTP ${res.status}`);
    } else {
      const json = await res.json();
      console.log('✅ Taostats v1 endpoint response:', json);
    }
  } catch (err) {
    console.error('❌ Error connecting to Taostats v1:', err.message);
  }
}

test();