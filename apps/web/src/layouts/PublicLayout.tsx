import { Outlet, Link } from "react-router-dom";
import { Button } from "@resume-ai/ui";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-text-primary">

      {/* Header */}
      <header
        className="border-b bg-card px-4 md:px-6 py-3 md:py-4 flex items-center justify-between"
        role="banner"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center"
          aria-label="Go to homepage"
        >
          <img
            src="/HireLensAILogo.png"
            alt="HireLens AI logo"
            className="h-9 md:h-11 lg:h-12 object-contain"
          />
        </Link>

        {/* Navigation */}
        <nav
          className="flex items-center gap-2 md:gap-3"
          aria-label="Main navigation"
        >
          <Link to="/demo" aria-label="View demo">
            <Button variant="ghost">Demo</Button>
          </Link>

          <Link to="/login" aria-label="Go to login page">
            <Button variant="ghost">Login</Button>
          </Link>

          <Link to="/signup" aria-label="Go to signup page">
            <Button>
              Sign up
            </Button>
          </Link>
        </nav>
      </header>

      {/* Main */}
      <main
        id="main-content"
        className="flex-1"
        role="main"
      >
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className="border-t bg-card px-4 md:px-6 py-4 text-sm text-text-secondary"
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">

          {/* Left - Social */}
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Facebook" className="hover:opacity-80">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 10-11.6 9.9v-7h-2.2v-2.9h2.2V9.8c0-2.2 1.3-3.4 3.3-3.4.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.3v1.6h2.2l-.3 2.9h-1.9v7A10 10 0 0022 12z" />
              </svg>
            </a>

            <a href="#" aria-label="Instagram" className="hover:opacity-80">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 2 .3 2.5.5.6.2 1 .5 1.5 1 .5.5.8.9 1 1.5.2.5.4 1.3.5 2.5.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 2-.5 2.5-.2.6-.5 1-1 1.5-.5.5-.9.8-1.5 1-.5.2-1.3.4-2.5.5-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-2-.3-2.5-.5-.6-.2-1-.5-1.5-1-.5-.5-.8-.9-1-1.5-.2-.5-.4-1.3-.5-2.5C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.3-2 .5-2.5.2-.6.5-1 1-1.5.5-.5.9-.8 1.5-1 .5-.2 1.3-.4 2.5-.5C8.4 2.2 8.8 2.2 12 2.2zM12 7a5 5 0 100 10 5 5 0 000-10z" />
              </svg>
            </a>

            <a href="#" aria-label="Twitter" className="hover:opacity-80">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 5.8c-.7.3-1.5.5-2.2.6.8-.5 1.3-1.2 1.6-2-.7.4-1.6.7-2.4.9A3.8 3.8 0 0012 8.1c0 .3 0 .6.1.9-3.1-.2-5.8-1.6-7.6-3.8-.3.5-.5 1.2-.5 1.9 0 1.3.7 2.5 1.8 3.2-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.3 3.5 3.1 3.9-.3.1-.7.1-1 .1-.2 0-.5 0-.7-.1.5 1.5 2 2.6 3.7 2.6A7.7 7.7 0 012 19.5a10.8 10.8 0 005.9 1.7c7.1 0 11-5.9 11-11v-.5c.8-.6 1.4-1.2 2-2z" />
              </svg>
            </a>
          </div>

          {/* Right - Copyright */}
          <div>
            © {new Date().getFullYear()} HireLens AI
          </div>

        </div>
      </footer>

    </div>
  );
}