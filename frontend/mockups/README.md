# Design mockups

Static HTML mockups of every Okojie screen, for review before they're built into the app.
They aren't part of the Laravel app or the frontend build, and they use sample data.

Start at `index.html`: it lists all 31 screens grouped by area.

## Viewing

Double-click any `.html` file to open it in your browser, no server needed. The moon/sun
button switches between light and dark.

Screens with several states (return stages, empty lists, 2FA steps, error codes) have a
dark "Mockup states" panel in the bottom-right corner for switching between them. It's
only for reviewing and isn't part of the design. You can also set states in the URL:
`portal-overview.html?theme=dark&m0=empty&panel=hide`.

## Screens and where they're built in the app

| Area | Mockups | App files |
| --- | --- | --- |
| Public site | `home`, `services`, `pricing`, `about`, `contact`, `legal-*`, `error` | `resources/js/pages/{home,services,pricing,about,contact,error}.tsx`, `pages/legal/` |
| Sign in | `auth-*` | `resources/js/pages/auth/` |
| Client portal | `portal-*` | `resources/js/pages/portal/`, `layouts/portal-layout.tsx` |
| Staff admin | `admin-*`, `settings-*` | `resources/js/pages/admin/`, `pages/settings/` |

## Shared files

| File | What it holds |
| --- | --- |
| `shared/tokens.css` | Colors, type and radii for light and dark, buttons, chips, two-layer cards |
| `shared/app.css` | Sidebar shell, metrics, lists, tables, forms, empty states |
| `shared/auth.css` | Split layout for sign-in screens |
| `shared/site.css` | Public pages: sky header band, nav, footer, FAQ |
| `shared/app.js` | Icons, sidebar and site nav, theme toggle, the mockup state panel |

`home.html` predates the shared files and keeps its own styles.

## Notes for the build

- The portal overview shows unread messages, the next appointment and recent documents,
  which the current overview page doesn't receive yet.
- Clients can't reply to messages in the current app, so the messages screen points them
  to phone or booking instead.
- Status messages on the overview are rewritten in plainer language. That text lives in
  the backend (`ReturnStatus`).
- Legal pages carry draft wording and must be replaced with counsel-reviewed text.
- Names, phone numbers, the team and refund amounts are placeholders.
