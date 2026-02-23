"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Users,
  CalendarDays,
  BarChart3,
  Zap,
  Eye,
  Trash2,
  ChevronDown,
  ChevronRight,
  LogOut,
  Search,
  X,
  Activity,
  DollarSign,
  TrendingUp,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { DemoProvider, useDemo } from "@/lib/demo-context";
import { cn } from "@/lib/utils";
import { formatHour } from "@/lib/utils";

// ─── Login Gate ───
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (user === "admin" && pass === "jed2025") {
      localStorage.setItem("crushers-admin", "1");
      onLogin();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, x: shake ? [0, -8, 8, -8, 8, 0] : 0 }}
        transition={shake ? { duration: 0.4 } : { duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Admin Access</h1>
          <p className="text-sm text-slate-400 mt-1">Crushers God Mode</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={user}
            onChange={(e) => { setUser(e.target.value); setError(false); }}
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-slate-800 border-2 text-white text-sm font-medium placeholder:text-slate-500 outline-none transition-colors",
              error ? "border-red-500" : "border-slate-700 focus:border-red-500",
            )}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => { setPass(e.target.value); setError(false); }}
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-slate-800 border-2 text-white text-sm font-medium placeholder:text-slate-500 outline-none transition-colors",
              error ? "border-red-500" : "border-slate-700 focus:border-red-500",
            )}
          />
          {error && (
            <p className="text-xs text-red-400 font-medium">Invalid credentials</p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-red-500/20 transition-all"
          >
            Enter God Mode
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Admin Panel (wrapped in DemoProvider) ───
function AdminPanelInner() {
  const { users, sessions, shots, bookings, cancelBooking, currentUser } = useDemo();
  const [tab, setTab] = useState<"overview" | "users" | "bookings" | "sessions">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [deletedBookings, setDeletedBookings] = useState<Set<string>>(new Set());

  function handleLogout() {
    localStorage.removeItem("crushers-admin");
    window.location.reload();
  }

  // Stats
  const totalRevenue = bookings.length * 45;
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayBookings = bookings.filter((b) => b.date === todayStr);
  const avgHandicap = users.length ? (users.reduce((a, u) => a + u.handicap, 0) / users.length).toFixed(1) : "0";
  const totalShots = shots.length;

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.includes(q),
    );
  }, [users, searchQuery]);

  // Sorted bookings (newest first)
  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => b.date.localeCompare(a.date) || b.hour - a.hour),
    [bookings],
  );

  // Sorted sessions
  const sortedSessions = useMemo(
    () => [...sessions].sort((a, b) => b.date.localeCompare(a.date)),
    [sessions],
  );

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: Activity },
    { id: "users" as const, label: `Users (${users.length})`, icon: Users },
    { id: "bookings" as const, label: `Bookings (${bookings.length})`, icon: CalendarDays },
    { id: "sessions" as const, label: `Sessions (${sessions.length})`, icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-black tracking-wide">CRUSHERS ADMIN</span>
            <span className="hidden sm:inline text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
              God Mode
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-slate-900 rounded-xl p-1 mb-6 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                tab === t.id
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-300",
              )}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* ─── OVERVIEW TAB ─── */}
        {tab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Total Users", value: users.length.toString(), icon: Users, color: "from-blue-500 to-cyan-500" },
                { label: "Total Bookings", value: bookings.length.toString(), icon: CalendarDays, color: "from-violet-500 to-purple-500" },
                { label: "Est. Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "from-emerald-500 to-teal-500" },
                { label: "Shots Tracked", value: totalShots.toLocaleString(), icon: Zap, color: "from-amber-500 to-orange-500" },
              ].map((s) => (
                <div key={s.label} className="bg-slate-900 rounded-xl border border-slate-800 p-4">
                  <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3", s.color)}>
                    <s.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-2xl font-black">{s.value}</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Today's Bookings", value: todayBookings.length.toString() },
                { label: "Avg Handicap", value: avgHandicap },
                { label: "Total Sessions", value: sessions.length.toString() },
                { label: "Bays Active", value: "3/3" },
              ].map((s) => (
                <div key={s.label} className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-3 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">{s.label}</span>
                  <span className="text-sm font-black text-white">{s.value}</span>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-bold">Recent Bookings</span>
              </div>
              <div className="divide-y divide-slate-800/50">
                {sortedBookings.slice(0, 8).map((b) => (
                  <div key={b.id} className="px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">
                        B{b.bayNumber}
                      </div>
                      <div>
                        <p className="text-xs font-bold">{b.userName}</p>
                        <p className="text-[10px] text-slate-500">{b.date} · {formatHour(b.hour)}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400">$45</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── USERS TAB ─── */}
        {tab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search users by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-600 outline-none focus:border-slate-600"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              )}
            </div>

            {/* User List */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-800 grid grid-cols-[1fr_80px_80px_80px_60px] gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <span>User</span>
                <span className="text-center">HCP</span>
                <span className="text-center">Speed</span>
                <span className="text-center">Sessions</span>
                <span className="text-center">Type</span>
              </div>
              <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-800/30">
                {filteredUsers.map((u) => {
                  const isExpanded = expandedUser === u.id;
                  const userSessions = sessions.filter((s) => s.userId === u.id);
                  const userBookings = bookings.filter((b) => b.userId === u.id);

                  return (
                    <div key={u.id}>
                      <button
                        onClick={() => setExpandedUser(isExpanded ? null : u.id)}
                        className="w-full px-4 py-2.5 grid grid-cols-[1fr_80px_80px_80px_60px] gap-2 items-center hover:bg-slate-800/30 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={u.avatar}
                            alt=""
                            className="w-7 h-7 rounded-lg bg-slate-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate">{u.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-center">{u.handicap}</span>
                        <span className="text-xs font-bold text-center">{u.swingSpeed}</span>
                        <span className="text-xs font-bold text-center">{userSessions.length}</span>
                        <span className={cn(
                          "text-[10px] font-bold text-center uppercase",
                          u.playerType === "competitive" ? "text-red-400" : u.playerType === "casual" ? "text-blue-400" : "text-slate-500",
                        )}>
                          {u.playerType.slice(0, 4)}
                        </span>
                      </button>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-3 pt-1 bg-slate-800/20">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                                <div><span className="text-slate-500">ID:</span> <span className="font-mono text-[10px]">{u.id.slice(0, 12)}...</span></div>
                                <div><span className="text-slate-500">Age:</span> <span className="font-bold">{u.age}</span></div>
                                <div><span className="text-slate-500">Height:</span> <span className="font-bold">{Math.floor(u.height / 12)}&apos;{u.height % 12}&quot;</span></div>
                                <div><span className="text-slate-500">Weight:</span> <span className="font-bold">{u.weight} lbs</span></div>
                                <div><span className="text-slate-500">Target HCP:</span> <span className="font-bold text-emerald-400">{u.targetHandicap}</span></div>
                                <div><span className="text-slate-500">Goal:</span> <span className="font-bold">{u.primaryGoal}</span></div>
                                <div><span className="text-slate-500">Bookings:</span> <span className="font-bold">{userBookings.length}</span></div>
                                <div><span className="text-slate-500">Joined:</span> <span className="font-bold">{u.joinDate}</span></div>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {u.strengths.map((s) => (
                                  <span key={s} className="text-[9px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">{s}</span>
                                ))}
                                {u.weaknesses.map((w) => (
                                  <span key={w} className="text-[9px] font-bold bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">{w}</span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── BOOKINGS TAB ─── */}
        {tab === "bookings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Bay summary */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {([1, 2, 3] as const).map((bay) => {
                const bayBookings = bookings.filter((b) => b.date === todayStr && b.bayNumber === bay);
                return (
                  <div key={bay} className="bg-slate-900 rounded-xl border border-slate-800 p-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bay {bay} Today</p>
                    <p className="text-xl font-black mt-1">{bayBookings.length}<span className="text-xs text-slate-500 font-medium"> bookings</span></p>
                  </div>
                );
              })}
            </div>

            {/* Bookings Table */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-800 grid grid-cols-[1fr_60px_80px_80px_40px] gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <span>Member</span>
                <span className="text-center">Bay</span>
                <span className="text-center">Date</span>
                <span className="text-center">Time</span>
                <span />
              </div>
              <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-800/30">
                {sortedBookings.map((b) => (
                  <div key={b.id} className="px-4 py-2 grid grid-cols-[1fr_60px_80px_80px_40px] gap-2 items-center hover:bg-slate-800/20 transition-colors">
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{b.userName}</p>
                      <p className="text-[10px] text-slate-500 truncate">{b.userId.slice(0, 10)}...</p>
                    </div>
                    <div className="text-center">
                      <span className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded-full",
                        b.bayNumber === 1 ? "bg-blue-500/10 text-blue-400"
                          : b.bayNumber === 2 ? "bg-violet-500/10 text-violet-400"
                          : "bg-teal-500/10 text-teal-400",
                      )}>
                        B{b.bayNumber}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-center text-slate-300">{b.date}</span>
                    <span className="text-[11px] font-bold text-center">{formatHour(b.hour)}</span>
                    <button
                      onClick={() => cancelBooking(b.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors group mx-auto"
                    >
                      <Trash2 className="w-3 h-3 text-slate-600 group-hover:text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── SESSIONS TAB ─── */}
        {tab === "sessions" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {[
                { label: "Total Sessions", value: sessions.length.toString() },
                { label: "Total Shots", value: shots.length.toLocaleString() },
                { label: "Avg Shots/Session", value: sessions.length ? Math.round(shots.length / sessions.length).toString() : "0" },
                { label: "Avg Duration", value: sessions.length ? `${Math.round(sessions.reduce((a, s) => a + s.duration, 0) / sessions.length)} min` : "0" },
              ].map((s) => (
                <div key={s.label} className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-3 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">{s.label}</span>
                  <span className="text-sm font-black">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-800 grid grid-cols-[1fr_60px_60px_80px_80px_80px] gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <span>User</span>
                <span className="text-center">Bay</span>
                <span className="text-center">Shots</span>
                <span className="text-center">Avg Carry</span>
                <span className="text-center">Best Drive</span>
                <span className="text-center">Date</span>
              </div>
              <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-800/30">
                {sortedSessions.slice(0, 100).map((s) => {
                  const user = users.find((u) => u.id === s.userId);
                  return (
                    <div key={s.id} className="px-4 py-2 grid grid-cols-[1fr_60px_60px_80px_80px_80px] gap-2 items-center hover:bg-slate-800/20 transition-colors">
                      <p className="text-xs font-bold truncate">{user?.name || "Unknown"}</p>
                      <span className="text-[11px] font-bold text-center">B{s.bayNumber}</span>
                      <span className="text-[11px] font-bold text-center">{s.shotCount}</span>
                      <span className="text-[11px] font-bold text-center text-emerald-400">{Math.round(s.avgCarry)} yds</span>
                      <span className="text-[11px] font-bold text-center text-amber-400">{Math.round(s.bestDrive)} yds</span>
                      <span className="text-[11px] font-medium text-center text-slate-400">{s.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Main Export ───
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthed(localStorage.getItem("crushers-admin") === "1");
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }

  return (
    <DemoProvider>
      <AdminPanelInner />
    </DemoProvider>
  );
}
