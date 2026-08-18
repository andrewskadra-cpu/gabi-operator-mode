import type { ExecutiveRole } from "@/lib/domain/executive-role";
import type { FutureCampaign } from "@/content/types";
import { futureCampaigns as cooFutureCampaigns } from "@/content/future-campaigns";

const ceoFutureCampaigns: readonly FutureCampaign[] = [
  {
    id: "ceo-investor-dealmaker",
    title: "Investor & Dealmaker",
    description:
      "Deepen valuation, risk, debt, real-estate finance, corporate finance, and deal-structure judgment.",
    topics: [
      "DCF",
      "Comparable companies",
      "Free cash flow",
      "Working capital",
      "IRR and NPV",
      "Commercial lending",
      "Seller financing",
      "Deal structuring",
      "Negotiation",
      "Risk-adjusted returns",
    ],
  },
  {
    id: "ceo-leadership-systems",
    title: "CEO Skills",
    description:
      "Build leaders, management systems, controls, dashboards, automation, strategy, and accountable culture.",
    topics: [
      "Managing managers",
      "Organizational design",
      "Executive hiring",
      "Compensation",
      "Strategy",
      "Decision-making",
      "Internal controls",
      "Forecasting",
      "KPIs",
      "Automation and AI",
    ],
  },
  {
    id: "ceo-acquisitions-capital",
    title: "Acquisitions & Capital",
    description:
      "Advance from screening assets to financing, diligence, closing, integration, and portfolio construction.",
    topics: [
      "M&A",
      "Quality of earnings",
      "LOIs",
      "Purchase agreements",
      "LBOs",
      "Earnouts",
      "Integration",
      "Roll-ups",
      "Holding companies",
      "Portfolio management",
    ],
  },
  {
    id: "ceo-holding-company",
    title: "Holding Company CEO",
    description:
      "Lead through capital allocation, governance, CEO selection, decentralized management, financing, and succession.",
    topics: [
      "Portfolio strategy",
      "Board governance",
      "CEO selection",
      "Executive compensation",
      "Institutional financing",
      "Debt markets",
      "Equity markets",
      "Crisis management",
      "Succession",
      "Family-office concepts",
    ],
  },
];

export function getFutureCampaignsForRole(
  role: ExecutiveRole,
): readonly FutureCampaign[] {
  return role === "ceo" ? ceoFutureCampaigns : cooFutureCampaigns;
}

export const roleLabLenses = {
  ceo: {
    eyebrow: "EXECUTIVE LABS / CAPITAL + SYSTEMS",
    title: "Train the owner's eye.",
    description:
      "Connect customer behavior, operating capacity, management quality, and process design to economic value.",
    customerPrompt:
      "What drives retention, pricing power, lifetime value, and avoidable service cost?",
    operationsPrompt:
      "Map capacity, KPI design, process economics, automation, bottlenecks, and capital productivity.",
  },
  coo: {
    eyebrow: "OPERATOR LABS / PRACTICE SYSTEMS",
    title: "Train the operating eye.",
    description:
      "Observe experience, map workflow, strengthen quality, lead people, and remove execution friction.",
    customerPrompt:
      "What does the customer experience, and which operating owner can improve it?",
    operationsPrompt:
      "Map execution, workflow, quality, staffing, customer impact, bottlenecks, and daily management.",
  },
} as const;

export const roleJournalPrompts: Readonly<Record<ExecutiveRole, readonly string[]>> = {
  ceo: [
    "What did the numbers reveal?",
    "Where is capital earning too little?",
    "Which assumption needs evidence?",
    "What decision did I avoid?",
    "What should a leader own instead of me?",
    "Which risk became more important?",
    "What customer or market signal changed my view?",
    "What system would improve decision quality?",
    "Where should the next dollar go?",
  ],
  coo: [
    "What did I notice?",
    "Where did communication break down?",
    "What relationship did I strengthen?",
    "What conversation did I avoid?",
    "What did I delegate?",
    "Where did I unnecessarily step back in?",
    "What customer insight did I learn?",
    "What employee behavior would I reward?",
    "What would I change as COO?",
  ],
};

