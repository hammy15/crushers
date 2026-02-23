import type {
  UserProfile,
  Session,
  TrackManShot,
  ClubStats,
  StrokesGained,
  ImprovementPlan,
} from "@/types/trackman";

// Realistic names
const firstNames = [
  "Jake","Mike","Ryan","Chris","Tyler","Brandon","Kyle","Josh","Matt","Austin",
  "Sarah","Emily","Jessica","Amanda","Megan","Lauren","Ashley","Nicole","Brooke","Taylor",
  "David","James","Robert","Daniel","Kevin","Brian","Steve","Mark","Tom","Alex",
  "Rachel","Samantha","Katie","Lisa","Jennifer","Maria","Diana","Tina","Heather","Kelly",
  "Nathan","Ethan","Caleb","Noah","Liam","Mason","Logan","Luke","Ben","Ian",
];

const lastNames = [
  "Johnson","Smith","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez",
  "Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Thompson","White","Harris",
  "Clark","Lewis","Walker","Hall","Allen","Young","King","Wright","Scott","Adams",
  "Nelson","Hill","Ramirez","Campbell","Mitchell","Roberts","Carter","Phillips","Evans","Turner",
  "Torres","Parker","Collins","Edwards","Stewart","Flores","Morris","Nguyen","Murphy","Rivera",
];

const goals = [
  "Break 90 consistently",
  "Eliminate my slice",
  "Add 20 yards to my drive",
  "Get more consistent with irons",
  "Lower my handicap by 5 strokes",
  "Hit more greens in regulation",
  "Improve short game",
  "Better course management",
  "Break 80",
  "Compete in local tournaments",
  "Play scratch golf",
  "Improve wedge distances",
];

const strengthsList = [
  "Driving distance","Putting accuracy","Iron consistency","Short game touch",
  "Course management","Mental game","Wedge play","Tee shots","Fairway woods",
  "Lag putting","Bunker play","Recovery shots",
];

const weaknessesList = [
  "Slice off the tee","Inconsistent irons","Poor bunker play","Three-putting",
  "Approach shot accuracy","Driver accuracy","Short game chipping","Distance control",
  "Hitting greens in regulation","Fairway finding","Wedge distance gaps","Mental composure",
];

// Seeded PRNG (mulberry32) — ensures identical output on server and client
let _seed = 42;
function seededRandom(): number {
  _seed |= 0;
  _seed = (_seed + 0x6d2b79f5) | 0;
  let t = Math.imul(_seed ^ (_seed >>> 15), 1 | _seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function resetSeed(s: number = 42) {
  _seed = s;
}

function rand(min: number, max: number): number {
  return seededRandom() * (max - min) + min;
}

function randInt(min: number, max: number): number {
  return Math.floor(rand(min, max + 1));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(seededRandom() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => seededRandom() - 0.5);
  return shuffled.slice(0, n);
}

function generateId(): string {
  return seededRandom().toString(36).substring(2, 15) + seededRandom().toString(36).substring(2, 15);
}

// Generate users with correlated stats
export function generateUsers(count: number = 50): UserProfile[] {
  return Array.from({ length: count }, (_, i) => {
    const handicap = rand(2, 36);
    const isGood = handicap < 12;
    const isMid = handicap >= 12 && handicap < 22;
    const swingSpeed = isGood
      ? rand(100, 118)
      : isMid
        ? rand(85, 105)
        : rand(70, 92);

    const age = randInt(18, 68);
    const playerType = handicap < 8
      ? ("competitive" as const)
      : handicap > 25
        ? ("beginner" as const)
        : ("casual" as const);

    const monthsAgo = randInt(1, 18);
    const joinDate = new Date();
    joinDate.setMonth(joinDate.getMonth() - monthsAgo);

    return {
      id: generateId(),
      name: `${pick(firstNames)} ${pick(lastNames)}`,
      email: `user${i}@crushers.golf`,
      avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${i}&backgroundColor=f0f0f0`,
      handicap: Math.round(handicap * 10) / 10,
      age,
      height: randInt(62, 76),
      weight: randInt(130, 240),
      swingSpeed: Math.round(swingSpeed * 10) / 10,
      playerType,
      joinDate: joinDate.toISOString().split("T")[0],
      totalSessions: randInt(5, 80),
      totalShots: 0, // computed later
      targetHandicap: Math.max(0, Math.round((handicap - rand(3, 8)) * 10) / 10),
      primaryGoal: pick(goals),
      strengths: pickN(strengthsList, randInt(2, 4)),
      weaknesses: pickN(weaknessesList, randInt(2, 4)),
      homeFacility: "Crushers - St. George",
    };
  });
}

// Club data with realistic parameters per club type
const CLUB_PROFILES: Record<string, { speedMult: number; launchAngle: [number, number]; spin: [number, number]; carry: [number, number] }> = {
  "Driver":     { speedMult: 1.0,  launchAngle: [8, 16],    spin: [2000, 3200],  carry: [180, 310] },
  "3-Wood":     { speedMult: 0.92, launchAngle: [10, 16],   spin: [3000, 4200],  carry: [170, 265] },
  "5-Wood":     { speedMult: 0.88, launchAngle: [12, 18],   spin: [3500, 5000],  carry: [155, 240] },
  "4-Iron":     { speedMult: 0.82, launchAngle: [12, 18],   spin: [3800, 5500],  carry: [140, 220] },
  "5-Iron":     { speedMult: 0.79, launchAngle: [13, 20],   spin: [4200, 5800],  carry: [130, 210] },
  "6-Iron":     { speedMult: 0.76, launchAngle: [15, 22],   spin: [4800, 6500],  carry: [120, 195] },
  "7-Iron":     { speedMult: 0.73, launchAngle: [16, 25],   spin: [5500, 7500],  carry: [110, 180] },
  "8-Iron":     { speedMult: 0.70, launchAngle: [18, 28],   spin: [6500, 8500],  carry: [100, 165] },
  "9-Iron":     { speedMult: 0.67, launchAngle: [20, 32],   spin: [7500, 9500],  carry: [90, 150] },
  "PW":         { speedMult: 0.64, launchAngle: [24, 36],   spin: [8000, 10500], carry: [80, 140] },
  "GW":         { speedMult: 0.60, launchAngle: [26, 38],   spin: [8500, 11000], carry: [70, 125] },
  "SW":         { speedMult: 0.55, launchAngle: [28, 42],   spin: [9000, 12000], carry: [50, 100] },
  "LW":         { speedMult: 0.50, launchAngle: [30, 48],   spin: [9500, 13000], carry: [30, 80] },
};

export function generateShot(
  sessionId: string,
  shotNumber: number,
  club: string,
  userSwingSpeed: number,
  userHandicap: number,
): TrackManShot {
  const profile = CLUB_PROFILES[club] || CLUB_PROFILES["7-Iron"];
  const skillFactor = Math.max(0.3, 1 - userHandicap / 50); // 0.3 to 1.0

  const clubSpeed = userSwingSpeed * profile.speedMult * rand(0.95, 1.05);
  const smashFactor = rand(1.35, 1.52) * (0.85 + skillFactor * 0.15);
  const ballSpeed = clubSpeed * smashFactor;

  const launchAngle = rand(profile.launchAngle[0], profile.launchAngle[1]);
  const spinRate = rand(profile.spin[0], profile.spin[1]);

  const carryBase = profile.carry[0] + (profile.carry[1] - profile.carry[0]) * skillFactor;
  const carry = carryBase * rand(0.9, 1.1);
  const totalDistance = carry * rand(1.02, 1.15);

  // Dispersion: higher handicap = more lateral miss
  const dispersionFactor = (1 - skillFactor) * 25;
  const sideLateral = rand(-dispersionFactor, dispersionFactor);

  const attackAngle = club === "Driver" ? rand(-3, 5) : rand(-8, -1);
  const clubPath = rand(-5, 5) * (1 - skillFactor * 0.5);
  const faceAngle = clubPath + rand(-3, 3) * (1 - skillFactor * 0.3);
  const faceToPath = faceAngle - clubPath;

  const dynamicLoft = launchAngle + rand(1, 5);
  const spinLoft = dynamicLoft - attackAngle;

  return {
    id: generateId(),
    sessionId,
    shotNumber,
    club,
    ballSpeed: Math.round(ballSpeed * 10) / 10,
    launchAngle: Math.round(launchAngle * 10) / 10,
    launchDirection: Math.round(rand(-3, 3) * 10) / 10,
    spinRate: Math.round(spinRate),
    spinAxis: Math.round(rand(-25, 25) * 10) / 10,
    apexHeight: Math.round(carry * rand(0.08, 0.18) * 10) / 10,
    carry: Math.round(carry * 10) / 10,
    totalDistance: Math.round(totalDistance * 10) / 10,
    sideLateral: Math.round(sideLateral * 10) / 10,
    landingAngle: Math.round(rand(30, 55) * 10) / 10,
    curve: Math.round(rand(-15, 15) * (1 - skillFactor * 0.5) * 10) / 10,
    clubSpeed: Math.round(clubSpeed * 10) / 10,
    attackAngle: Math.round(attackAngle * 10) / 10,
    clubPath: Math.round(clubPath * 10) / 10,
    faceAngle: Math.round(faceAngle * 10) / 10,
    faceToPath: Math.round(faceToPath * 10) / 10,
    dynamicLoft: Math.round(dynamicLoft * 10) / 10,
    spinLoft: Math.round(spinLoft * 10) / 10,
    smashFactor: Math.round(smashFactor * 100) / 100,
    efficiency: Math.round(skillFactor * 100 * rand(0.85, 1.1)),
  };
}

export function generateSessions(user: UserProfile, count?: number): { sessions: Session[]; shots: TrackManShot[] } {
  const sessionCount = count || user.totalSessions;
  const sessions: Session[] = [];
  const allShots: TrackManShot[] = [];
  const clubs = Object.keys(CLUB_PROFILES);

  for (let i = 0; i < Math.min(sessionCount, 20); i++) {
    const sessionId = generateId();
    const daysAgo = randInt(1, 180);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    const shotCount = randInt(30, 80);
    const sessionShots: TrackManShot[] = [];

    for (let s = 0; s < shotCount; s++) {
      const club = pick(clubs);
      const shot = generateShot(sessionId, s + 1, club, user.swingSpeed, user.handicap);
      sessionShots.push(shot);
    }

    const driverShots = sessionShots.filter((s) => s.club === "Driver");
    const bestDrive = driverShots.length > 0 ? Math.max(...driverShots.map((s) => s.totalDistance)) : 0;

    sessions.push({
      id: sessionId,
      userId: user.id,
      date: date.toISOString().split("T")[0],
      duration: randInt(30, 120),
      bayNumber: randInt(1, 3),
      shotCount,
      avgBallSpeed: Math.round((sessionShots.reduce((a, s) => a + s.ballSpeed, 0) / shotCount) * 10) / 10,
      avgCarry: Math.round((sessionShots.reduce((a, s) => a + s.carry, 0) / shotCount) * 10) / 10,
      avgClubSpeed: Math.round((sessionShots.reduce((a, s) => a + s.clubSpeed, 0) / shotCount) * 10) / 10,
      bestDrive: Math.round(bestDrive * 10) / 10,
      notes: "",
    });

    allShots.push(...sessionShots);
  }

  return { sessions: sessions.sort((a, b) => b.date.localeCompare(a.date)), shots: allShots };
}

export function computeClubStats(shots: TrackManShot[]): ClubStats[] {
  const byClub: Record<string, TrackManShot[]> = {};
  shots.forEach((s) => {
    if (!byClub[s.club]) byClub[s.club] = [];
    byClub[s.club].push(s);
  });

  return Object.entries(byClub)
    .map(([club, clubShots]) => {
      const n = clubShots.length;
      const avg = (fn: (s: TrackManShot) => number) =>
        Math.round((clubShots.reduce((a, s) => a + fn(s), 0) / n) * 10) / 10;

      const carries = clubShots.map((s) => s.carry);
      const dispersion = Math.round((Math.max(...carries) - Math.min(...carries)) * 10) / 10;

      return {
        club,
        avgCarry: avg((s) => s.carry),
        avgTotal: avg((s) => s.totalDistance),
        avgBallSpeed: avg((s) => s.ballSpeed),
        avgLaunchAngle: avg((s) => s.launchAngle),
        avgSpinRate: Math.round(avg((s) => s.spinRate)),
        avgClubSpeed: avg((s) => s.clubSpeed),
        dispersion,
        shotCount: n,
      };
    })
    .sort((a, b) => b.avgCarry - a.avgCarry);
}

export function computeStrokesGained(handicap: number): StrokesGained {
  // Simulate strokes gained relative to scratch golfer
  const factor = handicap / 20;
  return {
    offTheTee: Math.round(rand(-2.5, 0.5) * factor * 100) / 100,
    approach: Math.round(rand(-3, 0.3) * factor * 100) / 100,
    aroundTheGreen: Math.round(rand(-2, 0.3) * factor * 100) / 100,
    putting: Math.round(rand(-1.5, 0.5) * factor * 100) / 100,
    total: 0,
  };
}

export function generateImprovementPlan(user: UserProfile): ImprovementPlan {
  const focusAreas = user.weaknesses.slice(0, 3).map((weakness) => ({
    name: weakness,
    currentStat: Math.round(rand(40, 70)),
    targetStat: Math.round(rand(75, 95)),
    unit: "%",
    peerAverage: Math.round(rand(65, 85)),
    priority: (rand(0, 1) > 0.6 ? "high" : rand(0, 1) > 0.3 ? "medium" : "low") as "high" | "medium" | "low",
    drills: [
      {
        name: `${weakness} Focus Drill`,
        description: `Targeted practice to improve your ${weakness.toLowerCase()}`,
        duration: "15-20 min",
        frequency: "3x per week",
      },
      {
        name: `${weakness} Challenge`,
        description: `Progressive challenge to build consistency in ${weakness.toLowerCase()}`,
        duration: "10-15 min",
        frequency: "2x per week",
      },
    ],
  }));

  return {
    id: generateId(),
    userId: user.id,
    title: `Path to ${user.targetHandicap} Handicap`,
    description: `Based on ${randInt(8, 25)} golfers who made similar improvements`,
    basedOnPeers: randInt(8, 25),
    focusAreas,
    estimatedImprovement: Math.round(rand(2, 6) * 10) / 10,
    timeframe: `${randInt(2, 6)} months`,
  };
}

// Generate the full demo dataset
export function generateDemoData() {
  resetSeed(42); // Always start from the same seed
  const users = generateUsers(50);

  // Make first user the "demo" user
  users[0] = {
    ...users[0],
    id: "demo-user-001",
    name: "You (Demo)",
    email: "demo@crushers.golf",
    handicap: 18.4,
    age: 32,
    height: 71,
    weight: 185,
    swingSpeed: 95.2,
    playerType: "casual",
    totalSessions: 24,
    targetHandicap: 12,
    primaryGoal: "Break 80",
    strengths: ["Driving distance", "Mental game"],
    weaknesses: ["Inconsistent irons", "Three-putting", "Approach shot accuracy"],
  };

  const allSessions: Session[] = [];
  const allShots: TrackManShot[] = [];
  const allClubStats: { userId: string; stats: ClubStats[] }[] = [];
  const allStrokesGained: { userId: string; sg: StrokesGained }[] = [];
  const allPlans: ImprovementPlan[] = [];

  users.forEach((user) => {
    const { sessions, shots } = generateSessions(user);
    allSessions.push(...sessions);
    allShots.push(...shots);
    allClubStats.push({ userId: user.id, stats: computeClubStats(shots) });
    const sg = computeStrokesGained(user.handicap);
    sg.total = Math.round((sg.offTheTee + sg.approach + sg.aroundTheGreen + sg.putting) * 100) / 100;
    allStrokesGained.push({ userId: user.id, sg });
    allPlans.push(generateImprovementPlan(user));
    user.totalShots = shots.length;
  });

  return { users, sessions: allSessions, shots: allShots, clubStats: allClubStats, strokesGained: allStrokesGained, plans: allPlans };
}
