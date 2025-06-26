import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const KEY = process.env.TAOSTATS_API_KEY;

async function testTauStats() {
  try {
    const res = await fetch(
      'https://api-prod2-v2.taostats.io/v2/network/chain/stats/latest',
      { headers: { Authorization: `Bearer ${KEY}` } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('✅ Taostats API response:', data);
  } catch (err) {
    console.error('❌ Taostats API error:', err.message);
  }
}

testTauStats();