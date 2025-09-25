const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  // Перевіряємо, чи це CORS-запит, і одразу даємо дозвіл
  if (event.httpMethod === 'OPTIONS') {
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
    const data = JSON.parse(event.body);
    const { name, answer, scenario } = data;
    const { title, objection, idealAnswer } = scenario;

    const prompt = `
      Ти - досвідчений бізнес-тренер... (ваш повний промпт, як і раніше)
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${apiKey}`;

    const requestBody = { contents: [{ parts: [{ text: prompt }] }] };

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!apiResponse.ok) {
      throw new Error(`Google API Error: ${apiResponse.statusText}`);
    }

    const aiData = await apiResponse.json();
    const analysisJsonString = aiData.candidates[0].content.parts[0].text.replace(/```json/g, "").replace(/```/g, "").trim();
    const analysisObject = JSON.parse(analysisJsonString);

    // Тут ми могли б записувати в Google Таблицю, але давайте спочатку змусимо AI працювати.
    // Ми повернемо запис в таблицю пізніше.

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ status: 'success', analysis: analysisObject }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ status: 'error', message: error.toString() }),
    };
  }
};