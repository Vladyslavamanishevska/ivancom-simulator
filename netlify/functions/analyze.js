const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  console.log("--- analyze function started ---");

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
    console.log("Checking for GEMINI_API_KEY...");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("FATAL: GEMINI_API_KEY is not set in environment variables.");
      throw new Error("Server configuration error: API key is missing.");
    }
    console.log("GEMINI_API_KEY found.");

    console.log("Parsing request body...");
    const body = JSON.parse(event.body);
    const { name, answer, scenario } = body;
    console.log(`Received data for user: ${name}`);

    const prompt = `
      You are an expert coach for logistics managers. Your task is to analyze a manager's response to a client's objection.
      The client's objection was: "${scenario.objection}"
      The manager's response was: "${answer}"
      The ideal response for this scenario is: "${scenario.idealAnswer}"

      Analyze the manager's response based on the following criteria: empathy, problem-solving, professionalism, and clarity.
      Provide the analysis in a JSON format with the following structure:
      {
        "score": <an integer score from 1 to 10, where 1 is very poor and 10 is excellent>,
        "strengths": "<a string explaining the strong points of the manager's response>",
        "areasForImprovement": "<a string with constructive feedback on what could be improved>"
      }
      The response must be in Ukrainian.
    `;

    // --- ОСЬ ВИПРАВЛЕННЯ ---
    // Ми оновили адресу до найновішої, стабільної версії моделі Google AI
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    console.log("Sending request to Google AI...");
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });
    console.log(`Google AI response status: ${response.status}`);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Error from Google AI API:", errorBody);
      throw new Error(`Google AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Successfully received response from Google AI.");

    const analysisText = data.candidates[0].content.parts[0].text;
    const analysisJson = JSON.parse(analysisText);
    console.log("Successfully parsed AI analysis.");

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ status: 'success', analysis: analysisJson }),
    };

  } catch (error) {
    console.error("--- ERROR in analyze function ---");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ status: 'error', message: error.toString() }),
    };
  }
};