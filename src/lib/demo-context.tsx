"use client";

import { createContext, useContext, useMemo, useState, useCallback, type ReactNode } from "react";
import { generateDemoData, generateDemoBookings } from "./seed-data";
import { findPeerMatches } from "./matching";
import type {
  UserProfile,
  Session,
  TrackManShot,
  ClubStats,
  StrokesGained,
  ImprovementPlan,
  PeerMatch,
  BayBooking,
} from "@/types/trackman";

interface DemoData {
  currentUser: UserProfile;
  users: UserProfile[];
  sessions: Session[];
  shots: TrackManShot[];
  clubStats: ClubStats[];
  strokesGained: StrokesGained;
  plan: ImprovementPlan;
  peerMatches: PeerMatch[];
  userSessions: Session[];
  userShots: TrackManShot[];
  bookings: BayBooking[];
  bookSlot: (bayNumber: 1 | 2 | 3, date: string, hour: number) => void;
  cancelBooking: (bookingId: string) => void;
}

const DemoContext = createContext<DemoData | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const staticData = useMemo(() => {
    const raw = generateDemoData();
    const currentUser = raw.users[0];
    const userSessions = raw.sessions.filter((s) => s.userId === currentUser.id);
    const userShots = raw.shots.filter((s) =>
      userSessions.some((sess) => sess.id === s.sessionId),
    );
    const clubStatsEntry = raw.clubStats.find((c) => c.userId === currentUser.id);
    const sgEntry = raw.strokesGained.find((s) => s.userId === currentUser.id);
    const planEntry = raw.plans.find((p) => p.userId === currentUser.id);
    const peerMatches = findPeerMatches(currentUser, raw.users, 12);
    const initialBookings = generateDemoBookings(raw.users);

    return {
      currentUser,
      users: raw.users,
      sessions: raw.sessions,
      shots: raw.shots,
      clubStats: clubStatsEntry?.stats || [],
      strokesGained: sgEntry?.sg || { offTheTee: 0, approach: 0, aroundTheGreen: 0, putting: 0, total: 0 },
      plan: planEntry || raw.plans[0],
      peerMatches,
      userSessions,
      userShots,
      initialBookings,
    };
  }, []);

  const [bookings, setBookings] = useState<BayBooking[]>(staticData.initialBookings);

  const bookSlot = useCallback((bayNumber: 1 | 2 | 3, date: string, hour: number) => {
    const newBooking: BayBooking = {
      id: crypto.randomUUID(),
      bayNumber,
      date,
      hour,
      userId: staticData.currentUser.id,
      userName: staticData.currentUser.name,
      bookedAt: new Date().toISOString(),
    };
    setBookings(prev => [...prev, newBooking]);
  }, [staticData.currentUser]);

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  }, []);

  const value = useMemo(() => ({
    ...staticData,
    bookings,
    bookSlot,
    cancelBooking,
  }), [staticData, bookings, bookSlot, cancelBooking]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoData {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
