# tisyavaidya.com

Personal website of Tisya Vaidya, data scientist and master's student in Machine Learning and Statistics at Uppsala University.

The site looks and works like a JupyterLab notebook: each page is a notebook, cells run when the page opens, and visitors can re-run cells, restart the kernel, or ask questions with `me.ask("...")`. Plain HTML, CSS and JavaScript on GitHub Pages; no build step.

## Editing

Most content lives in **`js/data.js`**:

- `experience`: jobs, research and teaching (also drives the Gantt chart)
- `projects`: project cards and pop-up write-ups; `link` is the GitHub URL
- `education`, `skills`, `status`
- `ask`: questions and answers for Ask Tisya

Other files:

- `index.html`, `about.html`, `experience.html`, `projects.html`, `contact.html`: the cells on each page (markdown text and the illustrative code)
- `css/notebook.css`: colours for light and dark themes are at the top
- `js/notebook.js`: the notebook shell, running cells, and every cell's output
- `js/hero.js`: the interactive recursive least squares plot
- `assets/`: résumé PDF, photos, favicon, link-preview image

## Don't delete

- `CNAME`: serves the site at tisyavaidya.com
- `.nojekyll`: serves files as they are
