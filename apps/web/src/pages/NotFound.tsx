import { Link } from "react-router-dom";
import { Button, Card, PageHeader } from "@resume-ai/ui";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card padding="lg">
          <div className="space-y-6 text-center">
            <PageHeader
              title="Page not found"
              subtitle="Oops! The page you're looking for doesn’t exist."
            />

            <Link to="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}