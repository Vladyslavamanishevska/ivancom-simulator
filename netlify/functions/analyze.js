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
      Ти - досвідчений бізнес-тренер, який спеціалізується на навчанні менеджерів з клієнтського сервісу в логістичній компанії IVANCOM.
      Твоє завдання - надати детальний, конструктивний та доброзичливий фідбек на відповідь менеджера на складне заперечення клієнта.
      Аналізуй відповідь за такими критеріями:
      1.  Емпатія та приєднання: чи зрозумів менеджер емоційний стан клієнта?
      2.  Вирішення проблеми: чи запропонував менеджер конкретні кроки для вирішення ситуації?
      3.  Тон спілкування: чи був тон впевненим, спокійним та професійним?
      4.  Знання продукту/процесів: чи продемонстрував менеджер глибоке розуміння послуг компанії?

      Ось дані для аналізу:
      - Заперечення клієнта: "${objection}"
      - Ідеальна відповідь (еталон для тебе): "${idealAnswer}"
      - Відповідь менеджера: "${answer}"

      Надай відповідь у форматі JSON українською мовою. Структура має бути такою:
      {
        "score": (оцінка від 1 до 10, де 10 - ідеально),
        "strengths": "(Детально опиши, що менеджеру вдалося найкраще, посилаючись на критерії вище. Наприклад: 'Чудово, що ви почали з фрази..., це демонструє високий рівень емпатії.')",
        "areasForImprovement": "(Детально і тактовно поясни, що можна було б зробити краще. Наприклад: 'Наступного разу спробуйте одразу запропонувати конкретний крок, наприклад..., це додасть вашій відповіді конструктиву.')"
      }
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    // ОСЬ ОНОВЛЕНИЙ РЯДОК
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const requestBody = { contents: [{ parts: [{ text: prompt }] }] };

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!apiResponse.ok) {
      // Спробуємо отримати більше деталей про помилку від Google
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