// frontend/components/ResumeTemplate.tsx
import React from "react";

type Bullet = { point_num: number; text: string };

type SectionItem = {
  job_title: string;
  company: string;
  location: string;
  bullets: Bullet[];
  dates?: { start: string; end: string } | null;
};

type MatchOrder = {
  job_title: string;
  bullet_order: number[];
};

type MatchPayload = {
  work: MatchOrder[];
  projects: MatchOrder[];
};

const DEBUG = false; // set true if you want section outlines

// Optional: if you want the displayed title to match Word exactly (e.g., "Azure Engineer")
const titleDisplay: Record<string, string> = {
  // "Azure DevOps Engineer": "Azure Engineer",
};

function formatMonthYear(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(d);
}

function formatDateRange(dates?: { start: string; end: string } | null) {
  if (!dates?.start) return "";
  const start = formatMonthYear(dates.start);

  const endRaw = (dates.end ?? "").toLowerCase();
  const end = !dates.end || endRaw === "present" ? "Present" : formatMonthYear(dates.end);

  if (!start) return "";
  return `${start} – ${end}`;
}

function reorderBullets(bullets: Bullet[], order: number[]) {
  const map = new Map(bullets.map((b) => [b.point_num, b]));
  const ordered = order.map((n) => map.get(n)).filter(Boolean) as Bullet[];
  const remaining = bullets.filter((b) => !order.includes(b.point_num));
  return [...ordered, ...remaining];
}

function sectionWrapStyle(color: string) {
  if (!DEBUG) return undefined;
  return { outline: `1px solid ${color}`, outlineOffset: "2px" } as React.CSSProperties;
}

function SkillsBlock({ profile }: { profile: string }) {
  // NOTE: This is intentionally hard-coded (for now) to match your Word layout exactly.
  const dataEngineer = [
    {
      label: "Languages",
      text: "Python (Pandas, Seaborn, Matplotlib, scikit-learn, TensorFlow), SQL, Bash/Shell.",
    },
    {
      label: "Skills",
      text: "ETL/ELT, dimensional modeling, data quality/validation, schema design, data pipelines, performance tuning, REST APIs.",
    },
    {
      label: "Cloud",
      text: "GCP (BigQuery, Cloud Storage, Cloud Functions, Vertex AI), Azure.",
    },
    { label: "Orchestration", text: "Airflow." },
    {
      label: "DevOps/IaC",
      text: "Azure DevOps (YAML CI/CD), Terraform, Terraform Cloud, Git, Docker.",
    },
    {
      label: "BI/Analytics",
      text: "Tableau, Power BI, Oracle Fusion Data Intelligence, OTBI, OAC, Streamlit.",
    },
  ];

  const analyst = [
    {
      label: "Languages",
      text: "Python (Pandas, NumPy, scikit-learn), SQL, Bash/Shell.",
    },
    {
      label: "Skills",
      text: "KPI design, requirements mapping, ETL/ELT, dimensional modeling, data quality/validation, dashboarding.",
    },
    {
      label: "Cloud",
      text: "GCP (BigQuery, GCS, Cloud Functions, Vertex AI), Azure.",
    },
    { label: "Orchestration", text: "Airflow." },
    {
      label: "DevOps/IaC",
      text: "Azure DevOps (YAML CI/CD), Terraform, Terraform Cloud, Git, Docker, ServiceNow (REST).",
    },
    {
      label: "BI/Analytics",
      text: "Tableau, Power BI, Oracle Fusion Data Intelligence, OTBI, OAC, Streamlit.",
    },
  ];

  const rows = profile === "analyst" ? analyst : dataEngineer;

  return (
    <div style={{ marginTop: 6 }}>
      {rows.map((r) => (
        <div key={r.label} style={{ marginBottom: 2 }}>
          <span style={{ fontWeight: 700 }}>{r.label}:</span>{" "}
          <span>{r.text}</span>
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ marginTop: 12, fontWeight: 700, borderBottom: "1px solid #000", paddingBottom: 2 }}>
      {title}
    </div>
  );
}

function BulletList({ bullets }: { bullets: Bullet[] }) {
  // Word-like bullet layout (tight indent + good wrap)
  return (
    <ul style={{ marginTop: 4, paddingLeft: 0, marginLeft: 0 }}>
      {bullets.map((b) => (
        <li
          key={b.point_num}
          style={{
            listStyleType: "disc",
            marginLeft: 16, // where the bullet sits (tighter = more usable width)
            paddingLeft: 6, // gap between bullet and text
            marginBottom: 2,
          }}
        >
          {b.text}
        </li>
      ))}
    </ul>
  );
}

export function ResumeTemplate({
  resume,
  match,
  profile,
}: {
  resume: { work: SectionItem[]; project: SectionItem[] };
  match: MatchPayload | null;
  profile: string;
}) {
  const workOrderMap = new Map(match?.work?.map((w) => [w.job_title, w.bullet_order]));
  const projOrderMap = new Map(match?.projects?.map((p) => [p.job_title, p.bullet_order]));

  // Only show projects selected by match (2 projects). If no match yet, show all projects.
  const selectedProjectTitles = match?.projects?.map((p) => p.job_title) ?? [];
  const projectsToRender =
    selectedProjectTitles.length > 0
      ? resume.project.filter((p) => selectedProjectTitles.includes(p.job_title))
      : resume.project;

  // Keep them in the same order backend sends (already latest-first). If no match, keep original order.
  const projectsSorted =
    selectedProjectTitles.length > 0
      ? (selectedProjectTitles
          .map((t) => projectsToRender.find((p) => p.job_title === t))
          .filter(Boolean) as SectionItem[])
      : projectsToRender;

  return (
    <div>
      {/* HEADER (fixed) */}
      <div className="text-center" style={sectionWrapStyle("purple")}>
        <div style={{ fontWeight: 700, letterSpacing: 0.3 }}>JAYNENDER SINGH</div>
        <div style={{ marginTop: 2, fontSize: "10.5pt" }}>
          Boston, MA | +1 (857) 540-4315 | jay22@bu.edu | linkedin.com/in/jaynender-singh/
        </div>
      </div>

      {/* EDUCATION (fixed) */}
      <div style={sectionWrapStyle("green")}>
        <SectionHeader title="EDUCATION" />

        <div style={{ marginTop: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <div style={{ fontWeight: 700 }}>M.S. in Business Analytics</div>
              <div style={{ fontStyle: "italic" }}>Boston University, Questrom School of Business, Boston, MA</div>
            </div>
            <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
              <div>Expected Jan 2026</div>
              <div>GPA: 3.48/4.0</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}>
            <div>
              <div style={{ fontWeight: 700 }}>B.Tech in Mechanical Engineering</div>
              <div style={{ fontStyle: "italic" }}>Vellore Institute of Technology, Vellore, India</div>
            </div>
            <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
              <div>May 2022</div>
              <div>GPA: 3.59/4.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* WORK EXPERIENCE */}
      <div style={sectionWrapStyle("blue")}>
        <SectionHeader title="WORK EXPERIENCE" />

        <div style={{ marginTop: 8 }}>
          {resume.work.map((job) => {
            const order = workOrderMap.get(job.job_title) ?? job.bullets.map((b) => b.point_num);
            const bullets = reorderBullets(job.bullets, order);

            const displayTitle = titleDisplay[job.job_title] ?? job.job_title;

            return (
              <div key={job.job_title} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontWeight: 700 }}>{displayTitle}</div>
                  <div style={{ whiteSpace: "nowrap" }}>{formatDateRange(job.dates ?? null)}</div>
                </div>

                <div style={{ fontStyle: "italic" }}>
                  {job.company}, {job.location}
                </div>

                <BulletList bullets={bullets} />
              </div>
            );
          })}
        </div>
      </div>

      {/* PROJECT EXPERIENCE */}
      <div style={sectionWrapStyle("red")}>
        <SectionHeader title="PROJECT EXPERIENCE" />

        <div style={{ marginTop: 8 }}>
          {projectsSorted.map((proj) => {
            const order = projOrderMap.get(proj.job_title) ?? proj.bullets.map((b) => b.point_num);
            const bullets = reorderBullets(proj.bullets, order);

            return (
              <div key={proj.job_title} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontWeight: 700 }}>{proj.job_title}</div>
                  <div style={{ whiteSpace: "nowrap" }}>{formatDateRange(proj.dates ?? null)}</div>
                </div>

                <div style={{ fontStyle: "italic" }}>
                  {proj.company}, {proj.location}
                </div>

                <BulletList bullets={bullets} />
              </div>
            );
          })}
        </div>
      </div>

      {/* SKILLS (profile-based, fixed) */}
      <div style={sectionWrapStyle("orange")}>
        <SectionHeader title="SKILLS" />
        <SkillsBlock profile={profile} />
      </div>
    </div>
  );
}
