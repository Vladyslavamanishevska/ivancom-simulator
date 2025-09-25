import React, { useState } from 'react';

// ВАЖЛИВО! Переконайтесь, що тут ваше правильне посилання
const SCRIPT_URL = process.env.REACT_APP_SCRIPT_URL;

// --- Компонент для вводу ПІБ ---
const Login = ({ userName, setUserName, onLogin }) => (
  <div className="p-6 sm:p-8 bg-white rounded-lg shadow-lg animate-fade-in text-center">
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Симулятор заперечень IVANCOM</h1>
    <p className="text-gray-600 mb-6">Будь ласка, введіть ваше ім'я, щоб розпочати тренування.</p>
    <input
      type="text"
      value={userName}
      onChange={(e) => setUserName(e.target.value)}
      className="w-full max-w-sm mx-auto p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition mb-4"
      placeholder="Ваше Прізвище та Ім'я"
    />
    <button 
      onClick={onLogin} 
      disabled={!userName.trim()}
      className="w-full max-w-sm mx-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      Почати
    </button>
  </div>
);

// --- Інші компоненти (без змін) ---
const Introduction = ({ onStart }) => (
  <div className="p-6 sm:p-8 bg-white rounded-lg shadow-lg animate-fade-in">
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Ласкаво просимо до симулятора заперечень IVANCOM!</h1>
    <p className="text-base sm:text-lg text-gray-600 mb-6">Цей тренажер допоможе вам стати ще більш впевненими у розмові з клієнтами та перетворювати будь-яке заперечення на успішну угоду.</p>
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6">
      <h2 className="text-lg sm:text-xl font-semibold text-blue-800 mb-2">Правила гри</h2>
      <p className="text-blue-700">Прочитайте сценарій. Введіть вашу відповідь у текстове поле. Після відправки ви побачите розбір ідеальної відповіді. Ваша відповідь автоматично збережеться.</p>
    </div>
    <button onClick={onStart} className="mt-8 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
      Почати симуляцію
    </button>
  </div>
);

const Scenario = ({ scenario, answer, setAnswer, onSubmit, isSubmitting }) => (
  <div className="p-6 sm:p-8 bg-white rounded-lg shadow-lg animate-fade-in">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Сценарій №{scenario.id}: "{scenario.title}"</h2>
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <p className="font-semibold text-gray-700">Ситуація:</p>
      <p className="text-gray-600">{scenario.situation}</p>
    </div>
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
      <p className="font-semibold text-red-800">Заперечення клієнта:</p>
      <p className="text-red-700 text-lg italic">"{scenario.objection}"</p>
    </div>
    <p className="font-semibold text-gray-700 mb-2">Ваше завдання: Сформулюйте вашу відповідь клієнту.</p>
    <textarea
      value={answer}
      onChange={(e) => setAnswer(e.target.value)}
      className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      placeholder="Введіть вашу відповідь тут..."
      disabled={isSubmitting}
    ></textarea>
    <button 
      onClick={onSubmit} 
      disabled={isSubmitting}
      className="mt-4 w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {isSubmitting ? "Відправляємо..." : "Надіслати та подивитись розбір"}
    </button>
  </div>
);

const Analysis = ({ scenario, onNext }) => (
  <div className="p-6 sm:p-8 bg-white rounded-lg shadow-lg animate-fade-in">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Розбір відповіді на заперечення "{scenario.title}"</h2>
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6">
      <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-2">"Ідеальна" відповідь:</h3>
      <p className="text-blue-700 italic">"{scenario.idealAnswer}"</p>
    </div>
    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
      <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-2">Чому це працює (Аналіз за алгоритмом ВПВ):</h3>
      {scenario.analysis.map((point, index) => (
        <p key={index} className="text-green-700 mb-1"><span className="font-bold">{point.title}:</span> {point.description}</p>
      ))}
    </div>
    <button onClick={onNext} className="mt-8 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
      {scenario.id === 11 ? "Завершити симуляцію" : "Перейти до наступного сценарію"}
    </button>
  </div>
);

const Completion = ({ onRestart }) => (
    <div className="p-8 bg-white rounded-lg shadow-lg text-center animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-600 mb-4">Тренування завершено!</h1>
        <p className="text-base sm:text-lg text-gray-700 mb-6">Чудова робота! Ви пройшли всі сценарії. Ваші відповіді успішно збережено.</p>
        <p className="text-gray-600 mb-8">Пам'ятайте, кожне заперечення — це можливість допомогти клієнту, а не перешкода.</p>
        <button onClick={onRestart} className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
            Пройти симуляцію ще раз
        </button>
    </div>
);

function App() {
  const [step, setStep] = useState('login');
  const [userName, setUserName] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- ФІНАЛЬНІ ТЕКСТИ СЦЕНАРІЇВ (БЕЗ "МИТНИЦІ") ---
  const scenarios = [
    { id: 1, title: "Окрема оплата за ліки", situation: "Клієнт оформив відправку особистих речей і ліків. При оплаті він бачить, що сума за ліки виставлена окремим рахунком.", objection: "А чому за ліки окрема оплата? Я ж все відправляю разом, чому я маю платити двічі?", idealAnswer: "Розумію ваше питання. Перевезення ліків — це наша унікальна послуга, яка вимагає особливої уваги: ми гарантуємо температурний режим, використовуємо спеціальне пакування та окрему процедуру оформлення для проходження кордону. Саме тому, щоб гарантувати безпеку та якість доставки, ця послуга тарифікується окремо.", analysis: [{ title: "Приєднання", description: "Фраза 'Розумію ваше питання' показує, що ви на боці клієнта." }, { title: "Вирішення", description: "Пояснюємо цінність та унікальність послуги, а не просто факт окремої оплати." }, { title: "Закриття", description: "Акцент на 'гарантії безпеки та якості' зміщує фокус з ціни на переваги." }] },
    { id: 2, title: "Затримка до 5 днів", situation: "Клієнт телефонує, щоб дізнатись статус посилки. За планом вона мала прибути вчора, але трекінг показує, що вона на кордоні.", objection: "Доброго дня, де моя посилка? Вже 5 днів в дорозі, хоча обіцяли за 3! Мені вона терміново потрібна!", idealAnswer: "Доброго дня. Я розумію ваше хвилювання, очікувати завжди неприємно. Перепрошую за затримку. Я бачу, що посилка проходить обов'язкову перевірку на кордоні. Зазвичай це займає 1-2 дні, але зараз можливі затримки. Я поставлю ваше відправлення на особливий контроль і повідомлю вас, як тільки статус зміниться. Очікуємо, що вона буде у вас протягом 2-3 днів.", analysis: [{ title: "Приєднання", description: "Визнаємо почуття клієнта ('розумію хвилювання') і вибачаємось." }, { title: "Вирішення", description: "Надаємо прозору інформацію (перевірка на кордоні) і конкретний, хоч і орієнтовний, термін." }, { title: "Закриття", description: "Пропозиція 'поставити на особливий контроль' показує особисту залученість і турботу." }] },
    { id: 3, title: "Затримка до 10 днів", situation: "Клієнт, посилка якого затримується вже більше тижня, пише в чат у роздратованому стані.", objection: "Це просто знущання! 10 днів! Де моя посилка? Ви її загубили? Чому ніхто нічого не повідомляє?", idealAnswer: "Щиро перепрошую за цю абсолютно неприпустиму ситуацію. Затримка в 10 днів — це серйозне відхилення від наших стандартів, і я розумію ваше обурення. Я негайно подаю запит на розшук вашої посилки, щоб з'ясувати причину. Я особисто буду контролювати процес і повернусь до вас з інформацією протягом 2 годин. Ми зробимо все, щоб вирішити це якнайшвидше.", analysis: [{ title: "Приєднання", description: "Погоджуємось з клієнтом ('абсолютно неприпустима ситуація') і беремо на себе відповідальність." }, { title: "Вирішення", description: "Не виправдовуємось, а починаємо діяти: 'подаю запит на розшук'." }, { title: "Закриття", description: "Встановлюємо чіткі часові рамки ('протягом 2 годин') і обіцяємо особистий контроль." }] },
    { id: 4, title: "Дорого", situation: "Новий клієнт хоче відправити посилку вагою 10 кг і отримує від менеджера розрахунок вартості.", objection: "Ого, а чому так дорого? Я думав, буде дешевше. У конкурентів наче ціни нижчі.", idealAnswer: "Дякую за питання. Розумію, що ціна є важливим фактором. Наша вартість включає не лише перевезення, а й повне страхування посилки, можливість відстеження 24/7 та гарантію доставки 'від дверей до дверей'. Для вас важливо, щоб посилка доїхала не просто дешево, а надійно і без зайвих турбот?", analysis: [{ title: "Приєднання", description: "Погоджуємось, що ціна важлива, і не сперечаємось." }, { title: "Вирішення", description: "Розкладаємо ціну на складові, показуючи цінність: страхування, трекінг, сервіс." }, { title: "Закриття", description: "Ставимо питання, яке переводить розмову з площини ціни в площину потреб клієнта (надійність)." }] },
    { id: 5, title: "Ліки окремою посилкою", situation: "Клієнт у відділенні хоче покласти кілька пачок ліків у коробку з одягом та продуктами.", objection: "Чому я не можу покласти ліки сюди? Це ж мої речі, яка різниця? Не хочу оформлювати дві посилки.", idealAnswer: "Я вас чудово розумію, набагато зручніше все скласти в одну коробку. Однак, за правилами міжнародних перевезень, ліки є специфічною категорією і мають декларуватися окремо. Це вимога для безпечного проходження кордону, щоб у контролюючих служб не виникло питань до всієї посилки. Оформлюючи їх окремо, ми гарантуємо, що і речі, і ліки пройдуть контроль без проблем.", analysis: [{ title: "Приєднання", description: "Погоджуємось з логікою клієнта ('зручніше в одну коробку')." }, { title: "Вирішення", description: "Посилання на зовнішні, об'єктивні правила ('правила перевезень'), а не на наші забаганки." }, { title: "Закриття", description: "Пояснюємо вигоду для клієнта: це гарантія безпроблемної доставки." }] },
    { id: 6, title: "Не зрозуміло, що таке однотипний товар", situation: "Клієнт заповнює декларацію на сайті і зупиняється на пункті про 'однотипні товари'.", objection: "Я не розумію, що писати в цьому полі 'однотипний товар'. Що це взагалі означає?", idealAnswer: "Це дуже гарне питання, термін дійсно може заплутати. Простими словами, однотипний товар — це кілька однакових речей. Наприклад, 5 однакових футболок або 3 однакові книги. А от одна футболка, одна книга і один телефон — це вже різні товари, їх потрібно вказувати окремо. Давайте я допоможу вам заповнити?", analysis: [{ title: "Приєднання", description: "Хвалимо клієнта за питання ('дуже гарне питання'), знімаючи можливе збентеження." }, { title: "Вирішення", description: "Даємо максимально просте пояснення з конкретними прикладами 'за' і 'проти'." }, { title: "Закриття", description: "Пропонуємо конкретну допомогу, щоб завершити процес." }] },
    { id: 7, title: "Загубили посилку", situation: "Трекінг посилки не оновлюється більше тижня, і клієнт впевнений, що її втратили.", objection: "Ви загубили мою посилку! Де вона? Там були дуже важливі речі! Що мені тепер робити?", idealAnswer: "Я розумію вашу паніку і щиро перепрошую за цю ситуацію. Давайте я негайно перевірю всю інформацію. Я подаю офіційний запит на розшук вашого відправлення. Також хочу вас запевнити, що кожна посилка застрахована. Я буду тримати вас в курсі розслідування і зв'яжуся з вами сьогодні до кінця дня з першими результатами.", analysis: [{ title: "Приєднання", description: "Визнаємо почуття клієнта ('розумію вашу паніку') і не сперечаємось." }, { title: "Вирішення", description: "Описуємо чіткий план дій: 'офіційний запит', 'перевірка страхування'." }, { title: "Закриття", description: "Даємо обіцянку про зворотний зв'язок з конкретним терміном ('сьогодні до кінця дня')." }] },
    { id: 8, title: "Переплутали посилку", situation: "Клієнту кур'єр доставив посилку, але всередині виявились чужі речі.", objection: "Я в шоці! Ви привезли мені чужу посилку! А де моя? Ви там взагалі дивитесь, що відправляєте?", idealAnswer: "Прийміть мої найщиріші вибачення, це наша серйозна помилка. Будь ласка, не хвилюйтесь, ми все виправимо. Прошу вас не відкривати посилку. Наш кур'єр зв'яжеться з вами протягом години, щоб забрати її у зручний час. Тим часом я вже з'ясовую, де ваше відправлення, і організую його термінову доставку. За цю незручність наступна доставка для вас буде безкоштовною.", analysis: [{ title: "Приєднання", description: "Повне і беззаперечне прийняття провини ('це наша серйозна помилка')." }, { title: "Вирішення", description: "Чіткі інструкції для клієнта ('не відкривати') і для компанії ('кур'єр зв'яжеться', 'з'ясовую')." }, { title: "Закриття", description: "Негайна компенсація (безкоштовна доставка), щоб згладити негатив." }] },
    { id: 9, title: "Я не буду оплачувати - повертайте", situation: "При отриманні посилки клієнту виставляють рахунок за державні збори, які він не очікував.", objection: "Я не зрозумів, що це ще за сума? Я вже заплатив за доставку! Я не буду нічого доплачувати, повертайте посилку назад.", idealAnswer: "Розумію ваше здивування. Сума, яку ви сплатили нам, — це за послуги доставки. Цей же рахунок виставлений відповідними органами країни отримання, це державний податок на товари. Ми виступаємо як ваш помічник у підготовці документів, але саме рішення та нарахування проводять державні служби. Якщо відмовитись, посилка повернеться, але вартість доставки не компенсується. Давайте разом перевіримо декларацію?", analysis: [{ title: "Приєднання", description: "Визнаємо, що ситуація несподівана для клієнта." }, { title: "Вирішення", description: "Чітко розмежовуємо відповідальність: наша послуга — доставка, рахунок — державний податок." }, { title: "Закриття", description: "Пояснюємо наслідки і пропонуємо допомогу, а не залишаємо клієнта сам на сам." }] },
    { id: 10, title: "Конфіскат", situation: "Клієнт отримує повідомлення, що його посилку затримали на кордоні.", objection: "Що означає 'конфісковано'? Ви жартуєте? Там були подарунки для родини! Вимагаю повернути мої речі!", idealAnswer: "Мені дуже прикро повідомляти вам це. Конфіскація — це рішення, яке приймають виключно контролюючі органи країни призначення, не ми. Зазвичай це стається, якщо у посилці були заборонені до ввезення товари. Я можу надати вам копію офіційного акту від відповідних служб, де вказана причина. Також ми можемо допомогти вам скласти запит до цих служб, якщо ви захочете оскаржити рішення.", analysis: [{ title: "Приєднання", description: "Висловлюємо співчуття." }, { title: "Вирішення", description: "Пояснюємо, що рішення приймають державні органи, і надаємо можливі причини." }, { title: "Закриття", description: "Пропонуємо конкретну допомогу в рамках своєї компетенції (надати документи, допомогти зі зверненням)." }] },
    { id: 11, title: "Зміна ваги", situation: "Клієнт відправив посилку, вказавши вагу 5 кг, а при фінальному розрахунку вага склала 7 кг, і сума до оплати збільшилась.", objection: "Чому вага змінилась? Я сам важив, було рівно 5 кг! Ви хочете мене обдурити?", idealAnswer: "Розумію, що зміна ціни є неочікуваною. Ми використовуємо високоточні електронні ваги, але крім фактичної ваги існує ще 'об'ємна вага'. Якщо посилка легка, але велика, вартість розраховується за її габаритами. Давайте я перевірю, за якою вагою було проведено розрахунок — за фактичною чи об'ємною, і ми разом звіримо виміри. Ми зацікавлені в максимальній прозорості.", analysis: [{ title: "Приєднання", description: "Визнаємо, що ситуація неприємна, і не звинувачуємо клієнта в неправильному зважуванні." }, { title: "Вирішення", description: "Вводимо поняття 'об'ємної ваги' — це об'єктивна причина, а не обман." }, { title: "Закриття", description: "Пропонуємо спільну перевірку і наголошуємо на прозорості, що викликає довіру." }] }
  ];

  const handleSubmit = (scenario) => {
    if (!currentAnswer.trim()) {
      alert("Будь ласка, введіть вашу відповідь.");
      return;
    }
    setIsSubmitting(true);
    const data = {
      name: userName,
      scenario: scenario.title,
      answer: currentAnswer,
    };

    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(() => {
      setCurrentAnswer('');
      setIsSubmitting(false);
      setStep(`analysis${scenario.id}`);
    })
    .catch(error => {
      console.error('Error!', error.message);
      alert("Сталася помилка під час відправки. Спробуйте ще раз.");
      setIsSubmitting(false);
    });
  };

  const renderStep = () => {
    if (step === 'login') { 
      return <Login 
        userName={userName} 
        setUserName={setUserName} 
        onLogin={() => setStep('intro')} 
      />; 
    }
    if (step === 'intro') { return <Introduction onStart={() => setStep('scenario1')} />; }
    if (step === 'completion') { return <Completion onRestart={() => { setStep('login'); setUserName(''); }} />; }
    
    const stepType = step.startsWith('scenario') ? 'scenario' : 'analysis';
    const scenarioId = parseInt(step.replace(/scenario|analysis/, ''));
    const currentScenario = scenarios.find(s => s.id === scenarioId);

    if (stepType === 'scenario') { 
      return <Scenario 
        scenario={currentScenario} 
        answer={currentAnswer}
        setAnswer={setCurrentAnswer}
        onSubmit={() => handleSubmit(currentScenario)}
        isSubmitting={isSubmitting}
      />; 
    }
    if (stepType === 'analysis') { 
      return <Analysis 
        scenario={currentScenario} 
        onNext={() => { 
          if (scenarioId < scenarios.length) { 
            setStep(`scenario${scenarioId + 1}`) 
          } else { 
            setStep('completion'); 
          } 
        }} 
      />; 
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {renderStep()}
      </div>
    </div>
  );
}

export default App;