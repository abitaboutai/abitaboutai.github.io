---
layout: default
permalink: /
title: ""
---

<style>
  /* Full-viewport ASCII splash */
  .ascii-splash{
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px 16px;
    background: #0b1020;
    color: rgba(255,255,255,0.92);
  }
  .ascii-splash__inner{
    width: min(980px, 100%);
  }
  .ascii-splash__pre{
    margin: 0;
    padding: 18px 16px;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 16px;
    background: rgba(0,0,0,0.28);
    white-space: pre;
    overflow-x: auto;
    line-height: 1.15;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: clamp(12px, 1.2vw, 15px);
  }
  .ascii-splash__cta{
    margin-top: 18px;
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }
  .ascii-splash__hint{
    opacity: 0.85;
    font-size: 0.95rem;
    text-align: center;
    margin-top: 10px;
  }
</style>

<div class="ascii-splash">
  <div class="ascii-splash__inner">
    <pre id="dynamic-ascii-pre" class="ascii-splash__pre">Loading…</pre>

    <div class="ascii-splash__cta">
      <a class="btn btn--primary" href="/home/">Enter the blog</a>
      <a class="btn" href="/reads/">Browse reads</a>
      <a class="btn" href="/home/">Skip splash</a>
    </div>
    <div class="ascii-splash__hint">Generative ASCII — updates every 5 seconds.</div>
  </div>
</div>

<script>
(function () {
  const pre = document.getElementById('dynamic-ascii-pre');
  if (!pre) return;

  let t = Math.floor(Date.now() / 1000);

  function mulberry32(a) {
    return function() {
      let x = a += 0x6D2B79F5;
      x = Math.imul(x ^ (x >>> 15), x | 1);
      x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    }
  }

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  function render(n) {
    const width = 58;
    const energy = clamp(Math.floor(n * 31), 0, 30);
    const bars = '█'.repeat(energy) + '·'.repeat(30 - energy);
    const mood = n < 0.25 ? 'idle' : n < 0.5 ? 'warming up' : n < 0.75 ? 'focused' : 'overclock';

    const frameTop = '┌' + '─'.repeat(width) + '┐';
    const frameBot = '└' + '─'.repeat(width) + '┘';

    const lines = [];
    lines.push(frameTop);
    lines.push('│ ' + 'A BIT ABOUT AI  //  ascii splash'.padEnd(width - 1) + '│');
    lines.push('│ ' + (`mood: ${mood}`).padEnd(width - 1) + '│');
    lines.push('│ ' + (`rng : ${n.toFixed(8)}`).padEnd(width - 1) + '│');
    lines.push('│ ' + (`lvl : [${bars}]`).padEnd(width - 1) + '│');

    const rng = mulberry32(Math.floor(n * 1e9) ^ 0xA5A5A5A5);
    let spark = '';
    const chars = ' .:-=+*#%@';
    for (let i = 0; i < 44; i++) spark += chars[Math.floor(rng() * chars.length)];
    lines.push('│ ' + (`sig : ${spark}`).padEnd(width - 1) + '│');

    const x = clamp(Math.floor(n * 24), 0, 24);
    const creature = ' '.repeat(x) + '(•_•)  ~';
    lines.push('│ ' + creature.padEnd(width - 1) + '│');

    // footer line
    lines.push('│ ' + 'press enter: click “Enter the blog” ↓'.padEnd(width - 1) + '│');
    lines.push(frameBot);
    return lines.join('\n');
  }

  function tick() {
    t += 5;
    const rng = mulberry32(t ^ 0xC0FFEE);
    pre.textContent = render(rng());
  }

  tick();
  setInterval(tick, 5000);
})();
</script>
