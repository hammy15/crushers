"use client";

import { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import {
  Users,
  ChevronRight,
  Target,
  Zap,
  TrendingUp,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { getHandicapLabel } from "@/lib/utils";

export default function MatchingPage() {
  const { currentUser, peerMatches } = useDemo();
  const [sortBy, setSortBy] = useState<"matchScore" | "handicap" | "swingSpeed">("matchScore");
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  const sorted = [...peerMatches].sort((a, b) => {
    if (sortBy === "matchScore") return b.matchScore - a.matchScore;
    if (sortBy === "handicap") return a.user.handicap - b.user.handicap;
    return b.user.swingSpeed - a.user.swingSpeed;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">Peer Matching</h1>
        <p className="text-muted mt-1">
          Golfers matched to your profile — handicap, build, swing speed, and weaknesses
        </p>
      </div>

      {/* Your Profile Summary */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-4">Your Profile</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Handicap", value: currentUser.handicap, sub: getHandicapLabel(currentUser.handicap) },
            { label: "Swing Speed", value: `${currentUser.swingSpeed} mph`, sub: "Driver avg" },
            { label: "Age", value: currentUser.age, sub: "years" },
            { label: "Height", value: `${Math.floor(currentUser.height / 12)}'${currentUser.height % 12}"`, sub: `${currentUser.weight} lbs` },
            { label: "Type", value: currentUser.playerType, sub: currentUser.primaryGoal },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-xs text-muted font-medium">{stat.label}</p>
              <p className="text-lg font-bold capitalize">{stat.value}</p>
              <p className="text-xs text-muted">{stat.sub}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted font-medium mb-2">Weaknesses we&apos;re matching on:</p>
          <div className="flex flex-wrap gap-2">
            {currentUser.weaknesses.map((w) => (
              <span key={w} className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded-full font-medium">
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-muted" />
        <span className="text-sm text-muted">Sort by:</span>
        {[
          { key: "matchScore" as const, label: "Best Match" },
          { key: "handicap" as const, label: "Handicap" },
          { key: "swingSpeed" as const, label: "Swing Speed" },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={`text-sm px-4 py-1.5 rounded-full font-medium transition-colors ${
              sortBy === opt.key
                ? "bg-accent text-white"
                : "bg-white border border-border text-muted hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Match Cards */}
      <div className="space-y-4">
        {sorted.map((match) => {
          const isExpanded = expandedMatch === match.user.id;

          return (
            <div
              key={match.user.id}
              className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setExpandedMatch(isExpanded ? null : match.user.id)}
                className="w-full p-5 flex items-center gap-4 text-left"
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={match.user.avatar}
                    alt={match.user.name}
                    className="w-14 h-14 rounded-2xl bg-slate-100"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                      match.matchScore >= 80
                        ? "bg-emerald-500"
                        : match.matchScore >= 60
                          ? "bg-amber-500"
                          : "bg-slate-400"
                    }`}
                  >
                    {match.matchScore}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{match.user.name}</h3>
                    <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-md font-semibold capitalize">
                      {match.user.playerType}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted mt-1">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {match.user.handicap} handicap
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {match.user.swingSpeed} mph
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {match.user.age} yrs &middot; {Math.floor(match.user.height / 12)}&apos;{match.user.height % 12}&quot;
                    </span>
                  </div>
                </div>

                {/* Match Reasons Preview */}
                <div className="hidden md:flex flex-wrap gap-1.5 max-w-xs">
                  {match.matchReasons.slice(0, 2).map((reason) => (
                    <span
                      key={reason}
                      className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full"
                    >
                      {reason}
                    </span>
                  ))}
                </div>

                <ChevronRight
                  className={`w-5 h-5 text-muted shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                />
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-border pt-4">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Why matched */}
                    <div>
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Why You Match</p>
                      <div className="space-y-2">
                        {match.matchReasons.map((reason) => (
                          <div key={reason} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {reason}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shared weaknesses */}
                    <div>
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                        Shared Weaknesses
                      </p>
                      {match.sharedWeaknesses.length > 0 ? (
                        <div className="space-y-2">
                          {match.sharedWeaknesses.map((w) => (
                            <div key={w} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              {w}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted">No shared weaknesses</p>
                      )}
                    </div>

                    {/* Their journey */}
                    <div>
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                        Their Journey
                      </p>
                      <div className="bg-gradient-to-br from-accent/5 to-orange-50 rounded-xl p-4">
                        <TrendingUp className="w-5 h-5 text-accent mb-2" />
                        <p className="text-sm leading-relaxed">{match.theirJourney}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Comparison */}
                  <div className="mt-5 pt-5 border-t border-border">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                      Head to Head
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Handicap", you: currentUser.handicap, them: match.user.handicap },
                        { label: "Swing Speed", you: currentUser.swingSpeed, them: match.user.swingSpeed },
                        { label: "Sessions", you: currentUser.totalSessions, them: match.user.totalSessions },
                        { label: "Goal", you: currentUser.targetHandicap, them: match.user.targetHandicap },
                      ].map((comp) => (
                        <div key={comp.label} className="bg-slate-50 rounded-xl p-3 text-center">
                          <p className="text-xs text-muted mb-2">{comp.label}</p>
                          <div className="flex items-center justify-center gap-3">
                            <div>
                              <p className="text-sm font-bold text-accent">{comp.you}</p>
                              <p className="text-[10px] text-muted">You</p>
                            </div>
                            <ArrowUpDown className="w-3 h-3 text-muted" />
                            <div>
                              <p className="text-sm font-bold">{comp.them}</p>
                              <p className="text-[10px] text-muted">Them</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
