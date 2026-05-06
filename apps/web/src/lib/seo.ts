const BASE_URL = window.location.origin;

type MetaOptions = {
  title: string;
  description?: string;
  path?: string;
};

export function setMeta({
  title,
  description,
  path = "/",
}: MetaOptions) {
  // Title
  document.title = `${title} | HireLens AI`;

  // Description
  let meta = document.querySelector(
    'meta[name="description"]'
  ) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.appendChild(meta);
  }

  if (description) {
    meta.setAttribute("content", description);
  }

  // Canonical
  let canonical = document.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement | null;

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }

  canonical.setAttribute("href", `${BASE_URL}${path}`);
}

export function setStructuredData(data: Record<string, any>) {
  let script = document.getElementById(
    "ld-json"
  ) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "ld-json";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}

export const defaultSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HireLens AI",
  url: BASE_URL,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "HireLens AI helps you compare resumes with job descriptions, understand candidate fit, and make better hiring decisions with clarity.",
};