# 18-Day Git Roadmap for Lab Inventory App

This plan breaks the project into 18 daily deliverables so you can commit or push something meaningful every day and complete the app in 18 days.

## Workflow
- Create a dedicated branch for this roadmap, e.g. `daily-progress-18days`.
- Make one or more focused commits per day.
- Use the suggested commit messages below.
- At the end of each day, push the branch: `git push origin daily-progress-18days`.

## Daily Breakdown

### Day 1: Project setup and documentation
- Add or update `README.md` with install, seed, run, and build steps.
- Confirm `package.json` scripts include `dev`, `build`, `start`, `seed`.
- Commit: `docs: add initial project setup and run instructions`

### Day 2: Database seed and env configuration
- Finalize `scripts/seed.js` and MongoDB seed data.
- Document `MONGODB_URI` and default dev database in README.
- Commit: `feat: add database seed script and env docs`

### Day 3: MongoDB auth wiring
- Complete login route against MongoDB.
- Ensure `app/api/auth/login/route.ts` uses real users.
- Commit: `feat: wire login to MongoDB employees collection`

### Day 4: Auth session handling and profile
- Implement `me` and `logout` API routes.
- Ensure `app/api/auth/me/route.ts` returns current user.
- Commit: `feat: add auth session endpoints and profile lookup`

### Day 5: Admin equipment CRUD backend
- Finalize admin equipment GET/POST API routes.
- Add server-side validation and admin check.
- Commit: `feat: add admin equipment backend endpoints`

### Day 6: Employee equipment listing endpoint
- Implement employee-facing equipment listing.
- Ensure only available items are returned.
- Commit: `feat: add employee equipment listing API`

### Day 7: Checkout and return backend
- Complete checkout POST, return POST, and history routes.
- Validate inventory updates and statuses.
- Commit: `feat: implement equipment checkout and return logic`

### Day 8: Admin dashboard stats and reports
- Add stats endpoint for totals and active checkouts.
- Integrate dashboard UI data.
- Commit: `feat: add admin stats and dashboard data`

### Day 9: Admin equipment list UI polish
- Improve `app/admin/equipment/page.tsx` layout.
- Add search, sort, or basic filters.
- Commit: `ui: polish admin equipment list page`

### Day 10: Add equipment page UI and flow
- Complete `app/admin/equipment/add/page.tsx` form.
- Ensure post-submit navigation and validation.
- Commit: `feat: add admin equipment creation page`

### Day 11: Employee dashboard and checkout UI
- Build employee-facing equipment list, checkout form, history.
- Add status UI for current rentals.
- Commit: `feat: add employee checkout and history UI`

### Day 12: Route guards and access control
- Add client-side/admin guard logic.
- Harden API routes to reject unauthorized access.
- Commit: `fix: add route guards and auth protection`

### Day 13: Testing and validation
- Add simple tests or scripts for login, add equipment, checkout.
- Verify seed and APIs with curl or Playwright.
- Commit: `test: add end-to-end validation for core flows`

### Day 14: Error handling and UX
- Improve error messages and form feedback.
- Handle loading / empty states.
- Commit: `fix: improve UX and error handling`

### Day 15: Documentation and developer notes
- Update README with daily progress summary.
- Add environment and deployment notes.
- Commit: `docs: expand README with developer guide`

### Day 16: Cleanup and code quality
- Run formatting, remove leftover placeholders.
- Apply linting and TypeScript hygiene.
- Commit: `chore: cleanup code and enforce formatting`

### Day 17: Performance and enhancements
- Add pagination or optimized queries.
- Improve database indexes or list caching.
- Commit: `perf: optimize equipment list and queries`

### Day 18: Final polish and release prep
- Final review of UI, routing, and data flows.
- Create release notes / summary in README.
- Commit: `chore: final polish and release preparation`

## Notes
- Use small, frequent commits: one feature or fix per commit.
- Keep each day scoped to a single area: auth, admin, employee, UI, testing, or docs.
- If you want, I can also create a `daily-progress-18days` branch and add a first commit with this roadmap.
