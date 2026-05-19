export type Emotion = "positive" | "neutral" | "negative";

export interface WorkFrontmatter {
  title: string;
  slug: string;
  emotion: Emotion;
  importance: number;
  recency: number;
  experimental: number;
  tags: string[];
  thumbnail: string;
}

const workModules = import.meta.glob<{ frontmatter: WorkFrontmatter }>(
  "../../content/works/*.mdx",
  { eager: true },
);

export function getAllWorks(): WorkFrontmatter[] {
  return Object.values(workModules).map((mod) => mod.frontmatter);
}

export function getWorkBySlug(slug: string): WorkFrontmatter | undefined {
  return getAllWorks().find((w) => w.slug === slug);
}

export function emotionToValue(emotion: Emotion): number {
  switch (emotion) {
    case "positive":
      return 1;
    case "neutral":
      return 0;
    case "negative":
      return -1;
  }
}
