# PROJECT_SCOPE.md

## MVP Must-Have Scope

| Feature / Module | Description | Owner | Priority |
| --- | --- | --- | --- |
| Authentication / User Sync | Clerk login/signup, protected routes, sync Clerk users to MySQL. | Alih | MVP Must-Have |
| Global Layout | Sidebar, topbar, dashboard layout, protected layout, reusable common UI. | Alih | MVP Must-Have |
| Dashboard UI | Simple dashboard with basic stats, recent repositories/files/summaries, and repository view-based recent activity. | Alih | MVP Must-Have |
| Repository Views | Track repository views for dashboard statistics and recent activity. | Alih | MVP Must-Have |
| User Badges / Trust Labels | Display Community, Faculty, and Institution trust labels. Manual assignment is enough for MVP. | Alih | MVP Must-Have |
| Repository CRUD | Create, view, update, and delete repositories. | Marv | MVP Must-Have |
| Repository Visibility | Public, restricted, and private repository visibility. | Marv | MVP Must-Have |
| Access Request System | Users can request access to restricted repositories; owners can approve or deny. | Marv | MVP Must-Have |
| Repository Access | Store approved users who can view or edit restricted/private repositories. | Marv | MVP Must-Have |
| Repository Workspace | Workspace page where folders and files are managed inside a repository. | Marv + Dani | MVP Must-Have |
| Folder CRUD | Create, rename, update, and delete folders. Supports nested folders up to depth 6. | Marv | MVP Must-Have |
| File Upload | Upload supported academic files to cloud storage. | Dani | MVP Must-Have |
| File Metadata Management | Store file name, type, size, S3 key, URL, owner, repository, and folder location. | Dani | MVP Must-Have |
| File Viewer / Preview | Open or preview uploaded files. | Dani | MVP Must-Have |
| File Rename / Delete / Move | Basic file management inside repositories and folders. | Dani | MVP Must-Have |
| Basic Search | Search repositories and files by keyword while respecting visibility rules. | Dani | MVP Must-Have |
| AI File Summarizer | Generate AI summaries from uploaded files. | Cia | MVP Must-Have |
| Summary Modes | Quick, Detailed, Key Points, and Study Mode. Can be hardcoded first. | Cia | MVP Must-Have |
| Summary History | Dedicated page for all generated summaries. | Cia | MVP Must-Have |
| Summary Details / Summary Panel | View full summary, original file info, copy, delete, refine, and regenerate. | Cia | MVP Must-Have |
| Summary Storage | Save generated summaries in the database so users can revisit them. | Cia | MVP Must-Have |
| Basic Summary Citation Metadata | Store source references used by AI-generated summaries. | Cia | MVP Must-Have |

## Second Wave Scope

| Feature / Module | Description | Owner |
| --- | --- | --- |
| Collections | Pinterest-board style saved resource boards. Collections store references only, not duplicate files. | Dani |
| Collection Items | Save repository, file, or summary references into collections. | Dani |
| Notifications | In-app notifications for access requests, approvals, denials, and repository sharing updates. | Alih |
| Archive Page | View archived repositories and files. | Marv |
| Restore Archived Items | Restore archived repositories or files. | Marv |
| Activity Logs | Track user actions such as upload, summary generation, visibility update, and access approval. | Alih |
| User Settings | Theme, profile, notification preferences, and simple privacy settings. | Alih |
| Repository Members Page | Manage users who have access to a repository. | Marv |
| Advanced Search Filters | Filter by file type, date, owner, tags, trust label, and visibility. | Dani |
| File Download | Download uploaded files. | Dani |
| Folder Move | Move a folder to another location. | Marv |
| Get File Summaries | View all summaries generated for a specific file. | Cia |
| Search Files Only / Summaries Only | Separate search endpoints for files and summaries. | Dani |

## Advanced / Future Scope

| Feature / Module | Description |
| --- | --- |
| Semantic AI Search | Search by meaning using embeddings. |
| AI Recommendations | Recommend resources based on user activity, summaries, tags, and collections. |
| Folder AI Summarization | Generate one summary from multiple files inside a folder. |
| Repository AI Summary | Generate a summary for an entire repository. |
| AI Chatbot Assistant | Chat with uploaded files or repository content. |
| Advanced Citation Generator | APA, MLA, IEEE, or other citation formatting. |
| Comments and Ratings | Collaboration and feedback features for repositories/resources. |
| Version History | Track and restore previous versions of files or repository content. |
| Public Share Links | Share repositories or files through protected links. |
| Faculty / Institution Verification Workflow | Formal verification process for official resources. |
| Reports / Abuse Reports | Report incorrect, harmful, or unauthorized resources. |
| Advanced Analytics | Usage charts, most viewed resources, and AI usage statistics. |
| Permanent Delete System | Hard delete archived files/repositories. |
| Embedding Index | Vector storage for semantic search or chatbot features. |
| Admin Panel | Admin tools for managing users, reports, verification, and system content. |

## Removed / Not Included

Saved Items has been removed. Collections will handle saved resources in the Second Wave.

The Notes Editor has been removed. ReNote focuses on uploaded files, repositories, AI summaries, summary citations, access control, and academic resource organization.
