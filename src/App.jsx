import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowUp,
  CaretDown,
  Check,
  Copy,
  Pause,
  Play,
  Plus,
  X,
  XLogo,
  YoutubeLogo,
  ShieldCheck,
  Robot,
  UsersThree,
  Buildings,
  Asterisk,
} from "@phosphor-icons/react";
import { Sculpture } from "./Sculpture.jsx";

const navigation = [
  ["works", "Works"],
  ["products", "Products"],
  ["socials", "Socials"],
  ["stack", "Skills"],
  ["contact", "Contact"],
];
const creativeTools = [
  "Blender",
  "Premiere Pro",
  "Photoshop",
  "Illustrator",
  "YMM4",
  "After Effects",
];
const prices = [
  {
    title: "Video editing",
    number: "01",
    items: [
      ["Short-form video", "¥3,000+"],
      ["Video up to 10 minutes", "¥8,000+"],
      ["Additional minute", "¥800+"],
    ],
  },
  {
    title: "Thumbnails",
    number: "02",
    items: [
      ["Single thumbnail", "¥2,000"],
      ["Set of three", "¥5,000"],
      ["Extra revision", "¥500"],
    ],
  },
];

function SectionHeading({ number, title, id, note }) {
  return (
    <div className="section-heading reveal">
      <div className="section-label">
        <span>{number}</span>
        <h2 id={id}>{title}</h2>
      </div>
      {note && <span className="section-note">{note}</span>}
    </div>
  );
}

function Tilt({ children, className = "", motion, ...props }) {
  function move(event) {
    if (!motion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--tilt-x",
      `${(0.5 - (event.clientY - rect.top) / rect.height) * 5}deg`,
    );
    event.currentTarget.style.setProperty(
      "--tilt-y",
      `${((event.clientX - rect.left) / rect.width - 0.5) * 5}deg`,
    );
  }
  function reset(event) {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  }
  return (
    <a
      className={`tilt-card ${className}`}
      onPointerMove={move}
      onPointerLeave={reset}
      {...props}
    >
      {children}
    </a>
  );
}

function ProductDiagram() {
  const flow = [
    { icon: UsersThree, title: "Human direction", text: "Set the intent" },
    {
      icon: ShieldCheck,
      title: "Control plane",
      text: "Evaluate every action",
    },
    { icon: Robot, title: "AI agents", text: "Execute with authority" },
    {
      icon: Buildings,
      title: "Enterprise systems",
      text: "Access within limits",
    },
  ];
  return (
    <div className="product-details" id="enterprise-control-plane-details">
      <p className="product-description">
        One execution layer to govern AI identity, permissions, data access, and
        actions across company systems.
      </p>
      <div
        className="control-plane-diagram"
        aria-label="Planned system architecture"
      >
        <ol className="diagram-flow">
          {flow.map(({ icon: Icon, title, text }, index) => (
            <li
              key={title}
              className={
                index === 1 ? "diagram-node control-plane-core" : "diagram-node"
              }
            >
              <span className="diagram-step">0{index + 1}</span>
              <Icon size={28} aria-hidden="true" />
              <strong>{title}</strong>
              <span>{text}</span>
              {index < 3 && (
                <ArrowUpRight
                  className="flow-arrow"
                  size={19}
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
        <div className="control-modules">
          {[
            "Identity & authority",
            "Policy & risk",
            "Data & masking",
            "Approval & kill switch",
            "Audit · Replay · Rollback",
            "Cost & compliance",
          ].map((item) => (
            <span key={item}>
              <Plus size={12} aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
        <div className="decision-row">
          <span className="mono">EVERY ACTION, A DECISION</span>
          <div>
            <span>Allow</span>
            <span>Deny</span>
            <span>Approval</span>
            <span>Restricted</span>
          </div>
        </div>
      </div>
      <p className="product-note">
        Concept architecture · The product name is provisional and may change.
      </p>
    </div>
  );
}

export function App() {
  const [productOpen, setProductOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [activeSection, setActiveSection] = useState("top");
  const copyTimer = useRef();
  const menuButton = useRef();
  const motion = !paused && !reduced;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(query.matches);
    query.addEventListener("change", change);
    return () => {
      query.removeEventListener("change", change);
      clearTimeout(copyTimer.current);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = motion ? "on" : "off";
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            reveal.unobserve(entry.target);
          }
        }),
      { threshold: 0.06 },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((element) => reveal.observe(element));
    return () => reveal.disconnect();
  }, [motion]);

  useEffect(() => {
    let frame;
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty(
        "--scroll-progress",
        total > 0 ? window.scrollY / total : 0,
      );
      const sections = [...document.querySelectorAll("main > section[id]")];
      const current = sections
        .filter(
          (section) =>
            section.getBoundingClientRect().top <= window.innerHeight * 0.45,
        )
        .at(-1);
      setActiveSection(current?.id || "top");
      frame = undefined;
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
    };
  }, []);

  useEffect(() => {
    const escape = (event) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    if (menuOpen) document.querySelector("#main-navigation a")?.focus();
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [menuOpen]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText("air0916.jp@gmail.com");
      setCopyStatus("Copied");
    } catch {
      setCopyStatus("Select the email to copy it.");
    }
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyStatus(""), 2500);
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#works">
        Skip to content
      </a>
      <div className="reading-progress" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="AIRXTERIUM — back to top">
          <Asterisk
            className="brand-symbol"
            size={28}
            weight="bold"
            aria-hidden="true"
          />
          AIRXTERIUM
          <span className="brand-period" aria-hidden="true">
            ↗
          </span>
        </a>
        <nav
          id="main-navigation"
          className={menuOpen ? "navigation is-open" : "navigation"}
          aria-label="Main navigation"
        >
          {navigation.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMenuOpen(false)}
              aria-current={activeSection === id ? "location" : undefined}
            >
              {label}
              <span className="nav-dot" />
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="motion-toggle"
            type="button"
            disabled={reduced}
            aria-label={
              reduced
                ? "Reduced motion enabled by your device"
                : paused
                  ? "Resume animations"
                  : "Pause animations"
            }
            aria-pressed={paused || reduced}
            onClick={() => setPaused((value) => !value)}
          >
            {motion ? (
              <Pause size={13} weight="fill" />
            ) : (
              <Play size={13} weight="fill" />
            )}
            <span>Motion {motion ? "on" : "off"}</span>
          </button>
          <button
            ref={menuButton}
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={22} /> : <Plus size={22} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-topline mono">
            <span>INDEPENDENT CREATIVE & DEVELOPER</span>
            <span>PORTFOLIO — {new Date().getFullYear()}</span>
          </div>
          <div className="hero-copy">
            <h1 id="hero-title">
              <span className="hero-line">
                <span>Build.</span>
              </span>
              <span className="hero-line hero-outline">
                <span>Learn.</span>
              </span>
              <span className="hero-line hero-accent">
                <span>Create.</span>
              </span>
            </h1>
            <div className="hero-intro">
              <span className="accent-rule" />
              <p>
                Software Developer.
                <br />
                Video Editor. Designer.
              </p>
            </div>
            <a className="pill-link hero-cta" href="#works">
              Explore my work <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
          <div className="hero-art">
            <div className="sculpture-halo" aria-hidden="true" />
            <Sculpture variant="hero" motion={motion} />
            <span className="art-cross art-cross-one" aria-hidden="true">
              <Plus size={15} />
            </span>
            <span className="art-cross art-cross-two" aria-hidden="true">
              <Plus size={15} />
            </span>
            <div className="art-caption mono">
              <span>
                <i /> ALWAYS IN THE MAKING
              </span>
              <span>01 / ∞</span>
            </div>
          </div>
          <div className="hero-bottom mono">
            <span>JUNIOR HIGH SCHOOL STUDENT</span>
            <a href="#works">
              SCROLL TO EXPLORE <ArrowDown size={14} aria-hidden="true" />
            </a>
            <span className="hero-coordinate">CODE × DESIGN × MOTION</span>
          </div>
        </section>

        <div className="discipline-marquee" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy}>
                {["DEVELOPMENT", "VIDEO EDITING", "DESIGN", "EXPLORATION"].map(
                  (label) => (
                    <span className="marquee-item" key={label}>
                      {label}
                      <Asterisk className="marquee-star" size={21} />
                    </span>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>

        <section
          className="section works-section"
          id="works"
          aria-labelledby="works-title"
        >
          <SectionHeading
            number="01"
            title="Selected works"
            id="works-title"
            note="A FEW THINGS I'VE MADE"
          />
          <Tilt
            className="work-card reveal"
            motion={motion}
            href="https://fori.io/air0916"
            target="_blank"
            rel="noreferrer"
          >
            <div className="work-image-wrap">
              <img
                src={`${import.meta.env.BASE_URL}foriio-preview.jpg`}
                alt="A YouTube thumbnail designed by AIRXTERIUM"
                loading="lazy"
              />
              <span className="image-view">
                View collection <ArrowUpRight size={20} aria-hidden="true" />
              </span>
              <span className="image-index mono">CREATIVE ARCHIVE / 01</span>
            </div>
            <div className="work-content">
              <span className="mono work-eyebrow">VIDEO EDITING & DESIGN</span>
              <h3>
                Frames that <br />
                leave a mark.
              </h3>
              <div className="work-tags">
                <span>Video editing</span>
                <span>Thumbnails</span>
                <span>Design</span>
              </div>
              <span className="work-link">
                View on foriio <ArrowUpRight size={25} aria-hidden="true" />
              </span>
            </div>
          </Tilt>
          <div className="work-footnote reveal">
            <span className="mono">THE COLLECTION CONTINUES.</span>
            <span>
              More work in the making <Plus size={15} aria-hidden="true" />
            </span>
          </div>
        </section>

        <section
          className="section product-section"
          id="products"
          aria-labelledby="products-title"
        >
          <SectionHeading
            number="02"
            title="Products"
            id="products-title"
            note="FROM AN IDEA TO SOMETHING REAL"
          />
          <article className="product-card reveal">
            <div className="product-main">
              <div className="product-art">
                <Sculpture variant="product" motion={motion} />
                <span className="product-art-label mono">
                  INTELLIGENCE, IN ORBIT.
                </span>
              </div>
              <div className="product-overview">
                <span className="status-badge">
                  <i />
                  In development
                </span>
                <h3>
                  AI that <br />
                  governs <span>AI.</span>
                </h3>
                <p className="product-name">Enterprise AI Control Plane</p>
                <p className="product-working mono">WORKING TITLE</p>
                <button
                  className="product-toggle"
                  type="button"
                  aria-expanded={productOpen}
                  aria-controls="enterprise-control-plane-details"
                  onClick={() => setProductOpen((open) => !open)}
                >
                  <span>{productOpen ? "閉じる" : "詳しく見る"}</span>
                  <CaretDown size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div
              className="accordion-grid"
              inert={!productOpen ? true : undefined}
              aria-hidden={!productOpen}
            >
              <div className="accordion-inner">
                <ProductDiagram />
              </div>
            </div>
          </article>
        </section>

        <section
          className="section socials-section"
          id="socials"
          aria-labelledby="socials-title"
        >
          <SectionHeading
            number="03"
            title="Elsewhere"
            id="socials-title"
            note="SOCIALS"
          />
          <div className="social-list">
            <a
              className="social-row reveal"
              href="https://x.com/_a1gernon"
              target="_blank"
              rel="noreferrer"
            >
              <XLogo size={28} aria-hidden="true" />
              <h3>X</h3>
              <span className="social-handle mono">@_a1gernon</span>
              <span className="circle-arrow">
                <ArrowUpRight size={27} aria-hidden="true" />
              </span>
            </a>
            <a
              className="social-row reveal"
              href="https://www.youtube.com/@A1rlline"
              target="_blank"
              rel="noreferrer"
            >
              <YoutubeLogo size={31} aria-hidden="true" />
              <h3>YouTube</h3>
              <span className="social-handle mono">@A1rlline</span>
              <span className="circle-arrow">
                <ArrowUpRight size={27} aria-hidden="true" />
              </span>
            </a>
          </div>
        </section>

        <section
          className="section skills-section"
          id="stack"
          aria-labelledby="stack-title"
        >
          <SectionHeading
            number="04"
            title="Skills & tools"
            id="stack-title"
            note="MY CREATIVE TOOLKIT"
          />
          <div className="skills-layout">
            <div className="skill-intro reveal">
              <h3>
                Different tools.
                <br />
                <span>Same curiosity.</span>
              </h3>
              <Asterisk
                className="tool-asterisk"
                weight="bold"
                size={130}
                aria-hidden="true"
              />
            </div>
            <div className="skill-groups">
              <div className="skill-group reveal">
                <h4 className="mono">01 / LANGUAGES</h4>
                <div className="language-list">
                  {["Swift", "Python", "C#"].map((name, i) => (
                    <div className="language" key={name}>
                      <span>{name}</span>
                      <span className="mono">0{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="skill-group reveal">
                <h4 className="mono">02 / CREATIVE</h4>
                <div className="tool-list">
                  {creativeTools.map((tool) => (
                    <span key={tool}>
                      {tool}
                      <Plus size={13} aria-hidden="true" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <SectionHeading
            number="05"
            title="Contact"
            id="contact-title"
            note="NEXT UP: SOMETHING GREAT"
          />
          <div className="contact-body reveal">
            <div className="contact-kicker mono">
              <span className="status-dot" /> FOR WORK / GET IN TOUCH
            </div>
            <h3>
              Let's make
              <br />
              <span>something great.</span>
            </h3>
            <div className="contact-bottom">
              <div className="contact-email-group">
                <a className="email-link" href="mailto:air0916.jp@gmail.com">
                  air0916.jp@gmail.com{" "}
                  <ArrowUpRight size={24} aria-hidden="true" />
                </a>
                <button
                  className="copy-button"
                  type="button"
                  aria-label="Copy email address"
                  onClick={copyEmail}
                >
                  {copyStatus === "Copied" ? (
                    <Check size={19} />
                  ) : (
                    <Copy size={19} />
                  )}
                </button>
                <span className="copy-feedback" role="status">
                  {copyStatus}
                </span>
              </div>
              <a className="contact-service-link" href="#pricing">
                料金表はこちら <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section
          className="section pricing-section"
          id="pricing"
          aria-labelledby="pricing-title"
        >
          <SectionHeading
            number="06"
            title="Pricing"
            id="pricing-title"
            note="LET'S FIND THE RIGHT FIT"
          />
          <div className="pricing-grid">
            {prices.map((group) => (
              <article className="pricing-card reveal" key={group.title}>
                <header>
                  <span className="mono">{group.number}</span>
                  <h3>{group.title}</h3>
                  <ArrowUpRight size={22} aria-hidden="true" />
                </header>
                <dl>
                  {group.items.map(([service, price]) => (
                    <div key={service}>
                      <dt>{service}</dt>
                      <dd>{price}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-top">
          <span>
            AIRXTERIUM
            <Asterisk className="footer-star" size={80} aria-hidden="true" />
          </span>
          <a href="#top" className="circle-arrow" aria-label="Back to top">
            <ArrowUp size={26} />
          </a>
        </div>
        <div className="footer-bottom mono">
          <span>© {new Date().getFullYear()} AIRXTERIUM</span>
          <span>BUILT WITH CURIOSITY.</span>
          <span>THANKS FOR STOPPING BY.</span>
        </div>
      </footer>
    </div>
  );
}
