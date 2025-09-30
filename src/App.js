import React, { useState } from 'react';

// --- КОМПОНЕНТИ СТОРІНОК (залишаються без змін) ---
const Introduction = ({ onStart }) => (
  <div className="p-6 sm:p-8 bg-white rounded-lg shadow-lg animate-fade-in">
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Ласкаво просимо у симулятор заперечень IVANCOM!</h1>
    <p className="text-base sm:text-lg text-gray-600 mb-6">Цей тренажер допоможе вам стати ще більш впевненими у розмові з клієнтами та перетворювати будь-яке заперечення на успішну угоду.</p>
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6">
      <h2 className="text-lg sm:text-xl font-semibold text-blue-800 mb-2">Правила гри</h2>
      <p className="text-blue-700">Прочитайте сценарій. Дайте відповідь так, як ви б зробили в реальному житті. Після цього ви побачите розбір ідеальної відповіді. Будьте чесними, мета — навчитися.</p>
    </div>
    <button onClick={onStart} className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
      Почати тренування
    </button>
  </div>
);

const NameInput = ({ onNameSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <div className="p-6 sm:p-8 bg-white rounded-lg shadow-lg animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Введіть ваше ім'я</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше ім'я"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
          Почати тренування
        </button>
      </form>
    </div>
  );
};

// --- ОСНОВНИЙ КОД СИМУЛЯТОРА ---
function App() {
  const [scenarios] = useState([
    {
      id: 1,
      objection: "Добрий день! Я бачу, що статус моєї посилки не оновлювався вже 5 днів. Вона просто десь загубилася? Чому нічого не відбувається?",
      idealAnswer: "Я чудово розумію ваше занепокоєння, бачити відсутність оновлень справді тривожно. Дозвольте вас запевнити, посилка не загублена. Іноді трапляється, що вантаж очікує своєї черги на сканування на великому транзитному хабі. Я вже подаю запит нашим партнерам на терміналі, щоб отримати точну інформацію про її фізичне місцезнаходження. Як тільки у мене будуть новини, я одразу вам повідомлю."
    },
    {
      id: 2,
      objection: "Чому кінцева вартість доставки виявилася вищою, ніж я розраховував? Моя посилка важить всього 2 кг, а ви порахували мені 5 кг!",
      idealAnswer: "Дякую за ваше питання, це важливий момент. У міжнародних перевезеннях вартість розраховується не тільки за фактичною вагою, а й за об'ємом, який посилка займає в літаку. Ваше відправлення легке, але габаритне. Дозвольте, я ще раз перевірю розрахунки і покажу вам, як це працює на нашому сайті, щоб у майбутньому для вас все було прозоро."
    },
    {
      id: 3,
      objection: "Я хочу відправити через вас антикварний кинджал у подарунок. Чому ваш менеджер каже, що це неможливо? Це ж просто сувенір, а не зброя!",
      idealAnswer: "Я розумію, як важливо для вас зробити цей подарунок. На жаль, предмети, які навіть візуально схожі на холодну зброю, заборонені до авіаперевезення згідно з міжнародними правилами безпеки. Це правило існує для гарантування безпеки абсолютно всіх відправлень, і ми не можемо його порушити. Я можу допомогти вам перевірити, чи є інші варіанти подарунків, які ми зможемо доставити без жодних проблем."
    },
    {
      id: 4,
      objection: "Чому я маю платити за ліки окремо? Я думав, це все входить у вартість доставки. Ви ж одна компанія! Це схоже на якісь приховані платежі.",
      idealAnswer: "Я розумію, що це могло викликати непорозуміння, і дякую, що уточнили. Дозвольте пояснити. Уявіть, що ми ваш персональний помічник у Європі. Ми надаємо дві окремі послуги: перша — це ми за вашим дорученням ідемо в аптеку і викуповуємо для вас ліки. Друга — це ми організовуємо надійну міжнародну доставку цієї покупки до вас. Тому рахунок розділяється: один за сам товар, інший — за нашу роботу з доставки."
    },
    {
      id: 5,
      objection: "Я чекаю на свою посилку вже два тижні! Де вона?! Ви що, знущаєтесь? Я заплатив вам гроші не для того, щоб ви годували мене обіцянками! Якщо її не буде завтра, я напишу про вашу шахрайську контору на всіх сайтах!",
      idealAnswer: "Я чую ваше обурення, і мені неймовірно шкода, що ми доставили вам такі негативні емоції. Така затримка є абсолютно неприпустимою, і я повністю на вашому боці. Давайте забудемо на секунду про обіцянки і перейдемо до справи. Назвіть, будь ласка, ваш номер трекінгу. Я не покладу слухавку, доки ми не з'ясуємо точний статус і причину затримки. Моє завдання — вирішити вашу проблему прямо зараз."
    },
    {
      id: 6,
      objection: "Це просто грабіж серед білого дня! Чому доставка простої коробки коштує так дорого? Я міг би сам з'їздити туди й назад за ці гроші! За що я взагалі плачу такі шалені гроші?!",
      idealAnswer: "Я чую ваше розчарування, і я розумію, що на перший погляд сума може здатися значною. Давайте я поясню, що саме входить у цю вартість, щоб у вас була повна прозорість. Це не просто перевезення, а експрес-доставка \"від дверей до дверей\", у вартість якої включено повне страхування вашого вантажу на кожному етапі, а також персональний менеджер, який доступний для вас і вирішує будь-які питання. Ми не конкуруємо з повільними поштовими сервісами, ми пропонуємо преміальну послугу, де головне — це швидкість, гарантія збереження та ваш спокій. Чи важливо для вас, щоб ваша посилка приїхала не тільки цілою, але й максимально швидко?"
    }
  ]);

  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [gameState, setGameState] = useState('introduction'); // introduction, nameInput, playing, analysis
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => setGameState('nameInput');
  const handleNameSubmit = (name) => {
    setUserName(name);
    setGameState('playing');
  };

  const handleAnalyze = async () => {
    if (!userAnswer.trim()) {
      setError('Будь ласка, введіть вашу відповідь.');
      return;
    }
    setError('');
    setIsLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch('/.netlify/functions/analyze', {
        method: 'POST',
        body: JSON.stringify({
          name: userName,
          answer: userAnswer,
          scenario: scenarios[currentScenarioIndex],
        }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setAnalysis(data.analysis);
        setGameState('analysis');
        
        fetch('/.netlify/functions/report', {
            method: 'POST',
            body: JSON.stringify({
                name: userName,
                scenario: scenarios[currentScenarioIndex].objection,
                userAnswer: userAnswer,
                idealAnswer: scenarios[currentScenarioIndex].idealAnswer,
                score: data.analysis.score,
                strengths: data.analysis.strengths,
                areasForImprovement: data.analysis.areasForImprovement
            })
        }).catch(err => console.error("Failed to send report:", err));

      } else {
        throw new Error(data.message || 'Analysis failed');
      }
    } catch (err) {
      setError(`Деталі: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextScenario = () => {
    setAnalysis(null);
    setUserAnswer('');
    setError('');
    setCurrentScenarioIndex((prevIndex) => (prevIndex + 1) % scenarios.length);
    setGameState('playing');
  };

  if (gameState === 'introduction') {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4"><Introduction onStart={handleStart} /></div>;
  }
  if (gameState === 'nameInput') {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4"><NameInput onNameSubmit={handleNameSubmit} /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {gameState === 'playing' && (
          <div className="p-8 bg-white rounded-lg shadow-lg animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Сценарій {currentScenarioIndex + 1}</h2>
            <p className="text-lg text-gray-600 mb-6">{scenarios[currentScenarioIndex].objection}</p>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg h-40 mb-4 focus:ring-2 focus:ring-blue-500"
              placeholder="Ваша відповідь..."
            />
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className={`w-full text-white font-bold py-3 px-6 rounded-lg transition duration-300 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Аналізуємо...' : 'Надіслати на аналіз'}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        )}

        {gameState === 'analysis' && analysis && (
          <div className="p-8 bg-white rounded-lg shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Результати аналізу</h2>
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Сильні сторони:</h3>
                <p className="text-green-700">{analysis.strengths}</p>
            </div>
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-md">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Що можна покращити:</h3>
                <p className="text-yellow-700">{analysis.areasForImprovement}</p>
            </div>
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Ідеальна відповідь:</h3>
                <p className="text-blue-700">{scenarios[currentScenarioIndex].idealAnswer}</p>
            </div>
            <div className="text-center mb-6">
                <p className="text-lg font-semibold text-gray-700">Ваша оцінка:</p>
                <p className="text-5xl font-bold text-blue-600">{analysis.score}/10</p>
            </div>
            {error && <div className="p-4 mb-4 bg-red-100 border-l-4 border-red-500 rounded-md text-red-700">Помилка аналізу: {error}</div>}
            <button onClick={handleNextScenario} className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
              Наступний сценарій
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;