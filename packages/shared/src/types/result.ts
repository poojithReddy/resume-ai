export type Evidence = {
  requirement: string;
  snippet: string;
};

export type CandidateResult = {
  candidateId: string;
  fileName: string;
  score: number; // 0-100
  matched: string[];
  missing: string[];
  evidence: Evidence[];
};

export type JobRunResult = {
  jobId: string;
  results: CandidateResult[];
  summary: {
    total: number;
    topScore: number;
    avgScore: number;
  };
};
