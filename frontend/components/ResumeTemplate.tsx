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

function reorderBullets(bullets: Bullet[], order: number[]) {
  const map = new Map(bullets.map((b) => [b.point_num, b]));
  const ordered = order.map((n) => map.get(n)).filter(Boolean) as Bullet[];
  // fallback: append anything missing
  const remaining = bullets.filter((b) => !order.includes(b.point_num));
  return [...ordered, ...remaining];
}

export function ResumeTemplate({
  resume,
  match,
}: {
  resume: { work: SectionItem[]; project: SectionItem[] };
  match: { work: MatchOrder[]; projects: MatchOrder[] } | null;
}) {
  const workOrderMap = new Map(match?.work?.map((w) => [w.job_title, w.bullet_order]));
  const projOrderMap = new Map(match?.projects?.map((p) => [p.job_title, p.bullet_order]));

  // show only projects selected by match (2 projects)
  const selectedProjectTitles = match?.projects?.map((p) => p.job_title) ?? [];
  const projectsToRender = resume.project.filter((p) => selectedProjectTitles.includes(p.job_title));

  // keep them in the order backend sent (already latest-first)
  const projectsSorted = selectedProjectTitles
    .map((t) => projectsToRender.find((p) => p.job_title === t))
    .filter(Boolean) as SectionItem[];

  return (
    <div>
      {/* HEADER (fixed) */}
      <div className="text-center">
        <div style={{ fontWeight: 700, letterSpacing: 0.3 }}>JAYNENDER SINGH</div>
        <div style={{ marginTop: 2, fontSize: "10.5pt" }}>
          Boston, MA | +1 (857) 540-4315 | jay22@bu.edu | linkedin.com/in/jaynender-singh/
        </div>
      </div>

      {/* EDUCATION (fixed formatting) */}
      <div style={{ marginTop: 14, fontWeight: 700, borderBottom: "1px solid #000", paddingBottom: 2 }}>
        EDUCATION
      </div>

      <div style={{ marginTop: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 700 }}>M.S. in Business Analytics</div>
            <div style={{ fontStyle: "italic" }}>Boston University, Questrom School of Business, Boston, MA</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div>Expected Jan 2026</div>
            <div>GPA: 3.48/4.0</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <div>
            <div style={{ fontWeight: 700 }}>B.Tech in Mechanical Engineering</div>
            <div style={{ fontStyle: "italic" }}>Vellore Institute of Technology, Vellore, India</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div>May 2022</div>
            <div>GPA: 3.59/4.0</div>
          </div>
        </div>
      </div>

      {/* WORK EXPERIENCE */}
      <div style={{ marginTop: 14, fontWeight: 700, borderBottom: "1px solid #000", paddingBottom: 2 }}>
        WORK EXPERIENCE
      </div>

      <div style={{ marginTop: 8 }}>
        {resume.work.map((job) => {
          const order = workOrderMap.get(job.job_title) ?? job.bullets.map((b) => b.point_num);
          const bullets = reorderBullets(job.bullets, order);

          // Date strings: you can render from section_dates.json later; for now keep blank or hardcode.
          return (
            <div key={job.job_title} style={{ marginBottom: 10 }}>
              {/* job title line */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: 700 }}>{job.job_title}</div>
                {/* optional date right */}
                <div></div>
              </div>

              {/* company/location italic line */}
              <div style={{ fontStyle: "italic" }}>
                {job.company}, {job.location}
              </div>

              {/* bullets */}
              <ul style={{ marginTop: 4, paddingLeft: 18 }}>
                {bullets.map((b) => (
                  <li key={b.point_num} style={{ marginBottom: 2 }}>
                    {b.text}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* PROJECT EXPERIENCE */}
      <div style={{ marginTop: 12, fontWeight: 700, borderBottom: "1px solid #000", paddingBottom: 2 }}>
        PROJECT EXPERIENCE
      </div>

      <div style={{ marginTop: 8 }}>
        {projectsSorted.map((proj) => {
          const order = projOrderMap.get(proj.job_title) ?? proj.bullets.map((b) => b.point_num);
          const bullets = reorderBullets(proj.bullets, order);

          return (
            <div key={proj.job_title} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: 700 }}>{proj.job_title}</div>
                <div></div>
              </div>
              <div style={{ fontStyle: "italic" }}>
                {proj.company}, {proj.location}
              </div>
              <ul style={{ marginTop: 4, paddingLeft: 18 }}>
                {bullets.map((b) => (
                  <li key={b.point_num} style={{ marginBottom: 2 }}>
                    {b.text}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* SKILLS (keep fixed for now) */}
      <div style={{ marginTop: 12, fontWeight: 700, borderBottom: "1px solid #000", paddingBottom: 2 }}>
        SKILLS
      </div>

      <div style={{ marginTop: 6 }}>
        {/* keep as-is for now; you can paste your exact skills line(s) */}
        <div>Python, SQL, BigQuery, Airflow, GCP, Azure DevOps, Terraform, Tableau, Vertex AI</div>
      </div>
    </div>
  );
}
