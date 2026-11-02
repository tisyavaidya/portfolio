# tisyavaidya.com

Personal website of Tisya Vaidya, data scientist and master's student in Machine Learning and Statistics at Uppsala University.

Plain HTML, CSS and JavaScript, hosted on GitHub Pages. No build step.

## Editing

Almost everything you'd want to change is in **`js/data.js`**:

- `experience`: jobs, research and teaching (these also feed the timeline chart)
- `projects`: project cards and their pop-up write-ups. Set `link` to a GitHub URL to show a "View code" button
- `education`, `skills`
- `ask`: the questions and answers for **Ask Tisya**
- `status`: the green badge in the header

Other files:

- `index.html`, `about.html`, `contact.html`: page text that isn't in `data.js`
- `css/site.css`: colours for light and dark themes are at the top
- `assets/Tisya_Vaidya_Resume.pdf`: replace with a new résumé, same file name
- `assets/tisya.jpg`, `assets/avatar.jpg`: photos

## Don't delete

- `CNAME`: tells GitHub Pages to serve the site at tisyavaidya.com
- `.nojekyll`: tells GitHub Pages to serve the files as they are

## Preview locally

Open `index.html` in a browser.
