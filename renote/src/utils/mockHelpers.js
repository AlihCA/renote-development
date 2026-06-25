import { mockCollections } from "@/data/mockCollections"
import { mockFiles } from "@/data/mockFiles"
import { mockFolders } from "@/data/mockFolders"
import { mockNotifications } from "@/data/mockNotifications"
import { mockRepositories } from "@/data/mockRepositories"
import { mockSummaries } from "@/data/mockSummaries"

export function getRepositoryById(repositoryId) {
  return mockRepositories.find((repository) => repository.id === repositoryId)
}

export function getFilesByRepositoryId(repositoryId) {
  return mockFiles.filter((file) => file.repositoryId === repositoryId)
}

export function getFoldersByRepositoryId(repositoryId) {
  return mockFolders.filter((folder) => folder.repositoryId === repositoryId)
}

export function getCollectionById(collectionId) {
  return mockCollections.find((collection) => collection.id === collectionId)
}

export function getSummaryById(summaryId) {
  return mockSummaries.find((summary) => summary.id === summaryId)
}

export function getNotificationsByReadState(isRead) {
  return mockNotifications.filter((notification) => notification.isRead === isRead)
}
