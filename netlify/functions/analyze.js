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

    // ФІНАЛЬНИЙ, НАЙБІЛЬШ СУВОРИЙ ПРОМПТ
    const prompt = `
      **Твоя Роль:** Ти - API, яке повертає JSON.
      **Твоє Завдання:** Оцінити відповідь менеджера на заперечення клієнта для компанії IVANCOM.

      --- ДАНІ ДЛЯ АНАЛІЗУ ---
      **Ситуація (Заперечення клієнта):**
      "${objection}"

      **Еталонна відповідь (для твого розуміння):**
      "${idealAnswer}"

      **Відповідь менеджера (оціни саме її):**
      "${answer}"
      --- КІНЕЦЬ ДАНИХ ---

      Проаналізуй **"Відповідь менеджера"** за критеріями (емпатія, вирішення, тон, знання).
      **ВАЖЛИВО:** Твоя відповідь має бути ТІЛЬКИ валідним JSON-об'єктом. Без жодних пояснень, привітань чи тексту до або після. Починай відповідь одразу з символу '{'.
      Структура JSON: { "score": число, "strengths": "рядок", "areasForImprovement": "рядок" }.
    `;

    const apiKey = process.env.GEMINI_API_KEY;
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
    const rawResponse = aiData.candidates[0].content.parts[0].text;

    // ПОКРАЩЕНИЙ, "РОЗУМНИЙ" ПАРСИНГ
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI response did not contain a valid JSON object. Response was: " + rawResponse);
    }
    const analysisJsonString = jsonMatch[0];
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