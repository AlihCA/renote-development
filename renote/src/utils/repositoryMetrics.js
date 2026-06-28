import { mockFeedback } from "@/data/mockFeedback"

function isVisibleFeedback(item) {
  return item.status !== "hidden"
}

export function getRepositoryFeedback(repositoryId) {
  return mockFeedback.filter(
    (item) => item.repositoryId === repositoryId && isVisibleFeedback(item)
  )
}

export function getRepositoryAverageRating(repository) {
  const feedback = getRepositoryFeedback(repository.id)

  if (feedback.length > 0) {
    const total = feedback.reduce((sum, item) => sum + item.rating, 0)

    return total / feedback.length
  }

  return repository.averageRating ?? 0
}

export function getRepositoryReviewCount(repository) {
  const feedback = getRepositoryFeedback(repository.id)

  return repository.reviewCount ?? feedback.length
}

export function getRepositorySaveCount(repository) {
  if (Number.isFinite(repository.saveCount)) {
    return repository.saveCount
  }

  const viewSignal = Math.round((repository.views ?? 0) / 28)
  const citationSignal = Math.round((repository.citationCount ?? 0) * 1.4)
  const savedBoost = repository.isSaved ? 12 : 4

  return Math.max(repository.isSaved ? 1 : 0, viewSignal + citationSignal + savedBoost)
}

export function getRepositoryCardMetrics(repository) {
  return {
    averageRating: getRepositoryAverageRating(repository),
    category: repository.category ?? repository.subject ?? "General Study",
    citationCount: repository.citationCount ?? 0,
    reviewCount: getRepositoryReviewCount(repository),
    saveCount: getRepositorySaveCount(repository),
    views: repository.views ?? 0,
  }
}
