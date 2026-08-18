import type { ExecutiveRole } from "@/lib/domain/executive-role";

export const fieldMissionTemplates = [
  "Speak with a business owner",
  "Approach a vending location",
  "Observe a customer experience",
  "Attend a networking event",
  "Speak with a property manager",
  "Visit a franchise",
  "Negotiate something",
  "Ask an owner about the first employee",
  "Visit a manufacturing facility",
  "Talk with a nonprofit leader",
] as const;

export const ceoFieldMissionTemplates = [
  "Analyze a company's financial statements",
  "Build a profit and loss statement",
  "Evaluate a vending machine investment",
  "Interview a business owner about cash flow",
  "Talk with a commercial or SBA lender",
  "Analyze a business-for-sale listing",
  "Underwrite a real estate opportunity",
  "Build an investment memo",
  "Compare financing structures",
  "Analyze an operating process financially",
  "Build an executive dashboard",
  "Evaluate a capital expenditure",
  "Talk to a CPA or controller",
  "Talk to an acquisition entrepreneur",
] as const;

export function getFieldMissionTemplates(
  role: ExecutiveRole,
): readonly string[] {
  return role === "ceo" ? ceoFieldMissionTemplates : fieldMissionTemplates;
}

export const relationshipCategories = [
  "Owner",
  "Customer",
  "Location Manager",
  "Franchisee",
  "Property Manager",
  "Vendor",
  "Banker",
  "CPA",
  "Attorney",
  "Employee",
  "Executive",
  "Community Leader",
  "Nonprofit Leader",
  "Mentor",
] as const;

export const journalPrompts = [
  "What did I notice?",
  "Where did communication break down?",
  "What relationship did I strengthen?",
  "What conversation did I avoid?",
  "What did I delegate?",
  "Where did I unnecessarily step back in?",
  "What customer insight did I learn?",
  "What employee behavior would I reward?",
  "What would I change as COO?",
] as const;
