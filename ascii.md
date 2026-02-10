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

  function timeTheme(now) {
    const h = now.getHours();
    if (h >= 5 && h < 10) return { name: 'dawn', sky: ['.', '·', '*'], sun: '☼' };
    if (h >= 10 && h < 17) return { name: 'day', sky: [' ', ' ', '·'], sun: '☀' };
    if (h >= 17 && h < 20) return { name: 'sunset', sky: ['·', '.', '*'], sun: '◐' };
    return { name: 'night', sky: ['·', '.', '*'], sun: '☾' };
  }

  function renderSkyline(n, now) {
    const theme = timeTheme(now);

    const width = 64;
    const innerW = width - 2;

    const rng = mulberry32((Math.floor(n * 1e9) ^ (now.getHours() << 16) ^ now.getDate()) >>> 0);

    // Sky rows
    const skyRows = 6;
    const sky = [];
    for (let r = 0; r < skyRows; r++) {
      let row = '';
      for (let i = 0; i < innerW; i++) {
        const p = rng();
        const ch = p < (theme.name === 'day' ? 0.01 : 0.05)
          ? theme.sky[Math.floor(rng() * theme.sky.length)]
          : ' ';
        row += ch;
      }
      sky.push(row);
    }

    // Place sun/moon
    const orbX = clamp(Math.floor(rng() * (innerW - 2)) + 1, 1, innerW - 2);
    const orbY = clamp(Math.floor(rng() * 2), 0, 2);
    sky[orbY] = sky[orbY].slice(0, orbX) + theme.sun + sky[orbY].slice(orbX + 1);

    // Simple satellite at night
    if (theme.name === 'night' && rng() < 0.6) {
      const satX = clamp(Math.floor(rng() * (innerW - 6)) + 1, 1, innerW - 6);
      const satY = clamp(1 + Math.floor(rng() * 2), 1, 2);
      const sat = '-o-';
      sky[satY] = sky[satY].slice(0, satX) + sat + sky[satY].slice(satX + sat.length);
    }

    // Buildings
    const groundRows = 7;
    const heights = Array.from({ length: innerW }, () => 0);
    let x = 0;
    while (x < innerW) {
      const bW = clamp(2 + Math.floor(rng() * 6), 2, 6);
      const hBase = theme.name === 'day' ? 2 : 3;
      const bH = clamp(hBase + Math.floor(rng() * 6), 2, 8);
      for (let i = x; i < Math.min(innerW, x + bW); i++) heights[i] = bH;
      x += bW;
    }

    const buildings = [];
    for (let r = groundRows; r >= 1; r--) {
      let row = '';
      for (let i = 0; i < innerW; i++) {
        if (heights[i] >= r) {
          // windows
          const litProb = theme.name === 'night' ? 0.35 : theme.name === 'dawn' || theme.name === 'sunset' ? 0.22 : 0.08;
          const isWindow = (r % 2 === 0) && (i % 2 === 0);
          if (isWindow && rng() < litProb) row += '▣';
          else row += '█';
        } else {
          row += ' ';
        }
      }
      buildings.push(row);
    }

    // Street line
    const street = '─'.repeat(innerW);

    // HUD
    const tag = `AI skyline / ${theme.name}`;
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const energy = clamp(Math.floor(n * 21), 0, 20);
    const bars = '█'.repeat(energy) + '·'.repeat(20 - energy);

    const frameTop = '┌' + '─'.repeat(width) + '┐';
    const frameBot = '└' + '─'.repeat(width) + '┘';

    const lines = [];
    lines.push(frameTop);
    lines.push('│ ' + 'A BIT ABOUT AI'.padEnd(width - 1) + '│');
    lines.push('│ ' + (tag + '  ' + time).padEnd(width - 1) + '│');
    lines.push('│ ' + (`signal: [${bars}]`).padEnd(width - 1) + '│');
    lines.push('│' + ' '.repeat(width) + '│');

    for (const row of sky) lines.push('│ ' + row.padEnd(innerW) + ' │');
    for (const row of buildings) lines.push('│ ' + row.padEnd(innerW) + ' │');
    lines.push('│ ' + street + ' │');

    lines.push('│' + ' '.repeat(width) + '│');
    lines.push('│ ' + 'Click “Enter the blog” to continue ↓'.padEnd(width - 1) + '│');
    lines.push(frameBot);

    return lines.join('\n');
  }

  function tick() {
    t += 5;
    const rng = mulberry32(t ^ 0xC0FFEE);
    const now = new Date();
    pre.textContent = renderSkyline(rng(), now);
  }

  tick();
  setInterval(tick, 5000);
})();
</script>
