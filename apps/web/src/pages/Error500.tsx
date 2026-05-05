import { Link } from "react-router-dom";
import { Button, Card, PageHeader } from "@resume-ai/ui";

export default function Error500() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card padding="lg">
          <div className="space-y-6 text-center">
            <PageHeader
              title="Something went wrong"
              subtitle="Our team is working on this issue. Please try again later."
            />

            <div className="flex justify-center gap-3">
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>

              <Link to="/">
                <Button variant="secondary">Go to Home</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}