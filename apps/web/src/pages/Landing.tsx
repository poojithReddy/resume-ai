import { Link } from "react-router-dom";
import { Button, Card, PageHeader } from "@resume-ai/ui";

export default function Landing() {
  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-3xl space-y-6 text-center">
        <PageHeader
          title="Resume AI"
          subtitle="Analyze your resume with AI and improve your chances of landing interviews"
        />

        <Card padding="lg">
          <div className="space-y-4">
            <p className="text-gray-600">
              Get a match score, keyword insights, and actionable feedback
              to stand out in job applications.
            </p>

            <div className="flex justify-center gap-3">
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>

              <Link to="/demo">
                <Button variant="secondary">Try Demo</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}