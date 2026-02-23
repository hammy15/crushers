"use client";

import { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import {
  BarChart3,
  Calendar,
  Clock,
  Target,
  ChevronDown,
  ChevronUp,
  Upload,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

export default function SessionsPage() {
  const { userSessions, userShots, clubStats } = useDemo();
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [selectedClub, setSelectedClub] = useState<string>("All");

  const clubs = ["All", ...clubStats.map((c) => c.club)];
  const filteredStats =
    selectedClub === "All" ? clubStats : clubStats.filter((c) => c.club === selectedClub);

  // Dispersion chart data
  const driverShots = userShots
    .filter((s) => s.club === "Driver")
    .map((s) => ({
      x: s.sideLateral,
      y: s.carry,
      z: s.ballSpeed,
    }));

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Sessions</h1>
          <p className="text-muted mt-1">
            {userSessions.length} sessions &middot;{" "}
            {userShots.length.toLocaleString()} total shots tracked
          </p>
        </div>
        <button className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-accent px-5 py-2.5 rounded-full hover:bg-accent-dark transition-colors">
          <Upload className="w-4 h-4" />
          Upload CSV
        </button>
      </div>

      {/* Club Stats Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          {clubs.map((club) => (
            <button
              key={club}
              onClick={() => setSelectedClub(club)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedClub === club
                  ? "bg-accent text-white"
                  : "bg-white border border-border text-muted hover:text-foreground"
              }`}
            >
              {club}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredStats.map((stat) => (
            <div
              key={stat.club}
              className="bg-white rounded-2xl border border-border p-5 stat-card"
            >
              <p className="text-sm font-semibold text-muted mb-1">{stat.club}</p>
              <p className="text-2xl font-black">{Math.round(stat.avgCarry)}</p>
              <p className="text-xs text-muted">avg carry (yds)</p>
              <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted">Total</p>
                  <p className="text-sm font-bold">{Math.round(stat.avgTotal)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Ball Spd</p>
                  <p className="text-sm font-bold">{stat.avgBallSpeed}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Launch</p>
                  <p className="text-sm font-bold">{stat.avgLaunchAngle}&deg;</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Spin</p>
                  <p className="text-sm font-bold">{stat.avgSpinRate}</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted">
                {stat.shotCount} shots &middot; {Math.round(stat.dispersion)} yd spread
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Club Distance Chart */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-1">Club Distances</h3>
          <p className="text-sm text-muted mb-6">Average carry by club</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clubStats.slice(0, 10).reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="club" tick={{ fontSize: 11, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748B" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                />
                <Bar dataKey="avgCarry" fill="#FF5722" radius={[6, 6, 0, 0]} name="Avg Carry" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Driver Dispersion */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-1">Driver Dispersion</h3>
          <p className="text-sm text-muted mb-6">Lateral vs. carry distance</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Lateral"
                  unit=" yds"
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  domain={[-40, 40]}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Carry"
                  unit=" yds"
                  tick={{ fontSize: 12, fill: "#64748B" }}
                />
                <ZAxis type="number" dataKey="z" range={[30, 80]} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                />
                <Scatter
                  data={driverShots.slice(0, 50)}
                  fill="#FF5722"
                  fillOpacity={0.6}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Session History */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-bold">Session History</h3>
          <p className="text-sm text-muted">Click a session to see shot details</p>
        </div>

        <div className="divide-y divide-border">
          {userSessions.map((session) => {
            const isExpanded = expandedSession === session.id;
            const sessionShots = userShots.filter((s) => s.sessionId === session.id);

            return (
              <div key={session.id}>
                <button
                  onClick={() =>
                    setExpandedSession(isExpanded ? null : session.id)
                  }
                  className="w-full px-6 py-4 flex items-center gap-4 hover:bg-surface-hover transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {new Date(session.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-md font-semibold">
                        Bay {session.bayNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted mt-1">
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {session.shotCount} shots
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Avg {Math.round(session.avgCarry)} yds
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-accent">
                      {Math.round(session.bestDrive)} yds
                    </p>
                    <p className="text-xs text-muted">best drive</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-6 pb-4">
                    <div className="bg-slate-50 rounded-xl p-4 overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 pr-3 font-semibold text-muted">#</th>
                            <th className="text-left py-2 pr-3 font-semibold text-muted">Club</th>
                            <th className="text-right py-2 pr-3 font-semibold text-muted">Carry</th>
                            <th className="text-right py-2 pr-3 font-semibold text-muted">Total</th>
                            <th className="text-right py-2 pr-3 font-semibold text-muted">Ball Spd</th>
                            <th className="text-right py-2 pr-3 font-semibold text-muted">Launch</th>
                            <th className="text-right py-2 pr-3 font-semibold text-muted">Spin</th>
                            <th className="text-right py-2 pr-3 font-semibold text-muted">Club Path</th>
                            <th className="text-right py-2 font-semibold text-muted">Face</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessionShots.slice(0, 15).map((shot) => (
                            <tr key={shot.id} className="border-b border-border/30">
                              <td className="py-2 pr-3 text-muted">{shot.shotNumber}</td>
                              <td className="py-2 pr-3 font-medium">{shot.club}</td>
                              <td className="py-2 pr-3 text-right font-semibold">{Math.round(shot.carry)}</td>
                              <td className="py-2 pr-3 text-right">{Math.round(shot.totalDistance)}</td>
                              <td className="py-2 pr-3 text-right">{shot.ballSpeed}</td>
                              <td className="py-2 pr-3 text-right">{shot.launchAngle}&deg;</td>
                              <td className="py-2 pr-3 text-right">{shot.spinRate}</td>
                              <td className="py-2 pr-3 text-right">{shot.clubPath > 0 ? "+" : ""}{shot.clubPath}&deg;</td>
                              <td className="py-2 text-right">{shot.faceAngle > 0 ? "+" : ""}{shot.faceAngle}&deg;</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {sessionShots.length > 15 && (
                        <p className="text-xs text-muted text-center mt-3">
                          + {sessionShots.length - 15} more shots
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
