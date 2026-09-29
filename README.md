# Daniel Bayliss — mechanical engineering portfolio

A plain HTML/CSS portfolio for the GitHub Pages user site `djmbayliss.github.io`. There is no build step, framework, JavaScript dependency or external font. Every link and image currently resolves, including the deliberately marked placeholder CV. **Replace the CV and project placeholders before sharing the site with employers.**

## File structure

```text
djmbayliss.github.io/
├── .nojekyll                         Disable GitHub Pages' default Jekyll processing
├── index.html                        Homepage, project cards, skills, about, contact
├── style.css                         All styles and responsive layouts
├── README.md                         These instructions
├── assets/
│   └── Daniel-Bayliss-CV.pdf         PLACEHOLDER PDF: overwrite with the real CV
├── projects/
│   ├── _template.html                Copy this to make a new case study
│   ├── motorcycle-phone-mount.html
│   ├── automated-window-blinds.html
│   ├── animatronic-film-prop.html
│   └── rc-vehicle-engineering.html
└── images/
    ├── favicon.svg
    ├── social-preview.png              Neutral link-preview image (edit if desired)
    ├── projects/
    │   ├── motorcycle-phone-mount.svg       Homepage and case-study hero placeholder
    │   ├── automated-window-blinds.svg      Homepage and case-study hero placeholder
    │   ├── animatronic-film-prop.svg        Homepage and case-study hero placeholder
    │   ├── rc-vehicle-engineering.svg       Homepage and case-study hero placeholder
    │   ├── motorcycle-phone-mount/README.txt  Instructions; put real images here
    │   ├── automated-window-blinds/README.txt
    │   ├── animatronic-film-prop/README.txt
    │   └── rc-vehicle-engineering/README.txt
    ├── other/
    │   └── build-placeholder.svg       Small-build thumbnail placeholder
    └── shared/
        ├── cad-placeholder.svg         Reusable case-study image placeholders
        ├── drawing-placeholder.svg
        ├── analysis-placeholder.svg
        ├── prototype-placeholder.svg
        ├── test-placeholder.svg
        └── final-placeholder.svg
```

All links are relative (`projects/...`, `../style.css`, etc.), so the site works locally and at the GitHub Pages root. The canonical/preview URLs in `<head>` use the intended public address.

## 1. Edit Daniel's details

Open `index.html` in a text editor and find the visible `[ADD ...]` prompts. Replace the About details, smaller-build descriptions and contact fields. Edit the one-sentence hero introduction to match the projects. The four project titles and one-line summaries use the example information provided for this template; check them against the real work.

Edit the Skills section to list **only** tools Daniel has actually used. In particular, remove CFD, a software package or a programming tool if there is no experience to support it. Project pages give the best evidence of each skill.

The `images/social-preview.png` image supplies a neutral link preview without pretending to show project work. If you change the site address, update the absolute canonical and Open Graph URLs in each HTML `<head>`; normal page and image navigation uses relative links.

The contact fields are text until real destinations are known. Replace each value with a link, for example:

```html
<div><span>Email</span><a href="mailto:daniel@example.com">daniel@example.com</a></div>
<div><span>LinkedIn</span><a href="https://www.linkedin.com/in/your-profile/">LinkedIn profile ↗</a></div>
<div><span>GitHub</span><a href="https://github.com/djmbayliss">GitHub profile ↗</a></div>
```

Use Daniel's actual addresses. If he has no relevant public GitHub work, remove that row rather than linking to an empty profile. The header's Contact link already jumps to this section.

## 2. Replace the CV

Export the real CV as a PDF named **`Daniel-Bayliss-CV.pdf`** and overwrite `assets/Daniel-Bayliss-CV.pdf`. The included one-page PDF says **CV PLACEHOLDER**; it exists solely so all Download CV links work during editing. Keeping the same filename means no HTML changes are needed. Verify the PDF opens after replacing it.

## 3. Replace the images

The SVGs are conspicuously labelled placeholders, not pictures of Daniel's work. Add real photos, CAD screenshots, drawings and analysis output to `images/projects/<project-slug>/`. For each `<img>` in `index.html` and a project page, edit `src`, `alt` and its nearby `<figcaption>`. An HTML comment immediately above each case-study image gives its suggested destination path. Example:

```html
<!-- Before -->
<img src="../images/shared/cad-placeholder.svg" alt="Placeholder; replace ...">

<!-- After, from a file in projects/ -->
<img src="../images/projects/motorcycle-phone-mount/cad-01.png"
     alt="CAD section view showing the spring arms and quick-release latch">
```

On the homepage, paths begin `images/...`; inside `projects/`, paths begin `../images/...`. Case-study hero and technical images use `object-fit: contain` to preserve drawings and labels. Homepage card images use a 16:10 crop (`object-fit: cover`), so check the subject stays in frame. Prefer WebP/JPEG for photographs and PNG for drawings, CAD UI and FEA plots with fine text. Keep screenshots legible at phone size; crop away irrelevant application chrome, retain units and colour scales, and use descriptive captions.

The recommended names for each project folder are:

```text
hero.webp               Main physical build or clear CAD render
cad-01.png              Mechanism/assembly or detailed CAD view
design-iteration.png    Sketch, drawing, exploded view or revision comparison
analysis-setup.png      Loads, material, restraints and mesh (if applicable)
analysis-result.png     Result with colour scale, quantity and units (if applicable)
prototype-01.webp      First fabrication stage
prototype-02.webp      Assembly/detail
prototype-03.webp      Revised prototype
test-before.webp        Observed issue or initial test
test-after.webp         Changed design and retest
final-design.webp       Finished part or installed product
```

These are suggestions, not required assets. Use the real filename and extension in each HTML `src`. Use the most useful evidence for each project; delete irrelevant figures or sections. For the six smaller projects, add files under `images/other/` and replace each occurrence of `images/other/build-placeholder.svg` independently in `index.html`.

## 4. Finish the four existing case studies

Each page in `projects/` has a one-line summary, quick facts, overview, objective, requirements, design development, prototyping, testing, final result, contribution and tools. The phone mount also has an ANSYS analysis section. Other pages omit that section until there is real engineering analysis to show.

Replace every `[ADD ...]` prompt. Prioritise evidence over long prose:

1. Identify the problem, constraints and Daniel's exact role.
2. Show a CAD/sketch view explaining a design decision.
3. Show the build, test, change and final result with concise captions.
4. For ANSYS/FEA, state the load case, assumptions, boundary conditions, result **with units**, and the design decision. Do not present a screenshot alone as validation.
5. For team work, name Daniel's work separately from the collaborator's work.

If a project is still in progress, say so. Do not add invented dimensions, performance figures, results or achievements. The RC page should focus on one coherent vehicle/modification sequence rather than a collection of unrelated repairs.

## 5. Add a new full case study

1. Copy `projects/_template.html` to `projects/your-project-slug.html` (lowercase, hyphens, no spaces).
2. Remove the template-only `<meta name="robots" content="noindex">` line. Replace all bracketed prompts and the page's `<title>`, description, `og:url` and canonical URL. Use `https://djmbayliss.github.io/projects/your-project-slug.html`.
3. Add real images in `images/projects/your-project-slug/` and edit their `src`, `alt` and captions. The shared placeholder SVGs keep the page functional while editing.
4. Remove the entire Engineering analysis `<section id="analysis">...</section>` **and** its `<a href="#analysis">` table-of-contents entry if no analysis applies. Remove or add other image blocks as needed. The CSS classes `media-grid two`, `media-grid three` and `wide-figure` are ready to use.
5. Update the previous/next project links at the bottom of the new page and its neighbours, or link back to all projects. These are ordinary relative links.
6. Add a homepage card inside `<div class="project-grid">` in `index.html`: copy an existing `<article class="project-card ...">`, update both links, title, summary, image, alt text and tags. Use `project-card-half` for a two-column row, or `project-card-wide` / `project-card-narrow` for an asymmetric pair.

For a small build that does not merit a case study, copy one `<article class="build-card">` inside `.build-grid` and change its image, title and one-sentence evidence note. It does not need a link.

## 6. Preview locally

Open a terminal in the **site folder** (the folder containing `index.html`) and run:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`. Stop the server with Ctrl+C. Python 3 is only for local preview; GitHub Pages serves the files as-is. Check the homepage and every project page on both a phone-sized and desktop-sized browser viewport. Open the CV download and check images/captions after each content update.

## 7. Publish on GitHub Pages

1. Sign in as the GitHub user **`djmbayliss`** and create a **public** repository named exactly **`djmbayliss.github.io`**. A public repository is required for GitHub Pages on a free account.
2. Upload the **contents** of this site folder to the repository's top level on the `main` branch. `index.html` must appear at the repository root, not inside an extra `djmbayliss.github.io/` folder. Use GitHub's **Add file → Upload files**, or push the folder with Git. Include the empty `.nojekyll` file if your upload method shows hidden files.
3. After the files are on `main`, go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select **`main`** and **`/(root)`**, then **Save**.
4. Open `https://djmbayliss.github.io/` (or the **Visit site** button in Settings → Pages). Publication or updates can take up to about 10 minutes. Future edits are published by committing or uploading changed files to `main`.

GitHub's instructions: [Create a Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) · [Configure a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Before sending the link to recruiters

- [ ] Replace the placeholder CV PDF with Daniel's real CV.
- [ ] Add a real email and relevant LinkedIn/GitHub links; remove unused rows.
- [ ] Replace all four project hero/card illustrations and every relevant technical figure.
- [ ] Fill or delete every `[ADD ...]` prompt and small-build card.
- [ ] Verify every skills list item, project claim and personal contribution.
- [ ] Confirm all images have accurate alt text, useful captions and readable units/scales.
- [ ] Test all project links, previous/next links, CV download and contact destinations.
- [ ] Check the page at desktop and phone widths.
