const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  console.log("--- report function started ---");

  if (event.httpMethod === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request.");
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    };
  }

  try {
    console.log("Checking for GOOGLE_SCRIPT_URL...");
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
      console.error("FATAL: GOOGLE_SCRIPT_URL is not set in environment variables.");
      throw new Error("Server configuration error: Google Script URL is missing.");
    }
    console.log("GOOGLE_SCRIPT_URL found.");

    console.log("Sending data to Google Script...");
    const response = await fetch(scriptUrl, {
      method: 'POST',
      body: event.body,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(`Google Script response status: ${response.status}`);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Error from Google Script:", errorBody);
      throw new Error(`Google Script returned an error: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("Successfully sent data to Google Script.");

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(responseData),
    };

  } catch (error) {
    console.error("--- ERROR in report function ---");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ status: 'error', message: error.toString() }),
    };
  }
};