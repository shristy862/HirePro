export interface ParsedResumeAnalysis {
  atsScore: number | null;
  sections: { title: string; content: string }[];
  raw: string;
}

export function parseResumeAnalysis(raw: string): ParsedResumeAnalysis {
  const atsMatch =
    raw.match(/ATS\s*Score[:\s]*(\d{1,3})/i) ||
    raw.match(/(\d{1,3})\s*\/\s*100/i) ||
    raw.match(/score[:\s]*(\d{1,3})/i);

  const atsScore = atsMatch ? Math.min(100, Number(atsMatch[1])) : null;

  const sectionPatterns = [
    { key: /missing\s*skills?/i, title: "Missing skills" },
    { key: /strengths?/i, title: "Strengths" },
    { key: /weaknesses?/i, title: "Weaknesses" },
    { key: /recommended\s*roles?/i, title: "Recommended roles" },
    { key: /suggestions?/i, title: "Suggestions" },
    {
      key: /improvement\s*suggestions?/i,
      title: "Improvement suggestions",
    },
  ];

  const sections: { title: string; content: string }[] = [];

  for (let i = 0; i < sectionPatterns.length; i++) {
    const { key, title } = sectionPatterns[i];
    const start = raw.search(key);
    if (start === -1) continue;

    let end = raw.length;
    for (let j = i + 1; j < sectionPatterns.length; j++) {
      const next = raw.search(sectionPatterns[j].key);
      if (next !== -1 && next > start) {
        end = next;
        break;
      }
    }

    const chunk = raw
      .slice(start, end)
      .replace(/^[\d.]+\s*[^\n]*\n?/, "")
      .trim();
    const cleaned = chunk
      .replace(new RegExp(`^${title}`, "i"), "")
      .replace(/^[:.\s-]+/, "")
      .trim();

    if (cleaned) {
      sections.push({ title, content: cleaned });
    }
  }

  if (sections.length === 0 && raw.trim()) {
    sections.push({ title: "AI feedback", content: raw.trim() });
  }

  return { atsScore, sections, raw };
}

export function buildResumeTextFromProfile(profile: {
  bio?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}): string {
  const parts = [
    profile.bio && `Bio:\n${profile.bio}`,
    profile.skills?.length &&
      `Skills:\n${profile.skills.join(", ")}`,
    profile.experience && `Experience:\n${profile.experience}`,
    profile.education && `Education:\n${profile.education}`,
    profile.linkedin && `LinkedIn: ${profile.linkedin}`,
    profile.github && `GitHub: ${profile.github}`,
    profile.portfolio && `Portfolio: ${profile.portfolio}`,
  ].filter(Boolean);

  return parts.join("\n\n");
}
