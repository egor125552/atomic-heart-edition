import { CHAPTERS, UPGRADES, SIGNAL_LINES, DIRECTION_NAMES } from './data.js';
import {
  setAudioEnabled, unlockAudio, playUi, playRepairTone, playSignal,
  playSonar, playThreat, playPressure, speak
} from './audio.js';

const partUrls = [
  new URL('./runtime-parts/game-1.js.txt', import.meta.url),
  new URL('./runtime-parts/game-2.js.txt', import.meta.url),
  new URL('./runtime-parts/game-3.js.txt', import.meta.url),
  new URL('./runtime-parts/game-4.js.txt', import.meta.url),
 ];

try {
  const source = (await Promise.all(partUrls.map(async url => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Не загружен модуль ${url.pathname}: ${response.status}`);
    return response.text();
  }))).join('\n');
  const boot = new Function(
    'CHAPTERS', 'UPGRADES', 'SIGNAL_LINES', 'DIRECTION_NAMES',
    'setAudioEnabled', 'unlockAudio', 'playUi', 'playRepairTone', 'playSignal',
    'playSonar', 'playThreat', 'playPressure', 'speak', source
  );
  boot(
    CHAPTERS, UPGRADES, SIGNAL_LINES, DIRECTION_NAMES,
    setAudioEnabled, unlockAudio, playUi, playRepairTone, playSignal,
    playSonar, playThreat, playPressure, speak
  );
} catch (error) {
  console.error(error);
  const subtitle = document.getElementById('subtitle');
  if (subtitle) subtitle.textContent = 'Ошибка загрузки игры. Обнови страницу.';
}
