# Pratik Tambe — Portfolio

A dark, editorial, static portfolio built with plain HTML, CSS and vanilla JavaScript. No build step, no dependencies, no backend. Works on GitHub Pages project URLs because every path is relative.

## Features
- Six expandable horizontal panels (About, Projects, Experience, Skills, Education, Contact), one open at a time, one reusable pattern
- Horizontal rails: trackpad, Shift + wheel, mouse drag, touch swipe, arrow buttons, keyboard arrows, edge fade hint
- Full-screen project case study view with previous/next and close (Esc also closes)
- Keyboard accessible, visible focus, reduced-motion support, responsive down to phones
- Content lives in two data files; no personal details are scattered in the HTML

## Folder structure
```
portfolio/
├── index.html
├── css/style.css
├── js/
│   ├── config.js     # name, bio, links, experience, skills, education
│   ├── projects.js   # project cards and case study text
│   └── main.js       # rendering and interactions
├── assets/images/    # your images
├── assets/icons/
├── README.md
└── .gitignore
```

## Change your name and details
Edit `js/config.js`. The name, availability, hero lines, email, LinkedIn, GitHub, resume, bio, experience, skills and education all come from there. Empty LinkedIn/GitHub/resume values show a hint instead of a dead link.
The page `<title>` and meta description in `index.html` are static; edit them too if your name changes.

## Replace project images
1. Put the file in `assets/images/`, e.g. `wms-hero.jpg`.
2. In `js/projects.js`, set `image: "assets/images/wms-hero.jpg"` and `imageAlt: "Describe the image"`.
3. Use `gallery: ["assets/images/a.jpg", "assets/images/b.jpg"]` for extra images.
Use relative paths with no leading `/`. Empty values show a labelled placeholder.

## Add or remove projects
Each project is one `tpl({...})` entry in `js/projects.js`. Copy one, give it a unique `id`, edit the text. Delete an entry to remove it. The sample projects are concepts, not finished case studies; replace the text with your real work and only add outcomes you can verify.

## Colors and fonts
Edit the variables at the top of `css/style.css` (`--bg`, `--fg`, `--mute`, `--acc`, `--h`, `--b`). Fonts load from Google Fonts in `index.html` with system-font fallbacks; to change them, edit the `<link>` and the `--h` / `--b` variables.

## Run locally
Open `index.html` in a browser, or run a local server:
```
python3 -m http.server 8000
```
then visit http://localhost:8000.

## Publish on GitHub Pages
1. Create a new GitHub repository (for example `portfolio`).
2. In this folder run:
```
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/portfolio.git
git push -u origin main
```
3. On GitHub: Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main`, folder `/ (root)` → Save.
4. After a minute the site is live at `https://<your-username>.github.io/portfolio/`.

## Update the live site
```
git add .
git commit -m "Update portfolio"
git push
```
GitHub Pages redeploys automatically.
