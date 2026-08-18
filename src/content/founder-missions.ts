import type {
  ExecutiveRole,
} from "@/lib/domain/executive-role";
import type { FounderDecision } from "@/lib/domain/operator-state";

export interface FounderMissionRoleBrief {
  readonly objective: string;
  readonly responsibilities: readonly string[];
  readonly evidencePrompt: string;
}

export interface FounderMissionDefinition {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly scenario: string;
  readonly roles: Readonly<Record<ExecutiveRole, FounderMissionRoleBrief>>;
  readonly decisionPrompt: string;
  readonly decisions: readonly {
    readonly value: Exclude<FounderDecision, null>;
    readonly label: string;
  }[];
}

export const founderMissions: readonly FounderMissionDefinition[] = [
  {
    id: "founder-first-vending-location",
    title: "First Vending Location",
    category: "SHARED FOUNDER MISSION 01",
    scenario:
      "Skadra Ventures is evaluating a 220-employee manufacturing location with no reliable food option and a manager requesting commission.",
    roles: {
      ceo: {
        objective: "Decide whether the machine earns an acceptable risk-adjusted return.",
        responsibilities: [
          "Analyze machine, installation, and inventory cost",
          "Estimate revenue, COGS, card fees, and commission",
          "Calculate contribution profit, payback, and downside",
          "Set an approval condition and capital limit",
        ],
        evidencePrompt:
          "Show the assumptions, bear/base/bull economics, payback, and approval threshold.",
      },
      coo: {
        objective: "Validate the location need and build a serviceable operating relationship.",
        responsibilities: [
          "Research the site and approach the manager",
          "Understand employee demand and current pain",
          "Conduct a site visit and document constraints",
          "Define service expectations and maintain the relationship",
        ],
        evidencePrompt:
          "Document demand evidence, site constraints, stakeholder needs, service plan, and follow-up.",
      },
    },
    decisionPrompt: "What should Skadra Ventures do with this location?",
    decisions: [
      { value: "deploy", label: "Deploy machine" },
      { value: "renegotiate", label: "Renegotiate" },
      { value: "pass", label: "Pass" },
    ],
  },
  {
    id: "founder-hvac-acquisition",
    title: "HVAC Business Acquisition",
    category: "INVESTMENT COMMITTEE 01",
    scenario:
      "A fictional residential HVAC company is offered for $1.8 million. Revenue is stable, margins are declining, reviews are weakening, and the owner still approves most estimates.",
    roles: {
      ceo: {
        objective: "Build the financial and deal case for buying, negotiating, or passing.",
        responsibilities: [
          "Normalize SDE and EBITDA",
          "Evaluate valuation, leverage, debt service, and returns",
          "Test customer concentration and downside scenarios",
          "Propose price, structure, and walk-away conditions",
        ],
        evidencePrompt:
          "Write the investment thesis, valuation range, financing structure, return case, and material risks.",
      },
      coo: {
        objective: "Determine whether the operation can transition and improve without breaking customer trust.",
        responsibilities: [
          "Assess employees, managers, customers, and processes",
          "Identify owner dependence and transition risk",
          "Diagnose service failures and capacity constraints",
          "Build a 100-day people, customer, and execution plan",
        ],
        evidencePrompt:
          "Write the operating diagnosis, transition risks, people plan, customer recovery plan, and first 100 days.",
      },
    },
    decisionPrompt: "What case should go to the Skadra Investment Committee?",
    decisions: [
      { value: "buy", label: "Buy" },
      { value: "renegotiate", label: "Negotiate" },
      { value: "pass", label: "Pass" },
    ],
  },
];

export function getFounderMission(missionId: string) {
  return founderMissions.find((mission) => mission.id === missionId);
}
