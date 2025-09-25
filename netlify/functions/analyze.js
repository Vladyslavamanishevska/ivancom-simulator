const fetch = require('node-fetch');

exports.handler = async function (event, context) {
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
    const { answer, scenario } = data;
    const { objection, idealAnswer } = scenario;

    const prompt = `
      Ти - досвідчений бізнес-тренер... (весь ваш промпт залишається тут) ...
      Надай відповідь у форматі JSON українською мовою. Структура має бути такою:
      {
        "score": (оцінка від 1 до 10),
        "strengths": "(Що вдалося найкраще)",
        "areasForImprovement": "(Що можна покращити)"
      }
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    // ПОВЕРТАЄМО v1beta, ЯК У СПИСКУ МОДЕЛЕЙ
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`;

    const requestBody = { contents: [{ parts: [{ text: prompt }] }] };

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      throw new Error(`Google API Error: ${apiResponse.statusText}. Details: ${errorBody}`);
    }

    const aiData = await apiResponse.json();
    const analysisJsonString = aiData.candidates[0].content.parts[0].text.replace(/```json/g, "").replace(/```/g, "").trim();
    const analysisObject = JSON.parse(analysisJsonString);

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