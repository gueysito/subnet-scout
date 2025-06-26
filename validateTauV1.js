import fetch from 'node-fetch';
import dotenv from 'dotenv';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs';

dotenv.config();

async function run() {
  console.log('Fetching Taostats v1 data…');

  const apiKey = `${process.env.TAOSTATS_API_USERNAME}:${process.env.TAOSTATS_API_SECRET}`;
  const url = process.env.TAOSTATS_V1_URL;

  const res = await fetch(url, {
    headers: {
      Authorization: apiKey,
      Accept: 'application/json',
    },
  });

  const text = await res.text();
  console.log('Raw response length:', text.length);

  let json;
  try {
    json = JSON.parse(text);
    console.log('--- Raw JSON ---\n', JSON.stringify(json, null, 2));
  } catch (e) {
    console.error('❌ Failed to parse JSON:', e);
    return;
  }

  if (json.status_code === 401) {
    console.error('❌ API error:', json.message);
    return;
  }

  const schema = JSON.parse(fs.readFileSync('./tauV1.schema.json', 'utf8'));
  const ajv = new Ajv();
  addFormats(ajv);
  const validate = ajv.compile(schema);

  const valid = validate(json);
  if (valid) {
    console.log('✅ Data shape valid');
  } else {
    console.error('❌ Validation errors:', validate.errors);
  }
}

run();