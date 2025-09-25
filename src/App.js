import React, { useState } from 'react';

const SCRIPT_URL = process.env.REACT_APP_SCRIPT_URL;

function App() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const scenarios = [
    {
      title: "Затримка посилки",
      objection: "Добрий день, я відстежую посилку №12345, і вона вже 3 дні без руху на вашому сортувальному центрі. Де вона? Чому так довго?",
      idealAnswer: "Розумію ваше занепокоєння, це дійсно неприємно, коли очікуєш на важливе відправлення. Давайте я негайно перевірю детальну інформацію. Так, бачу вашу посилку. Іноді через велике навантаження сканування може оновлюватися з затримкою. Я створюю терміновий запит на склад, щоб фізично перевірили її місцезнаходження. Очікуйте на оновлення статусу протягом 2-3 годин. Я особисто проконтролюю це."
    },
    {
      title: "Оплата за доставку ліків",
      objection: "Я замовляв доставку ліків. Чому я маю платити за це окремо 200 гривень? Це ж просто маленька коробочка, ваші конкуренти доставляють безкоштовно!",
      idealAnswer: "Розумію ваше питання, ціна дійсно важлива. Справа в тому, що доставка медикаментів - це не просто перевезення. Ми гарантуємо дотримання спеціального температурного режиму на всьому шляху за допомогою термобоксів, щоб ліки не втратили своїх властивостей. Ця плата покриває вартість спеціалізованого пакування та гарантує, що ви отримаєте якісний та безпечний препарат. Це наш стандарт безпеки, від якого ми не можемо відмовитись."
    },
    {
      title: "Пошкоджена посилка",
      objection: "Я щойно отримав посилку, а коробка вся пом'ята, і товар всередині розбитий! Ви мені все зіпсували! Я вимагаю компенсацію!",
      idealAnswer: "Мені неймовірно прикро, що ви отримали посилку в такому стані. Це абсолютно неприпустимо, і я приношу свої вибачення. Будь ласка, не хвилюйтеся, ми все вирішимо. Сфотографуйте, будь ласка, пошкодження товару та упаковки і надішліть нам. Я негайно оформлюю претензію. Згідно з вартістю, вказаною у декларації, ми повністю компенсуємо збитки. Я допоможу вам пройти цей процес максимально швидко."
    }
  ];

  const currentScenario = scenarios[currentScenarioIndex];

  const handleNameSubmit = (e) => { e.preventDefault(); if (name.trim()) { setStep(1); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;
    setIsLoading(true);
    const dataToSend = { name, answer: userAnswer, scenario: { title: currentScenario.title, objection: currentScenario.objection, idealAnswer: currentScenario.idealAnswer } };
    try {
      const response = await fetch(SCRIPT_URL, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataToSend) });
      const result = await response.json();
      if (result.status === 'success') { setAiAnalysis(result.analysis); } 
      else { setAiAnalysis({ score: '!', strengths: 'Помилка аналізу', areasForImprovement: result.message }); }
    } catch (error) {
      setAiAnalysis({ score: '!', strengths: 'Помилка мережі', areasForImprovement: 'Не вдалося зв\'язатися з сервером аналітики. Можливо, потрібно оновити розгортання Google Скрипта.' });
    } finally {
      setIsLoading(false);
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    setAiAnalysis(null);
    setUserAnswer('');
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
    } else {
      setStep(2);
    }
  };

  const renderStep = () => {
    if (step === 0) {
      return (
        <form onSubmit={handleNameSubmit} className="text-center">
          <h2 className="text-2xl font-bold mb-4">Симулятор роботи з запереченнями</h2>
          <p className="mb-6">Будь ласка, введіть ваше ім'я та прізвище для початку.</p>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full max-w-md p-2 border border-gray-300 rounded-md shadow-sm" placeholder="Ім'я та Прізвище" />
          <button type="submit" className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Почати симуляцію</button>
        </form>
      );
    }
    if (step === 2) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Чудова робота!</h2>
          <p>Ви успішно пройшли всі сценарії. Ваші відповіді збережено для аналізу.</p>
          <button onClick={() => { setStep(0); setCurrentScenarioIndex(0); setName(''); }} className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Пройти ще раз</button>
        </div>
      );
    }
    if (isLoading) { return <div className="text-center"><h2 className="text-2xl font-bold animate-pulse">AI аналізує вашу відповідь...</h2></div>; }
    if (showFeedback && aiAnalysis) {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">Результат аналізу</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col items-center justify-center bg-gray-100 p-6 rounded-lg">
              <p className="text-lg font-semibold mb-2">Ваша оцінка</p>
              <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl font-bold ${aiAnalysis.score > 7 ? 'bg-green-500' : aiAnalysis.score > 4 ? 'bg-yellow-500' : 'bg-red-500'}`}>{aiAnalysis.score}</div>
            </div>
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-green-700 mb-2">✅ Сильні сторони</h3>
                <p className="text-gray-700">{aiAnalysis.strengths}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-700 mb-2">💡 Зони для росту</h3>
                <p className="text-gray-700">{aiAnalysis.areasForImprovement}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button onClick={handleNext} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">{currentScenarioIndex < scenarios.length - 1 ? 'Наступний сценарій' : 'Завершити'}</button>
          </div>
        </div>
      );
    }
    return (
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-2">{currentScenario.title}</h2>
        <p className="text-lg bg-gray-100 p-4 rounded-md mb-4"><span className="font-semibold">Клієнт каже:</span> "{currentScenario.objection}"</p>
        <textarea value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} className="w-full h-40 p-2 border border-gray-300 rounded-md shadow-sm" placeholder="Напишіть вашу відповідь тут..." />
        <button type="submit" className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Надіслати відповідь</button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg">
        {renderStep()}
      </div>
    </div>
  );
}

export default App;