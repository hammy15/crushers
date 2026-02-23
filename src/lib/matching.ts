import type { UserProfile, PeerMatch } from "@/types/trackman";

export function findPeerMatches(
  user: UserProfile,
  allUsers: UserProfile[],
  limit: number = 10,
): PeerMatch[] {
  const candidates = allUsers.filter((u) => u.id !== user.id);

  const scored = candidates.map((candidate) => {
    let score = 0;
    const reasons: string[] = [];
    const sharedWeaknesses: string[] = [];

    // Handicap similarity (0-25 points)
    const handicapDiff = Math.abs(user.handicap - candidate.handicap);
    const handicapScore = Math.max(0, 25 - handicapDiff * 2);
    score += handicapScore;
    if (handicapDiff < 5) reasons.push(`Similar handicap (${candidate.handicap})`);

    // Swing speed similarity (0-20 points)
    const speedDiff = Math.abs(user.swingSpeed - candidate.swingSpeed);
    const speedScore = Math.max(0, 20 - speedDiff);
    score += speedScore;
    if (speedDiff < 8) reasons.push(`Similar swing speed (${candidate.swingSpeed} mph)`);

    // Age similarity (0-10 points)
    const ageDiff = Math.abs(user.age - candidate.age);
    const ageScore = Math.max(0, 10 - ageDiff * 0.5);
    score += ageScore;
    if (ageDiff < 10) reasons.push(`Similar age group`);

    // Physical similarity (0-10 points)
    const heightDiff = Math.abs(user.height - candidate.height);
    const weightDiff = Math.abs(user.weight - candidate.weight);
    const physScore = Math.max(0, 10 - heightDiff - weightDiff * 0.1);
    score += physScore;
    if (heightDiff < 3 && weightDiff < 20) reasons.push(`Similar build`);

    // Shared weaknesses (0-25 points) — most valuable for improvement matching
    const shared = user.weaknesses.filter((w) => candidate.weaknesses.includes(w));
    const weaknessScore = shared.length * 8;
    score += Math.min(weaknessScore, 25);
    shared.forEach((w) => sharedWeaknesses.push(w));
    if (shared.length > 0) reasons.push(`${shared.length} shared weakness${shared.length > 1 ? "es" : ""}`);

    // Improvement bonus — if candidate has improved (lower handicap than user)
    const improvementDelta = user.handicap - candidate.handicap;
    if (improvementDelta > 0) {
      score += Math.min(improvementDelta * 2, 10);
      reasons.push(`Improved ${Math.round(improvementDelta * 10) / 10} strokes ahead`);
    }

    // Same facility bonus
    if (candidate.homeFacility === user.homeFacility) {
      score += 5;
      reasons.push("Same facility");
    }

    return {
      user: candidate,
      matchScore: Math.min(Math.round(score), 100),
      matchReasons: reasons,
      improvementDelta: Math.round(improvementDelta * 10) / 10,
      sharedWeaknesses,
      theirJourney: generateJourneyNarrative(candidate, improvementDelta),
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
}

function generateJourneyNarrative(user: UserProfile, delta: number): string {
  if (delta > 5) {
    return `${user.name.split(" ")[0]} was once a ${Math.round(user.handicap + delta)} handicap and dropped to ${user.handicap} over ${Math.round(Math.random() * 8 + 3)} months by focusing on ${user.strengths[0]?.toLowerCase() || "consistent practice"}.`;
  }
  if (delta > 0) {
    return `${user.name.split(" ")[0]} is currently working through similar challenges and has made steady progress with ${user.strengths[0]?.toLowerCase() || "dedicated practice sessions"}.`;
  }
  return `${user.name.split(" ")[0]} is on a similar journey and could be a great practice partner to push each other forward.`;
}
