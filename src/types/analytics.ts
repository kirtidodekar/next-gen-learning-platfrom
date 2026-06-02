export interface StudySession {
  id: string;
  user_id: string;
  course_id: string | null;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: AchievementType;
  unlocked_at: string;
  is_unlocked: boolean;
  created_at: string;
}

export type AchievementType =
  | 'first_lesson'
  | 'streak_7_days'
  | 'streak_30_days'
  | 'course_completed';

export interface AchievementDefinition {
  type: AchievementType;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface DashboardMetrics {
  totalStudyTime: number; // in minutes
  activeCourses: number;
  completedCourses: number;
  currentStreak: number;
  longestStreak: number;
}

export interface StudyTimeData {
  date: string;
  minutes: number;
  hours: number;
}

export interface CourseProgressData {
  status: string;
  count: number;
  percentage: number;
  color: string;
}
