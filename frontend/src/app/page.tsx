"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

export default function Home() {
  const [jd1, setJd1] = useState("");
  const [matchResult, setMatchResult] = useState<any>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);

  const [jd2, setJd2] = useState("");
  const [story, setStory] = useState("");
  const [storyResult, setStoryResult] = useState<any>(null);
  const [storyLoading, setStoryLoading] = useState(false);
  const [storyError, setStoryError] = useState<string | null>(null);

  async function runMatch() {
    setMatchLoading(true);
    setMatchError(null);
    setMatchResult(null);

    try {
      const res = await fetch(`${API_BASE}/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_description: jd1 }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      setMatchResult(await res.json());
    } catch (e: any) {
      setMatchError(e.message || "Something went wrong");
    } finally {
      setMatchLoading(false);
    }
  }

  async function runCoverStory() {
    setStoryLoading(true);
    setStoryError(null);
    setStoryResult(null);

    try {
      const res = await fetch(`${API_BASE}/cover-story`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_description: jd2, my_story: story }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      setStoryResult(await res.json());
    } catch (e: any) {
      setStoryError(e.message || "Something went wrong");
    } finally {
      setStoryLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">ApplyEZ</h1>
        <p className="text-sm text-muted-foreground">
          Paste the job description, then generate best-fit bullets and a tailored cover story.
        </p>
      </div>

      <Tabs defaultValue="match" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="match">Best-fit Experience</TabsTrigger>
          <TabsTrigger value="story">Cover Story</TabsTrigger>
        </TabsList>

        <TabsContent value="match" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={jd1}
                onChange={(e) => setJd1(e.target.value)}
                placeholder="Paste the job description here..."
                className="min-h-[180px]"
              />

              <Button onClick={runMatch} disabled={!jd1.trim() || matchLoading}>
                {matchLoading ? "Generating..." : "Generate best-fit bullets"}
              </Button>

              {matchError && (
                <div className="rounded-md border p-3 text-sm">
                  <b>Error:</b> {matchError}
                </div>
              )}

              {matchResult && (
                <div className="rounded-md border p-3">
                  <div className="text-sm font-medium mb-2">Result (raw JSON for now)</div>
                  <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(matchResult, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="story" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cover Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={jd2}
                onChange={(e) => setJd2(e.target.value)}
                placeholder="Paste the job description here..."
                className="min-h-[140px]"
              />

              <Textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Paste your raw story here (your background, motivation, achievements)..."
                className="min-h-[140px]"
              />

              <Button
                onClick={runCoverStory}
                disabled={!jd2.trim() || !story.trim() || storyLoading}
              >
                {storyLoading ? "Rewriting..." : "Rewrite story for cover letter"}
              </Button>

              {storyError && (
                <div className="rounded-md border p-3 text-sm">
                  <b>Error:</b> {storyError}
                </div>
              )}

              {storyResult && (
                <div className="rounded-md border p-3">
                  <div className="text-sm font-medium mb-2">Output</div>
                  <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(storyResult, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
