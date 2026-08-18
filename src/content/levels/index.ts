import { levels01To04 } from "@/content/levels/levels-01-04";
import { levels05To08 } from "@/content/levels/levels-05-08";
import { levels09To12 } from "@/content/levels/levels-09-12";
import { levels13To16 } from "@/content/levels/levels-13-16";
import { ceoYearOneLevels } from "@/content/levels/ceo-levels";
import type { OperatorLevel } from "@/content/types";
import type { ExecutiveRole } from "@/lib/domain/executive-role";

export const yearOneLevels: readonly OperatorLevel[] = [
  ...levels01To04,
  ...levels05To08,
  ...levels09To12,
  ...levels13To16,
];

export function getLevel(levelId: string): OperatorLevel | undefined {
  return [...yearOneLevels, ...ceoYearOneLevels].find(
    (level) => level.id === levelId,
  );
}

export { ceoYearOneLevels };

export function getLevelsForRole(
  role: ExecutiveRole,
): readonly OperatorLevel[] {
  return role === "ceo" ? ceoYearOneLevels : yearOneLevels;
}
