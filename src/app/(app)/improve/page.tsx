"use client";

import { useDemo } from "@/lib/demo-context";
import {
  TrendingUp,
  Target,
  Clock,
  Users,
  ChevronRight,
  CheckCircle2,
  Circle,
  Flame,
  Lightbulb,
  BarChart3,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  PolarRadiusAxis,
} from "recharts";

export default function ImprovePage() {
  const { currentUser, plan, strokesGained, peerMatches } = useDemo();

  // Radar chart data: your performance vs peer average
  const radarData = [
    {
      subject: "Driving",
      you: Math.max(20, 80 + strokesGained.offTheTee * 20),
      peers: 65,
    },
    {
      subject: "Approach",
      you: Math.max(20, 75 + strokesGained.approach * 15),
      peers: 62,
    },
    {
      subject: "Short Game",
      you: Math.max(20, 70 + strokesGained.aroundTheGreen * 18),
      peers: 60,
    },
    {
      subject: "Putting",
      you: Math.max(20, 78 + strokesGained.putting * 20),
      peers: 68,
    },
    {
      subject: "Consistency",
      you: Math.max(20, 60 + (20 - currentUser.handicap) * 2),
      peers: 55,
    },
    {
      subject: "Distance",
      you: Math.min(95, (currentUser.swingSpeed / 120) * 100),
      peers: 58,
    },
  ];

  // Top 3 peers who made similar improvements
  const improvementPeers = peerMatches
    .filter((m) => m.improvementDelta > 2)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">
          <span className="text-gradient">{plan.title}</span>
        </h1>
        <p className="text-muted mt-1">{plan.description}</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-border p-5 stat-card">
          <Target className="w-5 h-5 text-accent mb-2" />
          <p className="text-2xl font-black">{currentUser.targetHandicap}</p>
          <p className="text-sm font-semibold">Target Handicap</p>
          <p className="text-xs text-muted">from {currentUser.handicap}</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5 stat-card">
          <TrendingUp className="w-5 h-5 text-emerald-500 mb-2" />
          <p className="text-2xl font-black text-emerald-500">-{plan.estimatedImprovement}</p>
          <p className="text-sm font-semibold">Estimated Improvement</p>
          <p className="text-xs text-muted">strokes to gain</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5 stat-card">
          <Clock className="w-5 h-5 text-blue-500 mb-2" />
          <p className="text-2xl font-black">{plan.timeframe}</p>
          <p className="text-sm font-semibold">Timeframe</p>
          <p className="text-xs text-muted">based on peer data</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5 stat-card">
          <Users className="w-5 h-5 text-purple-500 mb-2" />
          <p className="text-2xl font-black">{plan.basedOnPeers}</p>
          <p className="text-sm font-semibold">Peer Sources</p>
          <p className="text-xs text-muted">golfers who did this</p>
        </div>
      </div>

      {/* Radar + Peer Stories */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-1">Your Game Profile</h3>
          <p className="text-sm text-muted mb-4">You vs. peer average (matched group)</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "#64748B" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="You"
                  dataKey="you"
                  stroke="#FF5722"
                  fill="#FF5722"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Radar
                  name="Peers"
                  dataKey="peers"
                  stroke="#94A3B8"
                  fill="#94A3B8"
                  fillOpacity={0.08}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-muted">You</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-slate-300" />
              <span className="text-muted">Peer Average</span>
            </div>
          </div>
        </div>

        {/* Peer Success Stories */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-1">Golfers Who Made This Jump</h3>
          <p className="text-sm text-muted mb-4">Real improvement stories from your matches</p>
          <div className="space-y-4">
            {improvementPeers.length > 0 ? (
              improvementPeers.map((peer) => (
                <div
                  key={peer.user.id}
                  className="bg-gradient-to-br from-emerald-50/50 to-white rounded-xl border border-emerald-100 p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={peer.user.avatar}
                      alt={peer.user.name}
                      className="w-10 h-10 rounded-xl bg-slate-100"
                    />
                    <div>
                      <p className="font-semibold text-sm">{peer.user.name}</p>
                      <p className="text-xs text-muted">
                        {peer.user.handicap} handicap &middot; {peer.user.swingSpeed} mph
                      </p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-sm font-bold text-emerald-600">
                        -{peer.improvementDelta} strokes
                      </p>
                      <p className="text-[10px] text-muted">ahead of you</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{peer.theirJourney}</p>
                  {peer.sharedWeaknesses.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {peer.sharedWeaknesses.map((w) => (
                        <span key={w} className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                          {w}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Building your peer network...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Focus Areas */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Flame className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold">Focus Areas</h2>
        </div>

        <div className="space-y-4">
          {plan.focusAreas.map((area) => {
            const progress = Math.round(
              ((area.currentStat - 20) / (area.targetStat - 20)) * 100,
            );
            return (
              <div
                key={area.name}
                className="bg-white rounded-2xl border border-border p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{area.name}</h3>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          area.priority === "high"
                            ? "bg-red-50 text-red-600"
                            : area.priority === "medium"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {area.priority} priority
                      </span>
                    </div>
                    <p className="text-sm text-muted mt-1">
                      Peer average: {area.peerAverage}{area.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      <span className="font-bold text-accent">{area.currentStat}{area.unit}</span>
                      <span className="text-muted"> &rarr; </span>
                      <span className="font-bold text-emerald-500">{area.targetStat}{area.unit}</span>
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-orange-400 rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                {/* Drills */}
                <div className="grid md:grid-cols-2 gap-3">
                  {area.drills.map((drill) => (
                    <div
                      key={drill.name}
                      className="bg-slate-50 rounded-xl p-4 flex items-start gap-3"
                    >
                      <div className="mt-0.5">
                        <Circle className="w-4 h-4 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{drill.name}</p>
                        <p className="text-xs text-muted mt-1">{drill.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {drill.duration}
                          </span>
                          <span>{drill.frequency}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insight callout */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 text-accent-light" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Key Insight</h3>
            <p className="text-slate-300 leading-relaxed">
              Based on {plan.basedOnPeers} golfers with similar profiles, the fastest path
              from a {currentUser.handicap} to a {currentUser.targetHandicap} handicap is to focus
              on <span className="text-white font-semibold">{currentUser.weaknesses[0]?.toLowerCase()}</span> first.
              {improvementPeers.length > 0
                ? ` ${improvementPeers[0].user.name.split(" ")[0]} dropped ${improvementPeers[0].improvementDelta} strokes by tackling this exact weakness over ${plan.timeframe}.`
                : ` Golfers who fixed this first saw the fastest overall improvement.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
