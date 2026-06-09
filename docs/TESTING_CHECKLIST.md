# TESTING_CHECKLIST.md

## MVP Testing Checklist

| Feature | Test Case | Priority |
| --- | --- | --- |
| Authentication | Guest cannot open protected dashboard pages; logged-in user can. | High |
| User Sync | New Clerk user creates a MySQL user record. | High |
| Protected Routes | Logged-out users are redirected to sign-in. | High |
| Dashboard | Dashboard loads basic stats, recent repositories/files/summaries. | High |
| Repository Views | Opening a repository records a view and updates recent activity/view count correctly. | High |
| Badge/Trust Label | User trust labels display on cards, search results, and headers when available. | Medium |
| Create Repository | User can create repository with title, description, visibility, and tags. | High |
| Update Repository | Owner can edit repository details. | High |
| Delete Repository | Owner can delete repository; unauthorized users cannot. | High |
| Visibility Public | Public repository can be found/opened according to public access rules. | High |
| Visibility Restricted | Restricted repository shows metadata and request access button to unauthorized users. | High |
| Visibility Private | Private repository is hidden from unauthorized users and direct link denies access. | High |
| Access Request | User can request access to a restricted repository. | High |
| Duplicate Access Request | Duplicate pending request is blocked. | High |
| Approve Access Request | Owner can approve request and repository_access record is created. | High |
| Deny Access Request | Owner can deny request and no access is granted. | High |
| Folder CRUD | User can create, rename/update, and delete folders. | High |
| Nested Folders | Folders can be created up to depth 6; depth 7 is blocked. | High |
| File Upload | Supported files upload successfully. | High |
| File Upload Validation | Unsupported or oversized files are blocked. | High |
| File Viewer | User with access can preview/open uploaded file. | High |
| File Metadata | File name, type, size, URL/S3 key, and location are stored correctly. | High |
| File Move | User can move a file to another folder/repository if permitted. | Medium |
| File Delete | Owner/editor can delete file; unauthorized users cannot. | High |
| Search | Search returns allowed results only and respects repository visibility. | High |
| AI Summary | Logged-in user with file access can generate selected summary mode. | High |
| AI Guest Block | Guest cannot use summarizer. | High |
| Summary History | Generated summaries appear in Summary History. | High |
| Summary Details | User can open a generated summary and see full content and original file info. | High |
| Summary Refinement | Refine summary action produces updated or new output. | Medium |
| Summary Regenerate | Regenerate action creates a new summary output using same or selected mode. | Medium |
| Summary Delete | User can delete own summary. | High |
| Summary Citations | Summary citation metadata is saved and displayed when available. | Medium |

## Second Wave Testing Checklist

| Feature | Test Case | Priority |
| --- | --- | --- |
| Collections | User can create collection boards and add references. | Medium |
| Notifications | Access request/approval/denial notifications are created and can be marked read. | Medium |
| Archive | Archived repository/file is hidden from active lists and appears in archive page. | Medium |
| Restore | Archived repository/file can be restored. | Medium |
| Activity Logs | Upload, summary generation, and access approval are logged. | Medium |
| Settings | User can update theme or notification preferences. | Low |
| Advanced Filters | Search can filter by file type, date, owner, tags, or visibility. | Medium |
