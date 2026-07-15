export const CHAPTERS = [
  {
    id: 'awakening',
    number: 1,
    title: 'Чужой вызов',
    intro: 'Ты просыпаешься на станции «Орфей-9». В журнале значится нулевая смена — смена, которой не существует. Из технического канала звучит твой голос и просит открыть шлюз.',
    objective: 'Запусти релейный узел, проверь два сигнала и доберись до лифта.',
    start: 'dock',
    exit: 'lift',
    required: { repair: 1, signals: 2 },
    mechanics: ['signals', 'repair'],
    rooms: {
      dock: { name: 'Стыковочный отсек', exits: { east: 'corridor' }, safe: true, recharge: true },
      corridor: { name: 'Главный коридор', exits: { west: 'dock', north: 'relay', east: 'medbay', south: 'lift' }, signal: true },
      relay: { name: 'Релейный узел', exits: { south: 'corridor' }, task: 'repair', signal: true },
      medbay: { name: 'Медицинский блок', exits: { west: 'corridor' }, heal: true, signal: true },
      lift: { name: 'Грузовой лифт', exits: { north: 'corridor' }, exit: true }
    }
  },
  {
    id: 'blackout',
    number: 2,
    title: 'Слепая палуба',
    intro: 'Лифт останавливается между уровнями. Свет умер. Карта больше не показывает соседние комнаты, пока ты не дашь сонарный импульс.',
    objective: 'Запусти два аварийных автомата и найди серверную. Следи за батареей сонара.',
    start: 'lift2',
    exit: 'server',
    required: { repair: 2, signals: 1 },
    mechanics: ['signals', 'repair', 'darkness', 'sonar'],
    rooms: {
      lift2: { name: 'Застрявший лифт', exits: { north: 'junction' }, safe: true, recharge: true },
      junction: { name: 'Тёмный перекрёсток', exits: { south: 'lift2', west: 'breakerA', east: 'storage', north: 'deepHall' }, signal: true },
      breakerA: { name: 'Западный автомат', exits: { east: 'junction' }, task: 'repair' },
      storage: { name: 'Склад аккумуляторов', exits: { west: 'junction', north: 'breakerB' }, salvage: true, recharge: true },
      breakerB: { name: 'Восточный автомат', exits: { south: 'storage', west: 'deepHall' }, task: 'repair', signal: true },
      deepHall: { name: 'Глухой коридор', exits: { south: 'junction', east: 'breakerB', north: 'server' }, signal: true },
      server: { name: 'Серверная', exits: { south: 'deepHall' }, exit: true }
    }
  },
  {
    id: 'flood',
    number: 3,
    title: 'Вода помнит',
    intro: 'Нижний контур затоплен. Давление растёт каждый ход. По трубам стучит код, которого нет в протоколах станции.',
    objective: 'Закрой три клапана, удержи давление ниже критического и выйди через насосную.',
    start: 'airlock',
    exit: 'pump',
    required: { valves: 3, signals: 1 },
    mechanics: ['signals', 'pressure', 'valves', 'routes'],
    rooms: {
      airlock: { name: 'Воздушный шлюз', exits: { east: 'pipeHub' }, safe: true, recharge: true },
      pipeHub: { name: 'Узел трубопроводов', exits: { west: 'airlock', north: 'valveA', east: 'floodedLab', south: 'valveC' }, signal: true },
      valveA: { name: 'Клапан альфа', exits: { south: 'pipeHub', east: 'valveB' }, task: 'valve' },
      valveB: { name: 'Клапан бета', exits: { west: 'valveA', south: 'floodedLab' }, task: 'valve', signal: true },
      floodedLab: { name: 'Затопленная лаборатория', exits: { west: 'pipeHub', north: 'valveB', south: 'pump' }, hazardous: true, salvage: true },
      valveC: { name: 'Клапан гамма', exits: { north: 'pipeHub', east: 'pump' }, task: 'valve' },
      pump: { name: 'Насосная', exits: { north: 'floodedLab', west: 'valveC' }, exit: true, pressureRelief: true }
    }
  },
  {
    id: 'mimic',
    number: 4,
    title: 'Голос в вентиляции',
    intro: 'Система подтверждает: на палубе есть ещё один живой организм. Через секунду она исправляется: организмов два. Один из них использует твою биометрию.',
    objective: 'Собери три голосовых ключа и открой карантинный шлюз. Не дай имитатору войти в твою комнату.',
    start: 'security',
    exit: 'quarantine',
    required: { keys: 3, signals: 2 },
    mechanics: ['signals', 'stalker', 'locks', 'stun'],
    rooms: {
      security: { name: 'Пост охраны', exits: { east: 'ringA' }, safe: true, recharge: true },
      ringA: { name: 'Кольцевой коридор А', exits: { west: 'security', north: 'archive', east: 'ringB', south: 'crew' }, signal: true },
      archive: { name: 'Голосовой архив', exits: { south: 'ringA' }, task: 'key', signal: true },
      crew: { name: 'Жилой модуль', exits: { north: 'ringA', east: 'infirmary' }, task: 'key', salvage: true },
      infirmary: { name: 'Изолятор', exits: { west: 'crew', north: 'ringB' }, heal: true, signal: true },
      ringB: { name: 'Кольцевой коридор Б', exits: { west: 'ringA', south: 'infirmary', north: 'comms', east: 'quarantine' }, signal: true },
      comms: { name: 'Коммуникационный узел', exits: { south: 'ringB' }, task: 'key' },
      quarantine: { name: 'Карантинный шлюз', exits: { west: 'ringB' }, exit: true }
    }
  },
  {
    id: 'zero',
    number: 5,
    title: 'Нулевая смена',
    intro: 'Сердце станции передаёт один и тот же пакет во все стороны: «Я спасал тебя четыре раза. Теперь впусти меня». До перезапуска ядра осталось мало времени.',
    objective: 'Стабилизируй ядро, восстанови кислород и реши, кому принадлежит голос станции.',
    start: 'quarantine2',
    exit: 'core',
    required: { repair: 2, valves: 1, signals: 2 },
    mechanics: ['signals', 'repair', 'pressure', 'stalker', 'finale'],
    rooms: {
      quarantine2: { name: 'Внутренний шлюз', exits: { west: 'spine' }, safe: true, recharge: true },
      spine: { name: 'Центральный позвоночник', exits: { east: 'quarantine2', north: 'oxygen', west: 'coolant', south: 'memory' }, signal: true },
      oxygen: { name: 'Кислородный контур', exits: { south: 'spine', west: 'coreHall' }, task: 'repair' },
      coolant: { name: 'Контур охлаждения', exits: { east: 'spine', south: 'memory' }, task: 'valve', hazardous: true },
      memory: { name: 'Хранилище памяти', exits: { north: 'spine', west: 'coolant', east: 'coreHall' }, signal: true, salvage: true },
      coreHall: { name: 'Предъядерный зал', exits: { east: 'oxygen', west: 'memory', north: 'core' }, task: 'repair', signal: true },
      core: { name: 'Ядро «Орфея»', exits: { south: 'coreHall' }, exit: true }
    }
  }
];

export const UPGRADES = [
  { id: 'lungs', name: 'Замкнутый дыхательный контур', desc: 'Расход кислорода при перемещении меньше на 1.', apply: s => { s.mods.oxygenMove = Math.max(1, s.mods.oxygenMove - 1); } },
  { id: 'scanner', name: 'Резонансный фильтр', desc: 'Сканер получает 2 дополнительных заряда в начале главы.', apply: s => { s.mods.scannerBonus += 2; } },
  { id: 'armor', name: 'Композитный жилет', desc: 'Урон от опасностей меньше на 5.', apply: s => { s.mods.damageReduce += 5; } },
  { id: 'battery', name: 'Полевой аккумулятор', desc: 'Сонар и аварийные инструменты получают дополнительный заряд.', apply: s => { s.mods.batteryBonus += 1; } },
  { id: 'stun', name: 'Двойной импульс', desc: 'В начале главы выдаётся дополнительный заряд оглушения.', apply: s => { s.mods.stunBonus += 1; } },
  { id: 'focus', name: 'Холодный протокол', desc: 'Ошибка в ремонте не отнимает здоровье.', apply: s => { s.mods.safeRepair = true; } }
];

export const SIGNAL_LINES = [
  { real: true, line: 'Пост семь. Контрольная фраза: северный ветер. Нужна ручная разблокировка.', rhythm: 'stable' },
  { real: true, line: 'Медблок вызывает техника. Я ранен. Повторяю: код четыре-два-четыре.', rhythm: 'stable' },
  { real: true, line: 'Автоматика не отвечает. Передаю координаты один раз. Слушай внимательно.', rhythm: 'stable' },
  { real: false, line: 'Это ты. То есть я. Открой дверь, Егор. Быстрее, пожалуйста.', rhythm: 'broken' },
  { real: false, line: 'Контрольная фраза: северный... северный... открой. Я замерзаю.', rhythm: 'broken' },
  { real: false, line: 'Пост семь. Всё нормально. Не сканируй. Просто подтверди канал.', rhythm: 'broken' }
];

export const DIRECTION_NAMES = { north: 'север', south: 'юг', east: 'восток', west: 'запад' };
