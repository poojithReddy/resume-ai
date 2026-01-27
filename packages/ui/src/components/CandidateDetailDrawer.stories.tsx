import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import CandidateDetailDrawer from "./CandidateDetailDrawer";
import type { CandidateResult } from "@resume-ai/shared";

const meta: Meta<typeof CandidateDetailDrawer> = {
  title: "Components/CandidateDetailDrawer",
  component: CandidateDetailDrawer,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;

type Story = StoryObj<typeof CandidateDetailDrawer>;

function Wrapper({
  initialOpen,
  candidate,
}: {
  initialOpen: boolean;
  candidate: CandidateResult | null;
}) {
  const [open, setOpen] = React.useState(initialOpen);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl space-y-4">
        <h1 className="text-xl font-semibold">Candidate drawer demo</h1>
        <p className="text-sm text-gray-600">
          Click the button to open/close the drawer (Storybook interaction).
        </p>

        <button
          className="rounded border px-4 py-2 bg-white hover:bg-gray-50"
          onClick={() => setOpen(true)}
        >
          Open Drawer
        </button>
      </div>

      <CandidateDetailDrawer
        open={open}
        onClose={() => setOpen(false)}
        candidate={candidate}
      />
    </div>
  );
}

const sampleCandidate: CandidateResult = {
  candidateId: "cand-1",
  fileName: "candidate_1.pdf",
  score: 86,
  matched: ["Python", "FastAPI", "SQL", "Model evaluation"],
  missing: ["Kubernetes", "MLOps pipelines"],
  evidence: [
    {
      requirement: "Python",
      snippet: "Built data pipelines and ML models in Python for 3+ years.",
    },
    {
      requirement: "FastAPI",
      snippet: "Developed REST APIs using FastAPI and deployed to Azure.",
    },
    {
      requirement: "SQL",
      snippet: "Designed normalized schemas and optimized queries in SQL Server.",
    },
  ],
};

const emptyCandidate: CandidateResult = {
  candidateId: "cand-2",
  fileName: "candidate_2.pdf",
  score: 42,
  matched: [],
  missing: [],
  evidence: [],
};

const longCandidate: CandidateResult = {
  candidateId: "cand-3",
  fileName: "candidate_long.pdf",
  score: 78,
  matched: Array.from({ length: 12 }, (_, i) => `Matched requirement ${i + 1}`),
  missing: Array.from({ length: 10 }, (_, i) => `Missing requirement ${i + 1}`),
  evidence: Array.from({ length: 12 }, (_, i) => ({
    requirement: `Requirement ${i + 1}`,
    snippet:
      "This is a longer evidence snippet to test wrapping and scrolling. " +
      "It should remain readable and not break the layout.",
  })),
};

export const Closed: Story = {
  render: () => <Wrapper initialOpen={false} candidate={sampleCandidate} />,
};

export const OpenWithData: Story = {
  render: () => <Wrapper initialOpen={true} candidate={sampleCandidate} />,
};

export const OpenEmptySections: Story = {
  render: () => <Wrapper initialOpen={true} candidate={emptyCandidate} />,
};

export const OpenLongContentScrollable: Story = {
  render: () => <Wrapper initialOpen={true} candidate={longCandidate} />,
};
