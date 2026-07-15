import { CHAPTERS } from './src/data.js';
let checks=0;
function ok(cond,msg){checks++;if(!cond)throw new Error(msg);console.log('PASS',msg)}
for(const c of CHAPTERS){
  ok(Boolean(c.rooms[c.start]),`${c.id}: старт существует`);
  ok(Boolean(c.rooms[c.exit]),`${c.id}: выход существует`);
  for(const [id,r] of Object.entries(c.rooms)){
    for(const [dir,target] of Object.entries(r.exits||{})){
      ok(Boolean(c.rooms[target]),`${c.id}: ${id}.${dir} ведёт в существующую комнату`);
    }
  }
  const seen=new Set([c.start]); const q=[c.start];
  while(q.length){const id=q.shift();for(const n of Object.values(c.rooms[id].exits||{}))if(!seen.has(n)){seen.add(n);q.push(n)}}
  ok(seen.has(c.exit),`${c.id}: выход достижим из старта`);
  ok(seen.size===Object.keys(c.rooms).length,`${c.id}: все комнаты связаны с картой`);
  const counts={repair:0,valves:0,keys:0,signals:0};
  for(const r of Object.values(c.rooms)){
    if(r.task==='repair')counts.repair++;
    if(r.task==='valve')counts.valves++;
    if(r.task==='key')counts.keys++;
    if(r.signal)counts.signals++;
  }
  for(const [kind,needed] of Object.entries(c.required)) ok(counts[kind]>=needed,`${c.id}: ресурсов механики ${kind} достаточно (${counts[kind]}/${needed})`);
}
console.log(`STATIC AUDIT COMPLETE: ${checks} checks passed.`);
