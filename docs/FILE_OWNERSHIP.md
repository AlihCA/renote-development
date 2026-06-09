# FILE_OWNERSHIP.md

## Alih — Foundation, Auth, Dashboard, Shared Setup

### Allowed Frontend Files/Folders
```txt
client/src/pages/auth/
client/src/pages/dashboard/
client/src/components/layout/
client/src/components/dashboard/
client/src/components/common/
client/src/services/api.js
client/src/services/authService.js
client/src/services/dashboardService.js
client/src/hooks/useCurrentUser.js
client/src/styles/variables.css
client/src/styles/global.css
client/src/styles/utilities.css
client/src/styles/layout.css
client/src/App.jsx
client/src/main.jsx
client/src/routes.jsx
```

### Allowed Backend Files/Folders
```txt
server/src/config/db.js
server/src/config/clerk.js
server/src/middleware/authMiddleware.js
server/src/middleware/errorMiddleware.js
server/src/routes/userRoutes.js
server/src/routes/dashboardRoutes.js
server/src/controllers/userController.js
server/src/controllers/dashboardController.js
server/src/models/userModel.js
server/src/utils/
server/src/app.js
server/src/server.js
server/src/database/schema.sql
```

## Marv — Repositories, Folders, Visibility, Access Requests, Archive Later

### Allowed Frontend Files/Folders
```txt
client/src/pages/repositories/
client/src/pages/folders/
client/src/pages/archive/
client/src/components/repositories/
client/src/components/folders/
client/src/components/access/
client/src/components/archive/
client/src/services/repositoryService.js
client/src/services/folderService.js
client/src/services/accessService.js
client/src/services/archiveService.js
client/src/hooks/useRepositories.js
client/src/styles/components/repositories.css
client/src/styles/pages/repositories.css
client/src/styles/pages/workspace.css
```

### Allowed Backend Files/Folders
```txt
server/src/routes/repositoryRoutes.js
server/src/routes/folderRoutes.js
server/src/routes/accessRequestRoutes.js
server/src/routes/archiveRoutes.js
server/src/controllers/repositoryController.js
server/src/controllers/folderController.js
server/src/controllers/accessRequestController.js
server/src/controllers/archiveController.js
server/src/models/repositoryModel.js
server/src/models/folderModel.js
server/src/models/accessRequestModel.js
server/src/models/repositoryAccessModel.js
server/src/models/archiveModel.js
server/src/middleware/accessMiddleware.js
```

## Dani — Files, Upload, Viewer, Search, Collections Later

### Allowed Frontend Files/Folders
```txt
client/src/pages/files/
client/src/pages/search/
client/src/pages/collections/
client/src/components/files/
client/src/components/search/
client/src/components/collections/
client/src/services/fileService.js
client/src/services/searchService.js
client/src/services/collectionService.js
client/src/hooks/useFiles.js
client/src/data/dummyFiles.js
client/src/styles/components/files.css
client/src/styles/pages/file-viewer.css
```

### Allowed Backend Files/Folders
```txt
server/src/config/s3.js
server/src/middleware/uploadMiddleware.js
server/src/routes/fileRoutes.js
server/src/routes/searchRoutes.js
server/src/routes/collectionRoutes.js
server/src/controllers/fileController.js
server/src/controllers/searchController.js
server/src/controllers/collectionController.js
server/src/models/fileModel.js
server/src/models/collectionModel.js
server/src/services/s3Service.js
server/src/services/fileParserService.js
```

## Cia — AI Summary, Summary History, Summary Citations

### Allowed Frontend Files/Folders
```txt
client/src/pages/summaries/
client/src/components/summaries/
client/src/services/summaryService.js
client/src/hooks/useSummaries.js
client/src/data/dummySummaries.js
client/src/styles/components/summaries.css
client/src/styles/pages/summaries.css
```

### Allowed Backend Files/Folders
```txt
server/src/config/openai.js
server/src/routes/summaryRoutes.js
server/src/controllers/summaryController.js
server/src/models/summaryModel.js
server/src/services/openaiService.js
server/src/services/summaryService.js
server/src/services/citationService.js
```

## Shared / Protected Files

Only Alih should edit these directly, or another member may edit after approval:

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
README.md
docs/
.env
.gitignore
package.json
```
