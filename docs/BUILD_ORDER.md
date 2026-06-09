# ReNote Build Order

This build order should be followed to avoid conflicts, missing dependencies, and repeated work. The team should build the MVP first before working on Second Wave or Future features.

---

## Phase 1: Project Foundation

### 1. Set up project folders

**Owner:** Alih
**Depends on:** None

Create the main project structure:

```text
renote/
├── client/
├── server/
├── docs/
└── README.md
```

---

### 2. Install dependencies and configure scripts

**Owner:** Alih
**Depends on:** Project folder setup

Set up the required frontend and backend packages.

Frontend:

```text
React
Vite
React Router
Axios
Clerk
```

Backend:

```text
Node.js
Express
MySQL
Clerk middleware
Multer / file upload tools
AWS S3 SDK
OpenAI SDK
```

---

### 3. Create global styles, reusable components, and routes

**Owner:** Alih
**Depends on:** Dependency setup

Set up:

```text
Global CSS
CSS variables
Utility classes
Reusable UI components
Main route structure
Protected routes
Dashboard layout
Sidebar
Topbar
```

---

### 4. Set up Clerk authentication UI

**Owner:** Alih
**Depends on:** Route setup

Create and configure:

```text
Sign In page
Sign Up page
ProtectedRoute
Role/user checking structure
```

---

### 5. Set up MySQL database schema

**Owner:** Alih with team coordination
**Depends on:** Final database plan

Create the MVP database tables:

```text
users
repositories
repository_tags
folders
files
summaries
summary_citations
access_requests
repository_access
repository_views
```

---

### 6. Set up auth middleware and user sync backend

**Owner:** Alih
**Depends on:** Clerk setup and users table

Build the authentication backend first because other modules need the logged-in user's database ID.

Required routes:

```text
GET /api/users/me
POST /api/users/sync
```

---

## Phase 2: Frontend UI with Dummy Data

### 7. Create dummy data files

**Owner:** All members
**Depends on:** Frontend folder structure

Create temporary dummy data for UI testing.

Examples:

```text
dummyRepositories.js
dummyFiles.js
dummySummaries.js
dummyNotifications.js
```

---

### 8. Build Dashboard UI with dummy data

**Owner:** Alih
**Depends on:** Layout and dummy data

Dashboard should show:

```text
Welcome section
Basic stats
Recent repositories
Recent summaries
Repository view activity if available
```

---

### 9. Build Repository CRUD UI with dummy data

**Owner:** Marv
**Depends on:** Dashboard layout and dummy data

Build UI for:

```text
Repository list
Repository cards
Create repository
Edit repository
Delete/archive repository
Repository visibility selector
```

---

### 10. Build Folder CRUD UI with dummy data

**Owner:** Marv
**Depends on:** Repository UI

Build UI for:

```text
Folder list
Create folder
Rename folder
Delete folder
Nested folder display
Breadcrumbs
```

---

### 11. Build File Upload UI and File Viewer with dummy data

**Owner:** Dani
**Depends on:** Repository and folder UI

Build UI for:

```text
File upload area
File list
File cards/table
File viewer
File actions
Rename file
Move file
Delete file
```

---

### 12. Build AI Summary UI and Summary History with dummy data

**Owner:** Cia
**Depends on:** File viewer UI

Build UI for:

```text
Summary mode selector
Generate summary button
Summary panel
Summary history page
Summary details page
Copy summary
Delete summary
Regenerate summary
Refine summary
Basic summary citations
```

---

### 13. Build Search UI with dummy data

**Owner:** Dani
**Depends on:** Repository, file, and summary dummy data

Build UI for:

```text
Global search bar
Repository search
File search
Search results
Basic filters
```

---

## Phase 3: Backend Module Development

### 14. Connect repository backend

**Owner:** Marv
**Depends on:** User sync backend and repositories table

Build repository API logic:

```text
GET /api/repositories
GET /api/repositories/:repoId
POST /api/repositories
PUT /api/repositories/:repoId
DELETE /api/repositories/:repoId
```

---

### 15. Connect folder backend

**Owner:** Marv
**Depends on:** Repository backend and folders table

Build folder API logic:

```text
GET /api/repositories/:repoId/folders
GET /api/folders/:folderId
POST /api/repositories/:repoId/folders
PUT /api/folders/:folderId
DELETE /api/folders/:folderId
```

---

### 16. Connect repository visibility backend

**Owner:** Marv
**Depends on:** Repository backend

Build visibility logic for:

```text
Public repositories
Restricted repositories
Private repositories
```

Required route:

```text
PUT /api/repositories/:repoId/visibility
```

---

### 17. Connect access request backend

**Owner:** Marv
**Depends on:** Repository visibility backend, access_requests table, repository_access table

Build access request logic:

```text
POST /api/repositories/:repoId/access-requests
GET /api/repositories/:repoId/access-requests
PUT /api/access-requests/:requestId/approve
PUT /api/access-requests/:requestId/deny
```

When a request is approved, add the user to:

```text
repository_access
```

---

### 18. Connect repository view tracking

**Owner:** Alih or Marv
**Depends on:** Repository backend and repository_views table

Build repository view tracking for dashboard statistics and repository activity.

Possible routes:

```text
POST /api/repositories/:repoId/view
GET /api/dashboard/repository-views
```

---

### 19. Connect file upload backend and S3

**Owner:** Dani
**Depends on:** Repository backend, folder backend, files table, S3 configuration

Build file upload and file management logic:

```text
GET /api/repositories/:repoId/files
GET /api/folders/:folderId/files
GET /api/files/:fileId
GET /api/files/:fileId/view
POST /api/repositories/:repoId/files/upload
POST /api/folders/:folderId/files/upload
PUT /api/files/:fileId
PUT /api/files/:fileId/move
DELETE /api/files/:fileId
```

---

### 20. Connect search backend

**Owner:** Dani
**Depends on:** Repository backend, file backend, summary backend if summary search is included

Build basic keyword search:

```text
GET /api/search?query=keyword
GET /api/repositories/:repoId/search?query=keyword
```

---

### 21. Connect AI file summarizer and summary citations

**Owner:** Cia
**Depends on:** File backend, summaries table, summary_citations table, OpenAI configuration

Build AI summary routes:

```text
POST /api/summaries/file/:fileId
GET /api/summaries
GET /api/summaries/:summaryId
GET /api/files/:fileId/summaries
PUT /api/summaries/:summaryId/refine
PUT /api/summaries/:summaryId/regenerate
DELETE /api/summaries/:summaryId
GET /api/summaries/:summaryId/citations
POST /api/summaries/:summaryId/citations
```

---

## Phase 4: Frontend and Backend Integration

### 22. Replace dummy data with API services

**Owner:** All members
**Depends on:** Backend routes

Each member should replace dummy data only in their assigned module.

Examples:

```text
repositoryService.js
folderService.js
fileService.js
searchService.js
summaryService.js
dashboardService.js
```

---

### 23. Connect frontend pages to backend APIs

**Owner:** All members
**Depends on:** API services

Connect:

```text
Dashboard page
Repositories page
Repository workspace
File viewer
Search page
Summary history
Summary details
Access request UI
```

---

### 24. Integration testing

**Owner:** All members
**Depends on:** Connected frontend and backend

Test the complete MVP flow:

```text
User signs in
User is synced to database
User creates repository
User creates folders
User uploads files
User views files
User searches resources
User generates summary
User views summary history
User changes repository visibility
User requests access
Owner approves or denies access
Repository views are tracked
```

---

## Phase 5: Finalization

### 25. Final bug fixing

**Owner:** All members
**Depends on:** Integration testing

Fix:

```text
Broken routes
UI layout issues
Missing API responses
Authorization errors
File upload errors
Summary generation errors
Search issues
```

---

### 26. Deployment preparation

**Owner:** Alih with team support
**Depends on:** Stable MVP

Prepare:

```text
Environment variables
Frontend deployment
Backend deployment
Database hosting
S3 configuration
Clerk production keys
OpenAI API key
Final README
Final documentation
```

---

## Important Build Rules

```text
Do not build Second Wave features until the MVP is stable.
Use dummy data first before connecting APIs.
Do not edit protected/shared files without approval.
Do not build access requests before repository visibility works.
Do not build AI summaries before file upload and file viewer work.
Do not build search before repositories and files have usable data.
Repository views are MVP and should be connected after repository backend.
```

---

## MVP Completion Order

```text
1. Authentication and user sync
2. Dashboard layout
3. Repository CRUD
4. Folder CRUD
5. File upload and file viewer
6. Repository visibility
7. Access request system
8. Repository view tracking
9. Basic search
10. AI file summarizer
11. Summary history and summary details
12. Integration testing
13. Deployment preparation
```
