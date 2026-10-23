# Okojie & Associates homepage redesign

My design and frontend work on the Okojie & Associates homepage: the static
mockup, plus the React components, styles and hooks I wrote when building it
into the site.

This isn't the full app. The components were built for the Okojie Laravel +
Inertia codebase, so they won't run on their own here.

## What's here

| Path                              | What it is                                                    |
| --------------------------------- | ------------------------------------------------------------- |
| `mockups/`                        | Mockups of every screen, light and dark. Start at `mockups/index.html`. |
| `resources/js/components/home/`   | Homepage sections: nav, hero, tiers, closing sections and the shared primitives |
| `resources/css/home.css`          | Homepage design tokens, scoped to `.home[data-theme]`         |
| `resources/js/hooks/`             | `use-quote-form` and `use-honeypot` for the intake forms      |
