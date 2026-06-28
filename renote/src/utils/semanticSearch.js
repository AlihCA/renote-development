const semanticStopWords = new Set([
  "a",
  "about",
  "and",
  "are",
  "by",
  "for",
  "from",
  "in",
  "into",
  "materials",
  "of",
  "on",
  "or",
  "resources",
  "the",
  "to",
  "with",
])

const semanticConcepts = {
  academic: ["research", "thesis", "study", "learning", "documentation"],
  capstone: ["project", "defense", "rubric", "documentation", "prototype"],
  cybersecurity: [
    "security",
    "assurance",
    "risk",
    "controls",
    "audit",
    "incident",
    "protection",
  ],
  database: ["schema", "normalization", "relational", "entity", "dependencies"],
  documentation: ["writing", "template", "chapter", "citation", "formatting"],
  reviewer: ["review", "reviewer", "guide", "rubric", "criteria", "checklist"],
  thesis: ["research", "writing", "chapter", "methodology", "defense"],
}

function normalizeSearchValue(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function tokenizeSearchValue(value) {
  return normalizeSearchValue(value)
    .split(" ")
    .filter((token) => token.length > 2 && !semanticStopWords.has(token))
}

function expandSemanticToken(token) {
  const relatedTerms = new Set([token])

  Object.entries(semanticConcepts).forEach(([concept, terms]) => {
    if (concept.includes(token) || token.includes(concept) || terms.includes(token)) {
      relatedTerms.add(concept)
      terms.forEach((term) => relatedTerms.add(term))
    }
  })

  return [...relatedTerms]
}

export function getRepositorySearchText(repository) {
  return normalizeSearchValue(
    [
      repository.title,
      repository.description,
      repository.ownerName,
      repository.ownerRole,
      repository.subject,
      repository.trustLabel,
      repository.visibility,
      ...(repository.tags ?? []),
      ...(repository.learningObjectives ?? []),
      ...(repository.includedTopics ?? []),
    ].join(" ")
  )
}

export function matchesRepositorySearch(repository, query, mode = "keyword") {
  const normalizedQuery = normalizeSearchValue(query)

  if (!normalizedQuery) {
    return true
  }

  const searchText = getRepositorySearchText(repository)

  if (mode === "keyword") {
    return searchText.includes(normalizedQuery)
  }

  const semanticTerms = [
    ...new Set(tokenizeSearchValue(query).flatMap(expandSemanticToken)),
  ]

  if (semanticTerms.length === 0) {
    return searchText.includes(normalizedQuery)
  }

  return semanticTerms.some((term) => searchText.includes(term))
}
