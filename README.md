# ReNote Documentation

ReNote is a web-based academic repository and knowledge management system. It helps users organize academic resources into repositories, control repository visibility, request access to restricted resources, upload and preview files, search resources, generate AI file summaries, and revisit summary history.

## Core Capstone Focus

ReNote focuses on reducing academic information overload through:

- Repository-based learning resource organization
- Public, restricted, and private repository visibility
- Access request workflow for restricted repositories
- File upload, file viewer, and file management
- Basic repository and file search
- AI-powered file summarization
- Summary history and summary details
- Basic summary citation metadata
- Repository view tracking for dashboard/recent activity
- Trust labels for Community, Faculty, and Institution resources

## Tech Stack

### Frontend
- React + Vite
- React Router DOM
- Clerk authentication

### Backend
- Node.js
- Express.js
- MySQL

### Storage and AI
- AWS S3 
- OpenAI API for AI file summarization

## Project Priority Levels

### MVP Must-Have
These features should be built first and are required for the working prototype.

### Second Wave
These features are planned after the MVP is stable.

### Advanced / Future
These features are not required for the current build and should be presented as future enhancements.

## Team Tasks

| Owner | Feature Area | Responsibilities |
| --- | --- | --- |
| Alih / Project Lead | Foundation, Authentication, Layout, Dashboard, Repository Views, Notifications later, Settings later | Project setup, folder structure, global styles, Clerk, user sync, protected routes, layout, dashboard shell, dashboard stats, repository view tracking, API format, PR review. |
| Marv | Repository Management, Folder Management, Visibility, Access Requests, Archive later | Repository CRUD, repository workspace, folder CRUD, visibility control, access request approve/deny, repository access table, archive/restore in Second Wave. |
| Dani | File Upload, File Viewer, Search, Collections later | File upload UI/API, S3 integration, file preview, file metadata, file rename/delete/move, basic search, collections in Second Wave. |
| Cia | AI Summaries, Summary History, Summary Citations | AI file summarizer, summary modes, summary panel, summary history, refine/regenerate summary, summary citation metadata. |

## Development Rule

Each member should work only inside their assigned feature folders. Shared files such as routes, global CSS, app setup, database schema, and environment configuration should be edited by Alih or reviewed first before merging.
