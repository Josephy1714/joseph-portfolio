"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowLeft, ArrowUpRight, AudioLines, Check, Command, Github, Linkedin, Mail, Move3D, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { projects, sections, type SectionId } from "@/lib/content";

const OrbitScene = dynamic(() => import("@/components/OrbitScene"), {
  ssr: false,
  loading: () => <div className="scene-loading"><span className="loader-orbit" />Building the universe…</div>,
});

export default function Home() {
  const [intro, setIntro] = useState(true);
  const [active, setActive] = useState<SectionId | null>(null);
  const [pathway, setPathway] = useState<"all" | "ai" | "data">("all");
  const [sound, setSound] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!intro || reduceMotion) { setIntro(false); return; }
    const timer = window.setTimeout(() => setIntro(false), 9000);
    return () => window.clearTimeout(timer);
  }, [intro, reduceMotion]);

  const destinations = useMemo(
    () => sections.filter(s => pathway === "all" || s.pathway === "both" || s.pathway === pathway),
    [pathway],
  );
  const selected = sections.find(s => s.id === active);

  const openSection = (id: SectionId) => {
    setActive(id);
    if (id === "ai-work") setPathway("ai");
    if (id === "education") setPathway("data");
  };

  return (
    <main className="universe-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <div className="scanline" aria-hidden="true" />
      <header className="topbar">
        <button className="wordmark" onClick={() => { setActive(null); setPathway("all"); }} aria-label="Return to the central sphere">
          <span className="wordmark-icon"><span /></span>
          <span>JO<span className="wordmark-divider">/</span>ORBIT</span>
        </button>
        <div className="topbar-center"><span className="live-dot" /> DIGITAL PORTFOLIO <span className="topbar-separator">/</span> 2026—∞</div>
        <div className="topbar-actions">
          <button className={`icon-button ${sound ? "active" : ""}`} onClick={() => setSound(!sound)} aria-label={sound ? "Mute ambient sound" : "Toggle ambient sound"} title="Ambient sound (visual prototype)">
            <AudioLines size={16} />
          </button>
          <a className="contact-pill" href="mailto:hello@example.com" onClick={e => { e.preventDefault(); openSection("contact"); }}>LET’S CONNECT <ArrowUpRight size={14} /></a>
        </div>
      </header>

      <section className="experience" aria-label="Interactive portfolio">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> PORTFOLIO / 001 <span className="eyebrow-status">ONLINE</span></div>
          <h1>Ideas into<br /><span>intelligence.</span></h1>
          <p className="hero-description">Exploring the space between <strong>artificial intelligence</strong>, data, and human possibility.</p>
          <div className="hero-meta"><span className="meta-index">01—09</span><span className="meta-rule" /><span>ROTATE TO EXPLORE</span></div>
          <div className="pathway-switch" role="group" aria-label="Filter portfolio destinations">
            <button className={pathway === "all" ? "selected" : ""} onClick={() => setPathway("all")}>All systems</button>
            <button className={pathway === "ai" ? "selected" : ""} onClick={() => setPathway("ai")}>AI work</button>
            <button className={pathway === "data" ? "selected" : ""} onClick={() => setPathway("data")}>Data science</button>
          </div>
          <div className="hero-footnote"><Move3D size={14} /> DRAG THE SPHERE <span>·</span> SELECT A NODE</div>
        </div>

        <div className="sphere-stage">
          <div className="sphere-halo" />
          <div className="sphere-orbit orbit-a" />
          <div className="sphere-orbit orbit-b" />
          <OrbitScene sections={destinations} onSelect={openSection} />
          <div className="sphere-caption"><span>FIG. 01</span><span>KNOWLEDGE NETWORK</span></div>
          <div className="sphere-coordinate">01° / 09° / 27°<br />NODES INTERCONNECTED</div>
        </div>

        <aside className="right-rail">
          <div className="rail-label">EXPLORE THE SYSTEM</div>
          <div className="rail-list">
            {destinations.slice(0, 5).map((section, i) => (
              <button key={section.id} className={active === section.id ? "rail-item active" : "rail-item"} onClick={() => openSection(section.id)}>
                <span className="rail-number">0{i + 1}</span><span>{section.label}</span><ArrowUpRight size={13} />
              </button>
            ))}
          </div>
          <div className="rail-note"><Sparkles size={14} /><span>Every node opens<br />a different dimension.</span></div>
        </aside>
      </section>

      <footer className="bottom-bar">
        <div className="footer-left"><span>NAIROBI, KE</span><span className="footer-divider">/</span><span>BUILDING IN PUBLIC</span></div>
        <div className="footer-center"><span className="footer-signal" /> SYSTEM READY <span className="footer-divider">·</span> INTERACTIVE EXPERIENCE</div>
        <div className="footer-links">
          <a href="https://github.com/Josephy1714" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={15} /></a>
          <a href="https://www.linkedin.com/in/joseph-ombati-623aa8381/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={15} /></a>
          <button onClick={() => openSection("contact")} aria-label="Contact"><Mail size={15} /></button>
        </div>
      </footer>

      <AnimatePresence>
        {selected && (
          <motion.div className="detail-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}>
            <motion.section className="detail-panel" initial={{ opacity: 0, x: 45, filter: "blur(8px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: 35 }} transition={{ duration: 0.35, ease: "easeOut" }} onClick={e => e.stopPropagation()} aria-labelledby="detail-title">
              <div className="panel-top"><span className="eyebrow"><span className="live-dot" /> {selected.eyebrow}</span><button className="icon-button" onClick={() => setActive(null)} aria-label="Close section"><X size={18} /></button></div>
              <div className="panel-content">
                <div className="panel-index">NODE / {String(sections.findIndex(s => s.id === selected.id) + 1).padStart(2, "0")}</div>
                <h2 id="detail-title">{selected.title}</h2>
                <p>{selected.description}</p>
                {selected.id === "projects" && <div className="project-stack">{projects.map((project, i) => <article className="project-card" key={project.title}><div className="project-number">0{i + 1}</div><div className="project-copy"><span className="project-type">{project.type}</span><h3>{project.title}</h3><p>{project.description}</p><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><span className="project-status">{project.status}</span><a href={project.href} target="_blank" rel="noreferrer">Explore project <ArrowUpRight size={13} /></a></div></article>)}</div>}
                {selected.id === "skills" && <div className="skill-cloud">{["Python", "SQL", "Pandas", "NumPy", "Scikit-learn", "XGBoost", "Data visualisation", "Model evaluation", "Annotation QA", "Git & GitHub"].map(skill => <span key={skill}>{skill}</span>)}</div>}
                {selected.id === "contact" && <div className="contact-actions"><a href="mailto:hello@example.com?subject=Portfolio%20enquiry"><Mail size={16} /> Email Joseph <ArrowUpRight size={14} /></a><a href="https://www.linkedin.com/in/joseph-ombati-623aa8381/" target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={14} /></a><a href="https://github.com/Josephy1714" target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={14} /></a><p className="small-note">Placeholder email must be replaced before launch.</p></div>}
                {selected.id === "cv" && <div className="callout-note"><Check size={15} /> A downloadable, accessible résumé will be attached after the latest CV and claims are verified.</div>}
                {selected.id === "credentials" && <div className="callout-note"><Check size={15} /> Only verifiable credentials will be published. In-progress applications will not be presented as certifications.</div>}
                <div className="panel-bottom"><span>JO / ORBIT SYSTEM</span><button className="return-link" onClick={() => setActive(null)}><ArrowLeft size={14} /> RETURN TO SPHERE</button></div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {intro && (
          <motion.div className="intro-screen" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.85, ease: "easeInOut" }}>
            <div className="intro-starfield" />
            <div className="intro-ring intro-ring-one" /><div className="intro-ring intro-ring-two" />
            <div className="intro-core"><span /><span /><span /></div>
            <div className="intro-content">
              <span className="intro-kicker">INITIALISING PERSONAL UNIVERSE</span>
              <h2>JOSEPH <span>OMBATI</span></h2>
              <p>ARTIFICIAL INTELLIGENCE <i>×</i> DATA SCIENCE</p>
              <div className="intro-progress"><span /></div>
              <div className="intro-status"><span>LOADING KNOWLEDGE NETWORK</span><span>0{intro ? "9" : "0"} / 09</span></div>
            </div>
            <button className="skip-intro" onClick={() => setIntro(false)}>SKIP INTRO <ArrowDownRight size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="accessibility-note">If 3D is unavailable, use the labelled destination list on the right.</div>
    </main>
  );
}
