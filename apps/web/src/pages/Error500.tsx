import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function Error500() {
  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>Server Error | HireLens AI</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 bg-surface text-text-primary">

        <div className="w-full max-w-md text-center space-y-6">

          {/* CODE */}
          <div className="text-5xl font-semibold text-primary">
            500
          </div>

          {/* MESSAGE */}
          <div className="space-y-2">
            <h1 className="text-xl font-semibold">
              Something went wrong
            </h1>

            <p className="text-sm text-text-secondary">
              We hit a small issue on our side. Please try again in a moment.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link to="/dashboard">
              <button className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition">
                Go to dashboard
              </button>
            </Link>

            <Link to="/">
              <button className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100 transition">
                Go to home
              </button>
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}