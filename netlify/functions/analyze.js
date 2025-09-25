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

    // НОВИЙ, ПОКРАЩЕНИЙ ПРОМПТ
    const prompt = `
      **Твоя Роль:** Ти - бізнес-тренер для логістичної компанії IVANCOM.
      **Твоє Завдання:** Оцінити відповідь менеджера на заперечення клієнта.
      **Формат Відповіді:** Тільки JSON.

      **Критерії Оцінки:**
      1. Емпатія: Чи виявлено розуміння почуттів клієнта?
      2. Вирішення: Чи запропоновано чіткий план дій?
      3. Тон: Чи був тон професійним та впевненим?
      4. Знання: Чи показав менеджер знання процесів компанії?

      --- ДАНІ ДЛЯ АНАЛІЗУ ---
      **Ситуація (Заперечення клієнта):**
      "${objection}"

      **Еталонна відповідь (для твого розуміння):**
      "${idealAnswer}"

      **Відповідь менеджера (оціни саме її):**
      "${answer}"
      --- КІНЕЦЬ ДАНИХ ---

      Проаналізуй **"Відповідь менеджера"** за вказаними критеріями і надай результат у JSON форматі з полями "score" (число від 1 до 10), "strengths" (рядок), та "areasForImprovement" (рядок).
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