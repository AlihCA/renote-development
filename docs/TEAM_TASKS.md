# TEAM_TASKS.md

## Final Team Ownership

| Owner | Feature Area | Responsibilities |
| --- | --- | --- |
| Alih | Foundation, Authentication, Layout, Dashboard, Repository Views, Notifications later, Settings later | Project setup, global styles, Clerk auth, user sync, protected routes, sidebar/topbar, dashboard shell, dashboard stats, repository view tracking, shared API format, code review. |
| Marv | Repository Management, Folder Management, Visibility, Access Requests, Archive later | Repository CRUD, repository workspace structure, folder CRUD, breadcrumbs, visibility, access request workflow, repository access, archive/restore in Second Wave. |
| Dani | File Upload, File Viewer, Search, Collections later | File upload UI/API, S3 service, file preview, file metadata, file rename/delete/move, keyword search, collections in Second Wave. |
| Cia | AI File Summarizer, Summary History, Summary Citations | Summary panel, summary history page, summary modes, refine/regenerate, OpenAI summarizer API, summary citations. |

## Branch Names

| Owner | Branch |
| --- | --- |
| Alih | `feature/foundation-auth-layout` |
| Marv | `feature/repository-management-access` |
| Dani | `feature/workspace-files-search` |
| Cia | `feature/ai-summary-citation` |

## MVP Responsibilities by Member

### Alih
- Project setup
- App routing
- Global styles
- Reusable layout components
- Clerk authentication
- User sync
- Dashboard UI
- Dashboard stats API
- Repository view tracking
- Shared service setup
- Code review and merge checking

### Marv
- Repository CRUD
- Repository visibility
- Repository workspace structure
- Folder CRUD
- Access request create/view/approve/deny
- Repository access records

### Dani
- File upload UI
- File upload API
- S3/storage integration
- File viewer
- File metadata update
- File move/delete
- Basic search

### Cia
- AI summary generation
- Summary modes
- Summary history
- Summary details panel
- Summary refine/regenerate
- Summary citations

## Team Rules

- No direct pushes to `main` or `dev`.
- All development goes through feature branches.
- Pull latest `dev` before coding.
- Use dummy data first before backend integration.
- Each member should edit only assigned files/folders unless approved.
- Shared/protected files require Alih's approval.
- Pull requests must be tested locally before merging.
- Use clear commit messages: `feat:`, `fix:`, `style:`, `docs:`, `refactor:`.
