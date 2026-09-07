const LABELS: Record<string, string> = {
  BEHAVIORAL: "Behavioral",
  CODING: "Coding",
  SYSTEM_DESIGN: "System Design",
  TECHNICAL: "Technical",
  LEADERSHIP: "Leadership",
  PROJECT_EXPERIENCE: "Project Experience",
  COMPANY_CULTURE: "Company Culture",
  OTHER: "Other",
};

export function categoryLabel(category: string | undefined | null): string {
  if (!category) return "Uncategorized";
  return LABELS[category] ?? category;
}
