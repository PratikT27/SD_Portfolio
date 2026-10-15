(function () {
  const C = window.SITE_CONFIG, P = window.PROJECTS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const li = (a) => a.map((x) => `<li>${esc(x)}</li>`).join("");

  /* ---- bind simple text ---- */
  const bind = { name: C.name, availability: C.availability, roles: C.hero.roles, tagline: C.hero.tagline, cta: C.hero.cta, closing: C.closing };
  $$("[data-bind]").forEach((el) => (el.textContent = bind[el.dataset.bind]));
  $("#h1").innerHTML = C.hero.lines.map((l) => `<span>${esc(l)}</span>`).join("");
  $("#year").textContent = new Date().getFullYear();
  document.title = `${C.name} — UI/UX Designer`;

  /* ---- links (no dead links: unset URLs render as hints) ---- */
  function linkList() {
    const mk = (label, url, hint) => url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}</a>` : `<span class="off">${label}: ${hint}</span>`;
    return [
      `<a href="mailto:${esc(C.email)}">${esc(C.email)}</a>`,
      mk("LinkedIn", C.linkedin, "add URL in js/config.js"),
      mk("GitHub", C.github, "add URL in js/config.js"),
      C.resume ? `<a href="${esc(C.resume)}" target="_blank" rel="noopener">Resume</a>` : ""
    ].join("");
  }
  $("#foot-links").innerHTML = linkList();
  $("#foot-cta").href = `mailto:${C.email}`;

  /* ---- artwork: real image if path set, else generated placeholder ---- */
  const art = (src, alt, accent, cls = "") => src
    ? `<div class="art ${cls}"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"></div>`
    : `<div class="art ph ${cls}" style="--a:${accent || "#C6FF3D"}" role="img" aria-label="Placeholder artwork"><span class="phl">Placeholder artwork</span></div>`;

  /* ---- section definitions: one pattern, six renderers ---- */
  const rail = (cards) => `<div class="rail-wrap"><div class="rail" tabindex="0" role="group" aria-label="Scroll horizontally">${cards}</div><div class="rail-ui"><button data-dir="-1" aria-label="Scroll left">←</button><button data-dir="1" aria-label="Scroll right">→</button><span aria-hidden="true">Drag or scroll for more</span></div></div>`;
  const SECTIONS = [
    { id: "about", title: "About", desc: "Background & approach", render: () => `<div class="about">${art(C.about.photo, "Portrait of " + C.name, "#B9A4FF")}<div><p class="lead">${esc(C.about.intro)}</p>${C.about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}<ol>${li(C.about.approach)}</ol></div></div>` },
    { id: "projects", title: "Projects", desc: "View selected work ↗", render: () => rail(P.map((p) => `<article class="card proj"><button data-proj="${p.id}" aria-label="View case study: ${esc(p.title)}">${art(p.image, p.imageAlt || p.title, p.accent)}<span class="meta">${esc(p.category)} · ${esc(p.year)}</span><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p><span class="go">View case study ↗</span></button></article>`).join("")) },
    { id: "experience", title: "Experience", desc: "Four roles, 2021 – now", render: () => rail(C.experience.map((e) => `<article class="card wide"><span class="meta">${esc(e.period)}</span><h3>${esc(e.title)}<br>${esc(e.company)}</h3><p>${esc(e.summary)}</p><ul>${li(e.responsibilities)}</ul><div class="tags">${e.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div></article>`).join("")) },
    { id: "skills", title: "Skills", desc: "Tools & ways of working", render: () => rail(C.skills.map((s) => `<article class="card skill"><h3>${esc(s.group)}</h3><ul>${li(s.items)}</ul></article>`).join("")) },
    { id: "education", title: "Education", desc: "Qualifications", render: () => rail(C.education.map((e) => `<article class="card edu"><span class="yr">${esc(e.year)}</span><div><h3>${esc(e.qualification)}</h3><p>${esc(e.institution)}</p></div></article>`).join("")) },
    { id: "contact", title: "Contact", desc: "Let's talk", render: () => `<div class="contact"><p>${esc(C.contactCta)}</p><div class="links">${linkList()}</div><a class="cta" href="mailto:${esc(C.email)}">Email me</a></div>` }
  ];
  const host = $("#panels");
  host.innerHTML = SECTIONS.map((s) => `<section class="panel" id="s-${s.id}"><h2><button class="panel-head" aria-expanded="false" aria-controls="b-${s.id}"><span class="t">${s.title}</span><span class="d">${s.desc}</span><span class="pm" aria-hidden="true">+</span></button></h2><div class="panel-body" id="b-${s.id}" role="region" aria-label="${s.title}" inert><div class="panel-inner">${s.render()}</div></div></section>`).join("");

  /* ---- expand / collapse (one at a time) ---- */
  function setOpen(panel, open) {
    panel.classList.toggle("open", open);
    $(".panel-head", panel).setAttribute("aria-expanded", open);
    $(".panel-body", panel).inert = !open;
  }
  function openSection(id, scroll = true) {
    const target = $("#s-" + id), was = target.classList.contains("open");
    $$(".panel").forEach((p) => setOpen(p, p === target && !was));
    if (!was && scroll) setTimeout(() => target.scrollIntoView({ block: "start" }), 60);
  }
  $$(".panel-head").forEach((b) => b.addEventListener("click", () => openSection(b.closest(".panel").id.slice(2))));
  $$("[data-open]").forEach((b) => b.addEventListener("click", () => {
    const id = b.dataset.open; if (!$("#s-" + id).classList.contains("open")) openSection(id); else $("#s-" + id).scrollIntoView();
  }));
  $("#totop").addEventListener("click", () => window.scrollTo({ top: 0 }));

  /* ---- horizontal rails: arrows, drag, edge hint ---- */
  $$(".rail-wrap").forEach((wrap) => {
    const r = $(".rail", wrap), [prev, next] = $$(".rail-ui button", wrap);
    const upd = () => { const max = r.scrollWidth - r.clientWidth - 2; prev.disabled = r.scrollLeft <= 2; next.disabled = r.scrollLeft >= max; wrap.classList.toggle("end", r.scrollLeft >= max); };
    r.addEventListener("scroll", upd, { passive: true }); window.addEventListener("resize", upd); upd();
    [prev, next].forEach((b) => b.addEventListener("click", () => r.scrollBy({ left: +b.dataset.dir * Math.min(440, r.clientWidth * 0.8), behavior: "smooth" })));
    r.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") r.scrollBy({ left: 300, behavior: "smooth" }); if (e.key === "ArrowLeft") r.scrollBy({ left: -300, behavior: "smooth" }); });
    let down = false, moved = false, sx = 0, sl = 0;
    r.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = r.scrollLeft; });
    window.addEventListener("pointermove", (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) { moved = true; r.classList.add("drag"); } if (moved) r.scrollLeft = sl - dx; });
    window.addEventListener("pointerup", () => { down = false; r.classList.remove("drag"); });
    r.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  });
  /* panel bodies are measured when opened, so refresh arrows then */
  $$(".panel-head").forEach((h) => h.addEventListener("click", () => setTimeout(() => window.dispatchEvent(new Event("resize")), 650)));

  /* ---- project case study dialog ---- */
  const dlg = $("#case");
  let idx = 0, opener = null;
  function showCase(i) {
    idx = (i + P.length) % P.length;
    const p = P[idx], prev = P[(idx - 1 + P.length) % P.length], nxt = P[(idx + 1) % P.length];
    const row = (h, body) => `<section><h3>${h}</h3><div>${body}</div></section>`;
    dlg.innerHTML = `<div class="case-bar"><button data-nav="-1" aria-label="Previous project: ${esc(prev.title)}">← Previous</button><button id="x" aria-label="Close case study">Close ✕</button><button data-nav="1" aria-label="Next project: ${esc(nxt.title)}">Next →</button></div>
    <article class="case"><div><p class="meta">${esc(p.category)} · ${esc(p.year)}</p><h2>${esc(p.title)}</h2></div>
    <p class="notice">Placeholder content and artwork. Replace in js/projects.js.</p>
    ${art(p.image, p.imageAlt || p.title + " hero image", p.accent)}
    ${row("Overview", `<p>${esc(p.overview)}</p>`)}${row("Problem", `<p>${esc(p.problem)}</p>`)}${row("My role", `<p>${esc(p.role)}</p>`)}
    ${row("Process", `<ol>${li(p.process)}</ol>`)}${row("Key decisions", `<ul>${li(p.decisions)}</ul>`)}${row("Outcome", `<p>${esc(p.outcome)}</p>`)}
    <div class="gal">${p.gallery.map((g, n) => art(g, `${p.title} additional image ${n + 1}`, p.accent)).join("")}</div></article>`;
    dlg.scrollTop = 0;
  }
  function openCase(id) { opener = document.activeElement; showCase(P.findIndex((p) => p.id === id)); if (!dlg.open) dlg.showModal(); document.documentElement.style.overflow = "hidden"; $("#x", dlg).focus(); }
  function closeCase() { dlg.close(); }
  dlg.addEventListener("close", () => { document.documentElement.style.overflow = ""; if (opener) opener.focus(); });
  dlg.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; if (b.id === "x") closeCase(); else if (b.dataset.nav) { showCase(idx + +b.dataset.nav); } });
  host.addEventListener("click", (e) => { const b = e.target.closest("[data-proj]"); if (b) openCase(b.dataset.proj); });
})();
