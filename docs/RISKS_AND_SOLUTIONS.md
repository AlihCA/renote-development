# RISKS_AND_SOLUTIONS.md

## Risk Register

| Risk | Concern | Mitigation |
| --- | --- | --- |
| Scope creep | Too many features may delay development. | Follow MVP/Second Wave/Future separation strictly. |
| AI cost or abuse | Users may overuse summarizer. | Require login, limit file size, cache summaries, and add future quotas. |
| Copyright concerns | Users may upload copyrighted books/resources. | Add upload responsibility statement and prioritize approved/OER/institution-owned resources. |
| Misinformation | Users may publish low-quality resources. | Use uploader identity, trust labels, and future reporting/moderation. |
| Verification limitation | No real university identity integration in MVP. | Use manual Faculty/Institution assignment for prototype; propose official verification as Future. |
| Access control bugs | Unauthorized users may access restricted/private content. | Enforce backend permission checks on every protected route and test visibility cases. |
| Storage growth | Uploaded files consume storage. | Set upload limits, use archive later, and propose future quotas/cold storage. |
| AI accuracy | Summaries may be incomplete or inaccurate. | Keep original file accessible and label AI summaries as study aids. Allow refine/regenerate. |
| Search limitations | MVP search may not search full document content. | Use filename/title/tag search first; semantic/full-text search is Future. |
| Merge conflicts | Multiple members may edit shared files. | Use file ownership rules and require approval for protected files. |

## Scope and Limitation Note

Faculty and Institution verification is manually configured in the MVP to demonstrate the trust-label framework. In a real-world deployment, verification may use institutional email verification, administrative approval, or ORCID integration.
