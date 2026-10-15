(function () {
  const C = window.SITE_CONFIG, P = window.PROJECTS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const li = (a) => a.map((x) => `<li>${esc(x)}</li>`).join("");
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)");
  const IO = "cubic-bezier(.65,.05,.2,1)", SOFT = "cubic-bezier(.22,.8,.3,1)";
  const T = (ms) => (REDUCED.matches ? Math.min(ms, 250) : ms);   // all durations pass through here
  const OPEN_MS = 1400, CLOSE_MS = 1200, RADIUS = "28px";

  /* ---- text bindings ---- */
  const bind = { name: C.name, availability: C.availability, roles: C.hero.roles, tagline: C.hero.tagline, cta: C.hero.cta, note: C.hero.note || "", closing: C.closing };
  $$("[data-bind]").forEach((el) => (el.textContent = bind[el.dataset.bind]));
  $("#h1").innerHTML = C.hero.lines.map((l) => `<span>${esc(l)}</span>`).join("");
  $("#year").textContent = new Date().getFullYear();
  document.title = `${C.name} — UI/UX Designer`;
  const mq = (C.marquee || []).map((m) => `<span>${esc(m)}</span>`).join("");
  $("#mq").innerHTML = mq + mq + mq + mq;

  /* ---- links (no dead links: unset URLs render as hints) ---- */
  function linkList() {
    const mk = (label, url, hint) => url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}</a>` : `<span class="off">${label}: ${hint}</span>`;
    return [`<a href="mailto:${esc(C.email)}">${esc(C.email)}</a>`, mk("LinkedIn", C.linkedin, "add URL in js/config.js"), mk("GitHub", C.github, "add URL in js/config.js"), C.resume ? `<a href="${esc(C.resume)}" target="_blank" rel="noopener">Resume</a>` : ""].join("");
  }
  $("#foot-links").innerHTML = linkList();
  $("#foot-cta").href = `mailto:${C.email}`;

  /* ---- artwork: image if path set, else generated placeholder ---- */
  const art = (src, alt, accent, cls = "") => src
    ? `<div class="art il ${cls}"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"></div>`
    : `<div class="art ph ${cls}" style="--a:${accent || "#EFC25A"}" role="img" aria-label="Placeholder artwork"><span class="phl">Placeholder artwork</span></div>`;

  /* ---- sections: every section is a rail of cards ---- */
  const rail = (cards) => `<div class="rail-wrap"><div class="rail" tabindex="0" role="group" aria-label="Scroll horizontally">${cards}</div><div class="rail-ui"><button data-dir="-1" aria-label="Scroll left">←</button><button data-dir="1" aria-label="Scroll right">→</button><span aria-hidden="true">drag or scroll for more</span></div></div>`;
  const lnk = (label, url, hint) => `<article class="card"><span class="meta">${label}</span>${url ? `<h3><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(url.replace(/^https?:\/\//, ""))} ↗</a></h3>` : `<p class="off">${hint}</p>`}</article>`;
  const SECTIONS = [
    { id: "about", tone: "c-teal", stk: "desk", rot: 6, title: "About", desc: "a little background", render: () => rail(`<article class="card pic">${art(C.about.photo, C.about.photoAlt || "Portrait of " + C.name, "#BCA9EC")}</article><article class="card wide"><p class="lead">${esc(C.about.intro)}</p>${C.about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</article><article class="card"><h3>How I work</h3><ol>${li(C.about.approach)}</ol></article>`) },
    { id: "projects", tone: "c-coral", stk: "laptop", rot: -6, title: "Projects", desc: "selected work ✿", render: () => rail(P.map((p) => `<article class="card proj"><button data-proj="${p.id}" aria-label="View case study: ${esc(p.title)}">${art(p.image, p.imageAlt || p.title, p.accent)}<span class="meta">${esc(p.category)} · ${esc(p.year)}</span><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p><span class="go">View case study ↗</span></button></article>`).join("")) },
    { id: "experience", tone: "c-mustard", stk: "kanban", rot: 5, title: "Experience", desc: "four roles, 2021 to now", render: () => rail(C.experience.map((e) => `<article class="card wide"><span class="meta">${esc(e.period)}</span><h3>${esc(e.title)}<br>${esc(e.company)}</h3><p>${esc(e.summary)}</p><ul>${li(e.responsibilities)}</ul><div class="tags">${e.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div></article>`).join("")) },
    { id: "skills", tone: "c-lilac", stk: "sql", rot: -5, title: "Skills", desc: "tools & ways of working", render: () => rail(C.skills.map((s) => `<article class="card skill"><h3>${esc(s.group)}</h3><ul>${li(s.items)}</ul></article>`).join("")) },
    { id: "education", tone: "c-teal", stk: "dashboard", rot: 6, title: "Education", desc: "the school bit", render: () => rail(C.education.map((e) => `<article class="card edu"><span class="yr">${esc(e.year)}</span><div><h3>${esc(e.qualification)}</h3><p>${esc(e.institution)}</p></div></article>`).join("")) },
    { id: "contact", tone: "c-coral", stk: "phone", rot: -6, title: "Contact", desc: "say hello", render: () => rail(`<article class="card wide"><h3>${esc(C.contactCta)}</h3><a class="chip" href="mailto:${esc(C.email)}">Email ${esc(C.email)}</a></article>${lnk("LinkedIn", C.linkedin, "Add your URL in js/config.js")}${lnk("GitHub", C.github, "Add your URL in js/config.js")}${lnk("Resume", C.resume, "Add a file path in js/config.js")}`) }
  ];
  const host = $("#panels");
  host.innerHTML = SECTIONS.map((s) => `<section class="panel ${s.tone}" id="s-${s.id}"><img class="stk-s" src="assets/images/${s.stk}.svg" alt="" style="--rot:${s.rot}deg"><h2><button class="frame-head" aria-haspopup="dialog" aria-label="Open ${s.title} full screen"><span class="t">${s.title}</span><span class="d">${s.desc}</span><span class="chip" aria-hidden="true">Expand ⤢</span></button></h2>${s.render()}</section>`).join("");

  /* ---- horizontal rails ---- */
  function initRail(wrap, wheel) {
    const r = $(".rail", wrap), [prev, next] = $$(".rail-ui button", wrap);
    const upd = () => { if (!wrap.isConnected) return; const max = r.scrollWidth - r.clientWidth - 2; prev.disabled = r.scrollLeft <= 2; next.disabled = r.scrollLeft >= max; wrap.classList.toggle("end", r.scrollLeft >= max); };
    r.addEventListener("scroll", upd, { passive: true }); window.addEventListener("resize", upd); upd(); setTimeout(upd, 1500);
    [prev, next].forEach((b) => b.addEventListener("click", () => r.scrollBy({ left: +b.dataset.dir * Math.min(440, r.clientWidth * 0.8), behavior: "smooth" })));
    r.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") r.scrollBy({ left: 300, behavior: "smooth" }); if (e.key === "ArrowLeft") r.scrollBy({ left: -300, behavior: "smooth" }); });
    if (wheel) {   // mouse wheel -> horizontal, only inside the full-page frame
      let tgt = 0, raf = 0, idle = 0;
      const step = () => { const diff = tgt - r.scrollLeft; if (Math.abs(diff) < 0.5) { r.scrollLeft = tgt; raf = 0; return; } r.scrollLeft += diff * 0.14; raf = requestAnimationFrame(step); };
      wrap.parentElement.addEventListener("wheel", (e) => {
        if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        const max = r.scrollWidth - r.clientWidth, d = e.deltaY * (e.deltaMode === 1 ? 32 : 1);
        if (max <= 0) return;
        e.preventDefault();
        if (!raf) tgt = r.scrollLeft;
        tgt = Math.max(0, Math.min(max, tgt + d));
        r.classList.add("wheel"); clearTimeout(idle); idle = setTimeout(() => r.classList.remove("wheel"), 300);
        if (!raf) raf = requestAnimationFrame(step);
      }, { passive: false });
    }
    let down = false, moved = false, sx = 0, sl = 0;
    r.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = r.scrollLeft; });
    window.addEventListener("pointermove", (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) { moved = true; r.classList.add("drag"); } if (moved) r.scrollLeft = sl - dx; });
    window.addEventListener("pointerup", () => { down = false; r.classList.remove("drag"); });
    r.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  }
  $$(".rail-wrap").forEach((w) => initRail(w, false));

  /* ---- shared helpers ---- */
  const px = (n) => n + "px";
  const box = (rc) => ({ top: px(rc.top), left: px(rc.left), width: px(rc.width), height: px(rc.height) });
  const fullBox = () => ({ top: "0px", left: "0px", width: innerWidth + "px", height: innerHeight + "px" });
  const chrome = () => ["#nav", "#top", ".foot"].map((s) => $(s));
  const lock = (on) => (document.documentElement.style.overflow = on ? "hidden" : "");
  const visible = (rc) => rc.width > 0 && rc.bottom > 0 && rc.top < innerHeight && rc.right > 0 && rc.left < innerWidth;
  const stagger = (els, base, per, dur) => els.forEach((el, i) => el.animate([{ opacity: 0, transform: "translateY(28px) scale(.98)" }, { opacity: 1, transform: "none" }], { duration: T(dur), delay: T(base + Math.min(i, 8) * per), easing: SOFT, fill: "backwards" }));

  /* ---- section frame grows to fill the page ---- */
  let full = null, busy = false;
  function expand(id) {
    if (full || busy) return;
    const sec = $("#s-" + id), s = SECTIONS.find((x) => x.id === id), rc = sec.getBoundingClientRect(), dur = T(OPEN_MS);
    const o = document.createElement("div");
    o.className = "frame-full " + s.tone; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", s.title);
    o.innerHTML = `<div class="ff-top"><div><h2>${s.title}</h2><p>${s.desc}</p></div><button class="chip" id="ff-close" aria-label="Close ${s.title}">Close ✕</button></div><div class="ff-main">${s.render()}</div>`;
    document.body.appendChild(o);
    chrome().forEach((el) => (el.inert = true)); lock(true);
    full = { o, sec };
    $$(".rail-wrap", o).forEach((w) => initRail(w, true));
    $("#ff-close", o).focus({ preventScroll: true });
    o.animate([{ ...box(rc), borderRadius: RADIUS }, { ...fullBox(), borderRadius: "0px" }], { duration: dur, easing: IO });
    $(".ff-top", o).animate([{ opacity: 0, transform: "translateY(-16px)" }, { opacity: 1, transform: "none" }], { duration: dur * 0.5, delay: dur * 0.45, easing: SOFT, fill: "backwards" });
    stagger($$(".card", o), dur * 0.5, 90, 900);
    $(".rail-ui", o).animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur * 0.4, delay: dur * 0.8, fill: "backwards" });
    setTimeout(() => window.dispatchEvent(new Event("resize")), dur + 80);
  }
  function collapse() {
    if (!full) return;
    const { o, sec } = full, rc = sec.getBoundingClientRect(), dur = T(CLOSE_MS);
    full = null; busy = true;
    $$(".ff-top,.ff-main", o).forEach((el) => el.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(.98)" }], { duration: dur * 0.4, easing: IO, fill: "forwards" }));
    o.animate([{ ...fullBox(), borderRadius: "0px" }, { ...box(rc), borderRadius: RADIUS }], { duration: dur, delay: dur * 0.12, easing: IO, fill: "both" }).onfinish = () => {
      o.remove(); chrome().forEach((el) => (el.inert = false)); lock(false); busy = false;
      $(".frame-head", sec).focus({ preventScroll: true });
    };
  }

  /* ---- project case study: grows from the clicked card ---- */
  const cs = $("#case");
  let cIdx = 0, cOpen = false, cBusy = false, cOpener = null;
  const caseHTML = (p, i) => {
    const prev = P[(i - 1 + P.length) % P.length], nxt = P[(i + 1) % P.length];
    const row = (h, body) => `<section><h3>${h}</h3><div>${body}</div></section>`;
    return `<div class="case-bar" style="background:${esc(p.accent || "#EFC25A")}"><button data-nav="-1" aria-label="Previous project: ${esc(prev.title)}">← Previous</button><button id="cx" aria-label="Close case study">Close ✕</button><button data-nav="1" aria-label="Next project: ${esc(nxt.title)}">Next →</button></div>
    <article class="case"><div><p class="meta">${esc(p.category)} · ${esc(p.year)}</p><h2>${esc(p.title)}</h2></div>
    <p class="notice">Illustrative artwork and placeholder text. Replace both in js/projects.js.</p>
    ${art(p.image, p.imageAlt || p.title + " hero image", p.accent)}
    ${row("Overview", `<p>${esc(p.overview)}</p>`)}${row("Problem", `<p>${esc(p.problem)}</p>`)}${row("My role", `<p>${esc(p.role)}</p>`)}
    ${row("Process", `<ol>${li(p.process)}</ol>`)}${row("Key decisions", `<ul>${li(p.decisions)}</ul>`)}${row("Outcome", `<p>${esc(p.outcome)}</p>`)}
    <div class="gal">${p.gallery.map((g, n) => art(g, `${p.title} additional image ${n + 1}`, p.accent)).join("")}</div></article>`;
  };
  const lockedEls = () => [...chrome(), full && full.o].filter(Boolean);
  function openCase(id, origin) {
    if (cOpen || cBusy) return;
    cIdx = Math.max(0, P.findIndex((p) => p.id === id)); cOpener = document.activeElement; cOpen = true;
    const rc = (origin || cOpener).getBoundingClientRect(), dur = T(OPEN_MS);
    cs.innerHTML = caseHTML(P[cIdx], cIdx); cs.scrollTop = 0; cs.hidden = false;
    lockedEls().forEach((el) => (el.inert = true)); lock(true);
    $("#cx", cs).focus({ preventScroll: true });
    if (visible(rc)) cs.animate([{ ...box(rc), borderRadius: RADIUS }, { ...fullBox(), borderRadius: "0px" }], { duration: dur, easing: IO });
    else cs.animate([{ opacity: 0, transform: "translateY(60px)" }, { opacity: 1, transform: "none" }], { duration: dur, easing: IO });
    $(".case-bar", cs).animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur * 0.4, delay: dur * 0.45, fill: "backwards" });
    stagger([...$(".case", cs).children], dur * 0.4, 90, 900);
  }
  function closeCase() {
    if (!cOpen || cBusy) return;
    cBusy = true;
    const dur = T(CLOSE_MS), id = P[cIdx].id;
    const card = $$(`[data-proj="${id}"]`).pop(), rc = card ? card.closest(".card").getBoundingClientRect() : null;
    $$(".case-bar,.case", cs).forEach((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur * 0.35, easing: IO, fill: "forwards" }));
    const frames = rc && visible(rc) ? [{ ...fullBox(), borderRadius: "0px" }, { ...box(rc), borderRadius: RADIUS }] : [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(60px)" }];
    cs.animate(frames, { duration: dur, delay: dur * 0.1, easing: IO, fill: "both" }).onfinish = () => {
      cs.hidden = true; cs.getAnimations().forEach((a) => a.cancel()); cs.innerHTML = ""; cOpen = false; cBusy = false;
      if (full) full.o.inert = false; else { chrome().forEach((el) => (el.inert = false)); lock(false); }
      (card || cOpener) && (card || cOpener).focus({ preventScroll: true });
    };
  }
  async function swapCase(dir) {
    if (cBusy) return; cBusy = true;
    await cs.animate([{ opacity: 1 }, { opacity: 0 }], { duration: T(450), easing: IO, fill: "forwards" }).finished;
    cs.getAnimations().forEach((a) => a.cancel());
    cIdx = (cIdx + dir + P.length) % P.length;
    cs.innerHTML = caseHTML(P[cIdx], cIdx); cs.scrollTop = 0;
    $("#cx", cs).focus({ preventScroll: true });
    cs.animate([{ opacity: 0, transform: `translateX(${dir * 70}px)` }, { opacity: 1, transform: "none" }], { duration: T(900), easing: SOFT });
    stagger([...$(".case", cs).children], 150, 80, 800);
    cBusy = false;
  }
  cs.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; if (b.id === "cx") closeCase(); else if (b.dataset.nav) swapCase(+b.dataset.nav); });

  /* ---- wiring ---- */
  host.addEventListener("click", (e) => {
    if (e.target.closest("a,[data-proj],.rail-ui button")) return;
    const s = e.target.closest(".panel"); if (s) expand(s.id.slice(2));
  });
  document.addEventListener("click", (e) => {
    if (e.target.closest("#ff-close")) collapse();
    const b = e.target.closest("[data-proj]"); if (b) openCase(b.dataset.proj, b.closest(".card"));
  });
  document.addEventListener("keydown", (e) => { if (e.key !== "Escape") return; if (cOpen) closeCase(); else if (full) collapse(); });
  $$("[data-open]").forEach((b) => b.addEventListener("click", () => expand(b.dataset.open)));
  $("#totop").addEventListener("click", () => window.scrollTo({ top: 0 }));
})();
