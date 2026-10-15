<h1 align="center">Frank Rosello · Portfolio</h1>

<p align="center">
  A personal portfolio showcasing my software projects, technical skills, and campus leadership.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/GitHub_Pages-222222?style=flat&logo=github&logoColor=white" alt="GitHub Pages">
</p>

<p align="center">
  <a href="https://github.com/frankrosello">GitHub</a> ·
  <a href="https://www.linkedin.com/in/frank-rosello/">LinkedIn</a> ·
  <a href="mailto:frankierose212005@gmail.com">Email</a>
</p>

## About

I’m a Computer Science student at Florida Polytechnic University, focused on software engineering and game design. This website brings together my projects, experience, and the tools I use, with a simple layout and visual details inspired by my World of Warcraft launcher.

Featured projects include EsportsHub, a web app for coordinating esports teams, and my World of Warcraft launcher.

Built with HTML, CSS, and vanilla JavaScript. No framework, package installation, or build step is required.

## Features

- **Project showcases** — filter projects by category and open detailed descriptions.
- **Screenshot gallery** — rotating launcher screenshots with arrows, selection dots, pause/play, keyboard navigation, and touch swipes.
- **Automatic appearance** — follows the device’s light or dark theme, with optional manual overrides.
- **Technical skills** — grouped languages, interfaces, APIs, libraries, development tools, and computer science concepts.
- **GitHub integration** — contribution graph, recent public activity, repository cards, language counts, stars, forks, followers, following, and the latest launcher release.
- **Experience and education** — campus leadership, degree information, and certifications.
- **Contact options** — GitHub, LinkedIn, email, Discord username copying, and a downloadable resume.
- **Responsive design** — adapts to desktop and mobile screens and respects reduced-motion preferences.

## Featured Projects

| Project | Focus | Technologies |
| --- | --- | --- |
| [EsportsHub](https://github.com/frankrosello/esportshub) | Team rosters, schedules, availability, role-specific access, and team reports | JavaScript, HTML, CSS, Clerk, Cloudflare Workers, Turso, SQL |
| [World of Warcraft Launcher](https://github.com/frankrosello/wow_launcher) | Game management, add-ons, Armory lookups, news, and playtime tracking | Python, Tkinter, JavaScript, REST APIs, Cloudflare Workers |
| [Airport Network Graph](https://github.com/frankrosello/airportnetworkgraphalgorithms) | Weighted graph modeling and route analysis | C++ |
| AxCelMark Application Website | Responsive job application website | HTML, CSS, JavaScript |

## Run Locally

From the repository folder, start a local server:

```bash
python3 -m http.server 8000
```

Then open [localhost:8000](http://localhost:8000/).

On Windows, you can use `py -m http.server 8000` instead.

## Deploy to GitHub Pages

1. Create a public repository named `frankrosello.github.io`, or use a repository such as `portfolio` for a project site.
2. Upload the website files to the repository root. Keep `index.html` and the `assets` folder at the same level.
3. Commit the files to `main`.
4. Open **Settings → Pages** and select **Deploy from a branch**.
5. Choose **main** and **/(root)**, then click **Save**.

After deployment, a repository named `frankrosello.github.io` is available at `https://frankrosello.github.io/`. A repository named `portfolio` is available at `https://frankrosello.github.io/portfolio/`.

See the [GitHub Pages quickstart](https://docs.github.com/en/pages/quickstart) for more details.

## File Structure

| File | Purpose |
| --- | --- |
| `index.html` | Page content and layout |
| `style.css` | Responsive styling and light/dark appearance |
| `app.js` | Project dialogs, filters, and Discord copying |
| `appearance.js` | Device theme detection and appearance preferences |
| `carousel.js` | Screenshot gallery controls and rotation |
| `github.js` | GitHub data loading and rendering |
| `assets/` | Screenshots, avatar, resume, and saved GitHub data |
| `.nojekyll` | Disables Jekyll processing on GitHub Pages |

## Updating the Portfolio

- Edit biography, skills, experience, and education in `index.html`.
- Edit project details in `app.js`.
- Change layouts and colors in `style.css`.
- Replace `assets/Frank_Rosello_Resume.pdf` to update the downloadable resume.
- Replace screenshots in `assets/`, keeping their existing filenames or updating the references.

GitHub data refreshes from public endpoints and uses short-term browser-session caching. Saved data and a contribution-chart fallback keep the section usable when an external service is unavailable. Fallback data is labeled with its saved date.

Language counts represent primary languages across original public repositories. Stars and forks exclude forked copies; recent events cover public activity only. No GitHub API token is required.

## Contact

- **Email:** [frankierose212005@gmail.com](mailto:frankierose212005@gmail.com)
- **LinkedIn:** [Frank Rosello](https://www.linkedin.com/in/frank-rosello/)
- **GitHub:** [frankrosello](https://github.com/frankrosello)
- **Discord:** `urghost`
