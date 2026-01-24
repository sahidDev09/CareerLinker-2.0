export type ProfileStep = {
  id: string;
  label: string;
  weight: number;
  completed: boolean;
};

export const PROFILE_COMPLETENESS_CRITERIA = [
  { id: "name", label: "Full Name", weight: 5 },
  { id: "imageUrl", label: "Profile Picture", weight: 5 },
  { id: "location", label: "Location", weight: 10 },
  { id: "availability", label: "Availability", weight: 5 },
  { id: "skills", label: "Technical Skills", weight: 15 },
  { id: "experiences", label: "Work Experience", weight: 20 },
  { id: "education", label: "Education History", weight: 15 },
  { id: "projects", label: "Portfolio Projects", weight: 15 },
  { id: "resumeUrl", label: "Resume/CV", weight: 10 },
];

export function calculateProfileCompleteness(profile: any) {
  if (!profile) return { percentage: 0, steps: [], nextSteps: [], completedSteps: [] };

  let totalScore = 0;
  let maxScore = 0;

  const steps = PROFILE_COMPLETENESS_CRITERIA.map((criteria) => {
    let isCompleted = false;
    const value = profile[criteria.id];

    if (Array.isArray(value)) {
      isCompleted = value.length > 0;
    } else if (typeof value === "string") {
      isCompleted = value.trim().length > 0;
    } else {
      isCompleted = !!value;
    }

    if (isCompleted) {
      totalScore += criteria.weight;
    }
    maxScore += criteria.weight;

    return {
      ...criteria,
      completed: isCompleted,
    };
  });

  const percentage = Math.round((totalScore / maxScore) * 100);

  return {
    percentage,
    steps,
    nextSteps: steps.filter((s) => !s.completed),
    completedSteps: steps.filter((s) => s.completed),
  };
}
