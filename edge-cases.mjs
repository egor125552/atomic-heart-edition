import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH || undefined,args:['--no-sandbox','--allow-file-access-from-files','--disable-web-security']});
const URL=process.env.GAME_URL || 'http://127.0.0.1:4173/?test=1';
let n=0;function assert(x,m){n++;if(!x)throw new Error(m);console.log('PASS',m)}
async function p(){const page=await browser.newPage();await page.goto(URL);await page.getByRole('button',{name:/Новая смена/}).click();return page}
async function texts(page){return page.locator('#choices button').allTextContents()}
async function click(page,re){await page.getByRole('button',{name:re}).first().click()}
try{
  {
    const page=await p();
    await page.evaluate(()=>window.__zeroShiftTest.goRoom('relay'));
    await click(page,/Начать ремонт/);
    const before=await page.evaluate(()=>window.__zeroShiftTest.getChallenge());
    await click(page,/Статус/);
    assert((await texts(page)).some(x=>/Вернуться к ремонту/.test(x)),'Статус посреди ремонта не выбрасывает из задачи');
    await click(page,/Вернуться к ремонту/);
    const after=await page.evaluate(()=>window.__zeroShiftTest.getChallenge());
    assert(JSON.stringify(before)===JSON.stringify(after),'Ремонт после справки продолжает ту же последовательность');
    await click(page,/Пауза/);await click(page,/Продолжить/);
    assert((await texts(page)).some(x=>/Вернуться к ремонту/.test(x)),'Пауза сохраняет активный ремонт');
    await click(page,/Вернуться к ремонту/);
    assert((await texts(page)).some(x=>/Низкая частота|Средняя частота|Высокая частота/.test(x)),'После паузы можно продолжить тот же ремонт');
    await page.close();
  }
  {
    const page=await p();
    await page.evaluate(()=>window.__zeroShiftTest.goRoom('corridor'));
    await click(page,/Прослушать неизвестный сигнал/);
    const before=await page.evaluate(()=>window.__zeroShiftTest.getSignal());
    await click(page,/Карта/);
    assert((await texts(page)).some(x=>/Вернуться к анализу сигнала/.test(x)),'Карта посреди сигнала не сбрасывает анализ');
    await click(page,/Вернуться к анализу сигнала/);
    const after=await page.evaluate(()=>window.__zeroShiftTest.getSignal());
    assert(JSON.stringify(before)===JSON.stringify(after),'После карты остаётся тот же сигнал');
    await page.close();
  }
  {
    const page=await p();
    await page.evaluate(()=>window.__zeroShiftTest.startChapter(3));
    await page.evaluate(()=>window.__zeroShiftTest.forceState({threatRoom:'ringA',threatFrozen:1}));
    await click(page,/Идти: восток/);
    assert((await texts(page)).some(x=>/Заблокировать|оглушающий|Замереть/.test(x)),'Нападение возникло перед сохранением');
    await click(page,/Пауза/);await click(page,/Сохранить и выйти/);await click(page,/Продолжить/);
    assert((await texts(page)).some(x=>/Заблокировать|оглушающий|Замереть/.test(x)),'Перезагрузка не позволяет пропустить нападение');
    await page.close();
  }
  {
    const page=await p();
    await page.evaluate(()=>window.__zeroShiftTest.startChapter(3));
    await page.evaluate(()=>window.__zeroShiftTest.goRoom('crew'));
    await page.evaluate(()=>window.__zeroShiftTest.forceState({threatRoom:'ringA',threatFrozen:0}));
    await click(page,/Разобрать найденное оборудование/);
    assert((await texts(page)).some(x=>/Заблокировать|оглушающий|Замереть/.test(x)),'Нападение во время разбора деталей не затирается наградой');
    await page.close();
  }
  {
    const page=await p();
    await page.evaluate(()=>window.__zeroShiftTest.startChapter(3));
    await page.evaluate(()=>window.__zeroShiftTest.goRoom('ringA'));
    await page.evaluate(()=>window.__zeroShiftTest.forceState({threatRoom:'archive',threatFrozen:0}));
    await click(page,/Прослушать неизвестный сигнал/);
    await click(page,/Сканировать канал/);
    assert((await texts(page)).some(x=>/Заблокировать|оглушающий|Замереть/.test(x)),'Нападение во время сканирования имеет приоритет над результатом анализа');
    await page.close();
  }
  {
    const page=await p();
    await page.evaluate(()=>localStorage.setItem('zero-shift-save-v1','{broken'));
    await page.reload();
    assert(!(await page.getByRole('button',{name:/Продолжить/}).isVisible()),'Повреждённое сохранение безопасно игнорируется');
    await page.close();
  }
  console.log(`EDGE CASES COMPLETE: ${n} checks passed.`);
}finally{await browser.close()}
