import type {
  BossOption,
  KnowledgeQuestion,
  OperatorLevel,
  TeachingConcept,
} from "@/content/types";
import type { ExecutiveSkill } from "@/lib/domain/executive-role";

type ConceptBlueprint = readonly [
  term: string,
  plainEnglish: string,
  whyItMatters: string,
  example: string,
  executiveUse: string,
  commonMistake: string,
];

type QuestionBlueprint = readonly [
  id: string,
  prompt: string,
  correct: string,
  wrongOne: string,
  wrongTwo: string,
  explanation: string,
];

interface CeoLevelBlueprint {
  readonly id: string;
  readonly number: number;
  readonly skill: string;
  readonly title: string;
  readonly tagline: string;
  readonly durationMinutes: number;
  readonly xpReward: number;
  readonly scoreSkills: readonly ExecutiveSkill[];
  readonly missionBrief: string;
  readonly why: string;
  readonly outcomes: readonly string[];
  readonly concepts: readonly ConceptBlueprint[];
  readonly supportingTopics: readonly string[];
  readonly example: readonly [title: string, description: string, takeaway: string];
  readonly practice: readonly [prompt: string, guidance: string];
  readonly questions: readonly QuestionBlueprint[];
  readonly project: readonly [title: string, prompt: string, deliverables: readonly string[]];
  readonly fieldMission: readonly [title: string, prompt: string];
  readonly boss: readonly [
    title: string,
    scenario: string,
    prompt: string,
    strongest: string,
    acceptable: string,
    weakest: string,
    feedback: string,
  ];
  readonly reflection: string;
}

function ceoConcept(blueprint: ConceptBlueprint): TeachingConcept {
  const [term, plainEnglish, whyItMatters, example, roleApplication, commonMistake] =
    blueprint;
  return {
    term,
    plainEnglish,
    whyItMatters,
    example,
    gabiUse: roleApplication,
    roleApplication,
    commonMistake,
  };
}

function ceoQuestion(blueprint: QuestionBlueprint): KnowledgeQuestion {
  const [id, prompt, correct, wrongOne, wrongTwo, explanation] = blueprint;
  return {
    id,
    prompt,
    correctOptionId: "b",
    options: [
      { id: "a", label: wrongOne, feedback: `Not quite. ${explanation}` },
      { id: "b", label: correct, feedback: `Exactly. ${explanation}` },
      { id: "c", label: wrongTwo, feedback: `Not quite. ${explanation}` },
    ],
  };
}

function ceoBossOptions(
  strongest: string,
  acceptable: string,
  weakest: string,
  strongestFeedback: string,
): readonly BossOption[] {
  return [
    {
      id: "a",
      label: weakest,
      points: 25,
      feedback:
        "This moves quickly, but it ignores material evidence, downside, or ownership responsibility.",
    },
    {
      id: "b",
      label: strongest,
      points: 100,
      feedback: strongestFeedback,
    },
    {
      id: "c",
      label: acceptable,
      points: 65,
      feedback:
        "This is a credible start, but the investment case needs a clearer assumption, threshold, or downside response.",
    },
  ];
}

function defineCeoLevel(blueprint: CeoLevelBlueprint): OperatorLevel {
  const [exampleTitle, exampleDescription, exampleTakeaway] = blueprint.example;
  const [practicePrompt, practiceGuidance] = blueprint.practice;
  const [projectTitle, projectPrompt, deliverables] = blueprint.project;
  const [fieldTitle, fieldPrompt] = blueprint.fieldMission;
  const [
    bossTitle,
    bossScenario,
    bossPrompt,
    strongest,
    acceptable,
    weakest,
    bossFeedback,
  ] = blueprint.boss;

  return {
    id: blueprint.id,
    number: blueprint.number,
    skill: blueprint.skill,
    title: blueprint.title,
    tagline: blueprint.tagline,
    durationMinutes: blueprint.durationMinutes,
    xpReward: blueprint.xpReward,
    executiveRole: "ceo",
    campaignId: "ceo-owners-foundation",
    scoreSkills: blueprint.scoreSkills,
    missionBrief: blueprint.missionBrief,
    whyGabiNeedsThis: blueprint.why,
    whyExecutiveNeedsThis: blueprint.why,
    outcomes: blueprint.outcomes,
    concepts: blueprint.concepts.map(ceoConcept),
    supportingTopics: blueprint.supportingTopics,
    example: {
      title: exampleTitle,
      description: exampleDescription,
      takeaway: exampleTakeaway,
    },
    practice: { prompt: practicePrompt, guidance: practiceGuidance },
    knowledgeChecks: blueprint.questions.map(ceoQuestion),
    project: { title: projectTitle, prompt: projectPrompt, deliverables },
    fieldMission: { title: fieldTitle, prompt: fieldPrompt },
    bossBattle: {
      title: bossTitle,
      scenario: bossScenario,
      prompt: bossPrompt,
      options: ceoBossOptions(strongest, acceptable, weakest, bossFeedback),
    },
    reflectionPrompt: blueprint.reflection,
  };
}

const blueprints = [
  {
    id: "ceo-financial-statements",
    number: 1,
    skill: "Financial statements",
    title: "Financial Statements",
    tagline: "Read the three connected stories every owner must understand.",
    durationMinutes: 55,
    xpReward: 150,
    scoreSkills: ["finance", "accounting"],
    missionBrief:
      "Use the income statement, balance sheet, and cash-flow statement together to explain performance, financial position, and cash movement.",
    why:
      "A CEO cannot allocate capital or evaluate managers from profit alone. Andrew needs to see how earnings, assets, liabilities, working capital, and cash connect.",
    outcomes: [
      "Explain what each financial statement tells an owner.",
      "Reconcile accounting profit with changes in cash.",
      "Identify a working-capital or financing explanation behind a cash decline.",
    ],
    concepts: [
      ["Income statement", "Revenue minus expenses over a period produces accounting profit or loss.", "It shows economic performance, but not when cash moved.", "$100,000 of revenue and $82,000 of expenses produces $18,000 of profit.", "Compare actual margins with the operating plan and ask which drivers changed.", "Treating profit as the bank balance."],
      ["Balance sheet", "A point-in-time view of assets, liabilities, and owners' equity.", "It reveals liquidity, leverage, working capital, and claims on the business.", "Receivables and inventory are assets even though neither is cash today.", "Inspect what consumed capital and which obligations the company must honor.", "Ignoring debt or working capital while celebrating asset growth."],
      ["Cash-flow statement", "A bridge showing operating, investing, and financing cash movement.", "It explains why cash can fall while profit rises.", "Buying equipment reduces investing cash; repaying principal reduces financing cash.", "Trace cash uses before approving more spending or distributions.", "Assuming depreciation itself uses cash in the period."],
      ["Working capital", "Short-term operating assets minus short-term operating liabilities.", "Growth can consume cash when receivables and inventory rise faster than payables.", "A large customer pays in 60 days while inventory is purchased today.", "Set cash-conversion expectations and fund growth deliberately.", "Calling every current asset equally liquid."],
    ],
    supportingTopics: ["Accrual accounting", "Profit versus cash", "Statement linkage", "Cash conversion"],
    example: ["Skadra Vending — profitable, less cash", "Skadra reports $100,000 of profit, adds $90,000 of receivables and inventory, buys a $35,000 route vehicle, and borrows $20,000. Cash falls even though earnings are positive.", "A sound explanation needs operating, investing, and financing causes—not one slogan."],
    practice: ["List four valid reasons a profitable company's bank balance could decline.", "Look for receivables, inventory, capex, debt principal, distributions, and timing—not only higher expenses."],
    questions: [
      ["ceo-fs-q1", "Which statement shows what the company owns and owes on one date?", "Balance sheet", "Income statement", "Cash-flow forecast", "The balance sheet is the point-in-time financial position."],
      ["ceo-fs-q2", "Profit rose while receivables and inventory rose even faster. What is the likely cash effect?", "Operating cash may decline because working capital consumed cash.", "Cash must equal profit.", "The balance sheet no longer balances.", "Accrual earnings can precede customer collections and inventory sales."],
    ],
    project: ["Three-statement owner review", "Analyze a fictional service business's income statement, balance sheet, and cash-flow statement. Explain performance, cash movement, and the three questions an owner should ask next.", ["Profit and margin conclusion", "Profit-to-cash bridge", "Liquidity and leverage observation", "Three owner questions"]],
    fieldMission: ["Ask how profit becomes cash", "Interview a business owner, CPA, or controller about the largest recurring difference between reported profit and available cash."],
    boss: ["The $100,000 profit mystery", "Skadra Ventures generated $100,000 of accounting profit, yet cash fell $70,000. Receivables rose $55,000, inventory rose $35,000, equipment purchases were $60,000, and new debt added $80,000.", "Which explanation demonstrates owner-level financial understanding?", "Build a complete cash bridge covering working capital, equipment, financing, taxes or distributions, and timing; then test whether the cash use was planned and fundable.", "Focus on receivables and ask collections to move faster.", "Assume the profit number is wrong because cash decreased.", "This recognizes that several valid explanations can coexist and turns reconciliation into a capital decision."],
    reflection: "Which statement do you currently trust least, and what would you verify before allocating capital?",
  },
  {
    id: "ceo-accounting",
    number: 2,
    skill: "Accounting",
    title: "Accounting",
    tagline: "Translate business events into a reliable economic record.",
    durationMinutes: 50,
    xpReward: 150,
    scoreSkills: ["accounting", "finance"],
    missionBrief: "Classify transactions and use the accounting equation to understand what changed, when, and why.",
    why: "A CEO need not be the bookkeeper, but must recognize classification errors, timing distortions, and records that cannot support decisions.",
    outcomes: ["Classify assets, liabilities, equity, revenue, and expenses.", "Explain debits and credits conceptually as a balanced recording system.", "Distinguish cash timing from accrual recognition."],
    concepts: [
      ["Accounting equation", "Assets equal liabilities plus equity.", "Every recorded transaction must preserve this balance.", "A financed $5,000 machine adds an asset and a loan liability.", "Challenge reports that cannot explain both sides of a transaction.", "Treating financed assets as free value."],
      ["Accrual recognition", "Revenue and expense are recorded when earned or incurred, not merely when cash moves.", "It matches economic activity to the period that produced it.", "August product sales belong in August even if card proceeds settle in September.", "Separate operating performance from collection and payment timing.", "Moving expenses between months to make a target look better."],
      ["Capitalization and depreciation", "Long-lived assets are recorded on the balance sheet and expensed over useful life.", "Large asset purchases should not distort one month's operating result, but still consume cash.", "A machine purchase reduces cash now while depreciation affects profit over years.", "Consider both accounting earnings and real maintenance capex.", "Assuming depreciation means no future cash replacement need."],
    ],
    supportingTopics: ["Debits and credits", "Chart of accounts", "Owner contribution", "Loan principal", "Card fees", "Location commissions"],
    example: ["Ten Skadra transactions", "Machine purchases, inventory, sales, card fees, commissions, fuel, loans, owner contributions, repairs, and depreciation each affect different accounts.", "Correct classification makes unit economics and cash analysis possible."],
    practice: ["Classify a $5,000 financed machine purchase and the first $300 principal payment.", "Name the asset, liability, cash movement, interest expense, and principal reduction separately."],
    questions: [
      ["ceo-accounting-q1", "A bank loan funds a machine purchase. What increases at purchase?", "An asset and a liability", "Revenue and profit", "Only expenses", "Financing creates an obligation while the machine becomes an asset."],
      ["ceo-accounting-q2", "Why use accrual accounting for owner decisions?", "It aligns revenue and expense with the activity that earned or incurred them.", "It guarantees cash is available.", "It eliminates judgment from accounting.", "Accruals improve period performance measurement but still require cash analysis."],
    ],
    project: ["Classify the vending ledger", "Classify ten Skadra Vending transactions and explain the effect on profit, cash, assets, liabilities, and equity.", ["Transaction classification table", "Accounting-equation impact", "Profit-versus-cash explanation"]],
    fieldMission: ["Talk to a CPA or bookkeeper", "Ask which three classification or close-process errors most often mislead small-business owners."],
    boss: ["The improved margin", "A manager moved repair costs into equipment assets and recorded next month's customer deposit as current revenue, lifting reported profit.", "What should the CEO do?", "Reverse unsupported entries, understand intent and controls, restate performance, and improve close review before using the report for compensation or capital decisions.", "Ask the accountant to fix the entries and continue using the original report for planning.", "Praise the margin improvement because cash was collected.", "Reliable accounting is a control system; the response protects the numbers and the behavior behind them."],
    reflection: "Which accounting judgment could most distort a business you might buy?",
  },
  {
    id: "ceo-cash-flow",
    number: 3,
    skill: "Cash flow",
    title: "Cash Flow",
    tagline: "Keep a profitable company alive through timing and discipline.",
    durationMinutes: 50,
    xpReward: 155,
    scoreSkills: ["finance", "systems"],
    missionBrief: "Forecast operating, investing, and financing cash so commitments are made before pressure becomes crisis.",
    why: "The CEO owns liquidity. Andrew must understand the cash conversion cycle, forecast obligations, and fund growth without confusing revenue with spendable cash.",
    outcomes: ["Build a simple rolling cash forecast.", "Separate operating, investing, and financing cash.", "Diagnose working-capital pressure before a payment is missed."],
    concepts: [
      ["Operating cash flow", "Cash generated or consumed by normal business activity.", "It shows whether the operating model funds itself after timing effects.", "Collections add operating cash while inventory purchases and payroll use it.", "Monitor recurring cash generation rather than relying on new borrowing.", "Calling loan proceeds operating performance."],
      ["Cash conversion cycle", "Time between paying for inputs and collecting customer cash.", "Long cycles require more funding as the company grows.", "Inventory is purchased 30 days before a customer pays.", "Change terms, inventory, billing, or collections to release cash responsibly.", "Growing sales without funding the conversion gap."],
      ["Liquidity runway", "How long available cash and committed funding cover expected net outflows.", "It creates time to solve problems without desperate decisions.", "A 13-week forecast shows a covenant and payroll pinch in week nine.", "Set minimum cash and contingency triggers.", "Using the current bank balance as the forecast."],
    ],
    supportingTopics: ["13-week cash forecast", "Receivables", "Payables", "Inventory", "Capital expenditures", "Debt service"],
    example: ["One machine, twelve months", "Seasonality, inventory purchases, card settlement, repairs, taxes, and financing make monthly cash uneven even when the machine is profitable for the year.", "A forecast turns timing into a manageable operating choice."],
    practice: ["A profitable company will miss payroll in six weeks. List the facts needed for a 13-week cash response.", "Include collections, committed sales, payroll, taxes, inventory, debt service, capex, vendor terms, and available credit."],
    questions: [
      ["ceo-cash-q1", "Which action is financing cash flow?", "Receiving loan proceeds", "Collecting customer invoices", "Buying inventory", "Borrowing changes financing cash, not operating performance."],
      ["ceo-cash-q2", "What is the strongest early-warning tool for a near-term cash problem?", "A regularly updated 13-week cash forecast", "Last year's profit margin", "The current bank balance alone", "A rolling forecast makes timing, ownership, and intervention dates visible."],
    ],
    project: ["Twelve-month machine cash forecast", "Build a monthly cash forecast for one vending machine including seasonality, working capital, capex, financing, taxes, and a minimum-cash rule.", ["Assumptions", "Monthly cash schedule", "Minimum-cash month", "Contingency actions"]],
    fieldMission: ["Interview an owner about cash pressure", "Ask what creates the biggest difference between expected and actual cash and which weekly signal they trust."],
    boss: ["Profitable and running out", "Sales and profit are growing, but customers pay in 60 days, inventory turns slowed, taxes are due, and a new facility deposit is committed.", "What should happen in the next 48 hours?", "Build a dated cash bridge, protect payroll and critical service, accelerate valid collections, adjust inventory and discretionary commitments, and assign owners to each assumption.", "Pause the facility and ask sales to collect faster.", "Borrow immediately without mapping the cash gap.", "The response protects liquidity now while identifying the operating and capital decisions that created the gap."],
    reflection: "What minimum-cash rule would prevent optimism from becoming a liquidity crisis?",
  },
  {
    id: "ceo-unit-economics",
    number: 4,
    skill: "Unit economics",
    title: "Unit Economics",
    tagline: "Prove value at the product, machine, and location level.",
    durationMinutes: 55,
    xpReward: 160,
    scoreSkills: ["finance", "investing", "systems"],
    missionBrief: "Trace revenue, variable cost, contribution profit, customer economics, and capacity from one unit to the whole operating model.",
    why: "A CEO must know what actually creates contribution before scaling volume, locations, customers, or headcount.",
    outcomes: ["Calculate contribution profit and margin.", "Move coherently from product to machine to location economics.", "Identify which assumption makes a unit scalable or dangerous."],
    concepts: [
      ["Contribution profit", "Revenue minus costs that vary with the unit sold.", "It shows what remains to cover fixed costs and profit.", "A $2.00 snack with $0.80 product cost, $0.06 fee, and $0.20 commission contributes $0.94.", "Compare products and locations on contribution, not sales alone.", "Ignoring fees, spoilage, and commissions."],
      ["Contribution margin", "Contribution profit divided by revenue.", "It shows the percentage of each sales dollar available for fixed costs.", "$0.94 contribution on a $2.00 sale is a 47% contribution margin.", "Test pricing and mix decisions before scaling.", "Confusing gross margin with final net margin."],
      ["Unit-to-system economics", "Economics change as products aggregate into machines, routes, and locations.", "A strong product can sit in an unprofitable route or low-volume location.", "Route labor and fuel can erase attractive product contribution.", "Model each layer and locate the real constraint.", "Multiplying one best-case unit without capacity or fixed cost."],
    ],
    supportingTopics: ["Revenue per unit", "Variable cost", "CAC", "LTV", "Break-even", "Capacity", "Product mix"],
    example: ["One product → one machine → one location", "A high-margin drink sells slowly, a lower-margin snack turns fast, and route cost is shared across machines. The location decision depends on volume, mix, and service cost together.", "Unit economics require the correct unit of analysis."],
    practice: ["Calculate contribution profit and margin for a $3.00 product with $1.10 COGS, 3% card fee, 12% commission, and $0.08 spoilage.", "Convert percentage costs to dollars before subtracting every variable cost."],
    questions: [
      ["ceo-unit-q1", "What does contribution profit pay for after variable costs?", "Fixed costs and profit", "Only inventory", "Loan principal only", "Contribution is the amount available after variable unit costs."],
      ["ceo-unit-q2", "A product has high margin but very low turns. What should the CEO conclude?", "Margin alone is insufficient; evaluate volume, capacity, spoilage, and location economics.", "Keep it because percentage margin is all that matters.", "Remove it because low volume is always bad.", "The full unit system combines margin, velocity, and service economics."],
    ],
    project: ["Product-to-location economics", "Analyze one vending product, expand it to a machine and location, and calculate contribution, break-even volume, route burden, and downside.", ["Product contribution", "Machine assumptions", "Location break-even", "Scale recommendation"]],
    fieldMission: ["Observe a real unit model", "Choose a product or service business and ask what one unit is, which cost varies with it, and what constrains profitable volume."],
    boss: ["Revenue doubled, profit did not", "A new location doubles machine revenue but requires frequent service, higher commission, and heavy spoilage.", "What is the strongest diagnosis?", "Rebuild contribution at product, machine, location, and route level; identify which volume, mix, commission, spoilage, or service threshold must change before expanding.", "Renegotiate commission because it is the most visible new cost.", "Add more machines because revenue growth will eventually fix margin.", "This finds the economic layer where value is leaking before more capital follows revenue."],
    reflection: "What is the true unit in the first Skadra business, and which cost is easiest to omit?",
  },
  {
    id: "ceo-roi-roic",
    number: 5,
    skill: "Returns on capital",
    title: "ROI / ROIC",
    tagline: "Compare returns without ignoring time, risk, or the capital base.",
    durationMinutes: 50,
    xpReward: 165,
    scoreSkills: ["investing", "capital-allocation", "finance"],
    missionBrief: "Use ROI, ROIC, ROE, payback, opportunity cost, and downside to compare competing uses of scarce capital.",
    why: "Andrew's central CEO responsibility is choosing among good-looking opportunities with different capital needs, durability, risk, and management burden.",
    outcomes: ["Calculate and distinguish ROI, ROIC, and ROE.", "Compare return with risk and time.", "State the opportunity cost of choosing one investment."],
    concepts: [
      ["ROI", "Gain relative to the investment used to produce it.", "It creates a common language for comparing projects.", "$3,000 annual profit on $12,000 invested is 25% ROI.", "Use a consistent profit and capital definition across choices.", "Mixing one-year profit for one option with lifetime profit for another."],
      ["ROIC", "After-tax operating profit relative to operating capital invested.", "It tests whether the business earns more than the cost and risk of its capital.", "A route earning $18,000 after tax on $90,000 of operating capital produces 20% ROIC.", "Track whether growth compounds value or merely absorbs money.", "Using revenue instead of operating profit in the numerator."],
      ["Opportunity cost", "The return or benefit sacrificed by choosing the next-best alternative.", "Capital committed here cannot be committed elsewhere.", "Buying Machine B means forgoing two smaller machines or debt reduction.", "Name the rejected alternative in every material recommendation.", "Comparing an investment only with doing nothing."],
    ],
    supportingTopics: ["ROE", "Capital invested", "Return versus risk", "Payback", "Liquidity", "Time requirement"],
    example: ["Machine A versus Machine B", "Machine A costs $2,500 and earns $250 monthly; Machine B costs $5,000 and earns $400 monthly. A has higher simple ROI, while B creates more absolute profit and may differ in risk and capacity.", "The correct answer depends on constraints and the next-best use of capital."],
    practice: ["Compare Machine A and Machine B on annual ROI, payback, absolute profit, and downside.", "Use the same time period, then state which constraint changes your choice."],
    questions: [
      ["ceo-roi-q1", "What is Machine A's annual simple ROI at $2,500 cost and $250 monthly profit?", "120%", "10%", "12%", "$3,000 annual profit divided by $2,500 invested equals 120%."],
      ["ceo-roi-q2", "Why is the highest stated ROI not automatically best?", "Risk, durability, liquidity, scale, time, and alternative uses may differ.", "ROI is never useful.", "Only absolute profit matters.", "A CEO compares return in context rather than optimizing one ratio."],
    ],
    project: ["Capital comparison memo", "Compare the two vending machines and one debt-reduction option. Recommend where capital should go and show the opportunity cost.", ["Return calculations", "Risk and liquidity table", "Opportunity cost", "Investment recommendation"]],
    fieldMission: ["Evaluate a real capital expenditure", "Ask an owner how they approved one equipment, hiring, or facility investment and what return evidence they expected."],
    boss: ["The attractive return", "A proposal claims 45% ROI but excludes installation, owner time, working capital, taxes, and a likely second-year overhaul.", "How should the CEO respond?", "Rebuild the capital base and cash returns consistently, add downside and opportunity cost, then approve only against a defined hurdle and ownership plan.", "Ask for installation and maintenance estimates, then use the stated ROI.", "Approve quickly before the opportunity disappears.", "The strongest response protects the comparison from omitted capital and false precision."],
    reflection: "Which nonfinancial constraint should influence Skadra's first major capital decision?",
  },
  {
    id: "ceo-business-valuation",
    number: 6,
    skill: "Business valuation",
    title: "Business Valuation",
    tagline: "Estimate value as a range built from earnings, risk, and evidence.",
    durationMinutes: 60,
    xpReward: 170,
    scoreSkills: ["investing", "deals", "finance"],
    missionBrief: "Value small businesses using normalized earnings, multiples, cash flow, comparables, growth, and risk without pretending the result is perfectly precise.",
    why: "A CEO must separate price from value and know which risks deserve a lower multiple, stronger terms, or a decision to walk away.",
    outcomes: ["Build a defensible valuation range.", "Normalize earnings before applying a multiple.", "Explain how concentration, owner dependence, capex, and growth affect value."],
    concepts: [
      ["Value versus price", "Value is the economic worth to a buyer; price is the amount negotiated.", "Different buyers can rationally value the same business differently.", "A strategic buyer may remove duplicate overhead while a first-time buyer cannot.", "State whose assumptions support the valuation.", "Treating the asking price as evidence of value."],
      ["Earnings multiple", "A market-informed factor applied to normalized SDE, EBITDA, or another earnings base.", "It converts sustainable earnings and risk into an estimate of enterprise value.", "$400,000 of normalized EBITDA at 4.5× implies $1.8 million before debt and cash adjustments.", "Use ranges and connect the multiple to specific evidence.", "Applying a public-company multiple to a dependent small business."],
      ["Normalization", "Adjusting reported results to reflect maintainable operations under the buyer.", "Owner pay, one-time costs, underinvestment, and unusual revenue can distort history.", "A one-time legal bill may be added back; deferred maintenance may require a deduction.", "Challenge every adjustment symmetrically.", "Accepting seller add-backs while ignoring missing expenses."],
    ],
    supportingTopics: ["SDE", "EBITDA", "Cash flow", "Comparable businesses", "Customer concentration", "Owner dependence", "Capex"],
    example: ["Three small businesses", "A route business, HVAC contractor, and bookkeeping firm have similar reported profit but different customer concentration, recurring revenue, management depth, and capex.", "A multiple reflects the quality and risk of earnings, not just their amount."],
    practice: ["Explain why two companies earning $300,000 might deserve 3× and 5× multiples.", "Tie the difference to durability, growth, concentration, management, capex, and transferability."],
    questions: [
      ["ceo-value-q1", "What should happen to value when one customer represents 60% of earnings, all else equal?", "The risk normally supports a lower value or protective structure.", "Value rises because the customer is large.", "Nothing; only earnings matter.", "Concentration makes future earnings less durable."],
      ["ceo-value-q2", "Why use a valuation range?", "Key assumptions and market evidence are uncertain.", "Exact calculation is impossible in accounting.", "Ranges eliminate negotiation.", "A range makes uncertainty and decision thresholds visible."],
    ],
    project: ["Value three fictional businesses", "Normalize earnings, choose an evidence-based multiple range, bridge enterprise to equity value, and explain the key risk for each target.", ["Normalized earnings", "Multiple range", "Value bridge", "Risk-adjusted recommendation"]],
    fieldMission: ["Analyze a business-for-sale listing", "Select one public listing and identify the earnings claim, implied multiple, missing information, and five diligence questions."],
    boss: ["The premium listing", "A seller asks 6× SDE for a company with 45% customer concentration, old equipment, no manager, and two years of growth.", "What is the strongest first valuation response?", "Normalize SDE, quantify concentration and replacement capex, test transferability, compare credible transactions, and build a range before discussing structure.", "Offer 4× because small businesses usually trade lower.", "Accept 6× because growth deserves a premium.", "The response converts broad concern into evidence and preserves options for price and structure."],
    reflection: "Which risk most often makes historical earnings less valuable to a new owner?",
  },
  {
    id: "ceo-sde-ebitda",
    number: 7,
    skill: "Normalized earnings",
    title: "SDE & EBITDA",
    tagline: "Separate reported profit, owner benefit, and transferable earnings.",
    durationMinutes: 55,
    xpReward: 170,
    scoreSkills: ["accounting", "deals", "finance"],
    missionBrief: "Rebuild messy small-business earnings and judge add-backs, owner compensation, capex, and working-capital needs.",
    why: "Purchase price and debt capacity often depend on normalized earnings. Weak add-back judgment can make an apparently affordable acquisition dangerous.",
    outcomes: ["Calculate adjusted SDE and EBITDA.", "Accept or reject add-backs with evidence.", "Recognize capex and working-capital needs that earnings metrics omit."],
    concepts: [
      ["SDE", "Seller's Discretionary Earnings estimates one full-time owner-operator's economic benefit.", "It is common in smaller owner-operated business valuation.", "Pretax income may be adjusted for one owner's pay, interest, and supported one-time items.", "Use it only when the buyer will replace that owner role appropriately.", "Adding back owner pay without budgeting replacement management."],
      ["EBITDA", "Earnings before interest, taxes, depreciation, and amortization.", "It approximates operating earnings before capital structure and some noncash charges.", "A manager-run company may be compared on adjusted EBITDA.", "Bridge EBITDA to real cash after capex, taxes, debt, and working capital.", "Calling EBITDA cash flow."],
      ["Add-back quality", "An add-back is valid only when the cost is documented, nonrecurring, and unnecessary under the buyer.", "Aggressive add-backs inflate price and debt capacity.", "A settled one-time lawsuit may qualify; recurring 'one-time' travel does not.", "Require invoices, history, and a post-close operating plan.", "Treating every discretionary expense as removable."],
    ],
    supportingTopics: ["Owner compensation", "Questionable add-backs", "Normalized earnings", "Capex", "Working capital", "Replacement salary"],
    example: ["The messy seller P&L", "Reported profit includes owner's family payroll, a real one-time legal cost, deferred maintenance, personal vehicles, and no salary for a replacement GM.", "Normalization must add and subtract—not merely increase earnings."],
    practice: ["Classify six proposed add-backs as valid, invalid, or requiring evidence.", "Ask whether the cost recurs, whether it is required under your plan, and what replacement expense appears."],
    questions: [
      ["ceo-sde-q1", "Which adjustment is most likely valid?", "A documented one-time legal settlement that will not recur", "All owner travel labeled discretionary", "A manager salary the buyer still needs", "A supported nonrecurring expense can be normalized."],
      ["ceo-sde-q2", "Why is EBITDA not cash flow?", "It excludes capex, working capital, taxes, and debt service.", "It excludes revenue.", "It is always lower than cash flow.", "The bridge from operating earnings to cash remains essential."],
    ],
    project: ["Rebuild adjusted earnings", "Calculate adjusted SDE and EBITDA from a messy fictional P&L, challenge questionable add-backs, and bridge to cash available for debt service.", ["Reported-to-adjusted bridge", "Add-back evidence table", "Replacement management cost", "Cash-flow caution"]],
    fieldMission: ["Review a listing's add-backs", "Find a business listing that states SDE or EBITDA and identify which adjustments require proof."],
    boss: ["The $250,000 add-back", "A seller adds back family payroll, vehicles, travel, deferred maintenance, and all owner compensation. The buyer needs a GM after close.", "What should the underwriting use?", "Validate every item, subtract replacement management and deferred investment, present a range, and size price and debt to conservative transferable earnings.", "Remove the most questionable two items and use the rest.", "Use seller SDE because the broker prepared it.", "This protects debt capacity and price from earnings the buyer cannot actually retain."],
    reflection: "Which add-back would you be most likely to accept too quickly, and what proof would you require?",
  },
  {
    id: "ceo-debt-financing",
    number: 8,
    skill: "Debt and financing",
    title: "Debt & Financing",
    tagline: "Use leverage as a tool without surrendering resilience.",
    durationMinutes: 60,
    xpReward: 175,
    scoreSkills: ["finance", "deals", "capital-allocation"],
    missionBrief: "Structure buyer equity, bank or SBA debt, and seller financing while testing debt service, covenants, collateral, and downside.",
    why: "Financing can improve equity returns and expand opportunity, but fixed obligations can destroy flexibility when assumptions fail.",
    outcomes: ["Calculate amortizing debt service and DSCR.", "Compare bank, SBA, seller-note, and equity tradeoffs.", "Identify personal-guarantee, collateral, covenant, and refinancing risk."],
    concepts: [
      ["Amortization", "Scheduled payments split between interest and principal over a term.", "Debt service can be much larger than interest expense shown in profit.", "A ten-year acquisition loan requires monthly principal and interest.", "Model the complete payment schedule and balloon risk.", "Using interest expense as total debt service."],
      ["DSCR", "Cash available for debt service divided by required debt payments.", "It measures the cushion protecting lenders and owners.", "$300,000 available cash divided by $200,000 debt service is 1.5× DSCR.", "Stress DSCR under lower earnings and higher rates.", "Treating 1.0× as a comfortable margin."],
      ["Seller financing", "The seller accepts a note paid from future buyer cash flow.", "It can bridge valuation, align confidence, and reduce bank funding needs.", "A 10% seller note may be subordinated to the senior lender.", "Negotiate term, standby, security, and offsets with the full structure.", "Assuming seller financing removes business risk."],
    ],
    supportingTopics: ["Principal", "Interest", "Term", "Collateral", "Personal guarantee", "Leverage", "SBA financing", "Covenants"],
    example: ["Financing a $1.5 million acquisition", "The buyer combines $225,000 equity, SBA debt, and a seller note. Returns improve, but DSCR and personal-guarantee exposure become central.", "Structure changes both upside and the consequences of being wrong."],
    practice: ["Calculate DSCR when cash available for debt service is $260,000 and annual debt service is $190,000.", "Divide available cash by required principal and interest, then stress a 20% earnings decline."],
    questions: [
      ["ceo-debt-q1", "What does 1.3× DSCR mean?", "Cash available is 1.3 times required debt service.", "Interest rate is 1.3%.", "Debt equals 130% of revenue.", "DSCR is a coverage ratio, not a rate or leverage percentage."],
      ["ceo-debt-q2", "What does a personal guarantee change?", "The lender may pursue the guarantor under the agreement if the business cannot pay.", "It lowers principal automatically.", "It eliminates collateral requirements.", "The CEO must understand personal downside, not only business return."],
    ],
    project: ["Finance the acquisition", "Structure buyer equity, SBA or bank debt, and a seller note for a fictional acquisition. Calculate debt service, DSCR, remaining cash, and downside.", ["Sources and uses", "Debt schedule", "Base and downside DSCR", "Guarantee and covenant risks"]],
    fieldMission: ["Talk with a lender", "Ask a commercial or SBA lender which assumptions, coverage ratios, guarantees, and management evidence matter most."],
    boss: ["The leveraged deal", "A target covers debt at 1.25× using seller adjustments. A 15% earnings decline reduces coverage below 1.0×, and the buyer gives a personal guarantee.", "What should the CEO change before proceeding?", "Re-underwrite conservative earnings, reduce price or debt, add seller risk-sharing and liquidity, and define a coverage threshold that survives plausible downside.", "Keep the structure but hold three months of payments in cash.", "Proceed because leverage increases equity returns.", "The response aligns structure with downside rather than using leverage to hide a thin deal."],
    reflection: "Which debt term could matter more than the headline interest rate?",
  },
  {
    id: "ceo-investment-analysis",
    number: 9,
    skill: "Investment analysis",
    title: "Investment Analysis",
    tagline: "Compare cash flows, time, risk, and strategic fit on one decision page.",
    durationMinutes: 60,
    xpReward: 180,
    scoreSkills: ["investing", "capital-allocation", "strategy"],
    missionBrief: "Use cash-on-cash return, NPV, IRR, payback, scenario analysis, and opportunity cost to compare unlike investments.",
    why: "Skadra may choose among vending, real estate, acquisitions, systems, hiring, or debt reduction. Andrew needs a consistent decision framework.",
    outcomes: ["Interpret NPV and IRR without treating either as a verdict.", "Compare return, liquidity, duration, and management intensity.", "Recommend where the next $100,000 should go under scenarios."],
    concepts: [
      ["NPV", "Present value of future cash flows minus the initial investment.", "It estimates value created after applying a required return.", "A positive NPV at 15% suggests projected cash exceeds the hurdle rate.", "Use scenario-specific cash flows and an explainable hurdle.", "Believing a model makes distant cash certain."],
      ["IRR", "The discount rate that makes projected NPV equal zero.", "It summarizes timing and magnitude as a return rate.", "Earlier cash often raises IRR even if total dollars are lower.", "Compare IRR with scale, reinvestment assumptions, and risk.", "Choosing the highest IRR despite tiny dollar value."],
      ["Scenario analysis", "A structured comparison of outcomes under changed assumptions.", "It makes uncertainty visible and identifies which variable drives loss.", "Bear, base, and bull cases change volume, margin, and exit value.", "Tie actions and capital limits to scenario thresholds.", "Changing many assumptions without explaining why."],
    ],
    supportingTopics: ["Cash-on-cash return", "Payback", "Risk-adjusted return", "Sensitivity", "Opportunity cost", "Strategic fit"],
    example: ["Where should $100,000 go?", "A vending route offers fast payback and operating work; a rental offers moderate yield and leverage; a small acquisition offers scale with concentrated risk.", "Comparable math supports—but does not replace—judgment about capability and strategy."],
    practice: ["Rank a vending route, rental property, and acquisition using six decision criteria.", "Use return, downside, liquidity, duration, strategic fit, and management time."],
    questions: [
      ["ceo-invest-q1", "What does a positive NPV at the chosen hurdle rate suggest?", "Projected cash flows exceed the required return on those assumptions.", "The investment cannot lose money.", "IRR equals the hurdle exactly.", "NPV is assumption-dependent evidence of value creation."],
      ["ceo-invest-q2", "Why can a smaller project with higher IRR still be inferior?", "It may create fewer dollars, have less strategic value, or rely on unrealistic reinvestment.", "IRR is always wrong.", "Only payback matters.", "Rate, scale, timing, and strategic context belong together."],
    ],
    project: ["Allocate the next $100,000", "Compare a vending route, rental property, and small acquisition using consistent cash flows, scenarios, return metrics, and a decision memo.", ["Comparable assumptions", "NPV/IRR/payback", "Bear/base/bull cases", "Capital recommendation"]],
    fieldMission: ["Build a real investment memo", "Choose a public business, property, or equipment opportunity and write a one-page thesis, risks, assumptions, and next diligence step."],
    boss: ["Three attractive investments", "One choice has high IRR but tiny scale, one has stable cash but low liquidity, and one has strategic value with execution risk.", "How should the CEO decide?", "Apply a consistent hurdle and scenarios, quantify value and downside, test strategic capability and liquidity, and state what must be true for the chosen allocation.", "Average the return metrics and select the highest score.", "Choose the highest IRR.", "The response compares unlike assets without hiding judgment inside one metric."],
    reflection: "Which investment metric are you most likely to over-trust?",
  },
  {
    id: "ceo-negotiation",
    number: 10,
    skill: "Negotiation",
    title: "Negotiation",
    tagline: "Discover interests before trading price, risk, timing, and structure.",
    durationMinutes: 50,
    xpReward: 170,
    scoreSkills: ["deals", "leadership", "strategy"],
    missionBrief: "Prepare BATNA, interests, questions, concessions, and deal structure before entering a consequential conversation.",
    why: "CEOs negotiate acquisitions, financing, partnerships, talent, leases, and customer commitments where a narrow price fight misses valuable terms.",
    outcomes: ["Prepare a credible BATNA and walk-away point.", "Separate stated position from underlying interest.", "Trade across economics, risk, timing, certainty, and responsibility."],
    concepts: [
      ["BATNA", "The best available course if no agreement is reached.", "A real alternative prevents fear from dictating terms.", "Skadra can pursue a second location instead of accepting a weak commission structure.", "Improve alternatives before negotiating under pressure.", "Inventing a bluff instead of building an option."],
      ["Interests versus positions", "A position states a demand; an interest explains why it matters.", "Interests create more ways to solve the actual problem.", "A 20% commission demand may reflect fairness, budget pressure, or comparison with an incumbent.", "Ask calibrated questions before countering.", "Assuming every demand is only about price."],
      ["Concession discipline", "Every movement should be deliberate, conditional, and exchanged for value.", "Unreciprocated concessions teach the other side to keep asking.", "A longer term may justify installation support or lower commission.", "Plan priority, cost, and trade value before the meeting.", "Splitting the difference automatically."],
    ],
    supportingTopics: ["Preparation", "Tactical empathy", "Calibrated questions", "Deal structure", "Certainty", "Walk-away conditions"],
    example: ["The 20% location commission", "The manager demands 20%. Andrew first learns the incumbent terms, employee complaints, desired service, decision process, and budget purpose before discussing a package.", "Discovery creates terms a reflexive 10% counter cannot see."],
    practice: ["Write five discovery questions before responding to a 20% commission demand.", "Ask about comparison, service, decision criteria, risk, timing, and what a successful partnership changes."],
    questions: [
      ["ceo-negotiation-q1", "What is the strongest first response to a new price demand?", "Clarify the interest, evidence, alternatives, and decision process before conceding.", "Counter halfway immediately.", "Reject it to show strength.", "Discovery protects both economics and relationship."],
      ["ceo-negotiation-q2", "What makes a concession disciplined?", "It is conditional and exchanged for something of value.", "It is offered early to build goodwill.", "It always splits the difference.", "Conditional trades preserve value and reveal priorities."],
    ],
    project: ["Build the negotiation brief", "Prepare the commission negotiation with objectives, BATNA, interests, questions, package options, concessions, and walk-away conditions.", ["BATNA", "Interest map", "Question plan", "Three packages", "Concession rules"]],
    fieldMission: ["Negotiate a low-stakes term", "Practice discovery and a conditional trade in a real low-risk conversation, then log what changed."],
    boss: ["Commission without discovery", "A location owner demands 20%, cites another vendor, and will decide Friday. Service quality and term length are unknown.", "What should Andrew do next?", "Acknowledge the request, investigate the comparison and underlying interests, clarify service and decision criteria, then propose conditional packages instead of one number.", "Counter at 12% with better service.", "Accept 20% to win the location.", "This preserves the deadline while creating enough information to negotiate the whole deal."],
    reflection: "Which concession do you tend to give before learning whether the other side values it?",
  },
  {
    id: "ceo-real-estate-underwriting",
    number: 11,
    skill: "Real estate underwriting",
    title: "Real Estate Underwriting",
    tagline: "Convert rent, vacancy, expenses, debt, and reserves into a decision.",
    durationMinutes: 65,
    xpReward: 185,
    scoreSkills: ["investing", "finance", "deals"],
    missionBrief: "Underwrite a small apartment property using NOI, cap rate, debt service, DSCR, cash-on-cash return, capex, and downside.",
    why: "Real estate can produce durable cash flow and strategic assets, but optimistic vacancy, expenses, leverage, or deferred capex can erase the case.",
    outcomes: ["Calculate NOI and cap rate correctly.", "Model debt service, DSCR, and cash-on-cash return.", "Recommend buy, negotiate, or pass under bear/base/bull assumptions."],
    concepts: [
      ["NOI", "Property revenue minus operating expenses before debt service, income tax, and capital expenditures.", "NOI drives valuation and debt coverage.", "$180,000 effective income minus $75,000 operating expenses equals $105,000 NOI.", "Normalize occupancy and expenses before applying a cap rate.", "Subtracting mortgage principal inside NOI."],
      ["Cap rate", "NOI divided by purchase price or value.", "It relates current unlevered income to asset value.", "$100,000 NOI on a $1.25 million price is an 8% cap rate.", "Compare quality, growth, location, capex, and risk—not the rate alone.", "Calling a high cap rate automatically better."],
      ["Cash-on-cash return", "Annual pre-tax cash flow divided by cash equity invested.", "It shows current levered cash yield on the buyer's equity.", "$30,000 cash flow on $300,000 equity is 10% cash-on-cash.", "Stress debt, vacancy, repairs, and reserves.", "Ignoring future capital work because it is not an operating expense."],
    ],
    supportingTopics: ["Vacancy", "Operating expenses", "Debt service", "DSCR", "Capex", "Reserves", "Leverage", "Exit assumptions"],
    example: ["The 20-unit property", "A 94%-occupied building looks attractive until taxes reset, roofs need replacement, and one employer drives local demand.", "Underwriting converts hidden operational facts into price and reserve decisions."],
    practice: ["Calculate NOI, cap rate, and DSCR from a simple property case.", "Keep operating expenses, capital items, and debt service in the correct sections."],
    questions: [
      ["ceo-re-q1", "Which item is excluded from NOI?", "Mortgage principal and interest", "Property taxes", "Routine repairs", "NOI is unlevered property operating income before debt service."],
      ["ceo-re-q2", "What should deferred roof replacement do to the case?", "Increase near-term capex or reserves and potentially reduce price.", "Increase NOI.", "Have no effect until the roof fails.", "Real capital needs affect cash and value even when excluded from NOI."],
    ],
    project: ["Underwrite the apartment property", "Build a bear/base/bull underwriting for a fictional apartment building and decide buy, negotiate, or pass.", ["Rent and vacancy schedule", "NOI and cap rate", "Debt/DSCR/cash-on-cash", "Capex reserve", "Decision memo"]],
    fieldMission: ["Underwrite a real listing", "Select a public small commercial or multifamily listing and identify missing rent, expense, capex, debt, and market evidence."],
    boss: ["The high-cap-rate property", "A property shows a 10% cap rate, but taxes reset after sale, occupancy depends on one employer, roofs are near end of life, and seller expenses look low.", "What is the strongest decision process?", "Normalize taxes and expenses, verify leases and collections, fund capex reserves, stress occupancy and debt coverage, then reprice or pass against a clear hurdle.", "Reduce the offer by the roof estimate.", "Buy because the cap rate is above market.", "The response tests every driver behind the headline yield before capital is committed."],
    reflection: "Which real-estate assumption creates the largest invisible downside?",
  },
  {
    id: "ceo-business-acquisitions",
    number: 12,
    skill: "Business acquisitions",
    title: "Business Acquisition Fundamentals",
    tagline: "Move from search to transition without skipping the decision gates.",
    durationMinutes: 65,
    xpReward: 190,
    scoreSkills: ["deals", "investing", "strategy"],
    missionBrief: "Screen a business listing through NDA, seller call, LOI, diligence, financing, closing, and transition.",
    why: "A disciplined acquisition process protects time, capital, and reputation while moving promising targets toward evidence-based decisions.",
    outcomes: ["Describe the acquisition process and decision gates.", "Screen earnings, concentration, management, capex, and financing fit.", "Write the questions and conditions needed before an LOI."],
    concepts: [
      ["Search criteria", "A written definition of target size, industry, geography, economics, risk, and ownership fit.", "Criteria keep attractive distractions from consuming the pipeline.", "Skadra may target durable local services with $300,000–$800,000 EBITDA and management potential.", "Use criteria to say no early and learn systematically.", "Changing the thesis to fit every listing."],
      ["LOI", "A mostly nonbinding outline of price, structure, exclusivity, diligence, and closing conditions.", "It focuses negotiation while preserving diligence and documentation.", "Price may depend on normalized working capital and seller financing.", "State assumptions and protections before exclusivity.", "Treating an LOI as final certainty."],
      ["Transition", "The transfer of customers, people, knowledge, authority, relationships, and systems after closing.", "Value can disappear quickly if the business depends on the seller.", "Top customers and employees need a sequenced communication and retention plan.", "Underwrite transition before signing, not after closing.", "Assuming the company runs itself because revenue is recurring."],
    ],
    supportingTopics: ["NDA", "CIM", "Seller call", "Screening", "Financing", "Purchase agreement", "Closing", "Working capital"],
    example: ["The $750,000 listing", "A route-service company shows $250,000 SDE, high owner involvement, aging vehicles, two large customers, and an open seller-financing option.", "The screen should expose both reasons to advance and facts required before price confidence."],
    practice: ["Write ten first-call questions for the $750,000 listing.", "Cover earnings, concentration, owner role, management, capex, working capital, growth, employees, financing, and seller goals."],
    questions: [
      ["ceo-ma-q1", "What is the main purpose of search criteria?", "Focus time and capital on targets that fit a defined thesis.", "Guarantee every target is profitable.", "Replace diligence.", "Criteria create an explicit filter and learning loop."],
      ["ceo-ma-q2", "Why underwrite transition before closing?", "Customer, employee, and owner dependence can destroy expected value immediately.", "The seller requires it by law.", "It increases the multiple automatically.", "Transferability is part of the asset being purchased."],
    ],
    project: ["Screen the $750,000 business", "Analyze a fictional listing and produce an advance/pass screen with SDE, EBITDA, concentration, management, capex, working capital, debt, seller financing, and next questions.", ["Search-fit score", "Earnings and value screen", "Risk map", "Seller-call questions", "Advance/pass decision"]],
    fieldMission: ["Speak with an acquisition entrepreneur", "Ask how they source, reject, and advance deals and which early signal has saved the most time."],
    boss: ["The urgent seller", "A broker requests an LOI in 48 hours. Earnings look attractive, but customer concentration, owner dependence, working capital, and vehicle condition are unclear.", "What should Andrew do?", "Issue only a clearly conditional range or pause, state assumptions, request critical evidence, preserve diligence rights, and avoid manufactured urgency overriding the search criteria.", "Submit a low LOI to reserve the opportunity.", "Match the asking price before another buyer does.", "The response keeps momentum without turning unknowns into committed capital."],
    reflection: "Which acquisition gate are you most tempted to rush when a deal feels scarce?",
  },
  {
    id: "ceo-due-diligence",
    number: 13,
    skill: "Due diligence",
    title: "Due Diligence",
    tagline: "Test the investment thesis across numbers, operations, people, and obligations.",
    durationMinutes: 70,
    xpReward: 195,
    scoreSkills: ["deals", "investing", "systems"],
    missionBrief: "Run a data-room investigation that connects financial, operational, commercial, legal, tax, people, technology, vendor, and environmental evidence.",
    why: "Diligence is not document collection. The CEO must decide whether evidence supports, changes, reprices, restructures, or kills the thesis.",
    outcomes: ["Build a thesis-driven diligence plan.", "Cross-check documents and operating evidence.", "Escalate findings into price, structure, closing conditions, or a pass."],
    concepts: [
      ["Thesis-driven diligence", "Testing the specific reasons the investment should create value and the risks that could break them.", "It focuses limited time on decision-relevant evidence.", "If retention supports value, cohort data and customer calls matter more than a generic checklist.", "Assign each claim an owner, source, and decision consequence.", "Completing a checklist without updating the thesis."],
      ["Quality of earnings", "Analysis of whether reported earnings are accurate, sustainable, and converted to cash.", "Purchase price and debt depend on transferable earnings quality.", "Bank deposits, invoices, tax returns, payroll, and customer data should reconcile.", "Investigate trends, cut-off, add-backs, concentration, and working capital.", "Treating audited-looking schedules as independent proof."],
      ["Red-flag consequence", "A finding matters through its effect on value, structure, certainty, or willingness to proceed.", "Not every issue kills a deal, and not every issue is fixable with price.", "Unpermitted work may require a closing condition; fraud may require walking away.", "State severity, evidence, mitigation, owner, and decision date.", "Building a long issue list with no decision impact."],
    ],
    supportingTopics: ["Financial", "Operational", "Commercial", "Legal", "Tax", "People", "Technology", "Customer", "Vendor", "Environmental"],
    example: ["The HVAC data room", "Revenue totals reconcile, but technician turnover, warranty claims, deferred fleet maintenance, owner-approved pricing, and one disputed tax filing challenge the thesis.", "The best finding is connected to future cash, transition, or legal exposure."],
    practice: ["Write five cross-checks that could reveal a hidden earnings or customer problem.", "Reconcile records from independent sources and explain what each discrepancy would change."],
    questions: [
      ["ceo-dd-q1", "What makes diligence thesis-driven?", "Each workstream tests a value claim or material risk and has a decision consequence.", "Every possible document is requested.", "Only financial data is reviewed.", "Diligence should update the investment decision, not fill a folder."],
      ["ceo-dd-q2", "A red flag is found. What is the next analytical step?", "Quantify severity and connect it to mitigation, price, structure, condition, or a pass.", "Automatically end the deal.", "Save it for after closing.", "Consequences turn findings into executive decisions."],
    ],
    project: ["Data-room investigation", "Review a fictional HVAC data room with hidden inconsistencies. Produce findings, evidence, financial impact, mitigation, and a revised recommendation.", ["Diligence tracker", "Five material findings", "Earnings/working-capital adjustments", "Deal-impact recommendation"]],
    fieldMission: ["Interview a diligence professional", "Ask a CPA, attorney, lender, operator, or acquisition entrepreneur which finding most often changes a small-business deal."],
    boss: ["The clean summary, messy evidence", "The CIM shows stable margins. Payroll shows technician turnover, warranty claims rose, vehicle maintenance fell, and one customer contract expires after closing.", "What should the CEO do?", "Reconcile the earnings effect, test customer and workforce durability, quantify catch-up investment, update valuation and structure, and pause approval until decision-critical gaps close.", "Request seller explanations and reduce price by a general reserve.", "Proceed because the financial summary is clean.", "The response connects operating evidence to earnings quality, transition, and deal protection."],
    reflection: "Which diligence finding would be impossible to solve with a lower price?",
  },
  {
    id: "ceo-financial-modeling",
    number: 14,
    skill: "Financial modeling",
    title: "Financial Modeling",
    tagline: "Turn assumptions into statements, cash, returns, scenarios, and a decision.",
    durationMinutes: 75,
    xpReward: 210,
    scoreSkills: ["finance", "accounting", "systems", "investing"],
    missionBrief: "Build Skadra Ventures Asset #001 from assumptions through revenue, expenses, statements, debt, returns, scenarios, and dashboard.",
    why: "A useful model makes assumptions and consequences inspectable. It does not hide uncertainty behind spreadsheet precision.",
    outcomes: ["Build a coherent model architecture.", "Link operating assumptions to cash and returns.", "Use bear/base/bull cases to make a buy or don't-buy decision."],
    concepts: [
      ["Model architecture", "A deliberate flow from assumptions to calculations, statements, returns, scenarios, and outputs.", "Clear structure reduces hidden errors and makes review possible.", "Units sold and price drive revenue; COGS, fees, and commission drive contribution.", "Separate inputs, formulas, and outputs and document sources.", "Hard-coding assumptions inside formulas."],
      ["Three-statement linkage", "Income, balance-sheet changes, and cash movement reconcile inside one model.", "Returns built on disconnected schedules can be internally inconsistent.", "Inventory growth affects the balance sheet and operating cash, not just expense.", "Add checks for cash, debt, and balance-sheet balance.", "Forecasting profit without funding working capital."],
      ["Sensitivity", "Measuring how an output changes when one or two key assumptions move.", "It identifies the variables that deserve evidence and control.", "Payback may be most sensitive to daily units and commission.", "Focus diligence and operating dashboards on the real drivers.", "Changing every assumption at once and calling it insight."],
    ],
    supportingTopics: ["Assumptions", "Revenue", "Expenses", "Income statement", "Balance sheet", "Cash flow", "Debt", "Returns", "Dashboard"],
    example: ["Skadra Ventures — Asset #001", "The model includes machine price, installation, inventory, daily units, price, COGS, fees, commission, maintenance, fuel, insurance, tax, and financing.", "The output must reconcile economics, cash, break-even, payback, ROI, ROIC, and cash-on-cash."],
    practice: ["Design the tabs and calculation flow for Asset #001 before entering a number.", "Separate assumptions, operating schedules, statements, debt, returns, scenarios, and dashboard."],
    questions: [
      ["ceo-model-q1", "Where should a changeable selling-price assumption live?", "In a clearly labeled assumptions section referenced by formulas", "Inside every revenue formula", "Only in the dashboard", "Central assumptions improve auditability and scenario control."],
      ["ceo-model-q2", "What makes a sensitivity useful?", "It shows which uncertain driver materially changes the decision.", "It creates more outputs.", "It guarantees the base case.", "Sensitivity directs evidence gathering and risk response."],
    ],
    project: ["Skadra Ventures — Asset #001", "Build the complete investment model for one vending machine with bear/base/bull scenarios and a final buy or don't-buy recommendation.", ["Documented assumptions", "Operating and cash schedules", "Break-even/payback/ROI/ROIC", "Bear/base/bull dashboard", "Buy/don't-buy memo"]],
    fieldMission: ["Validate one model assumption", "Get a real quote, traffic observation, product-cost sample, commission benchmark, or lender term and replace one guessed model input."],
    boss: ["The precise spreadsheet", "The model shows a 31.7% return, but volume is copied from a different location, maintenance is zero, working capital is omitted, and the downside case changes only price.", "What should the CEO do?", "Reject false precision, source the key assumptions, add missing cash uses, test independent downside drivers, and decide only after the model reveals what must be true.", "Add a 10% contingency to all expenses.", "Approve because the modeled return exceeds the hurdle.", "The response turns the spreadsheet into a decision system rather than a confidence prop."],
    reflection: "Which model assumption should become an operating KPI after the asset is purchased?",
  },
  {
    id: "ceo-leadership-delegation",
    number: 15,
    skill: "Leadership and delegation",
    title: "Leadership & Delegation",
    tagline: "Build a team and system that can operate without founder heroics.",
    durationMinutes: 60,
    xpReward: 195,
    scoreSkills: ["leadership", "systems", "strategy"],
    missionBrief: "Move from doing every task to defining outcomes, hiring capability, managing managers, and creating accountable operating systems.",
    why: "Andrew's long-term CEO work must concentrate on people, strategy, deals, and capital—not become the permanent bottleneck in every asset.",
    outcomes: ["Delegate outcomes with authority and standards.", "Design manager scorecards and review rhythms.", "Remove founder dependence without abandoning accountability."],
    concepts: [
      ["Outcome delegation", "Assigning a result, standard, authority, resources, and checkpoint—not merely a task.", "It allows judgment to move closer to the work while preserving accountability.", "A route lead owns 98% in-stock performance within budget and escalates defined exceptions.", "Make decision rights and evidence explicit.", "Delegating activity while retaining every decision."],
      ["Managing managers", "Setting direction, selecting leaders, reviewing outcomes, and coaching judgment through a management layer.", "Scale requires leaders who can create performance through others.", "The CEO reviews unit scorecards and leader development instead of every route issue.", "Evaluate both results and how the system produces them.", "Bypassing managers whenever pressure rises."],
      ["Founder-light system", "A business where routine value creation does not depend on daily founder intervention.", "Transferability, resilience, and executive capacity increase.", "SOPs, dashboards, owners, escalation rules, and capable managers replace memory.", "Remove one dependency at a time and test the control loop.", "Confusing founder-light with absent ownership."],
    ],
    supportingTopics: ["Hiring", "Organizational design", "Accountability", "KPIs", "Executive communication", "SOPs", "Decision rights"],
    example: ["Twenty machines, one bottleneck", "Andrew approves inventory, plans routes, handles repairs, answers customers, closes books, and evaluates locations. Growth increases his workload instead of system capacity.", "The organization must be redesigned before more units are added."],
    practice: ["Sort twenty founder tasks into keep, delegate, automate, eliminate, and redesign.", "Keep only work that truly requires CEO judgment, and state the control retained for delegated outcomes."],
    questions: [
      ["ceo-lead-q1", "What makes delegation complete?", "Outcome, owner, authority, standard, resources, checkpoint, and escalation rule", "A task list and deadline", "Trust with no follow-up", "Delegation transfers ownership while preserving a visible control loop."],
      ["ceo-lead-q2", "What is the CEO's role when managing managers?", "Set direction, select and develop leaders, review outcomes, and resolve system-level constraints.", "Approve every frontline decision.", "Avoid operating information.", "Executive leverage comes from accountable leaders and systems."],
    ],
    project: ["Make the vending business founder-light", "Redesign a 20-machine business Andrew currently runs alone. Build the org, role outcomes, SOP priorities, dashboard, meeting rhythm, and transition sequence.", ["Founder task audit", "Organization design", "Manager scorecard", "Delegation sequence", "Escalation rules"]],
    fieldMission: ["Interview a leader who delegated", "Ask an owner or executive which responsibility was hardest to release, what control replaced direct work, and what failed first."],
    boss: ["The capable new lead", "A new route lead misses one service standard during the first month. Andrew can fix it faster himself, and a key customer is watching.", "What is the strongest CEO response?", "Protect the customer, require the lead to diagnose and own recovery, coach the judgment gap, verify the system, and keep the role's authority intact unless evidence shows a capability problem.", "Step in this time and return authority after the customer is stable.", "Take the route back permanently.", "The response protects the customer without rebuilding founder dependence after one miss."],
    reflection: "Which decision should no longer require you once Skadra has a capable manager?",
  },
  {
    id: "ceo-capital-allocation",
    number: 16,
    skill: "Capital allocation",
    title: "Capital Allocation",
    tagline: "Choose where the next dollar can create the most durable value.",
    durationMinutes: 75,
    xpReward: 250,
    scoreSkills: ["capital-allocation", "strategy", "investing", "leadership"],
    missionBrief: "Allocate $250,000 among reinvestment, acquisitions, debt, cash, property, hiring, automation, distributions, and outside investments.",
    why: "Capital allocation is the Campaign I final boss and a defining CEO responsibility. Every choice carries return, risk, liquidity, strategic, and opportunity-cost consequences.",
    outcomes: ["Set an allocation framework and hurdle rates.", "Compare opportunities across return, risk, liquidity, fit, time, and downside.", "Defend a portfolio of decisions rather than one favorite project."],
    concepts: [
      ["Capital allocation", "Directing cash, debt capacity, equity, time, and attention among competing uses.", "Repeated allocation decisions determine long-term compounding and resilience.", "Skadra can reinvest, acquire, repay debt, hold cash, hire, automate, or distribute.", "Make the rejected alternatives and constraints explicit.", "Calling every growth expense an investment."],
      ["Hurdle rate", "The minimum risk-adjusted return required for a class of investment.", "It prevents scarce capital from following excitement or sunk cost.", "A proven route expansion may have a lower hurdle than an unfamiliar turnaround acquisition.", "Adjust for risk, illiquidity, duration, and capability.", "Using one hurdle for cash, debt repayment, real estate, and early ventures."],
      ["Portfolio resilience", "The ability of the total set of assets and obligations to withstand adverse outcomes.", "Individually attractive investments can create collective liquidity or concentration risk.", "Several leveraged assets may fail together during a recession.", "Preserve cash, debt capacity, and management bandwidth across the portfolio.", "Optimizing each deal without modeling the company balance sheet."],
    ],
    supportingTopics: ["Reinvest", "Acquire", "Pay debt", "Hold cash", "Buy property", "Hire", "Automate", "Distribute", "Opportunity cost"],
    example: ["The $250,000 allocation", "Choices include new machines, debt repayment, an HVAC equity check, a property down payment, a controller hire, route software, cash reserve, and distribution.", "The best allocation is a coherent portfolio with explicit assumptions and limits."],
    practice: ["Create a capital-allocation scorecard with seven criteria and explain the weights.", "Include expected return, downside, liquidity, strategic fit, management time, evidence quality, and reversibility."],
    questions: [
      ["ceo-capital-q1", "What is the opportunity cost of holding cash?", "The risk-adjusted return and strategic benefit forgone from the best available alternative.", "Cash has no value.", "Only inflation.", "Liquidity has value, but it still competes with other uses."],
      ["ceo-capital-q2", "Why evaluate portfolio resilience?", "Risks can correlate and exhaust cash, debt capacity, or management attention together.", "Every asset should have the same return.", "Diversification always eliminates loss.", "The company survives the combined downside, not isolated base cases."],
    ],
    project: ["Allocate Skadra's $250,000", "Evaluate realistic opportunities and produce a capital plan with amounts, expected returns, risks, liquidity, strategic fit, time requirements, downside, and opportunity cost.", ["Capital inventory and constraints", "Comparable opportunity memos", "Portfolio allocation", "Downside liquidity test", "Board-ready decision rationale"]],
    fieldMission: ["Ask an owner where the next dollar goes", "Interview a business owner, investor, lender, or CFO about the hardest allocation decision they made and what they would measure differently."],
    boss: ["Where should the next $1 go?", "Skadra has $250,000, moderate debt, one proven vending route, an acquisition opportunity, a property option, an overloaded operating team, and uncertain economic conditions.", "How should Andrew allocate the capital?", "Set constraints and reserves, compare risk-adjusted returns and strategic capacity, allocate across the strongest evidence-backed uses, preserve downside flexibility, and name triggers for releasing or reallocating capital.", "Fund the proven route and hold the remaining cash until uncertainty clears.", "Put all capital into the opportunity with the highest projected IRR.", "The response treats capital allocation as a portfolio system with staged commitments and learning—not a single spreadsheet ranking."],
    reflection: "Where should the next $1 of Skadra Ventures capital go, and what evidence could change your answer?",
  },
] as const satisfies readonly CeoLevelBlueprint[];

export const ceoYearOneLevels: readonly OperatorLevel[] =
  blueprints.map(defineCeoLevel);

