import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Buildings,
  CaretDown,
  Check,
  Copy,
  Database,
  EnvelopeSimple,
  Robot,
  ShieldCheck,
  UsersThree,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";

const stackGroups = [
  {
    label: "Languages",
    items: ["Swift", "Python", "C#"],
  },
  {
    label: "Creative",
    items: [
      "Blender",
      "Premiere Pro",
      "Photoshop",
      "Illustrator",
      "YMM4",
      "After Effects",
    ],
  },
];

const pricingGroups = [
  {
    title: "Video Editing",
    items: [
      ["Short-form video", "¥3,000+"],
      ["Video up to 10 minutes", "¥8,000+"],
      ["Additional minute", "¥800+"],
    ],
  },
  {
    title: "Thumbnails",
    items: [
      ["Single thumbnail", "¥2,000"],
      ["Set of three", "¥5,000"],
      ["Extra revision", "¥500"],
    ],
  },
];

export function App() {
  const [copied, setCopied] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  async function copyEmail() {
    await navigator.clipboard.writeText("air0916.jp@gmail.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Back to top">
          AIRXTERIUM <span>/</span> PORTFOLIO
        </a>
        <nav aria-label="Main navigation">
          <a href="#works">Works</a>
          <a href="#products">Products</a>
          <a href="#socials">Socials</a>
          <a href="#stack">Skills</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">Build. Learn.<br />Create.</h1>
            <div className="hero-actions">
              <a className="button button-primary" href="#works">
                View Work <ArrowDown aria-hidden="true" size={18} weight="bold" />
              </a>
              <a className="button button-secondary" href="mailto:air0916.jp@gmail.com">
                Get in Touch <EnvelopeSimple aria-hidden="true" size={19} />
              </a>
            </div>
          </div>

          <aside className="identity-card" aria-label="Profile overview">
            <p className="identity-mark" aria-hidden="true">AIRXTERIUM</p>
            <dl>
              <div><dt>Role</dt><dd>Software Developer / Video Editor / Designer</dd></div>
              <div><dt>Profile</dt><dd>Junior High School Student</dd></div>
            </dl>
          </aside>
        </section>

        <section className="section" id="works" aria-labelledby="works-title">
          <div className="section-heading">
            <h2 id="works-title">Works</h2>
            <span>01</span>
          </div>

          <a className="work-card" href="https://fori.io/air0916" target="_blank" rel="noreferrer">
            <div className="work-image-wrap">
              <img src={`${import.meta.env.BASE_URL}foriio-preview.jpg`} alt="A YouTube thumbnail created by AIRXTERIUM" />
            </div>
            <div className="work-content">
              <h3>Selected Creative Work</h3>
              <span className="text-link">
                View on foriio <ArrowUpRight aria-hidden="true" size={18} weight="bold" />
              </span>
            </div>
          </a>

          <div className="next-project">
            <span>Next</span>
            <h3>More work coming soon.</h3>
          </div>
        </section>

        <section className="section product-section" id="products" aria-labelledby="products-title">
          <div className="section-heading">
            <h2 id="products-title">Products</h2>
            <span>02</span>
          </div>

          <article className="product-card">
            <div className="product-overview">
              <div>
                <div className="product-meta">
                  <span>In Development</span>
                  <span>Working Title</span>
                </div>
                <p className="product-kicker">AI that governs AI.</p>
                <h3>Enterprise AI Control Plane</h3>
              </div>
              <button
                className="product-toggle"
                type="button"
                aria-expanded={productOpen}
                aria-controls="enterprise-control-plane-details"
                onClick={() => setProductOpen((open) => !open)}
              >
                詳しく見る
                <CaretDown
                  aria-hidden="true"
                  className={productOpen ? "is-open" : ""}
                  size={18}
                  weight="bold"
                />
              </button>
            </div>

            {productOpen && (
              <div className="product-details" id="enterprise-control-plane-details">
                <p className="product-description">
                  A unified execution layer that controls how enterprise AI agents identify themselves,
                  access data, receive authority, communicate, and act across company systems.
                </p>

                <div
                  className="control-plane-diagram"
                  role="img"
                  aria-label="Human operators direct AI work through the Enterprise AI Control Plane. The control plane evaluates identity, authority, policy, data, risk, approval, and audit before AI agents can access enterprise systems."
                >
                  <div className="diagram-node diagram-node-human">
                    <UsersThree aria-hidden="true" size={24} />
                    <div><strong>Human Direction</strong><span>Employees · Admins · Executives</span></div>
                  </div>

                  <ArrowDown className="diagram-arrow" aria-hidden="true" size={22} weight="bold" />

                  <div className="control-plane-core">
                    <div className="control-plane-title">
                      <ShieldCheck aria-hidden="true" size={30} weight="duotone" />
                      <div><span>ENTERPRISE</span><strong>AI CONTROL PLANE</strong></div>
                    </div>
                    <div className="control-modules">
                      <span>Identity &amp; Authority</span>
                      <span>Policy &amp; Risk</span>
                      <span>Data &amp; Masking</span>
                      <span>Approval &amp; Kill Switch</span>
                      <span>Audit · Replay · Rollback</span>
                      <span>Cost &amp; Compliance</span>
                    </div>
                    <div className="decision-row" aria-label="Possible control decisions">
                      <span>Allow</span><span>Deny</span><span>Approval</span><span>Restricted</span>
                    </div>
                  </div>

                  <ArrowDown className="diagram-arrow" aria-hidden="true" size={22} weight="bold" />

                  <div className="diagram-agents">
                    <div className="diagram-node"><Robot aria-hidden="true" size={23} /><span>Sales Agent</span></div>
                    <div className="diagram-node"><Robot aria-hidden="true" size={23} /><span>Coding Agent</span></div>
                    <div className="diagram-node"><Robot aria-hidden="true" size={23} /><span>Finance Agent</span></div>
                  </div>

                  <ArrowDown className="diagram-arrow" aria-hidden="true" size={22} weight="bold" />

                  <div className="diagram-destinations">
                    <div className="diagram-node">
                      <Buildings aria-hidden="true" size={24} />
                      <div><strong>Enterprise Systems</strong><span>Gmail · Slack · GitHub · CRM · Cloud</span></div>
                    </div>
                    <div className="diagram-node">
                      <Database aria-hidden="true" size={24} />
                      <div><strong>Critical Data</strong><span>ERP · Database · Banking · Customer Data</span></div>
                    </div>
                  </div>
                </div>

                <p className="product-note">The product name is provisional and may change.</p>
              </div>
            )}
          </article>
        </section>

        <section className="section" id="socials" aria-labelledby="socials-title">
          <div className="section-heading">
            <h2 id="socials-title">Socials</h2>
            <span>03</span>
          </div>
          <div className="social-grid">
            <a className="social-card" href="https://x.com/_a1gernon" target="_blank" rel="noreferrer">
              <XLogo aria-hidden="true" size={28} weight="fill" />
              <div>
                <h3>X</h3>
                <p>@_a1gernon</p>
              </div>
              <ArrowUpRight aria-hidden="true" size={20} weight="bold" />
            </a>
            <a className="social-card" href="https://www.youtube.com/@A1rlline" target="_blank" rel="noreferrer">
              <YoutubeLogo aria-hidden="true" size={30} weight="fill" />
              <div>
                <h3>YouTube</h3>
                <p>@A1rlline</p>
              </div>
              <ArrowUpRight aria-hidden="true" size={20} weight="bold" />
            </a>
          </div>
        </section>

        <section className="section stack-section" id="stack" aria-labelledby="stack-title">
          <div className="section-heading">
            <h2 id="stack-title">Skills &amp; Tools</h2>
            <span>04</span>
          </div>
          <div className="stack-layout">
            {stackGroups.map((group) => (
              <div className="stack-group" key={group.label}>
                <h3>{group.label}</h3>
                <ul>
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <p className="contact-index">05</p>
          <h2 id="contact-title">Contact</h2>
          <p>For work inquiries, get in touch.</p>
            <a className="contact-service-link" href="#pricing">
              料金表はこちら <ArrowDown aria-hidden="true" size={16} weight="bold" />
            </a>
          <div className="contact-actions">
            <a href="mailto:air0916.jp@gmail.com">
              air0916.jp@gmail.com <ArrowUpRight aria-hidden="true" size={19} weight="bold" />
            </a>
            <button type="button" onClick={copyEmail} aria-live="polite">
              {copied ? <Check aria-hidden="true" size={18} weight="bold" /> : <Copy aria-hidden="true" size={18} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </section>

        <section className="section pricing-section" id="pricing" aria-labelledby="pricing-title">
          <div className="section-heading">
            <h2 id="pricing-title">Pricing</h2>
            <span>06</span>
          </div>
          <div className="pricing-grid">
            {pricingGroups.map((group) => (
              <article className="pricing-card" key={group.title}>
                <header>
                  <h3>{group.title}</h3>
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
        <p>© {new Date().getFullYear()} AIRXTERIUM</p>
      </footer>
    </div>
  );
}
