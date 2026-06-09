# API_DOCUMENTATION.md

## Base URL

```txt
http://localhost:5000/api
```

## Standard Response Format

Success:
```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

Error:
```json
{
  "success": false,
  "message": "Something went wrong"
}
```

## MVP API Routes

| Module | Method | Endpoint | Purpose | Owner |
| --- | --- | --- | --- | --- |
| Users/Auth | GET | `/api/users/me` | Get current user profile. | Alih |
| Users/Auth | POST | `/api/users/sync` | Sync Clerk user with MySQL user record. | Alih |
| Dashboard | GET | `/api/dashboard/stats` | Get dashboard statistics. | Alih |
| Dashboard | GET | `/api/dashboard/recent` | Get recent viewed repositories, files, and summaries. Uses repository view tracking. | Alih |
| Repositories | GET | `/api/repositories` | Get all repositories of current user. | Marv |
| Repositories | GET | `/api/repositories/:id` | Get one repository. Also records a repository view when appropriate. | Marv + Alih |
| Repositories | POST | `/api/repositories` | Create repository. | Marv |
| Repositories | PUT | `/api/repositories/:id` | Update repository. | Marv |
| Repositories | DELETE | `/api/repositories/:id` | Delete repository. | Marv |
| Repository Visibility & Access | PUT | `/api/repositories/:repoId/visibility` | Change repository visibility. | Marv |
| Repository Visibility & Access | POST | `/api/repositories/:repoId/access-requests` | Request access to restricted repository. | Marv |
| Repository Visibility & Access | GET | `/api/repositories/:repoId/access-requests` | Owner views access requests. | Marv |
| Repository Visibility & Access | PUT | `/api/access-requests/:requestId/approve` | Approve access request. | Marv |
| Repository Visibility & Access | PUT | `/api/access-requests/:requestId/deny` | Deny access request. | Marv |
| Folders | GET | `/api/repositories/:repoId/folders` | Get folders in repository. | Marv |
| Folders | GET | `/api/folders/:folderId` | Get one folder details. | Marv |
| Folders | POST | `/api/repositories/:repoId/folders` | Create folder in repository. | Marv |
| Folders | PUT | `/api/folders/:id` | Rename/update folder. | Marv |
| Folders | DELETE | `/api/folders/:id` | Delete folder. | Marv |
| Files | GET | `/api/repositories/:repoId/files` | Get files in repository. | Dani |
| Files | GET | `/api/folders/:folderId/files` | Get files in folder. | Dani |
| Files | GET | `/api/files/:id` | Get file details. | Dani |
| Files | GET | `/api/files/:fileId/view` | Preview/open file. | Dani |
| Files | POST | `/api/repositories/:repoId/files/upload` | Upload file to repository. | Dani |
| Files | POST | `/api/folders/:folderId/files/upload` | Upload file to folder. | Dani |
| Files | PUT | `/api/files/:id` | Rename/update file metadata. | Dani |
| Files | PUT | `/api/files/:fileId/move` | Move file to another folder/repository. | Dani |
| Files | DELETE | `/api/files/:id` | Delete file. | Dani |
| Search | GET | `/api/search?query=keyword` | Global keyword search. | Dani |
| Search | GET | `/api/repositories/:repoId/search?query=keyword` | Search inside one repository. | Dani |
| AI Summaries | POST | `/api/summaries/file/:fileId` | Generate AI summary for file. | Cia |
| AI Summaries | GET | `/api/summaries` | Get summary history. | Cia |
| AI Summaries | GET | `/api/summaries/:summaryId` | Get one generated summary. | Cia |
| AI Summaries | PUT | `/api/summaries/:summaryId/refine` | Make summary shorter, longer, or more detailed. | Cia |
| AI Summaries | PUT | `/api/summaries/:summaryId/regenerate` | Regenerate summary using same or new mode. | Cia |
| AI Summaries | DELETE | `/api/summaries/:summaryId` | Delete generated summary. | Cia |
| Citations | GET | `/api/summaries/:summaryId/citations` | Get citation metadata for generated summary. | Cia |
| Citations | POST | `/api/summaries/:summaryId/citations` | Save citation metadata. | Cia |

## Second Wave API Routes

| Module | Method | Endpoint | Purpose | Owner |
| --- | --- | --- | --- | --- |
| Users/Auth | PUT | `/api/users/me` | Update user profile details. | Alih |
| Dashboard | GET | `/api/dashboard/activity` | Get recent activity overview. | Alih |
| Repositories | GET | `/api/repositories/:repoId/members` | Get users with access to repository. | Marv |
| Repositories | POST | `/api/repositories/:repoId/members` | Add allowed user to repository. | Marv |
| Repositories | DELETE | `/api/repositories/:repoId/members/:userId` | Remove user access from repository. | Marv |
| Access | DELETE | `/api/access-requests/:requestId` | Cancel access request. | Marv |
| Folders | PUT | `/api/folders/:folderId/move` | Move folder to another location. | Marv |
| Files | GET | `/api/files/:fileId/download` | Download file. | Dani |
| Search | GET | `/api/search/files?query=keyword` | Search files only. | Dani |
| Search | GET | `/api/search/summaries?query=keyword` | Search summaries only. | Dani |
| AI Summaries | GET | `/api/files/:fileId/summaries` | Get summaries generated for one file. | Cia |
| Collections | GET | `/api/collections` | Get user collections. | Dani |
| Collections | GET | `/api/collections/:collectionId` | Get one collection and saved references. | Dani |
| Collections | POST | `/api/collections` | Create collection board. | Dani |
| Collections | PUT | `/api/collections/:collectionId` | Update collection name/description. | Dani |
| Collections | DELETE | `/api/collections/:collectionId` | Delete collection. | Dani |
| Collections | POST | `/api/collections/:collectionId/items` | Add repository/file/summary reference. | Dani |
| Collections | DELETE | `/api/collections/:collectionId/items/:itemId` | Remove item from collection. | Dani |
| Notifications | GET | `/api/notifications` | Get current user notifications. | Alih |
| Notifications | PUT | `/api/notifications/:notificationId/read` | Mark one notification as read. | Alih |
| Notifications | PUT | `/api/notifications/read-all` | Mark all notifications as read. | Alih |
| Notifications | DELETE | `/api/notifications/:notificationId` | Delete notification. | Alih |
| Archive | GET | `/api/archive/repositories` | Get archived repositories. | Marv |
| Archive | GET | `/api/archive/files` | Get archived files. | Marv |
| Archive | PUT | `/api/repositories/:repoId/archive` | Archive repository. | Marv |
| Archive | PUT | `/api/repositories/:repoId/restore` | Restore repository. | Marv |
| Archive | PUT | `/api/files/:fileId/archive` | Archive file. | Marv + Dani |
| Archive | PUT | `/api/files/:fileId/restore` | Restore file. | Marv + Dani |
| Activity Log | GET | `/api/activity` | Get current user's activity log. | Alih |
| Activity Log | GET | `/api/repositories/:repoId/activity` | Get activity inside one repository. | Alih |
| Settings | GET | `/api/settings` | Get user settings. | Alih |
| Settings | PUT | `/api/settings` | Update user settings. | Alih |
| Settings | PUT | `/api/settings/theme` | Update theme preference. | Alih |

## Advanced / Future API Routes

| Module | Method | Endpoint | Purpose | Owner |
| --- | --- | --- | --- | --- |
| Users/Auth | DELETE | `/api/users/me` | Delete/deactivate user account. | Alih |
| Search | GET | `/api/search/semantic?query=keyword` | Semantic AI search using embeddings. | Dani |
| AI Summaries | POST | `/api/summaries/folder/:folderId` | Generate summary for a folder. | Cia |
| Archive | DELETE | `/api/archive/repositories/:repoId/permanent` | Permanently delete repository. | Marv |
| Archive | DELETE | `/api/archive/files/:fileId/permanent` | Permanently delete file. | Marv |
| Settings | PUT | `/api/settings/privacy` | Update privacy preferences. | Alih |
| Settings | PUT | `/api/settings/notifications` | Update notification preferences. | Alih |
