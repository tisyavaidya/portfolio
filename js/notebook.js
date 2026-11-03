/* ==========================================================================
   Notebook engine: the JupyterLab-style shell, running cells, and every
   cell output. Content comes from js/data.js.
   ========================================================================== */
(function () {
  "use strict";
  const S = window.SITE;
  const page = document.body.dataset.page || "home";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const sleep = ms => new Promise(r => setTimeout(r, reduceMotion ? 0 : ms));

  /* ------------------------------------------------------------- Memory */
  // Theme and "already ran this page" are kept in localStorage, with window.name
  // as a fallback that survives page changes in the same tab when storage is blocked.
  function remember(key, val) {
    try { localStorage.setItem(key, val); } catch (e) { /* storage unavailable */ }
    const re = new RegExp("(?:^|;)" + key + "=[^;]*");
    window.name = (window.name || "").replace(re, "") + ";" + key + "=" + val;
  }
  function recall(key) {
    let v = null;
    try { v = localStorage.getItem(key); } catch (e) { /* storage unavailable */ }
    if (v == null) { const m = new RegExp("(?:^|;)" + key + "=([^;]*)").exec(window.name || ""); if (m) v = m[1]; }
    return v;
  }

  /* -------------------------------------------------------------- Theme */
  const currentTheme = () => document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  function setTheme(t, save) {
    document.documentElement.dataset.theme = t;
    if (save) remember("theme", t);
    document.dispatchEvent(new CustomEvent("themechange", { detail: t }));
  }
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  if (mq.addEventListener) mq.addEventListener("change", e => { if (!recall("theme")) setTheme(e.matches ? "dark" : "light", false); });

  /* -------------------------------------------------------------- Shell */
  const notebooks = [
    ["home", "index.html", "tisya.ipynb"],
    ["about", "about.html", "about.ipynb"],
    ["experience", "experience.html", "experience.ipynb"],
    ["projects", "projects.html", "projects.ipynb"],
    ["contact", "contact.html", "contact.ipynb"]
  ];
  const current = notebooks.find(n => n[0] === page) || notebooks[0];
  const nbIcon = `<svg class="nb-icon" viewBox="0 0 16 16" aria-hidden="true"><rect x="2.5" y="1.5" width="11" height="13" rx="2"/><path d="M5 5.5h6M5 8h6M5 10.5h4"/></svg>`;
  const pdfIcon = `<svg class="nb-icon pdf" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 1.5h5.5L13 5v9.5H4z"/><path d="M9.5 1.5V5H13"/></svg>`;
  const folderIcon = `<svg class="nb-icon folder" viewBox="0 0 16 16" aria-hidden="true"><path d="M1.5 4.5v8.5h13V5.5H7.5L6 3.5H1.5z"/></svg>`;

  // Sigmoid theme switch: the dot slides along σ(x) from 0 (light) to 1 (dark)
  const SW = 40, SH = 22;
  const sigX = t => 5 + t * (SW - 10);
  const sigY = t => SH - 4 - (SH - 8) / (1 + Math.exp(-(t - 0.5) * 10));
  let sigPath = "";
  for (let i = 0; i <= 30; i++) { const t = i / 30; sigPath += (i ? "L" : "M") + sigX(t).toFixed(1) + "," + sigY(t).toFixed(1); }

  const app = $("#app");
  const nbBody = $("#notebook");
  app.insertAdjacentHTML("afterbegin", `
    <header class="menubar">
      <a class="brand" href="index.html" aria-label="Tisya Vaidya, home">
        <img src="assets/avatar.jpg" alt="" width="26" height="26"><span>Tisya Vaidya</span>
      </a>
      <span class="badge"><span class="pulse" aria-hidden="true"></span>${esc(S.status)}</span>
      <nav class="menu" aria-label="Notebook actions">
        <button type="button" data-action="run-all">Run all</button>
        <button type="button" data-action="restart">Restart kernel</button>
        <a href="${S.resume}" target="_blank" rel="noopener">Résumé</a>
      </nav>
      <button type="button" class="sigmoid" id="theme-toggle" aria-pressed="false" aria-label="Dark theme">
        <svg viewBox="0 0 ${SW} ${SH}" width="${SW}" height="${SH}" aria-hidden="true">
          <line x1="2" y1="${SH - 4}" x2="${SW - 2}" y2="${SH - 4}" class="sig-axis"/>
          <path d="${sigPath}" class="sig-curve"/><circle r="4" class="sig-dot"/>
        </svg>
      </button>
    </header>
    <aside class="sidebar" aria-label="Files">
      <p class="crumb">${folderIcon}<span>tisya-vaidya</span></p>
      <ul class="files">
        ${notebooks.map(([id, href, name]) => `<li><a href="${href}"${id === page ? ' aria-current="page"' : ""}>${nbIcon}<span>${name}</span></a></li>`).join("")}
        <li><a href="${S.resume}" target="_blank" rel="noopener">${pdfIcon}<span>${S.resume.split("/").pop()}</span></a></li>
      </ul>
      <p class="kernels"><span class="kdot" aria-hidden="true"></span>1 kernel running</p>
    </aside>`);

  const main = $(".main");
  main.insertAdjacentHTML("afterbegin", `
    <nav class="tabs" aria-label="Notebooks">
      ${notebooks.map(([id, href, name]) => `<a href="${href}"${id === page ? ' aria-current="page"' : ""}>${nbIcon}<span>${name}</span></a>`).join("")}
    </nav>
    <div class="toolbar" role="toolbar" aria-label="Notebook toolbar">
      <button type="button" data-action="run-selected" title="Run the selected cell (Shift+Enter)" aria-label="Run selected cell">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 3v10l8-5z"/></svg></button>
      <button type="button" data-action="restart" title="Restart the kernel and run all cells" aria-label="Restart kernel and run all">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5V5h-2.5" fill="none"/></svg></button>
      <button type="button" data-action="clear" title="Clear all outputs" aria-label="Clear all outputs">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" fill="none"/></svg></button>
      <span class="kernel" aria-live="polite"><span class="kname">Python 3 (tisya)</span><span class="kstate" title="Kernel idle"></span></span>
    </div>`);

  document.body.insertAdjacentHTML("beforeend", `
    <footer class="statusbar">
      <span>${current[2]}</span><span class="kstatus">Python 3 (tisya) | Idle</span>
      <span class="sb-right">${esc(S.location)}</span><span class="sb-right">© ${new Date().getFullYear()} ${esc(S.name)}</span>
    </footer>`);

  /* Theme toggle wiring */
  const toggle = $("#theme-toggle"), dot = $(".sig-dot", toggle);
  let dotT = currentTheme() === "dark" ? 1 : 0, fromClick = false;
  const placeDot = t => { dot.setAttribute("cx", sigX(t)); dot.setAttribute("cy", sigY(t)); };
  const syncToggle = () => {
    const dark = currentTheme() === "dark";
    toggle.setAttribute("aria-pressed", String(dark));
    toggle.title = dark ? "σ(theme) = 1: dark. Click for light." : "σ(theme) = 0: light. Click for dark.";
  };
  placeDot(dotT); syncToggle();
  toggle.addEventListener("click", () => {
    const to = currentTheme() === "dark" ? 0 : 1;
    fromClick = true; setTheme(to ? "dark" : "light", true); fromClick = false; syncToggle();
    if (reduceMotion) { dotT = to; placeDot(dotT); return; }
    const from = dotT, start = performance.now();
    const step = now => {
      const k = Math.min(1, (now - start) / 420), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      dotT = from + (to - from) * e; placeDot(dotT);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
  document.addEventListener("themechange", () => { if (fromClick) return; syncToggle(); dotT = currentTheme() === "dark" ? 1 : 0; placeDot(dotT); });

  /* ------------------------------------------------- Syntax highlighting */
  const KW = new Set(["from", "import", "as", "for", "in", "if", "else", "return", "def", "lambda", "not", "and", "or", "with", "True", "False", "None"]);
  function highlight(src) {
    const re = /(#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\sA-Za-z0-9_])/g;
    let out = "", m, prev = "";
    while ((m = re.exec(src))) {
      const [tok, com, str, num, word] = m;
      if (com) out += `<span class="tk-c">${esc(tok)}</span>`;
      else if (str) out += `<span class="tk-s">${esc(tok)}</span>`;
      else if (num) out += `<span class="tk-n">${esc(tok)}</span>`;
      else if (word) {
        const next = src.slice(re.lastIndex).match(/^\s*(.)/);
        if (KW.has(word)) out += `<span class="tk-k">${tok}</span>`;
        else if (prev === "." && next && next[1] === "(") out += `<span class="tk-f">${tok}</span>`;
        else if (next && next[1] === "(") out += `<span class="tk-f">${tok}</span>`;
        else if (prev === ".") out += `<span class="tk-a">${tok}</span>`;
        else if (/^[A-Z]/.test(word)) out += `<span class="tk-t">${tok}</span>`;
        else out += tok;
      } else out += esc(tok);
      if (!/^\s+$/.test(tok)) prev = tok;
    }
    return out;
  }

  /* ------------------------------------------------------- Mini charts */
  function rng(seed) { let a = seed; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const CW = 240, CH = 130;
  const axes = `<line class="ax" x1="20" y1="112" x2="226" y2="112"/><line class="ax" x1="20" y1="14" x2="20" y2="112"/>`;
  const CHARTS = {
    bars() { const v = [0.62, 0.7, 0.66, 0.58, 0.77]; return axes + v.map((h, i) => `<rect class="${i === 4 ? "fb" : "fa"}" x="${34 + i * 38}" y="${112 - h * 92}" width="26" height="${h * 92}" rx="2"/>`).join(""); },
    bars2() { const v = [[0.5, 0.7], [0.8, 0.55], [0.35, 0.45], [0.65, 0.9]]; return axes + v.map((p, i) => `<rect class="fa" x="${32 + i * 48}" y="${112 - p[0] * 90}" width="16" height="${p[0] * 90}" rx="2"/><rect class="fb" x="${50 + i * 48}" y="${112 - p[1] * 90}" width="16" height="${p[1] * 90}" rx="2"/>`).join(""); },
    line() {
      const r = rng(7); let y = 80; const pts = [];
      for (let i = 0; i <= 40; i++) { y += (r() - 0.44) * 12; y = Math.max(22, Math.min(104, y)); pts.push([22 + i * 5.1, y]); }
      const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join("");
      return axes + `<path class="area" d="${d}L226,112L22,112Z"/><path class="la" d="${d}"/>`;
    },
    scatter() {
      const r = rng(11); let s = axes;
      for (let i = 0; i < 34; i++) { const x = 28 + r() * 190, y = 104 - (x - 28) * 0.38 - (r() - 0.5) * 34; s += `<circle class="fa" cx="${x.toFixed(1)}" cy="${Math.max(18, y).toFixed(1)}" r="3.2"/>`; }
      return s + `<line class="lb" x1="24" y1="106" x2="224" y2="30"/>`;
    },
    heatmap() {
      const m = [[0.92, 0.1, 0.05], [0.12, 0.85, 0.08], [0.04, 0.09, 0.9]]; let s = "";
      m.forEach((row, i) => row.forEach((v, j) => {
        s += `<rect class="${i === j ? "fa" : "fm"}" x="${62 + j * 40}" y="${8 + i * 39}" width="37" height="36" rx="3" fill-opacity="${(0.15 + v * 0.85).toFixed(2)}"/>`;
        s += `<text x="${80.5 + j * 40}" y="${30 + i * 39}" class="${i === j && v > 0.5 ? "tl" : "td"}">${v.toFixed(2)}</text>`;
      }));
      return s;
    },
    pie() {
      const cx = 120, cy = 65, R = 50, n = 8; let s = `<circle class="fm" cx="${cx}" cy="${cy}" r="${R}" fill-opacity=".25"/>`;
      for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; s += `<line class="ax" x1="${cx}" y1="${cy}" x2="${(cx + R * Math.cos(a)).toFixed(1)}" y2="${(cy + R * Math.sin(a)).toFixed(1)}"/>`; }
      const a0 = -Math.PI / 2 - Math.PI / 4, a1 = -Math.PI / 2, off = 9, mx = Math.cos((a0 + a1) / 2) * off, my = Math.sin((a0 + a1) / 2) * off;
      return s + `<path class="fb" d="M${cx + mx},${cy + my}L${(cx + mx + R * Math.cos(a0)).toFixed(1)},${(cy + my + R * Math.sin(a0)).toFixed(1)}A${R},${R} 0 0 1 ${(cx + mx + R * Math.cos(a1)).toFixed(1)},${(cy + my + R * Math.sin(a1)).toFixed(1)}Z"/>`;
    },
    hist() {
      const v = [0.08, 0.18, 0.34, 0.6, 0.85, 1, 0.82, 0.55, 0.32, 0.17, 0.08];
      let s = axes + v.map((h, i) => `<rect class="fa" x="${26 + i * 18}" y="${112 - h * 90}" width="16" height="${h * 90}"/>`).join(""), d = "";
      for (let i = 0; i <= 50; i++) { const x = 26 + i * 3.96, z = (i - 25) / 9; d += (i ? "L" : "M") + x.toFixed(1) + "," + (112 - 92 * Math.exp(-z * z / 2)).toFixed(1); }
      return s + `<path class="lb" d="${d}"/>`;
    },
    grid() {
      const r = rng(3); let s = "";
      for (let c = 0; c < 5; c++) for (let rr = 0; rr < 4; rr++) { const on = r() > 0.55; s += `<rect class="${on ? (r() > 0.6 ? "fb" : "fa") : "fm"}" ${on ? "" : 'fill-opacity=".22"'} x="${30 + c * 38}" y="${12 + rr * 27}" width="34" height="23" rx="3"/>`; }
      return s;
    },
    blocks() {
      let s = "";
      [["L1", 4, 30], ["L2", 7, 22], ["L3", 10, 17]].forEach(([lab, n, w], i) => {
        const y = 14 + i * 36; s += `<text class="td" x="24" y="${y + 18}" text-anchor="start">${lab}</text>`;
        for (let k = 0; k < n; k++) s += `<rect class="${(i === 0 && k === 1) ? "fb" : "fa"}" fill-opacity="${i === 0 ? 1 : i === 1 ? 0.7 : 0.45}" x="${50 + k * (w + 2)}" y="${y}" width="${w}" height="26" rx="2"/>`;
      });
      return s;
    },
    map() {
      const p = [[40, 90], [95, 40], [150, 75], [205, 30], [190, 100]];
      let s = `<path class="lm" d="M40,90 Q60,40 95,40 T150,75 T205,30"/><path class="lm" d="M150,75 Q175,105 190,100"/>`;
      p.forEach((q, i) => { s += `<circle class="${i === 3 ? "fb" : "fa"}" cx="${q[0]}" cy="${q[1]}" r="${i === 3 ? 7 : 5.5}"/>`; });
      return s;
    },
    dashboard() {
      let s = `<rect class="fm" fill-opacity=".14" x="14" y="10" width="100" height="110" rx="5"/><rect class="fm" fill-opacity=".14" x="124" y="10" width="102" height="52" rx="5"/><rect class="fm" fill-opacity=".14" x="124" y="68" width="102" height="52" rx="5"/>`;
      const cx = 64, cy = 65, R = 30, C = 2 * Math.PI * R;
      s += `<circle cx="${cx}" cy="${cy}" r="${R}" class="ring-m"/><circle cx="${cx}" cy="${cy}" r="${R}" class="ring" stroke-dasharray="${(C * 0.62).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>`;
      [0.5, 0.8, 0.35, 0.65, 0.9].forEach((h, i) => { s += `<rect class="${i === 4 ? "fb" : "fa"}" x="${136 + i * 17}" y="${56 - h * 38}" width="11" height="${h * 38}" rx="1.5"/>`; });
      return s + `<path class="la" d="M134,108L150,100L166,104L182,88L198,92L216,78"/>`;
    }
  };
  // Charts drawn from a project's real numbers (data.js "data" field)
  function realChart(d, label) {
    const W = 320, H = 190, fmt = v => (d.prefix || "") + (Number.isInteger(v) ? v : Math.abs(v) < 1 ? v.toFixed(2) : v.toFixed(1)) + (d.unit || "");
    const aria = `role="img" aria-label="${esc(label || d.title || "")}"`;
    let s = "";
    if (d.type === "heatmap") {
      const n = d.labels.length, cell = 44, x0 = 120, y0 = 22;
      s += `<text class="cap" x="${x0 + n * cell / 2}" y="12">predicted</text>`;
      d.labels.forEach((l, j) => { s += `<text class="lab" x="${x0 + j * cell + cell / 2}" y="${y0 + n * cell + 14}">${esc(l)}</text>`; });
      d.values.forEach((row, i) => {
        s += `<text class="lab end" x="${x0 - 8}" y="${y0 + i * cell + cell / 2 + 4}">${esc(d.labels[i])}</text>`;
        row.forEach((v, j) => {
          s += `<rect class="${i === j ? "fa" : "fm"}" x="${x0 + j * cell + 1}" y="${y0 + i * cell + 1}" width="${cell - 2}" height="${cell - 2}" rx="3" fill-opacity="${(0.12 + v * 0.88).toFixed(2)}"/>`;
          s += `<text class="${i === j && v > 0.5 ? "tl" : "td"}" x="${x0 + j * cell + cell / 2}" y="${y0 + i * cell + cell / 2 + 4}">${v.toFixed(2)}</text>`;
        });
      });
      s += `<text class="cap" x="22" y="${y0 + n * cell / 2}" transform="rotate(-90 22 ${y0 + n * cell / 2})">true</text>`;
    } else if (d.type === "hbars") {
      const max = Math.max(...d.values), x0 = 104, bh = 20, gap = 8, y0 = 10, w = W - x0 - 34;
      d.values.forEach((v, i) => {
        const y = y0 + i * (bh + gap);
        s += `<text class="lab end" x="${x0 - 8}" y="${y + bh / 2 + 4}">${esc(d.labels[i])}</text>`;
        s += `<rect class="${i === d.highlight ? "fb" : "fa"}" x="${x0}" y="${y}" width="${(v / max * w).toFixed(1)}" height="${bh}" rx="2"/>`;
        s += `<text class="val" x="${(x0 + v / max * w + 8).toFixed(1)}" y="${y + bh / 2 + 4}" text-anchor="start">${fmt(v)}</text>`;
      });
    } else {
      const max = Math.max(...d.values), n = d.values.length, x0 = 14, base = H - 26, top = 22, slot = (W - x0 * 2) / n, bw = Math.min(46, slot * 0.62);
      s += `<line class="ax" x1="${x0}" y1="${base}" x2="${W - x0}" y2="${base}"/>`;
      d.values.forEach((v, i) => {
        const h = v / max * (base - top), x = x0 + i * slot + (slot - bw) / 2;
        s += `<rect class="${i === d.highlight ? "fb" : "fa"}" x="${x.toFixed(1)}" y="${(base - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="2"/>`;
        s += `<text class="val" x="${(x + bw / 2).toFixed(1)}" y="${(base - h - 5).toFixed(1)}">${fmt(v)}</text>`;
        s += `<text class="lab" x="${(x + bw / 2).toFixed(1)}" y="${base + 15}">${esc(d.labels[i])}</text>`;
      });
    }
    return `<svg class="mini real" viewBox="0 0 ${W} ${H}" ${aria}>${s}</svg>`;
  }
  function projectPicture(p, label) {
    if (p.thumb) return `<img class="thumb-img" src="${p.thumb}" alt="${label ? esc(p.title) : ""}" loading="lazy">`;
    if (p.data) return realChart(p.data, label ? p.data.title : "");
    return chart(p.chart, label ? p.title : "");
  }

  const chart = (kind, label) => `<svg class="mini" viewBox="0 0 ${CW} ${CH}" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'}>${(CHARTS[kind] || CHARTS.bars)()}</svg>`;

  /* --------------------------------------------------------- Ask Tisya */
  function answer(q) {
    const text = q.toLowerCase(), words = text.match(/[a-zé]+/g) || [];
    let best = null, bestScore = 0;
    S.ask.answers.forEach(item => {
      let score = 0;
      item.keys.forEach(k => {
        if (k.includes(" ")) { if (text.includes(k)) score += 2; }
        else if (words.some(w => w === k || (k.length > 3 && w.startsWith(k)))) score += 1;
      });
      if (score > bestScore) { bestScore = score; best = item; }
    });
    return best ? best.a : S.ask.fallback;
  }

  /* -------------------------------------------------- Output renderers */
  const toM = s => { const [y, m] = s.split("-").map(Number); return y * 12 + (m - 1); };
  const kindLabel = { work: "Work", research: "Research", teaching: "Teaching" };
  const cats = { ml: "Machine learning", analytics: "Analytics" };

  function dataFrame(cols, rows) {
    return `<div class="df-wrap"><table class="df"><thead><tr><th></th>${cols.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((r, i) => `<tr><th>${i}</th>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }
  function roleList(items) {
    return `<ol class="roles">${items.map(e => `
      <li id="${e.id}">
        <p class="when">${esc(e.dates)}</p>
        <div><h3>${esc(e.role)}</h3><p class="muted">${esc(e.org)}, ${esc(e.place)}</p>
        <ul>${e.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
        ${e.project ? `<p class="role-link"><a href="projects.html#${e.project}">See the project from this internship</a></p>` : ""}</div>
      </li>`).join("")}</ol>`;
  }

  // Python-style repr of a list of [key, value] pairs (strings, numbers, lists)
function pyVal(v) {
  if (Array.isArray(v)) return `[${v.map(pyVal).join(", ")}]`;
  if (typeof v === "number") return `<span class="tk-n">${v}</span>`;
  return `<span class="tk-s">'${esc(v)}'</span>`;
}
function pyDict(pairs) {
  return `<pre class="repr dict">{\n${pairs.map(([k, v]) => `    <span class="tk-s">'${esc(k)}'</span>: ${pyVal(v)},`).join("\n")}\n}</pre>`;
}

const RENDER = {
    "me-repr"() {
      return `<pre class="repr">Tisya(
    name=<span class="tk-s">'${esc(S.name)}'</span>,
    role=<span class="tk-s">'Data Scientist'</span>,
    studying=<span class="tk-s">'M.S. Data Science @ Uppsala University'</span>,
    based_in=<span class="tk-s">'${esc(S.location)}'</span>,
    status=<span class="tk-s">'${esc(S.status)}'</span>,
)</pre>`;
    },
    education() { return dataFrame(["degree", "school", "dates"], S.education.map(e => [esc(e.degree), esc(e.school), esc(e.dates)])); },
    now() {
      const n = S.now;
      return pyDict([["term", n.term], ["studying", n.courses], ["diving_into", n.exploring], ["learning", n.learning], ["looking_for", S.status.replace(/^Open to /, "")]]);
    },
    "fun-facts"() { return pyDict(S.funFacts); },
    languages() { return `<pre class="repr">[${S.languages.map(l => `<span class="tk-s">'${esc(l)}'</span>`).join(", ")}]</pre>`; },
    courses() { let prev = null; return dataFrame(["degree", "course", "area"], S.courses.map(([d, c, a]) => { const shown = d === prev ? "" : esc(d); prev = d; return [shown ? `<strong>${shown}</strong>` : "", esc(c), esc(a)]; })); },
    skills() { return dataFrame(["area", "tools"], S.skills.map(([k, v]) => [esc(k), esc(v)])); },
    plot(out) { if (window.RLSPlot) window.RLSPlot.run(); return null; },
    explore() {
      const blurb = { about: "Who I am and how I got here", experience: "Internships, research and teaching", projects: `${S.projects.length} projects across machine learning and analytics`, contact: "The quickest ways to reach me" };
      return `<ul class="explore">${notebooks.slice(1).map(([id, href, name]) => `
        <li><a href="${href}">${nbIcon}<strong>${name}</strong><span>${blurb[id]}</span></a></li>`).join("")}</ul>`;
    },
    ask(out, cell) {
      const q = ($(".ask-input", cell) || {}).value || "";
      const chips = `<div class="chips">${S.ask.suggestions.map(s => `<button type="button" class="chip" data-ask-fill="${esc(s)}">${esc(s)}</button>`).join("")}</div>`;
      if (!q.trim()) return `<p class="muted small">Nothing asked yet. Try one of these:</p>${chips}`;
      return `<p class="answer">${esc(answer(q))}</p><p class="muted small" style="margin-top:10px">Or try another:</p>${chips}`;
    },
    gantt() {
      const items = S.experience.slice().sort((a, b) => toM(a.start) - toM(b.start));
      const lo = Math.min(...items.map(i => toM(i.start))) - 1, hi = Math.max(...items.map(i => toM(i.end))) + 2;
      const pct = m => ((m - lo) / (hi - lo)) * 100;
      const years = []; for (let y = Math.ceil(lo / 12); y * 12 <= hi; y++) years.push(y);
      return `<div class="gantt">
        <div class="g-axis" aria-hidden="true">${years.map(y => `<span style="left:${pct(y * 12).toFixed(2)}%">${y}</span>`).join("")}</div>
        <ol class="g-rows">${items.map(i => `
          <li class="g-row">
            <a class="g-label" href="#${i.id}">${esc(i.short || i.role)}<span>${esc(i.org.split(",")[0])}</span></a>
            <div class="g-track">${years.map(y => `<i class="g-tick" style="left:${pct(y * 12).toFixed(2)}%"></i>`).join("")}
              <a class="g-bar k-${i.kind}" href="#${i.id}" style="left:${pct(toM(i.start)).toFixed(2)}%;width:${Math.max(1.6, pct(toM(i.end) + 1) - pct(toM(i.start))).toFixed(2)}%" aria-label="${esc(i.role)}, ${esc(i.dates)}" title="${esc(i.role)}: ${esc(i.dates)}"></a>
            </div>
          </li>`).join("")}</ol>
        <p class="g-legend">${Object.keys(kindLabel).map(k => `<span><i class="k-${k}"></i>${kindLabel[k]}</span>`).join("")}</p>
      </div>`;
    },
    "work-research"() { return roleList(S.experience.filter(e => e.kind !== "teaching").sort((a, b) => toM(b.start) - toM(a.start))); },
    teaching() { return roleList(S.experience.filter(e => e.kind === "teaching").sort((a, b) => toM(b.start) - toM(a.start))); },
    "project-counts"() {
      const counts = {}; S.projects.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
      const keys = Object.keys(cats);
      const w = Math.max(...keys.map(k => k.length));
      return `<pre class="repr">category\n${keys.map(k => `${k.padEnd(w + 4)}<span class="tk-n">${counts[k] || 0}</span>`).join("\n")}\nName: count, dtype: int64</pre>`;
    },
    "project-grid"() {
      return `<div class="widget" role="group" aria-label="Filter projects by category">
          <span class="w-label">category</span>
          ${[["all", "all"]].concat(Object.keys(cats).map(k => [k, k])).map(([k, v], i) => `<button type="button" class="tbtn" data-filter="${k}" aria-pressed="${i === 0}">${v}</button>`).join("")}
        </div>
        <ul class="pgrid">${S.projects.map(p => `
          <li class="pcard${p.featured ? " featured" : ""}" data-cat="${p.category}">
            <button type="button" data-project="${p.id}">
              <span class="thumb${p.thumb ? " has-img" : ""}">${projectPicture(p)}</span>
              <span class="pmeta"><span class="ptitle">${esc(p.title)}</span><span class="psum">${esc(p.summary)}</span>
              <span class="pstack">${p.stack.map(esc).join(", ")}</span></span>
            </button>
          </li>`).join("")}</ul>`;
    },
    contact() {
      const rows = [["email", `<a href="mailto:${S.email}">${S.email}</a>`], ["linkedin", `<a href="${S.linkedin}" target="_blank" rel="noopener">linkedin.com/in/tisya-vaidya</a>`],
        ["github", `<a href="${S.github}" target="_blank" rel="noopener">github.com/tisyavaidya</a>`], ["resume", `<a href="${S.resume}" target="_blank" rel="noopener">Tisya_Vaidya_Resume.pdf</a>`]];
      return `<pre class="repr dict">{\n${rows.map(([k, v]) => `    <span class="tk-s">'${k}'</span>: ${v},`).join("\n")}\n}</pre>
        <p><button type="button" class="btn" id="copy-email">Copy email</button></p>`;
    }
  };

  /* ---------------------------------------------------- Notebook runtime */
  const cells = $$(".cell", nbBody);
  const codeCells = cells.filter(c => c.classList.contains("code"));
  let counter = 0, busy = false;
  const kstate = $(".kstate"), kstatus = $(".kstatus");
  function setBusy(b) {
    busy = b;
    document.body.classList.toggle("kernel-busy", b);
    kstate.title = b ? "Kernel busy" : "Kernel idle";
    kstatus.textContent = `Python 3 (tisya) | ${b ? "Busy" : "Idle"}`;
  }

  // Prepare every cell: highlighted source, prompts and run buttons
  cells.forEach((cell, i) => {
    cell.tabIndex = -1;
    if (!cell.classList.contains("code")) { cell.insertAdjacentHTML("afterbegin", `<div class="gutter"></div>`); return; }
    const src = $("pre.src code", cell);
    const raw = src.textContent.replace(/^\n+|\s+$/g, "");
    if (raw.includes("__INPUT__")) {
      // Code like  me.ask("__INPUT__")  gets a real text box between the quotes
      const [a, b] = raw.split("__INPUT__");
      src.innerHTML = highlight(a.replace(/"$/, "")) +
        `<span class="tk-s">"<label class="sr-only" for="ask-${i}">Your question</label><input class="ask-input" id="ask-${i}" type="text" autocomplete="off" spellcheck="false" placeholder="type a question here">"</span>` +
        highlight(b.replace(/^"/, ""));
    } else src.innerHTML = highlight(raw);
    cell.insertAdjacentHTML("afterbegin", `<div class="gutter"><span class="prompt">[ ]:</span>
      <button type="button" class="run" aria-label="Run cell" title="Run cell (Shift+Enter)"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 3v10l8-5z"/></svg></button></div>`);
  });

  async function runCell(cell, opts = {}) {
    if (!cell.classList.contains("code")) return;
    const prompt = $(".prompt", cell), out = $(".output", cell);
    if (opts.select !== false) select(cell, false);
    prompt.textContent = "[*]:";
    cell.classList.add("running");
    if (!opts.instant) await sleep(260 + Math.random() * 160);
    counter += 1;
    prompt.textContent = `[${counter}]:`;
    const r = RENDER[out.dataset.render];
    if (r) {
      const html = r(out, cell);
      if (html !== null && html !== undefined) $(".out-body", out).innerHTML = html;
    }
    const op = $(".out-prompt", out);
    if (op) op.textContent = `Out[${counter}]:`;
    out.hidden = false;
    cell.classList.remove("running");
    cell.classList.add("ran");
  }
  async function runAll(opts = {}) {
    if (busy) return;
    setBusy(true);
    for (const c of codeCells) await runCell(c, Object.assign({ select: false }, opts));
    setBusy(false);
  }
  function clearAll() {
    counter = 0;
    codeCells.forEach(c => { $(".prompt", c).textContent = "[ ]:"; $(".output", c).hidden = true; c.classList.remove("ran"); });
  }
  async function restart() {
    if (busy) return;
    clearAll();
    kstatus.textContent = "Python 3 (tisya) | Restarting";
    await sleep(350);
    runAll();
  }

  let selected = null;
  function select(cell, focus = true) {
    if (selected) selected.classList.remove("selected");
    selected = cell; cell.classList.add("selected");
    if (focus) cell.focus({ preventScroll: true });
  }
  nbBody.addEventListener("click", e => {
    const cell = e.target.closest(".cell"); if (!cell) return;
    if (e.target.closest(".run")) { if (!busy) { setBusy(true); runCell(cell).then(() => setBusy(false)); } return; }
    if (!e.target.closest("a, button, input")) select(cell, !e.target.closest("pre, .output"));
    else if (selected !== cell) select(cell, false);
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Enter" && (e.shiftKey || e.ctrlKey || e.metaKey) && selected && !busy) {
      const inCell = selected.contains(document.activeElement) || document.activeElement === selected;
      if (!inCell) return;
      e.preventDefault();
      setBusy(true);
      runCell(selected).then(() => {
        setBusy(false);
        const idx = cells.indexOf(selected);
        if (e.shiftKey && cells[idx + 1]) select(cells[idx + 1], document.activeElement === selected);
      });
    } else if (e.key === "Enter" && e.target.classList && e.target.classList.contains("ask-input")) {
      e.preventDefault();
      const cell = e.target.closest(".cell"); select(cell, false);
      if (!busy) { setBusy(true); runCell(cell).then(() => setBusy(false)); }
    }
  });

  document.addEventListener("click", e => {
    const a = e.target.closest("[data-action]");
    if (a) {
      const act = a.dataset.action;
      if (act === "run-all") { clearAll(); runAll(); }
      else if (act === "restart") restart();
      else if (act === "clear") { if (!busy) clearAll(); }
      else if (act === "run-selected") { const c = selected && selected.classList.contains("code") ? selected : codeCells[0]; if (c && !busy) { setBusy(true); runCell(c).then(() => setBusy(false)); } }
      return;
    }
    const fill = e.target.closest("[data-ask-fill]");
    if (fill) {
      const cell = $$(".cell").find(c => $(".ask-input", c));
      if (cell) { $(".ask-input", cell).value = fill.dataset.askFill; select(cell, false); if (!busy) { setBusy(true); runCell(cell).then(() => setBusy(false)); } }
      return;
    }
    const f = e.target.closest("[data-filter]");
    if (f) {
      const wrap = f.closest(".output");
      $$("[data-filter]", wrap).forEach(x => x.setAttribute("aria-pressed", String(x === f)));
      $$(".pcard", wrap).forEach(c => { c.hidden = f.dataset.filter !== "all" && c.dataset.cat !== f.dataset.filter; });
      return;
    }
    const p = e.target.closest("[data-project]");
    if (p) { openProject(p.dataset.project); return; }
    if (e.target.closest("#copy-email")) copyEmail(e.target.closest("#copy-email"));
  });

  async function copyEmail(btn) {
    try { await navigator.clipboard.writeText(S.email); btn.textContent = "Copied"; }
    catch (e) { btn.textContent = "Select the address to copy"; }
    setTimeout(() => { btn.textContent = "Copy email"; }, 2200);
  }

  /* ---------------------------------------------------- Project dialog */
  const dlg = document.createElement("dialog");
  dlg.className = "project-dialog"; dlg.setAttribute("aria-labelledby", "pd-title");
  document.body.appendChild(dlg);
  function openProject(id, fromHash) {
    const p = S.projects.find(x => x.id === id); if (!p) return;
    dlg.innerHTML = `
      <button type="button" class="close" aria-label="Close">×</button>
      <div class="pd-thumb${p.thumb ? " has-img" : ""}">${projectPicture(p, true)}${p.data ? `<p class="pd-cap">${esc(p.data.title)}</p>` : ""}</div>
      <div class="pd-body">
        <p class="muted">${cats[p.category]}</p>
        <h2 id="pd-title">${esc(p.title)}</h2>
        <ul class="tags">${p.stack.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
        ${p.metrics ? `<dl class="metrics">${p.metrics.map(([v, l]) => `<div><dd>${esc(v)}</dd><dt>${esc(l)}</dt></div>`).join("")}</dl>` : ""}
        ${p.body.map(t => `<p>${esc(t)}</p>`).join("")}
        ${p.results ? `<h3>Results</h3><ul class="results">${p.results.map(r => `<li>${esc(r)}</li>`).join("")}</ul>` : ""}
        ${(p.images || []).filter(im => im.src !== p.thumb || (p.images || []).length > 1).length ? `<h3>Outputs</h3>${p.images.filter(im => im.src !== p.thumb).map(im => `
          <figure class="pd-fig"><a href="${im.src}" target="_blank" rel="noopener"><img src="${im.src}" alt="${esc(im.caption)}" loading="lazy"></a><figcaption>${esc(im.caption)}</figcaption></figure>`).join("")}` : ""}
        ${p.thumb && p.images && p.images.find(im => im.src === p.thumb) ? `<p class="muted small">${esc(p.images.find(im => im.src === p.thumb).caption)}. <a href="${p.thumb}" target="_blank" rel="noopener">Open full size</a></p>` : ""}
        ${p.link || p.notebook ? `<p class="pd-link">${p.link ? `<a class="btn solid" href="${p.link}" target="_blank" rel="noopener">View code on GitHub</a>` : ""}${p.notebook ? `<a class="btn" href="${p.notebook}" target="_blank" rel="noopener">View the notebook</a>` : ""}</p>` : ""}
      </div>`;
    $(".close", dlg).addEventListener("click", () => dlg.close());
    if (typeof dlg.showModal === "function") { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute("open", "");
    if (!fromHash) history.replaceState(null, "", "#" + id);
  }
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => { if (location.hash) history.replaceState(null, "", location.pathname + location.search); });

  /* -------------------------------------------------------------- Start */
  // First visit to a notebook in this tab runs cell by cell; later visits show results at once.
  const seenKey = "ran-" + page;
  const firstTime = !recall(seenKey);
  remember(seenKey, "1");
  runAll({ instant: !firstTime }).then(() => {
    const id = location.hash.slice(1);
    if (id && page === "projects") openProject(id, true);
    else if (id) { const t = document.getElementById(id); if (t) t.scrollIntoView(); }
  });
  window.addEventListener("hashchange", () => { const id = location.hash.slice(1); if (id && page === "projects") openProject(id, true); });
})();
