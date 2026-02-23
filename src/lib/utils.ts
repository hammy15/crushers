import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistance(yards: number): string {
  return `${Math.round(yards)} yds`;
}

export function formatSpeed(mph: number): string {
  return `${Math.round(mph * 10) / 10} mph`;
}

export function formatDegrees(deg: number): string {
  return `${deg > 0 ? "+" : ""}${Math.round(deg * 10) / 10}°`;
}

export function getHandicapLabel(handicap: number): string {
  if (handicap < 5) return "Scratch";
  if (handicap < 10) return "Single Digit";
  if (handicap < 15) return "Low-Mid";
  if (handicap < 20) return "Mid";
  if (handicap < 25) return "High";
  return "Beginner";
}

export function getMatchColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-slate-400";
}

export function formatHour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}

export function isWithinFacilityHours(dayOfWeek: number, hour: number): boolean {
  // dayOfWeek: 0 = Sunday
  if (dayOfWeek === 0) return hour >= 8 && hour < 20;
  return hour >= 7 && hour < 22;
}
