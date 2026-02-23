"use client";

import { useDemo } from "@/lib/demo-context";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  BarChart3,
  Users,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export default function DashboardPage() {
  const { currentUser, userSessions, clubStats, strokesGained, peerMatches, plan } = useDemo();

  // Build trend data from sessions (sorted oldest to newest)
  const trendData = [...userSessions]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((s) => ({
      date: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      avgCarry: Math.round(s.avgCarry),
      ballSpeed: Math.round(s.avgBallSpeed),
      shots: s.shotCount,
    }));

  const topClubs = clubStats.slice(0, 6);
  const clubChartData = topClubs.map((c) => ({
    club: c.club,
    carry: c.avgCarry,
    total: c.avgTotal,
  }));

  const sgData = [
    { name: "Off Tee", value: strokesGained.offTheTee, color: strokesGained.offTheTee >= 0 ? "#10B981" : "#EF4444" },
    { name: "Approach", value: strokesGained.approach, color: strokesGained.approach >= 0 ? "#10B981" : "#EF4444" },
    { name: "Short Game", value: strokesGained.aroundTheGreen, color: strokesGained.aroundTheGreen >= 0 ? "#10B981" : "#EF4444" },
    { name: "Putting", value: strokesGained.putting, color: strokesGained.putting >= 0 ? "#10B981" : "#EF4444" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">
          Welcome back
          <span className="text-gradient">{currentUser.name === "You (Demo)" ? "" : `, ${currentUser.name.split(" ")[0]}`}</span>
        </h1>
        <p className="text-muted mt-1">
          Current handicap: <span className="font-semibold text-foreground">{currentUser.handicap}</span> &middot; Target: <span className="font-semibold text-accent">{currentUser.targetHandicap}</span>
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Handicap",
            value: currentUser.handicap.toString(),
            sub: `Target: ${currentUser.targetHandicap}`,
            icon: Target,
            trend: "down",
            color: "text-emerald-500",
          },
          {
            label: "Avg. Carry",
            value: `${Math.round(userSessions[0]?.avgCarry || 0)}`,
            sub: "yards (last session)",
            icon: Zap,
            trend: "up",
            color: "text-accent",
          },
          {
            label: "Sessions",
            value: userSessions.length.toString(),
            sub: "total tracked",
            icon: BarChart3,
            trend: "up",
            color: "text-blue-500",
          },
          {
            label: "Peer Matches",
            value: peerMatches.length.toString(),
            sub: "golfers like you",
            icon: Users,
            trend: "up",
            color: "text-purple-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-border p-5 stat-card"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              {stat.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-emerald-500" />
              )}
            </div>
            <p className="text-3xl font-black">{stat.value}</p>
            <p className="text-xs text-muted mt-1">{stat.sub}</p>
            <p className="text-sm font-semibold mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Carry Trend */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold">Carry Distance Trend</h3>
              <p className="text-sm text-muted">All clubs average per session</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="carryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF5722" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#FF5722" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748B" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avgCarry"
                  stroke="#FF5722"
                  strokeWidth={2}
                  fill="url(#carryGradient)"
                  name="Avg Carry (yds)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Club Distances */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold">Club Distances</h3>
              <p className="text-sm text-muted">Average carry vs total</p>
            </div>
            <Link href="/sessions" className="text-sm text-accent font-medium flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clubChartData}>
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
                <Bar dataKey="carry" fill="#FF5722" radius={[4, 4, 0, 0]} name="Carry" />
                <Bar dataKey="total" fill="#FFB74D" radius={[4, 4, 0, 0]} name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strokes Gained + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Strokes Gained */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold">Strokes Gained</h3>
              <p className="text-sm text-muted">vs. scratch golfer baseline</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-gradient">{strokesGained.total > 0 ? "+" : ""}{strokesGained.total}</p>
              <p className="text-xs text-muted">Total SG</p>
            </div>
          </div>

          <div className="space-y-4">
            {sgData.map((sg) => (
              <div key={sg.name} className="flex items-center gap-4">
                <span className="text-sm font-medium w-24 shrink-0">{sg.name}</span>
                <div className="flex-1 h-8 bg-slate-50 rounded-lg relative overflow-hidden">
                  <div
                    className="absolute top-0 h-full rounded-lg transition-all"
                    style={{
                      backgroundColor: sg.color,
                      width: `${Math.min(Math.abs(sg.value) * 15, 100)}%`,
                      left: sg.value >= 0 ? "50%" : `${50 - Math.abs(sg.value) * 15}%`,
                      opacity: 0.8,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold" style={{ color: sg.color }}>
                      {sg.value > 0 ? "+" : ""}{sg.value}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Link
            href="/matching"
            className="block bg-white rounded-2xl border border-border p-5 hover:shadow-md transition-shadow group"
          >
            <Users className="w-5 h-5 text-accent mb-3" />
            <h4 className="font-bold text-sm">Find Peer Matches</h4>
            <p className="text-xs text-muted mt-1">
              {peerMatches.length} golfers share your profile
            </p>
            <div className="flex items-center gap-1 text-xs text-accent font-medium mt-3 group-hover:gap-2 transition-all">
              View Matches <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          <Link
            href="/improve"
            className="block bg-gradient-to-br from-accent/5 to-orange-50 rounded-2xl border border-accent/10 p-5 hover:shadow-md transition-shadow group"
          >
            <TrendingUp className="w-5 h-5 text-accent mb-3" />
            <h4 className="font-bold text-sm">{plan.title}</h4>
            <p className="text-xs text-muted mt-1">
              Based on {plan.basedOnPeers} similar golfers
            </p>
            <div className="flex items-center gap-1 text-xs text-accent font-medium mt-3 group-hover:gap-2 transition-all">
              View Plan <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          <div className="bg-white rounded-2xl border border-border p-5">
            <h4 className="font-bold text-sm mb-3">Top Weaknesses</h4>
            <div className="space-y-2">
              {currentUser.weaknesses.map((w) => (
                <div
                  key={w}
                  className="flex items-center gap-2 text-xs bg-red-50 text-red-700 rounded-lg px-3 py-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {w}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold">Recent Sessions</h3>
          <Link href="/sessions" className="text-sm text-accent font-medium flex items-center gap-1">
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-semibold text-muted py-3 pr-4">Date</th>
                <th className="text-left font-semibold text-muted py-3 pr-4">Bay</th>
                <th className="text-right font-semibold text-muted py-3 pr-4">Shots</th>
                <th className="text-right font-semibold text-muted py-3 pr-4">Avg Carry</th>
                <th className="text-right font-semibold text-muted py-3 pr-4">Ball Speed</th>
                <th className="text-right font-semibold text-muted py-3">Best Drive</th>
              </tr>
            </thead>
            <tbody>
              {userSessions.slice(0, 5).map((session) => (
                <tr key={session.id} className="border-b border-border/50 hover:bg-surface-hover transition-colors">
                  <td className="py-3 pr-4 font-medium">
                    {new Date(session.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-semibold">
                      Bay {session.bayNumber}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right">{session.shotCount}</td>
                  <td className="py-3 pr-4 text-right font-semibold">{Math.round(session.avgCarry)} yds</td>
                  <td className="py-3 pr-4 text-right">{session.avgBallSpeed} mph</td>
                  <td className="py-3 text-right font-bold text-accent">{Math.round(session.bestDrive)} yds</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
