// Enums
export type UserRole = "USER" | "RESELLER" | "ADMIN";
export type UserStatus = "ACTIVE" | "PENDING" | "BLOCKED" | "SUSPENDED";
export type Plan = "STARTER" | "PRO" | "ENTERPRISE";
export type PlanStatus = "ACTIVE" | "SUSPENDED" | "CANCELLED" | "TRIAL";
export type MatchStatus = "SCHEDULED" | "LIVE" | "FINISHED" | "CANCELLED";
export type BolaoStatus = "ACTIVE" | "FINISHED" | "ARCHIVED";
export type RedemptionStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

// Models
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  favoriteTeam?: string | null;
  role: UserRole;
  status: UserStatus;
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  globalRank?: number | null;
  tenantId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  points: number;
  status: UserStatus;
  createdAt: Date;
  _count?: { predictions: number };
}

export interface Tenant {
  id: string;
  slug: string;
  platformName: string;
  tagline?: string | null;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  customDomain?: string | null;
  subdomain: string;
  plan: Plan;
  planStatus: PlanStatus;
  planExpiresAt?: Date | null;
  maxUsers?: number | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Competition {
  id: string;
  name: string;
  slug: string;
  country?: string | null;
  logoUrl?: string | null;
  season: string;
  isActive: boolean;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logoUrl?: string | null;
  country?: string | null;
  competitionId?: string | null;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  competitionId: string;
  scheduledAt: Date;
  closedAt: Date;
  status: MatchStatus;
  homeScore?: number | null;
  awayScore?: number | null;
  venue?: string | null;
  pointsMultiplier: number;
  createdAt: Date;
  homeTeam?: Team;
  awayTeam?: Team;
  competition?: Competition;
  bonusQuestions?: BonusQuestion[];
  predictions?: Prediction[];
  userPrediction?: Prediction | null;
}

// Alias for match with all relations loaded
export type MatchWithDetails = Match & {
  homeTeam: Team;
  awayTeam: Team;
  competition: Competition;
  bonusQuestions: BonusQuestion[];
  userPrediction?: Prediction | null;
  /** True for finals/knockouts with x1.5 multiplier */
  isChampions?: boolean;
  matchDate: Date; // alias for scheduledAt used in components
};

export interface BonusQuestion {
  id: string;
  matchId: string;
  question: string;
  options: string[] | null;
  correctAnswer?: string | null;
  pointsReward: number;
}

export interface Prediction {
  id: string;
  userId: string;
  matchId: string;
  tenantId?: string | null;
  homeScore: number;
  awayScore: number;
  bonusAnswers?: Record<string, string> | null;
  pointsEarned: number | null;
  isExact: boolean;
  isCorrectResult: boolean;
  submittedAt: Date;
  match?: Match;
  user?: Pick<User, "id" | "name" | "avatarUrl">;
}

export interface Bolao {
  id: string;
  name: string;
  description?: string | null;
  inviteCode: string;
  createdById: string;
  tenantId?: string | null;
  isPublic: boolean;
  status: BolaoStatus;
  maxMembers?: number | null;
  createdAt: Date;
  members?: BolaoMember[];
  _count?: { members: number };
}

export type BolaoWithDetails = Bolao & {
  owner?: Pick<User, "id" | "name" | "avatarUrl"> | null;
  membersCount: number;
  isJoined?: boolean;
  isOwner?: boolean;
};

export interface BolaoMember {
  id: string;
  bolaoId: string;
  userId: string;
  totalPoints: number;
  rank?: number | null;
  joinedAt: Date;
  user?: Pick<User, "id" | "name" | "avatarUrl">;
}

export interface Prize {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  pointsCost: number;
  stock: number | null;
  isActive: boolean;
  tenantId?: string | null;
  canRedeem?: boolean;
}

export interface PrizeRedemption {
  id: string;
  userId: string;
  prizeId: string;
  status: RedemptionStatus;
  shippingAddress?: Record<string, string>;
  redeemedAt: Date;
  deliveredAt?: Date | null;
  prize?: Prize;
}

export interface ResellerSubscription {
  id: string;
  tenantId: string;
  plan: Plan;
  priceMonthly: number;
  billingCycle: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  isActive?: boolean;
  daysLeft?: number | null;
}

export interface RankingEntry {
  userId: string;
  name: string;
  avatarUrl?: string | null;
  points: number;
  position: number;
  totalPredictions: number;
}

export interface BrandSettings {
  name: string;
  primaryColor: string;
  logoUrl?: string;
  customDomain?: string;
}

export interface DailyStats {
  date: string;
  newUsers: number;
  predictions: number;
}

export interface ResellerStats {
  totalUsers: number;
  activeToday: number;
  totalPredictions: number;
  weeklyGrowth: number;
  dailyStats: DailyStats[];
  topCompetitions: { name: string; percentage: number }[];
  topUsers: Pick<User, "id" | "name" | "totalPoints" | "avatarUrl">[];
}

// Generic API response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
