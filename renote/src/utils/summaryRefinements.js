export const summaryRefinementOptions = [
  { label: "Original", value: "original" },
  { label: "Shorter", value: "shorter" },
  { label: "Expanded", value: "expanded" },
  { label: "Study Guide", value: "study-guide" },
  { label: "Key Points", value: "key-points" },
]

function addMinutes(value, minutes) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString()
  }

  date.setMinutes(date.getMinutes() + minutes)

  return date.toISOString()
}

function toList(items = []) {
  return items.filter(Boolean)
}

function createOriginalText(summary) {
  const content = summary.content ?? {}
  const sections = [
    summary.preview,
    content.overview,
    ...(content.importantConcepts ?? []).map((item) => `Concept: ${item}`),
    ...(content.definitions ?? []).map((item) => `Definition: ${item}`),
    ...(content.reviewNotes ?? []).map((item) => `Review note: ${item}`),
    ...(content.suggestedQuestions ?? []).map((item) => `Question: ${item}`),
  ]

  return sections.filter(Boolean).join("\n")
}

function createStudyGuideText(summary) {
  const content = summary.content ?? {}
  const concepts = toList(content.importantConcepts)
  const notes = toList(content.reviewNotes)
  const questions = toList(content.suggestedQuestions)

  return [
    `Study guide for ${summary.title}`,
    content.overview,
    concepts.length > 0 ? `Focus terms: ${concepts.join(", ")}` : null,
    notes.length > 0 ? `Review checklist: ${notes.join(" ")}` : null,
    questions.length > 0 ? `Practice questions: ${questions.join(" ")}` : null,
  ]
    .filter(Boolean)
    .join("\n")
}

export function getSummaryRefinementVersions(summary) {
  if (!summary) {
    return []
  }

  const content = summary.content ?? {}
  const concepts = toList(content.importantConcepts)
  const notes = toList(content.reviewNotes)
  const definitions = toList(content.definitions)
  const originalText = createOriginalText(summary)
  const keyPoints = [...concepts, ...notes].slice(0, 6)

  return [
    {
      versionId: "original",
      label: "Original",
      mode: summary.mode,
      generatedAt: summary.generatedAt,
      preview: summary.preview,
      content: originalText,
      changesNote: "Original saved AI summary.",
    },
    {
      versionId: "shorter",
      label: "Shorter",
      mode: "Shorter",
      generatedAt: addMinutes(summary.generatedAt, 8),
      preview:
        summary.preview ??
        "Shortened summary prepared for quick review and recall.",
      content: [summary.preview, concepts.slice(0, 2).join(", ")]
        .filter(Boolean)
        .join("\n"),
      changesNote: "Shortened for quick review.",
    },
    {
      versionId: "expanded",
      label: "Expanded",
      mode: "Expanded",
      generatedAt: addMinutes(summary.generatedAt, 15),
      preview:
        content.overview ??
        "Expanded version adds more academic context from the original summary.",
      content: [
        content.overview,
        definitions.length > 0 ? `Definitions: ${definitions.join(" ")}` : null,
        notes.length > 0 ? `Review notes: ${notes.join(" ")}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      changesNote: "Expanded with more context.",
    },
    {
      versionId: "study-guide",
      label: "Study Guide",
      mode: "Study Guide",
      generatedAt: addMinutes(summary.generatedAt, 22),
      preview: "Converted into a study guide format for exam preparation.",
      content: createStudyGuideText(summary),
      changesNote: "Converted into study guide format.",
    },
    {
      versionId: "key-points",
      label: "Key Points",
      mode: "Key Points",
      generatedAt: addMinutes(summary.generatedAt, 30),
      preview: keyPoints.slice(0, 3).join("; ") || summary.preview,
      content:
        keyPoints.length > 0
          ? keyPoints.map((item) => `- ${item}`).join("\n")
          : summary.preview,
      changesNote: "Reframed as key points for faster scanning.",
    },
  ]
}

export function getSummaryRefinementCount(summary) {
  return getSummaryRefinementVersions(summary).length
}

export function getSummaryRefinementVersion(summary, versionId) {
  const versions = getSummaryRefinementVersions(summary)

  return (
    versions.find((version) => version.versionId === versionId) ??
    versions[0] ??
    null
  )
}
