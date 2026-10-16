# Daniel Bayliss — Mechanical Engineering portfolio

Project and vehicle pages use a `.page-banner` image matching their directory thumbnail. Banner and tiled thumbnails share 3.2:1 proportions on desktop and 2.4:1 on mobile. The shared navigation script docks their page title and adds a scroll-to-top arrow only to project-directory, project and vehicle pages.

Finished project source folders live in `../finished projects/`. Each contains images and a `.txt` file specifying the project title, date, description, thumbnail, and ordered image names with dates and captions. Use that order for the project slideshow, reserve a caption area below each image, and display its date in a floating bubble at the top right. Use the specified thumbnail for both the page banner and project directory card. Copy referenced images into this website so it remains self-contained for GitHub upload. Replace an existing project page and card when updating the same project.

RS4 is published locally at `projects/hpi-rs4.html`. Its seven slides use the shared `project-slideshow.js` and `project-slideshow.css`, with previous/next buttons, arrow-key navigation, and touch swipes. Without JavaScript all photos and captions remain readable. Project completion dates can use year, year-month, or full date precision; do not invent a month or day when only a year is supplied.
