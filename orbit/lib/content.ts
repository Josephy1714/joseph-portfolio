export type SectionId =
  | "about" | "projects" | "skills" | "experience"
  | "education" | "contact" | "credentials" | "cv" | "ai-work";

export type PortfolioSection = {
  id: SectionId;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  pathway: "both" | "ai" | "data";
  metric?: string;
};

export const sections: PortfolioSection[] = [
  { id: "about", label: "About", eyebrow: "01 / THE HUMAN", title: "Curiosity, made tangible.", description: "I explore how thoughtful engineering and data-driven reasoning can turn complicated problems into useful tools. This space is a living record of what I build, what I learn, and what I want to solve next.", pathway: "both" },
  { id: "projects", label: "Projects", eyebrow: "02 / SELECTED WORK", title: "Proof over promises.", description: "Case studies designed to show the question, the decisions, the trade-offs, and the outcome—not just a polished screenshot. Metrics and links will be verified before publication.", pathway: "both", metric: "BUILD · MEASURE · REFINE" },
  { id: "skills", label: "Skills", eyebrow: "03 / THE TOOLKIT", title: "Tools are only the beginning.", description: "Python, SQL, data analysis, machine learning, visualisation, annotation quality assurance, and the habits that make technical work reliable.", pathway: "both" },
  { id: "experience", label: "Experience", eyebrow: "04 / IN THE FIELD", title: "Learning by doing.", description: "A curated timeline of relevant work, responsibilities, and outcomes, with context for what I contributed and what I learned.", pathway: "both" },
  { id: "education", label: "Education", eyebrow: "05 / THE FOUNDATION", title: "Data Science · University of Nairobi", description: "BSc Data Science, University of Nairobi. Expected graduation: 2029. Focused on building strong fundamentals and applying them to real problems.", pathway: "data" },
  { id: "ai-work", label: "AI Work", eyebrow: "06 / HUMAN-IN-THE-LOOP", title: "Helping AI become more reliable.", description: "Annotation, evaluation, instruction following, data quality, and careful review of model outputs—grounded in guidelines and evidence.", pathway: "ai" },
  { id: "credentials", label: "Credentials", eyebrow: "07 / VERIFIED MILESTONES", title: "Evidence, not decoration.", description: "A place for verifiable certifications, assessment milestones, and professional learning, clearly distinguished by status.", pathway: "both" },
  { id: "cv", label: "CV / RESUME", eyebrow: "08 / THE QUICK READ", title: "The concise version.", description: "An accessible, recruiter-friendly résumé and downloadable PDF will be added after dates, links, and claims are verified.", pathway: "both" },
  { id: "contact", label: "Contact", eyebrow: "09 / OPEN CHANNEL", title: "Have a good problem?", description: "For AI evaluation, data science, and thoughtful collaborations. Choose a clear next step and get in touch.", pathway: "both" },
];

export const projects = [
  { title: "Credit Card Fraud Detection", type: "MACHINE LEARNING", status: "Review metrics before publishing", description: "An imbalanced classification study focused on fraud recall, evaluation discipline, and the trade-offs behind model performance.", tags: ["Python", "Pandas", "XGBoost", "Imbalanced data"], href: "https://github.com/Josephy1714" },
  { title: "Titanic SQL Analysis", type: "DATA EXPLORATION", status: "Project link to verify", description: "A structured exploration of passenger data using SQL to ask clear questions, surface patterns, and communicate findings.", tags: ["SQL", "Data cleaning", "Analysis"], href: "https://github.com/Josephy1714/titanic-sql-analysis" },
  { title: "CareerPilot AI", type: "PRODUCT ENGINEERING", status: "Live project — verify demo URL", description: "A career-support product exploring résumé parsing, job-fit signals, and AI-assisted career workflows.", tags: ["Next.js", "AI", "Product design"], href: "https://github.com/Josephy1714/careerpilotAI" },
];
