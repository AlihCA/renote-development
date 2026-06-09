# DATABASE_SCHEMA.md

## Database Name

`renote_db`

## MVP Tables

### users

Purpose: Stores app user profiles synced from Clerk.

Columns:
```txt
id
clerk_id
full_name
email
profile_image
role ENUM('user', 'faculty', 'institution')
verification_status ENUM('unverified', 'pending', 'verified', 'rejected')
trust_label ENUM('community_resource', 'faculty_published', 'official_resource')
institution_name
created_at
updated_at
```

Relationships:
- One user can own many repositories.
- One user can upload many files.
- One user can generate many summaries.
- One user can send access requests.
- One user can receive notifications.

### repositories

Purpose: Stores the main workspace/project containers.

Columns:
```txt
id
user_id
title
description
slug
visibility ENUM('public', 'restricted', 'private')
repository_type
trust_label ENUM('community_resource', 'faculty_published', 'official_resource')
view_count
is_archived
archived_at
archived_by
created_at
updated_at
```

Relationships:
- Belongs to one user.
- One repository can have many folders.
- One repository can have many files.
- One repository can have many summaries.
- One repository can have many tags.
- One repository can have many access requests.
- One repository can have many approved users through `repository_access`.
- One repository can have many views through `repository_views`.

### repository_tags

Purpose: Stores tags attached to repositories for organization and search.

Columns:
```txt
id
repository_id
tag_name
created_at
```

Relationships:
- Belongs to one repository.
- One repository can have many tags.

### folders

Purpose: Organizes files inside a repository.

Columns:
```txt
id
repository_id
parent_folder_id
name
depth
folder_order
created_at
updated_at
deleted_at
```

Relationships:
- Belongs to one repository.
- Can belong to another parent folder.
- One folder can have many child folders.
- One folder can contain many files.

Notes:
- `parent_folder_id` is nullable.
- If `parent_folder_id` is null, the folder is a root-level folder.
- `depth` should support a maximum of 6.

### files

Purpose: Stores uploaded file metadata and S3/storage references.

Columns:
```txt
id
repository_id
folder_id
user_id
original_name
stored_name
s3_key
file_url
mime_type
file_type
file_size
extracted_text
upload_status ENUM('uploaded', 'processing', 'failed')
is_archived
archived_at
created_at
updated_at
```

Relationships:
- Belongs to one user.
- Belongs to one repository.
- May belong to one folder.
- One file can have many summaries.
- One file can have many citations through `summary_citations`.

### summaries

Purpose: Stores AI-generated summaries.

Columns:
```txt
id
user_id
repository_id
folder_id
file_id
title
summary_type ENUM('file', 'folder')
summary_mode ENUM('quick', 'detailed', 'key_points', 'study_mode')
summary_content
model_used
status ENUM('generating', 'completed', 'failed')
created_at
updated_at
deleted_at
```

Relationships:
- Belongs to one user.
- Belongs to one repository.
- May belong to one folder.
- Usually belongs to one file.
- One summary can have many citations.
- One summary can be saved into many collections later.

Notes:
- File summaries are MVP.
- Folder summaries are Future or Second Wave.
- `created_at` is needed for Summary History sorting.

### summary_citations

Purpose: Stores citation/source reference data for AI-generated summaries.

Columns:
```txt
id
summary_id
file_id
page_number
section_title
quoted_text
citation_text
created_at
```

Relationships:
- Belongs to one summary.
- Belongs to one file.
- One summary can have many citations.

### access_requests

Purpose: Stores requests from users who want access to restricted repositories.

Columns:
```txt
id
repository_id
requester_id
owner_id
message
status ENUM('pending', 'approved', 'rejected', 'cancelled')
responded_by
created_at
responded_at
```

Relationships:
- Belongs to one repository.
- `requester_id` references the user requesting access.
- `owner_id` references the repository owner.
- `responded_by` references the user who approved or denied the request.

### repository_access

Purpose: Stores approved users who can access restricted/private repositories.

Columns:
```txt
id
repository_id
user_id
access_role ENUM('viewer', 'editor')
granted_by
created_at
updated_at
```

Relationships:
- Belongs to one repository.
- Belongs to one user.
- `granted_by` references the user who approved or added access.

### repository_views

Purpose: Stores repository view tracking for dashboard statistics and recent activity.

Columns:
```txt
id
repository_id
user_id
viewed_at
```

Relationships:
- Belongs to one repository.
- May belong to one user.

Notes:
- This is MVP.
- `user_id` can be nullable if public or guest views are allowed in the future.
- For MVP, views can be recorded when a repository is opened through `GET /api/repositories/:id`.

## Second Wave Tables

### collections

Purpose: User-created boards for saved resources.

Columns:
```txt
id
user_id
title
description
cover_image
created_at
updated_at
deleted_at
```

Relationships:
- Belongs to one user.
- One collection can have many collection items.

### collection_items

Purpose: Stores saved resource references inside collections.

Columns:
```txt
id
collection_id
item_type ENUM('repository', 'file', 'summary')
item_id
created_at
deleted_at
```

Relationships:
- Belongs to one collection.
- References a repository, file, or summary depending on `item_type`.

### notifications

Purpose: Stores database-backed notifications for users.

Columns:
```txt
id
user_id
type ENUM('access_request', 'access_approved', 'access_rejected', 'repository_shared', 'access_removed', 'system')
title
message
related_repository_id
related_user_id
is_read
created_at
read_at
```

Relationships:
- Belongs to one user.
- May reference one repository.
- May reference another related user.

### activity_logs

Purpose: Stores user actions for accountability and history.

Columns:
```txt
id
user_id
repository_id
action_type
target_type ENUM('repository', 'folder', 'file', 'summary', 'access_request', 'collection')
target_id
description
created_at
```

Relationships:
- Belongs to one user.
- May belong to one repository.
- Can reference different target types depending on the action.

### user_settings

Purpose: Stores user preferences.

Columns:
```txt
id
user_id
theme_preference ENUM('light', 'dark', 'system')
email_notifications_enabled
in_app_notifications_enabled
profile_visibility ENUM('public', 'private')
created_at
updated_at
```

Relationships:
- Belongs to one user.
- One user has one settings record.

## Important Enum Values

### repositories.visibility
```txt
public
restricted
private
```

### users.role
```txt
user
faculty
institution
```

### summaries.summary_mode
```txt
quick
detailed
key_points
study_mode
```

### access_requests.status
```txt
pending
approved
rejected
cancelled
```

### repository_access.access_role
```txt
viewer
editor
```
