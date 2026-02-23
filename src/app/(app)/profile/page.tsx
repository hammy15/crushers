"use client";

import { useDemo } from "@/lib/demo-context";
import { getHandicapLabel } from "@/lib/utils";
import {
  User,
  Target,
  Zap,
  Calendar,
  BarChart3,
  MapPin,
  TrendingUp,
  Award,
  Edit3,
} from "lucide-react";

export default function ProfilePage() {
  const { currentUser, userSessions, userShots, clubStats, strokesGained } = useDemo();

  const totalDriveShots = userShots.filter((s) => s.club === "Driver");
  const avgDriveCarry = totalDriveShots.length
    ? Math.round(totalDriveShots.reduce((a, s) => a + s.carry, 0) / totalDriveShots.length)
    : 0;
  const bestDrive = totalDriveShots.length
    ? Math.round(Math.max(...totalDriveShots.map((s) => s.totalDistance)))
    : 0;
  const avgSmashFactor = totalDriveShots.length
    ? (totalDriveShots.reduce((a, s) => a + s.smashFactor, 0) / totalDriveShots.length).toFixed(2)
    : "0";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Profile</h1>
          <p className="text-muted mt-1">Your golf identity and performance snapshot</p>
        </div>
        <button className="inline-flex items-center gap-2 text-sm font-semibold text-accent bg-accent/10 px-4 py-2 rounded-full hover:bg-accent/20 transition-colors">
          <Edit3 className="w-4 h-4" />
          Edit
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-accent to-orange-400 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
        </div>

        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col md:flex-row items-start gap-5">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold shadow">
                {Math.round(currentUser.handicap)}
              </div>
            </div>

            <div className="flex-1 pt-2">
              <h2 className="text-2xl font-black">{currentUser.name}</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {currentUser.homeFacility}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Member since {new Date(currentUser.joinDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold capitalize">
                  {currentUser.playerType}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Target, label: "Handicap", value: currentUser.handicap, sub: getHandicapLabel(currentUser.handicap), color: "text-accent" },
          { icon: Zap, label: "Driver Speed", value: `${currentUser.swingSpeed}`, sub: "mph average", color: "text-blue-500" },
          { icon: BarChart3, label: "Total Sessions", value: userSessions.length, sub: `${userShots.length.toLocaleString()} shots`, color: "text-emerald-500" },
          { icon: TrendingUp, label: "Target", value: currentUser.targetHandicap, sub: currentUser.primaryGoal, color: "text-purple-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-border p-5 stat-card">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <p className="text-3xl font-black">{stat.value}</p>
            <p className="text-sm font-semibold">{stat.label}</p>
            <p className="text-xs text-muted">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Details Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Physical Profile */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-accent" />
            Physical Profile
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Age", value: `${currentUser.age} years` },
              { label: "Height", value: `${Math.floor(currentUser.height / 12)}'${currentUser.height % 12}"` },
              { label: "Weight", value: `${currentUser.weight} lbs` },
              { label: "Player Type", value: currentUser.playerType },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-muted">{item.label}</p>
                <p className="text-sm font-bold mt-0.5 capitalize">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Highlights */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-accent" />
            Driver Highlights
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Avg Carry", value: `${avgDriveCarry} yds` },
              { label: "Best Drive", value: `${bestDrive} yds` },
              { label: "Club Speed", value: `${currentUser.swingSpeed} mph` },
              { label: "Smash Factor", value: avgSmashFactor },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-muted">{item.label}</p>
                <p className="text-sm font-bold mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-4">Strengths</h3>
          <div className="space-y-2">
            {currentUser.strengths.map((s) => (
              <div
                key={s}
                className="flex items-center gap-2 bg-emerald-50 text-emerald-700 rounded-lg px-4 py-2.5 text-sm font-medium"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-4">Areas to Improve</h3>
          <div className="space-y-2">
            {currentUser.weaknesses.map((w) => (
              <div
                key={w}
                className="flex items-center gap-2 bg-red-50 text-red-700 rounded-lg px-4 py-2.5 text-sm font-medium"
              >
                <div className="w-2 h-2 rounded-full bg-red-400" />
                {w}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strokes Gained Summary */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3 className="font-bold mb-4">Strokes Gained Breakdown</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Off the Tee", value: strokesGained.offTheTee },
            { label: "Approach", value: strokesGained.approach },
            { label: "Short Game", value: strokesGained.aroundTheGreen },
            { label: "Putting", value: strokesGained.putting },
            { label: "Total", value: strokesGained.total },
          ].map((sg) => (
            <div
              key={sg.label}
              className={`rounded-xl p-4 text-center ${
                sg.label === "Total"
                  ? "bg-gradient-to-br from-accent/10 to-orange-50 border border-accent/10"
                  : "bg-slate-50"
              }`}
            >
              <p className="text-xs text-muted">{sg.label}</p>
              <p
                className={`text-2xl font-black mt-1 ${
                  sg.value >= 0 ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {sg.value > 0 ? "+" : ""}
                {sg.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Club Stats Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-bold">Full Club Stats</h3>
          <p className="text-sm text-muted">Averages across all sessions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50">
                <th className="text-left py-3 px-6 font-semibold text-muted">Club</th>
                <th className="text-right py-3 px-4 font-semibold text-muted">Carry</th>
                <th className="text-right py-3 px-4 font-semibold text-muted">Total</th>
                <th className="text-right py-3 px-4 font-semibold text-muted">Ball Speed</th>
                <th className="text-right py-3 px-4 font-semibold text-muted">Launch</th>
                <th className="text-right py-3 px-4 font-semibold text-muted">Spin</th>
                <th className="text-right py-3 px-4 font-semibold text-muted">Club Speed</th>
                <th className="text-right py-3 px-4 font-semibold text-muted">Spread</th>
                <th className="text-right py-3 px-6 font-semibold text-muted">Shots</th>
              </tr>
            </thead>
            <tbody>
              {clubStats.map((stat) => (
                <tr key={stat.club} className="border-b border-border/50 hover:bg-surface-hover transition-colors">
                  <td className="py-3 px-6 font-semibold">{stat.club}</td>
                  <td className="py-3 px-4 text-right font-bold text-accent">{Math.round(stat.avgCarry)}</td>
                  <td className="py-3 px-4 text-right">{Math.round(stat.avgTotal)}</td>
                  <td className="py-3 px-4 text-right">{stat.avgBallSpeed}</td>
                  <td className="py-3 px-4 text-right">{stat.avgLaunchAngle}&deg;</td>
                  <td className="py-3 px-4 text-right">{stat.avgSpinRate}</td>
                  <td className="py-3 px-4 text-right">{stat.avgClubSpeed}</td>
                  <td className="py-3 px-4 text-right text-muted">{Math.round(stat.dispersion)}</td>
                  <td className="py-3 px-6 text-right text-muted">{stat.shotCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
