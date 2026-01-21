"use client";

import { useEffect, useMemo, useState } from "react";
import { ResumePaper } from "@/components/ResumePaper";
import { ResumeTemplate } from "@/components/ResumeTemplate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:9000";

type Bullet = { point_num: number; text: string };
type SectionItem = {
  job_title: string;
  company: string;
  location: string;
  bullets: Bullet[];
  dates?: { start: string; end: string } | null;
};

type ResumeResponse = {
  work: SectionItem[];
  project: SectionItem[];
};

type MatchOrder = {
  job_title: string;
  bullet_order: number[];
};

type MatchResponse = {
  profile: string;
  keywords_used: string[];
  work: MatchOrder[];
  projects: MatchOrder[];
};

export default function Home() {
  const [profile] = useState<"data_engineer">("data_engineer");

  const [resume, setResume] = useState<ResumeResponse | null>(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);

  const [jd, setJd] = useState("");
  const [match, setMatch] = useState<MatchResponse | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);

  // 1) Load resume content once
  useEffect(() => {
    async function loadResume() {
      setResumeLoading(true);
      setResumeError(null);

      try {
        const res = await fetch(`${API_BASE}/resume?profile=${profile}`);
        if (!res.ok) throw new Error(await res.text());
        const data = (await res.json()) as ResumeResponse;
        setResume(data);
      } catch (e: any) {
        setResumeError(e.message || "Failed to load resume");
      } finally {
        setResumeLoading(false);
      }
    }

    loadResume();
  }, [profile]);

  // 2) Generate ordering (reorder bullets + pick top 2 projects)
  async function runMatch() {
    setMatchLoading(true);
    setMatchError(null);
    setMatch(null);

    try {
      const res = await fetch(`${API_BASE}/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, job_description: jd }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as MatchResponse;
      setMatch(data);
    } catch (e: any) {
      setMatchError(e.message || "Failed to generate match");
    } finally {
      setMatchLoading(false);
    }
  }

  const keywordsPreview = useMemo(() => {
    if (!match?.keywords_used?.length) return "";
    return match.keywords_used.join(", ");
  }, [match]);

  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">ApplyEZ</h1>
          <p className="text-sm text-muted-foreground">
            Paste the job description → backend reorders bullets + selects top 2 projects.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* LEFT: controls */}
          <div className="no-print space-y-6">
            <Tabs defaultValue="resume" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="resume">Resume Match</TabsTrigger>
                <TabsTrigger value="story">Cover Story</TabsTrigger>
              </TabsList>

              {/* Resume Match tab */}
              <TabsContent value="resume" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Description</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={jd}
                      onChange={(e) => setJd(e.target.value)}
                      placeholder="Paste the job description here..."
                      className="min-h-[220px]"
                    />

                    <Button
                      onClick={runMatch}
                      disabled={!jd.trim() || matchLoading || resumeLoading || !resume}
                      className="w-full"
                    >
                      {matchLoading ? "Generating..." : "Generate best-fit ordering"}
                    </Button>

                    {resumeLoading && (
                      <div className="rounded-md border bg-white p-3 text-sm">
                        Loading resume content...
                      </div>
                    )}

                    {resumeError && (
                      <div className="rounded-md border bg-white p-3 text-sm">
                        <b>Resume load error:</b> {resumeError}
                      </div>
                    )}

                    {matchError && (
                      <div className="rounded-md border bg-white p-3 text-sm">
                        <b>Match error:</b> {matchError}
                      </div>
                    )}

                    {!!keywordsPreview && (
                      <div className="rounded-md border bg-white p-3 text-sm">
                        <b>Keywords used:</b> {keywordsPreview}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Cover Story tab (placeholder for now) */}
              <TabsContent value="story" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Cover Story (next)</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    We’ll wire this next after the resume layout is perfect. Same idea:
                    JD + your story → backend returns rewritten story.
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT: resume preview */}
          <div>
            {resume ? (
              <ResumePaper>
                <ResumeTemplate resume={resume} match={match} profile={profile} />
              </ResumePaper>
            ) : (
              <div className="rounded-md border bg-white p-4 text-sm">
                {resumeLoading ? "Loading resume..." : "Resume not loaded yet."}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}


