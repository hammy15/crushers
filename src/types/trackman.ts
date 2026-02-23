export interface TrackManShot {
  id: string;
  sessionId: string;
  shotNumber: number;
  club: string;
  // Ball Data
  ballSpeed: number; // mph
  launchAngle: number; // degrees
  launchDirection: number; // degrees
  spinRate: number; // rpm
  spinAxis: number; // degrees
  apexHeight: number; // yards
  carry: number; // yards
  totalDistance: number; // yards
  sideLateral: number; // yards (+ right, - left)
  landingAngle: number; // degrees
  curve: number; // yards
  // Club Data
  clubSpeed: number; // mph
  attackAngle: number; // degrees
  clubPath: number; // degrees
  faceAngle: number; // degrees
  faceToPath: number; // degrees
  dynamicLoft: number; // degrees
  spinLoft: number; // degrees
  smashFactor: number;
  // Computed
  efficiency: number; // 0-100
}

export interface Session {
  id: string;
  userId: string;
  date: string;
  duration: number; // minutes
  bayNumber: number; // 1-3
  shotCount: number;
  avgBallSpeed: number;
  avgCarry: number;
  avgClubSpeed: number;
  bestDrive: number;
  notes: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  handicap: number;
  age: number;
  height: number; // inches
  weight: number; // lbs
  swingSpeed: number; // avg driver mph
  playerType: "casual" | "competitive" | "beginner";
  joinDate: string;
  totalSessions: number;
  totalShots: number;
  // Goals
  targetHandicap: number;
  primaryGoal: string;
  // Strengths/Weaknesses
  strengths: string[];
  weaknesses: string[];
  // Location
  homeFacility: string;
}

export interface PeerMatch {
  user: UserProfile;
  matchScore: number; // 0-100
  matchReasons: string[];
  improvementDelta: number; // how much they improved
  sharedWeaknesses: string[];
  theirJourney: string;
}

export interface ImprovementPlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  basedOnPeers: number; // how many peers this is based on
  focusAreas: FocusArea[];
  estimatedImprovement: number; // strokes
  timeframe: string;
}

export interface FocusArea {
  name: string;
  currentStat: number;
  targetStat: number;
  unit: string;
  drills: Drill[];
  peerAverage: number;
  priority: "high" | "medium" | "low";
}

export interface Drill {
  name: string;
  description: string;
  duration: string;
  frequency: string;
}

export interface StrokesGained {
  offTheTee: number;
  approach: number;
  aroundTheGreen: number;
  putting: number;
  total: number;
}

export interface ClubStats {
  club: string;
  avgCarry: number;
  avgTotal: number;
  avgBallSpeed: number;
  avgLaunchAngle: number;
  avgSpinRate: number;
  avgClubSpeed: number;
  dispersion: number; // yards spread
  shotCount: number;
}

export type PricingTier = "free" | "crusher" | "pro" | "facility";
