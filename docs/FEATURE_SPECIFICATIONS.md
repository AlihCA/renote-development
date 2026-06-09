# FEATURE_SPECIFICATIONS.md

## Authentication and User Sync

Users sign in through Clerk. After sign-in, the backend syncs the Clerk account with the `users` table. Protected pages require login. Public repositories may be visible to guests, but actions such as uploading files, requesting access, generating summaries, and creating repositories require login.

## Dashboard

The dashboard is the first page after login. It should show a simple overview of the user's activity and resources.

Key features:
- Total repositories
- Total files
- Total generated summaries
- Recent repositories
- Recent files
- Recent summaries
- Repository view-based recent activity

Repository view tracking is part of MVP. Views can be recorded when a user opens a repository through `GET /api/repositories/:id`.

## Repository Management

Repositories are the main containers for academic resources. Users can create, update, view, and delete repositories.

Key fields:
- Title
- Description
- Slug
- Visibility: public, restricted, private
- Repository type
- Trust label
- Tags

Visibility rules:
- Public: visible and accessible based on allowed view rules.
- Restricted: visible as metadata, but full access requires owner approval.
- Private: hidden from unauthorized users.

## Access Request System

Restricted repositories allow users to request access. The owner can approve or deny requests. Approved access is stored in `repository_access`.

Key rules:
- Duplicate pending requests should be blocked.
- Only the repository owner can approve or deny requests.
- Approved requests create a repository access record.
- Denied requests remain as history but do not grant access.

## Repository Workspace and Folders

The workspace shows folders and files inside a repository. Folders can be nested up to depth 6.

Key features:
- Folder create
- Folder rename/update
- Folder delete
- Breadcrumb navigation
- Folder tree or folder cards
- Root-level and nested folder support

## Files

Files are uploaded to cloud storage. The database stores metadata and S3/storage references.

Supported MVP file examples:
- PDF
- DOCX
- PPTX
- TXT
- Images, if preview support is manageable

Key features:
- Upload file to repository
- Upload file to folder
- Preview/open file
- Rename/update file metadata
- Move file
- Delete file
- Store extracted text when available

## Search

MVP search should be keyword-based. It should search repository titles, descriptions, tags, and file names first. Search must respect visibility and access rules.

Semantic AI search is Future.

## AI File Summarizer

The AI summarizer generates summaries from uploaded files. The generated summaries are saved in the `summaries` table.

MVP summary modes:
- Quick
- Detailed
- Key Points
- Study Mode

Summary actions:
- Generate summary
- View summary history
- View summary details
- Copy summary
- Delete summary
- Refine summary
- Regenerate summary

## Summary Citations

MVP citations are basic source references attached to generated summaries. They are not the same as a full APA/MLA/IEEE citation generator.

Key data:
- Summary ID
- File ID
- Page number, if available
- Section title, if available
- Quoted/source text, if available
- Citation text shown in the UI

Advanced citation formatting is Future.

## Collections

Collections are Second Wave. They work like Pinterest-style boards where users save references to repositories, files, or summaries.

Collections do not duplicate files. They only store references.

## Archive

Archive is Second Wave. It allows users to hide inactive repositories or files without permanently deleting them.

Permanent delete is Future.
