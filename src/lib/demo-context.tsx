"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { generateDemoData } from "./seed-data";
import { findPeerMatches } from "./matching";
import type {
  UserProfile,
  Session,
  TrackManShot,
  ClubStats,
  StrokesGained,
  ImprovementPlan,
  PeerMatch,
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
}

const DemoContext = createContext<DemoData | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const data = useMemo(() => {
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
    };
  }, []);

  return <DemoContext.Provider value={data}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoData {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
