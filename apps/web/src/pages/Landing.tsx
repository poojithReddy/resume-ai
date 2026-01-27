import { Link } from "react-router-dom";
import { Button, Card } from "@resume-ai/ui";

export default function Landing() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center">
      <div className="w-full space-y-14">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 border rounded-full px-3 py-1 text-sm bg-white">
            <span className="font-semibold">Resume Review</span>
            <span className="text-gray-600">Structured screening for job requirements</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Screen resumes against your role requirements with clear reasons.
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl">
            Paste a job description and compare multiple resumes. You’ll get a score per candidate,
            what matches, what’s missing, and evidence snippets you can reference during review.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/demo">
              <Button variant="primary">Try the demo</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">Sign in</Button>
            </Link>
            <Link to="/signup">
              <Button variant="secondary">Create account</Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            Demo mode uses sample data. Upload + backend integration will be added next.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Consistent scoring"
            desc="Compare candidates using the same criteria across the shortlist."
          />
          <FeatureCard
            title="Matched vs missing requirements"
            desc="See which role requirements appear in a resume and which don’t."
          />
          <FeatureCard
            title="Evidence you can reference"
            desc="View snippets that explain why something was counted as a match."
          />
        </section>

        <Card
          padding="lg"
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h2 className="text-xl font-semibold">See a full example</h2>
            <p className="text-gray-600 mt-1">
              Open the demo results to view scores, gaps, and evidence.
            </p>
          </div>

          <div className="flex gap-3">
            <Link to="/demo">
              <Button variant="primary">Open demo</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary">Go to dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card padding="md">
      <div className="font-semibold">{title}</div>
      <div className="text-gray-600 mt-2 text-sm">{desc}</div>
    </Card>
  );
}
