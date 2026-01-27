import type { JobRunResult } from "../types/result";

export const demoJobRunResult: JobRunResult = {
  jobId: "demo-job-1",
  results: [
    {
      candidateId: "cand-1",
      fileName: "Asha_Patel.pdf",
      score: 86,
      matched: ["React", "TypeScript", "REST APIs"],
      missing: ["FastAPI", "Docker"],
      evidence: [
        { requirement: "React", snippet: "Built React dashboards using hooks and context." },
        { requirement: "TypeScript", snippet: "Migrated codebase to TypeScript and improved type safety." },
      ],
    },
    {
      candidateId: "cand-2",
      fileName: "Rahul_Singh.pdf",
      score: 71,
      matched: ["Python", "SQL"],
      missing: ["React", "Tailwind"],
      evidence: [
        { requirement: "Python", snippet: "Developed data pipelines and automation scripts in Python." },
        { requirement: "SQL", snippet: "Wrote complex joins and optimized queries." },
      ],
    },
  ],
  summary: {
    total: 2,
    topScore: 86,
    avgScore: 78.5,
  },
};
