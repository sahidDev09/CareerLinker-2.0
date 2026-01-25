import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSalary(salary: string) {
  if (!salary) return salary;
  
  // If it already has formatting, return as is
  if (salary.includes('$')) return salary;
  
  // Handle range like "80-100"
  if (salary.includes('-')) {
    const [min, max] = salary.split('-').map(s => s.trim());
    if (!isNaN(Number(min)) && !isNaN(Number(max))) {
      return `$${min}k - $${max}k`;
    }
  }
  
  // Handle single number like "80"
  if (!isNaN(Number(salary.trim()))) {
    return `$${salary.trim()}k`;
  }
  
  return salary;
}

export function formatRelativeTime(date: string | Date) {
  if (!date) return "";
  const now = new Date();
  const past = new Date(date);
  
  // Check if invalid date
  if (isNaN(past.getTime())) return date.toString();

  const diff = now.getTime() - past.getTime();
  
  // Handle future dates or very close dates
  if (diff < 60000) return "just now";
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  
  const years = Math.floor(days / 365);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}
