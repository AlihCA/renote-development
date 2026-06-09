# CODING_STANDARDS.md

## Naming Conventions

### React Components
Use PascalCase.

Examples:
```txt
RepositoryCard.jsx
DashboardPage.jsx
SummaryHistory.jsx
```

### Variables and Functions
Use camelCase.

Examples:
```txt
getRepositories()
createFolder()
generateSummary()
```

### Database Tables
Use snake_case.

Examples:
```txt
repositories
repository_tags
summary_citations
repository_access
repository_views
```

## Frontend Rules

- Use reusable components.
- Keep components small and focused.
- Avoid very large files.
- Use dummy data first if API is not ready.
- Separate pages and components.
- Use the services folder for API calls.
- Include loading, error, and empty states.
- Do not call backend routes directly inside components if a service file exists.

## Backend Rules

- Separate routes, controllers, models, and services.
- Use async/await.
- Validate request bodies and route parameters.
- Protect routes using authentication middleware.
- Check permissions on the backend, not only the frontend.
- Return consistent API responses.
- Keep S3/OpenAI logic inside service files.

## Git Rules

Branches:
```txt
main
dev
feature/*
```

Commit format:
```txt
feat: add repository CRUD
fix: correct access request bug
style: update dashboard layout
docs: update API documentation
refactor: clean summary service
```

## Protected Files

Only Alih or approved members can edit:

```txt
client/src/App.jsx
client/src/main.jsx
client/src/routes.jsx
client/src/services/api.js
client/src/styles/global.css
client/src/styles/variables.css
client/src/styles/utilities.css
server/src/app.js
server/src/server.js
server/src/config/db.js
server/src/database/schema.sql
.env
package.json
```

## Pull Request Checklist

Before submitting a PR:

- Pull latest `dev`.
- Test locally.
- Check for console errors.
- Check loading/error/empty states.
- Do not include unused files or test/debug logs.
- Explain what files were changed.
- Mention if shared files were touched.
