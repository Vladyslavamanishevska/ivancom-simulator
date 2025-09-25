// Force rebuild
import React, { useState } from 'react';

const scenarios = [
    {
      id: 1,
      title: "Затримка посилки",
      objection: "Чому моя посилка затримується вже на 3 дні? Ваш сервіс жахливий!",
      idealAnswer: "Я розумію ваше розчарування, і мені дуже шкода, що ви зіткнулися з такою ситуацією. Давайте я негайно перевірю статус вашого відправлення. Назвіть, будь ласка, номер накладної. Я зроблю все можливе, щоб прискорити процес і надати вам точну інформацію."
    },
    {
      id: 2,
      title: "Оплата за ліки",
      objection: "Чому я маю окремо платити за доставку ліків? Я думав, це входить у вартість!",
      idealAnswer: "Я розумію ваше запитання. Доставка медикаментів вимагає спеціальних умов транспортування та температурного режиму, тому ця послуга тарифікується окремо для гарантії їхньої безпеки. Давайте я перевірю, чи можемо ми запропонувати вам оптимальний тариф або пакетну послугу."
    },
    {
      id: 3,
      title: "Пошкоджена упаковка",
      objection: "Моя посилка прийшла з пошкодженою упаковкою! Що, якщо всередині все розбито?",
      idealAnswer: "Мені дуже шкода це чути. Безпека ваших відправлень – наш головний пріоритет. Будь ласка, не хвилюйтеся. Давайте разом складемо акт про пошкодження, і я негайно ініціюю перевірку та розкажу вам про варіанти компенсації."
    },
    {
      id: 4,
      title: "Конкуренти дешевші",
      objection: "Я знайшов іншу компанію, у якої доставка на 15% дешевша. Чому у вас так дорого?",
      idealAnswer: "Дякую, що поділилися цією інформацією. Ми дійсно не завжди найдешевші на ринку, оскільки фокусуємося на надійності, швидкості та гарантії збереження вантажу. Давайте я детальніше розкажу, що саме входить у нашу вартість, і, можливо, ми зможемо підібрати для вас вигідніший тарифний план."
    }
];

// ОСЬ ОНОВЛЕНА ФУНКЦІЯ
const sendDataToGoogleSheet = async (data) => {
  // Тепер ми відправляємо дані нашому "помічнику"
  const proxyUrl = '/.netlify/functions/report'; 

  try {
    await fetch(proxyUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log("Data successfully sent to the reporting function.");
  } catch (error) {
    console.error("Error sending data to the reporting function:", error);
  }
};


const App = () => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [userName, setUserName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysisResult(null);
    const currentScenario = scenarios[currentScenarioIndex];

    try {
      const response = await fetch('/.netlify/functions/analyze', {
        method: 'POST',
        body: JSON.stringify({
          name: userName,
          answer: userAnswer,
          scenario: currentScenario,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === 'success') {
        setAnalysisResult(result.analysis);
        await sendDataToGoogleSheet({
          name: userName,
          answer: userAnswer,
          scenario: currentScenario,
          analysis: result.analysis
        });
      } else {
        throw new Error(result.message || 'Unknown error from analysis function');
      }
    } catch (error) {
      setAnalysisResult({ error: error.toString() });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextScenario = () => {
    setAnalysisResult(null);
    setUserAnswer('');
    setCurrentScenarioIndex((prevIndex) => (prevIndex + 1) % scenarios.length);
  };

  if (!isNameSet) {
    return <NameInputScreen onNameSubmit={(name) => { setUserName(name); setIsNameSet(true); }} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {isLoading ? <LoadingScreen /> :
       analysisResult ? <AnalysisResult result={analysisResult} onNext={handleNextScenario} /> :
       <ScenarioScreen
         scenario={scenarios[currentScenarioIndex]}
         userAnswer={userAnswer}
         setUserAnswer={setUserAnswer}
         onAnalyze={handleAnalyze}
       />}
    </div>
  );
};

const NameInputScreen = ({ onNameSubmit }) => {
    const [name, setName] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onNameSubmit(name.trim());
        }
    };
    return (
        <div className="bg-white p-8 rounded-lg shadow-lg animate-fade-in w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Введіть ваше ім'я</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ваше ім'я"
                />
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg mt-4 hover:bg-blue-700 transition-colors">
                    Почати тренування
                </button>
            </form>
        </div>
    );
};

const ScenarioScreen = ({ scenario, userAnswer, setUserAnswer, onAnalyze }) => (
    <div className="bg-white p-8 rounded-lg shadow-lg animate-fade-in w-full max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{scenario.title}</h2>
        <p className="text-gray-600 mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-md">{scenario.objection}</p>
        <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введіть вашу відповідь тут..."
        />
        <button
            onClick={onAnalyze}
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg mt-4 hover:bg-green-700 transition-colors"
        >
            Аналізувати відповідь
        </button>
    </div>
);

const LoadingScreen = () => (
    <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg font-semibold text-gray-700">Аналізую вашу відповідь...</p>
    </div>
);

const AnalysisResult = ({ result, onNext }) => {
    if (result.error) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-lg animate-fade-in w-full max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">Помилка аналізу</h2>
                <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-800">
                    <p><strong>Деталі:</strong> {result.error}</p>
                </div>
                <button onClick={onNext} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg mt-6 hover:bg-blue-700 transition-colors">
                    Наступний сценарій
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg animate-fade-in w-full max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Результат аналізу</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl font-bold ${result.score >= 8 ? 'bg-green-500' : result.score >= 5 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                    {result.score}
                </div>
                <div className="flex-1">
                    <div>
                        <h3 className="text-xl font-semibold text-green-600 mb-2">✅ Сильні сторони</h3>
                        <p className="text-gray-700 bg-green-50 p-4 rounded-md border border-green-200">{result.strengths}</p>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-xl font-semibold text-yellow-600 mb-2">💡 Зони для росту</h3>
                        <p className="text-gray-700 bg-yellow-50 p-4 rounded-md border border-yellow-200">{result.areasForImprovement}</p>
                    </div>
                </div>
            </div>
            <button onClick={onNext} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg mt-4 hover:bg-blue-700 transition-colors">
                Наступний сценарій
            </button>
        </div>
    );
};

export default App;