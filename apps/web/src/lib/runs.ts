export type RunSummary = {
  jobId: string;
  jobTitle: string;
  createdAt: string;
  totalResumes: number;
  topScore: number;
};

export const demoRuns: RunSummary[] = [
  {
    jobId: "demo-job-1",
    jobTitle: "AI/ML Developer (Demo)",
    createdAt: new Date().toISOString(),
    totalResumes: 2,
    topScore: 86,
  },
  {
    jobId: "demo-job-2",
    jobTitle: "Full Stack Engineer (Demo)",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    totalResumes: 3,
    topScore: 79,
  },
];