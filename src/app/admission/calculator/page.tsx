"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { mapMerit } from "@/lib/supabase/mappers";
import type { MeritHistory, ProgramType } from "@/lib/types";
import {
  calculateNatAggregate,
  calculateNuAggregate,
  calculateSatAggregate,
} from "@/lib/calculator/aggregateFormulas";
import { CAMPUSES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Tab = "nat" | "nu" | "sat" | "merit";

export default function CalculatorPage() {
  const [tab, setTab] = useState<Tab>("nu");
  const [programType, setProgramType] = useState<ProgramType>("computing");
  const [matric, setMatric] = useState("");
  const [fsc, setFsc] = useState("");
  const [natMarks, setNatMarks] = useState("");
  const [correct, setCorrect] = useState("");
  const [wrong, setWrong] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("100");
  const [satScore, setSatScore] = useState("");
  const [meritData, setMeritData] = useState<MeritHistory[]>([]);
  const [meritCampus, setMeritCampus] = useState("all");
  const [meritProgram, setMeritProgram] = useState("all");

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    getSupabase()
      .from("merit_history")
      .select("*")
      .order("year", { ascending: false })
      .then(({ data }) => {
        setMeritData((data ?? []).map((row) => mapMerit(row)));
      });
  }, []);

  const matricNum = parseFloat(matric) || 0;
  const fscNum = parseFloat(fsc) || 0;

  const natResult = calculateNatAggregate(
    matricNum,
    fscNum,
    parseFloat(natMarks) || 0,
    programType
  );

  const nuResult = calculateNuAggregate(
    matricNum,
    fscNum,
    parseInt(correct) || 0,
    parseInt(wrong) || 0,
    parseInt(totalQuestions) || 100,
    programType
  );

  const satResult = calculateSatAggregate(
    matricNum,
    fscNum,
    parseFloat(satScore) || 0,
    programType
  );

  const userAggregate =
    tab === "nat"
      ? natResult
      : tab === "sat"
        ? satResult
        : nuResult.aggregate;

  const filteredMerit = meritData.filter((m) => {
    if (meritCampus !== "all" && m.campus !== meritCampus) return false;
    if (meritProgram !== "all" && m.program !== meritProgram) return false;
    return true;
  });

  const programs = [...new Set(meritData.map((m) => m.program))];

  const tabs: { id: Tab; label: string }[] = [
    { id: "nu", label: "NU Marks" },
    { id: "nat", label: "NAT Marks" },
    { id: "sat", label: "SAT" },
    { id: "merit", label: "Merit List" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Aggregate Calculator</h1>
        <p className="mt-2 text-muted-foreground">
          Calculate your FAST NUCES admission scores
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/">
          <Button variant="ghost" size="sm">
            Home
          </Button>
        </Link>
        {tabs.map((t) => (
          <Button
            key={t.id}
            variant={tab === t.id ? "default" : "outline"}
            size="sm"
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </Button>
        ))}
        <Link href="/admission/faq">
          <Button variant="outline" size="sm">
            Admission FAQ
          </Button>
        </Link>
      </div>

      {tab !== "merit" && (
        <div className="mb-6">
          <Label>Program Type</Label>
          <div className="mt-2 flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={programType === "computing"}
                onChange={() => setProgramType("computing")}
              />
              Computing / Business (10/40/50)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={programType === "engineering"}
                onChange={() => setProgramType("engineering")}
              />
              Engineering PEC (17/50/33)
            </label>
          </div>
        </div>
      )}

      {tab === "nu" && (
        <Card>
          <CardHeader>
            <CardTitle>NU Marks Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Negative marking: +1 correct, −0.25 wrong, 0 unattempted
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Matric %</Label>
                <Input
                  type="number"
                  value={matric}
                  onChange={(e) => setMatric(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <Label>FSc Part-1 %</Label>
                <Input
                  type="number"
                  value={fsc}
                  onChange={(e) => setFsc(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <Label>Correct MCQs</Label>
                <Input
                  type="number"
                  value={correct}
                  onChange={(e) => setCorrect(e.target.value)}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Wrong MCQs</Label>
                <Input
                  type="number"
                  value={wrong}
                  onChange={(e) => setWrong(e.target.value)}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Total Questions</Label>
                <Input
                  type="number"
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(e.target.value)}
                  min="1"
                />
              </div>
            </div>
            <div className="rounded-xl bg-vault-navy p-6 text-white">
              <p>NU Test Score: {nuResult.nuScore.toFixed(2)}</p>
              <p>NU Test %: {nuResult.nuPercent.toFixed(2)}%</p>
              <p className="mt-2 text-2xl font-bold text-vault-gold">
                Aggregate: {nuResult.aggregate.toFixed(2)}%
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "nat" && (
        <Card>
          <CardHeader>
            <CardTitle>NAT Marks Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Matric %</Label>
                <Input
                  type="number"
                  value={matric}
                  onChange={(e) => setMatric(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>FSc %</Label>
                <Input
                  type="number"
                  value={fsc}
                  onChange={(e) => setFsc(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>NAT Marks (out of 100)</Label>
                <Input
                  type="number"
                  value={natMarks}
                  onChange={(e) => setNatMarks(e.target.value)}
                />
              </div>
            </div>
            <div className="rounded-xl bg-vault-navy p-6 text-white">
              <p className="text-2xl font-bold text-vault-gold">
                Aggregate: {natResult.toFixed(2)}%
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "sat" && (
        <Card>
          <CardHeader>
            <CardTitle>SAT Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Matric %</Label>
                <Input
                  type="number"
                  value={matric}
                  onChange={(e) => setMatric(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>FSc %</Label>
                <Input
                  type="number"
                  value={fsc}
                  onChange={(e) => setFsc(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>SAT Score (out of 1600)</Label>
                <Input
                  type="number"
                  value={satScore}
                  onChange={(e) => setSatScore(e.target.value)}
                  max="1600"
                />
              </div>
            </div>
            <div className="rounded-xl bg-vault-navy p-6 text-white">
              <p className="text-2xl font-bold text-vault-gold">
                Aggregate: {satResult.toFixed(2)}%
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "merit" && (
        <Card>
          <CardHeader>
            <CardTitle>Campus & Program Merit</CardTitle>
          </CardHeader>
          <CardContent>
            {matric && fsc && (
              <div className="mb-4 rounded-lg bg-vault-gold/10 p-4 text-sm">
                Your calculated aggregate (from calculator tabs):{" "}
                <strong>{userAggregate.toFixed(2)}%</strong> — compare against
                closing merits below.
              </div>
            )}
            <div className="mb-4 flex gap-4">
              <select
                value={meritCampus}
                onChange={(e) => setMeritCampus(e.target.value)}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                <option value="all">All Campuses</option>
                {CAMPUSES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                value={meritProgram}
                onChange={(e) => setMeritProgram(e.target.value)}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                <option value="all">All Programs</option>
                {programs.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            {filteredMerit.length === 0 ? (
              <p className="text-muted-foreground">
                No merit data available. Admin can add historical merit records.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left">Campus</th>
                      <th className="py-2 text-left">Program</th>
                      <th className="py-2 text-left">Year</th>
                      <th className="py-2 text-right">Closing Merit</th>
                      <th className="py-2 text-right">Your Chances</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMerit.map((m) => {
                      const meetsMerit =
                        matric && fsc && userAggregate >= m.closing_merit;
                      return (
                      <tr key={m.id} className="border-b">
                        <td className="py-2">{m.campus}</td>
                        <td className="py-2">{m.program}</td>
                        <td className="py-2">{m.year}</td>
                        <td className="py-2 text-right font-semibold">
                          {m.closing_merit}%
                        </td>
                        <td className={`py-2 text-right font-medium ${matric && fsc ? (meetsMerit ? "text-green-600" : "text-red-600") : "text-muted-foreground"}`}>
                          {!matric || !fsc
                            ? "—"
                            : meetsMerit
                              ? "Above cutoff"
                              : "Below cutoff"}
                        </td>
                      </tr>
                    );})}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
