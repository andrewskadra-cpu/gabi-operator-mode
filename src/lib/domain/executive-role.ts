export const EXECUTIVE_ROLES = ["ceo", "coo"] as const;

export type ExecutiveRole = (typeof EXECUTIVE_ROLES)[number];

export type ExecutiveSkill =
  | "finance"
  | "accounting"
  | "investing"
  | "deals"
  | "capital-allocation"
  | "strategy"
  | "leadership"
  | "systems"
  | "operations"
  | "people"
  | "customers"
  | "execution"
  | "relationships"
  | "process-improvement"
  | "field-experience";

export interface ExecutiveRoleDefinition {
  readonly role: ExecutiveRole;
  readonly label: string;
  readonly shortLabel: string;
  readonly operatingTitle: string;
  readonly selectionSummary: string;
  readonly commandName: string;
  readonly campaignId: string;
  readonly campaignName: string;
  readonly firstLevelId: string;
  readonly objective: string;
  readonly commandLede: string;
  readonly scorecardSkills: readonly ExecutiveSkill[];
  readonly roadmap: readonly string[];
  readonly principles: readonly string[];
}

export const EXECUTIVE_ROLE_DEFINITIONS: Readonly<
  Record<ExecutiveRole, ExecutiveRoleDefinition>
> = {
  ceo: {
    role: "ceo",
    label: "CEO / President",
    shortLabel: "CEO",
    operatingTitle: "CEO / President in Training",
    selectionSummary: "Strategy · Finance · Capital · Deals · Systems",
    commandName: "CEO Command Center",
    campaignId: "ceo-owners-foundation",
    campaignName: "CEO Campaign I · Owner's Foundation",
    firstLevelId: "ceo-financial-statements",
    objective: "Finance + Investing + Deals + Strategy + Capital",
    commandLede:
      "Decide where capital should go, what Skadra should own, and which systems and leaders can compound value.",
    scorecardSkills: [
      "finance",
      "accounting",
      "investing",
      "deals",
      "capital-allocation",
      "strategy",
      "leadership",
      "systems",
    ],
    roadmap: [
      "Owner Fundamentals",
      "Investor",
      "Dealmaker",
      "CEO",
      "Capital Allocator",
      "Holding Company CEO",
    ],
    principles: ["UNDERSTAND", "UNDERWRITE", "DECIDE", "ALLOCATE", "BUILD"],
  },
  coo: {
    role: "coo",
    label: "COO / Vice President",
    shortLabel: "COO",
    operatingTitle: "Future Vice President / COO",
    selectionSummary: "Operations · People · Customers · Execution · Relationships",
    commandName: "COO Command Center",
    campaignId: "year-one-core-operator",
    campaignName: "Year One · Core Operator Campaign",
    firstLevelId: "follow-the-money",
    objective: "People + Operations + Relationships + Execution",
    commandLede:
      "Turn strategy into reliable execution through people, customer judgment, operating systems, and disciplined follow-through.",
    scorecardSkills: [
      "operations",
      "people",
      "customers",
      "execution",
      "relationships",
      "leadership",
      "process-improvement",
      "field-experience",
    ],
    roadmap: [
      "Operator Fundamentals",
      "Operations Leader",
      "People Leader",
      "Multi-Unit Operator",
      "Portfolio COO",
      "Holding Company COO",
    ],
    principles: ["UNDERSTAND", "CONNECT", "LEAD", "EXECUTE", "IMPROVE", "SCALE"],
  },
};

export function isExecutiveRole(value: unknown): value is ExecutiveRole {
  return EXECUTIVE_ROLES.includes(value as ExecutiveRole);
}

export function getExecutiveRoleDefinition(
  role: ExecutiveRole,
): ExecutiveRoleDefinition {
  return EXECUTIVE_ROLE_DEFINITIONS[role];
}

export function formatExecutiveSkill(skill: ExecutiveSkill): string {
  return skill
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
