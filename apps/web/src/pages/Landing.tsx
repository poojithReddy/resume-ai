import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface text-text-primary flex items-center justify-center px-4">

      <div className="w-full max-w-6xl text-center space-y-12">

        {/* HERO */}
        <div className="space-y-5">
          <h1 className="text-3xl tablet:text-4xl font-semibold leading-snug text-center">
            Find the right talent.
            <br />
            <span className="block mt-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Faster. Smarter.
            </span>
          </h1>

          <p className="text-sm tablet:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Compare resumes with job descriptions in seconds and confidently find the right person for the job.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link to="/signup">
            <button className="px-6 py-3 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition">
              Get started
            </button>
          </Link>

          <Link to="/demo">
            <button className="px-6 py-3 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100 transition">
              Try demo
            </button>
          </Link>
        </div>

        {/* VALUE PROPS */}
        <div className="grid grid-cols-1 tablet-sm:grid-cols-2 tablet:grid-cols-3 gap-6 pt-4">

          <Feature
            title="Instant match score"
            desc="Quickly see how well a resume matches the job requirements, no manual review needed."
          />

          <Feature
            title="Keyword insights"
            desc="Easily spot missing skills and strengths to understand candidate fit faster."
          />

          <Feature
            title="Better decisions"
            desc="Make confident hiring decisions with clear, structured insights."
          />
        </div>

        {/* FOOT NOTE */}
        <div className="text-xs text-text-muted pt-4">
          Built for recruiters, hiring managers, and growing teams.
        </div>

      </div>
    </div>
  );
}

/* FEATURE CARD */
function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="
      bg-card 
      rounded-xl 
      p-6 
      text-left 
      shadow-card 
      transition 
      hover:shadow-lg 
      hover:-translate-y-1
    ">
      <div className="font-semibold text-base mb-2">
        {title}
      </div>

      <div className="text-sm text-text-secondary leading-relaxed">
        {desc}
      </div>
    </div>
  );
}