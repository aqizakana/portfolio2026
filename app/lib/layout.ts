import type { WorkFrontmatter } from "./works";

const GRID_SPACING = 8;

export interface BuildingPlacement {
  work: WorkFrontmatter;
  x: number;
  z: number;
}

function jaccardDistance(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 1;
  return 1 - intersection.size / union.size;
}

export function computePlacements(works: WorkFrontmatter[]): BuildingPlacement[] {
  const sorted = [...works].sort((a, b) => b.importance - a.importance);

  const cols = Math.ceil(Math.sqrt(sorted.length));

  return sorted.map((work, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;

    const centerOffset = ((cols - 1) * GRID_SPACING) / 2;
    const x = col * GRID_SPACING - centerOffset;
    const z = row * GRID_SPACING - centerOffset;

    return { work, x, z };
  });
}
