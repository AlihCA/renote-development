export const mockSummaries = [
  {
    id: "summary-ia-controls",
    repositoryId: "repo-information-assurance-reviewer",
    fileId: "file-ia-controls-pdf",
    title: "Assurance Controls Quick Review",
    repositoryTitle: "Information Assurance Reviewer",
    fileName: "Information Assurance Controls.pdf",
    mode: "Quick Summary",
    generatedAt: "2026-06-18T10:00:00Z",
    preview:
      "Information assurance combines policy, technical controls, and monitoring to protect academic systems.",
    content: {
      overview:
        "This summary reviews core assurance controls and how they reduce confidentiality, integrity, and availability risks.",
      importantConcepts: [
        "Defense-in-depth",
        "Least privilege",
        "Audit logging",
        "Risk-based control selection",
      ],
      definitions: [
        "Control: a safeguard used to reduce risk.",
        "Assurance: confidence that a system satisfies security objectives.",
      ],
      reviewNotes: [
        "Match controls to the risk they reduce.",
        "Documentation matters for audits and accountability.",
      ],
      suggestedQuestions: [
        "How does least privilege reduce operational risk?",
        "Why are audit trails important in academic systems?",
      ],
    },
  },
  {
    id: "summary-db-normalization",
    repositoryId: "repo-database-normalization-guide",
    fileId: "file-db-normalization-pdf",
    title: "Normalization Detailed Summary",
    repositoryTitle: "Database Normalization Guide",
    fileName: "Normalization Walkthrough.pdf",
    mode: "Detailed Summary",
    generatedAt: "2026-06-15T15:10:00Z",
    preview:
      "Normalization organizes tables to reduce redundancy and improve data integrity.",
    content: {
      overview:
        "The walkthrough explains how to identify dependencies and restructure tables into normalized forms.",
      importantConcepts: [
        "Functional dependency",
        "Primary key selection",
        "Partial dependency",
        "Transitive dependency",
      ],
      definitions: [
        "1NF: values are atomic and repeating groups are removed.",
        "3NF: non-key attributes depend only on candidate keys.",
      ],
      reviewNotes: [
        "Start by listing dependencies before splitting tables.",
        "Check whether each non-key column describes the key.",
      ],
      suggestedQuestions: [
        "What problem does 2NF solve?",
        "When should a table be separated into a new entity?",
      ],
    },
  },
  {
    id: "summary-cyber-threats",
    repositoryId: "repo-cybersecurity-fundamentals",
    fileId: "file-cyber-threats-pdf",
    title: "Common Threats Important Concepts",
    repositoryTitle: "Cybersecurity Fundamentals",
    fileName: "Common Threats Reviewer.pdf",
    mode: "Important Concepts",
    generatedAt: "2026-06-21T15:45:00Z",
    preview:
      "Threat awareness helps teams prepare layered controls and safer user practices.",
    content: {
      overview:
        "This concept-focused summary groups threats by source, technique, and expected defensive response.",
      importantConcepts: ["phishing", "malware", "social engineering", "patching"],
      definitions: [
        "Phishing: deceptive messaging used to steal information.",
        "Malware: software designed to damage or misuse systems.",
      ],
      reviewNotes: [
        "Human factors are often part of security incidents.",
        "Patch management reduces exposure to known vulnerabilities.",
      ],
      suggestedQuestions: [
        "How can training reduce phishing risk?",
        "Why should patches be prioritized by severity?",
      ],
    },
  },
  {
    id: "summary-research-definitions",
    repositoryId: "repo-research-methods-notes",
    fileId: "file-research-survey-docx",
    title: "Research Methods Definitions",
    repositoryTitle: "Research Methods Notes",
    fileName: "Survey Instrument Template.docx",
    mode: "Definitions",
    generatedAt: "2026-06-10T16:45:00Z",
    preview:
      "Key research terms help students prepare valid instruments and sampling plans.",
    content: {
      overview:
        "This definitions summary clarifies research design vocabulary for survey-based capstone studies.",
      importantConcepts: ["sampling", "validity", "reliability", "instrument design"],
      definitions: [
        "Validity: the degree to which an instrument measures what it should measure.",
        "Reliability: consistency of measurement across repeated use.",
      ],
      reviewNotes: [
        "Survey questions should align with research objectives.",
        "Pilot testing can reveal unclear wording.",
      ],
      suggestedQuestions: [
        "What is the difference between validity and reliability?",
        "Why should survey items map to research questions?",
      ],
    },
  },
  {
    id: "summary-capstone-review-notes",
    repositoryId: "repo-capstone-documentation-guide",
    fileId: "file-capstone-rubric-pdf",
    title: "Capstone Rubric Review Notes",
    repositoryTitle: "Capstone Documentation Guide",
    fileName: "Capstone Rubric.pdf",
    mode: "Review Notes",
    generatedAt: "2026-06-22T10:30:00Z",
    preview:
      "The rubric highlights documentation completeness, system quality, and presentation readiness.",
    content: {
      overview:
        "These review notes summarize evaluation criteria for capstone documentation and final defense preparation.",
      importantConcepts: [
        "problem statement",
        "methodology",
        "implementation evidence",
        "defense readiness",
      ],
      definitions: [
        "Deliverable: an output required for a project milestone.",
        "Rubric: scoring guide used to evaluate work against criteria.",
      ],
      reviewNotes: [
        "Screenshots and test results should support claims.",
        "Limit scope descriptions to implemented features.",
      ],
      suggestedQuestions: [
        "Does the documentation match the actual system?",
        "What evidence supports the stated objectives?",
      ],
    },
  },
]
