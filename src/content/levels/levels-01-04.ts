import { bossOptions, concept, defineLevel, question } from "@/content/levels/helpers";

export const levels01To04 = [
  defineLevel({
    id: "follow-the-money",
    number: 1,
    skill: "Business financial basics",
    title: "Follow the Money",
    tagline: "Learn to read the basic financial story of a business.",
    durationMinutes: 45,
    xpReward: 120,
    missionBrief:
      "Build the financial vocabulary needed to tell whether a business is earning money, protecting cash, and building value.",
    whyGabiNeedsThis:
      "A COO makes decisions about staffing, inventory, service, and systems. Every one of those choices affects profit and cash. Financial literacy helps you improve operations without flying blind.",
    outcomes: [
      "Explain revenue, gross profit, operating expenses, net profit, and cash flow.",
      "Separate what a company owns from what it owes.",
      "Use the three financial statements as different views of one business.",
    ],
    concepts: [
      concept(
        "Revenue",
        "All money earned from customers before any costs are subtracted.",
        "Revenue shows demand, but it does not tell you whether the company kept any money.",
        "A machine sells $1,500 of drinks and snacks this month. Revenue is $1,500.",
        "Track whether operational changes increase or protect customer sales.",
        "Calling revenue profit. Revenue is the top line; costs still need to come out.",
      ),
      concept(
        "Expenses",
        "Money the company spends to operate, including product, fuel, repairs, insurance, and payroll.",
        "A growing business can still lose money if expenses rise faster than revenue.",
        "Skadra Vending spends $600 on products, $120 on fuel, and $80 on repairs.",
        "Ask which costs are necessary, which create value, and which signal a broken process.",
        "Assuming every expense is bad. Some expenses, such as maintenance, protect future performance.",
      ),
      concept(
        "Gross profit",
        "Revenue minus the direct cost of the product or service sold.",
        "It shows how much money remains to operate the business after paying for what customers bought.",
        "Revenue of $1,500 minus $600 of product cost leaves $900 of gross profit.",
        "Watch product mix, pricing, waste, and purchasing because they change gross profit.",
        "Subtracting every company expense here. Gross profit only removes direct product or service cost.",
      ),
      concept(
        "Operating expenses",
        "Costs of running the company that are not the direct item sold.",
        "Fuel, insurance, software, and administrative costs must be covered before the company earns net profit.",
        "The vending route spends $120 on fuel and $80 on repairs after paying for inventory.",
        "Build reliable processes that control costs without damaging service.",
        "Cutting a cost without noticing the customer or employee impact.",
      ),
      concept(
        "Net profit",
        "What remains after the business subtracts its expenses from revenue.",
        "Net profit is the clearest simple signal of whether the business model produced earnings.",
        "$1,500 revenue minus $600 product cost and $300 operating expenses leaves $600 net profit.",
        "Connect service and process decisions to the profit they protect or create.",
        "Treating the bank balance as profit. Cash timing can make the two numbers different.",
      ),
      concept(
        "Cash flow",
        "The actual movement of money into and out of the bank account.",
        "A profitable company can still miss payroll if customers pay late or too much cash is tied up in inventory.",
        "A $5,000 sale counts as revenue today, but if the customer pays next month, the cash has not arrived yet.",
        "Watch payment timing, inventory buying, bills, and unexpected repairs.",
        "Assuming profit guarantees available cash.",
      ),
      concept(
        "Assets, liabilities, and equity",
        "Assets are valuable things the company owns. Liabilities are what it owes. Equity is the owners' economic value after liabilities.",
        "Together they show the financial position and resilience of the company.",
        "If Skadra owns $20,000 of machines and cash and owes $8,000, owner equity is $12,000.",
        "Protect assets, avoid hidden obligations, and understand how operational decisions build owner value.",
        "Thinking a financed machine is pure value while ignoring the loan attached to it.",
      ),
      concept(
        "Income statement",
        "A report showing revenue, expenses, and profit over a period of time.",
        "It answers: did the business make money during this month, quarter, or year?",
        "The monthly vending summary lists sales, product cost, route expenses, and profit.",
        "Use it to connect operating changes to financial results.",
        "Reading one strong month as proof that performance is permanently fixed.",
      ),
      concept(
        "Balance sheet",
        "A snapshot of what the company owns, owes, and what belongs to owners on one date.",
        "It reveals financial strength, debt, and resources available to operate.",
        "Machines and cash are assets; a vehicle loan is a liability.",
        "Use it to understand the resources and obligations behind the operation.",
        "Treating it like a monthly profit report. It is a snapshot, not a movie.",
      ),
      concept(
        "Cash flow statement",
        "A report showing where cash actually came from and where it went.",
        "It explains why profit and the bank-account change are not always the same.",
        "Profit was $600, but buying a $2,000 machine reduced cash during the month.",
        "Use it to anticipate cash pressure before it becomes an emergency.",
        "Ignoring investments, loan payments, or delayed customer payments.",
      ),
    ],
    supportingTopics: ["Margin", "Direct cost", "Assets − Liabilities = Equity", "Financial statement period"],
    example: {
      title: "Skadra Vending — Month 1",
      description:
        "Ten machines produce $12,000 in sales. Products cost $5,000. Route fuel, card fees, insurance, and repairs total $3,100. The income statement shows $3,900 of net profit before taxes. Cash only rises $1,900 because Skadra also paid $2,000 for a new machine.",
      takeaway:
        "The company made money, but profit and cash changed by different amounts. Both stories matter.",
    },
    practice: {
      prompt:
        "A location produces $2,400 of revenue. Product cost is $960 and other operating expenses are $740. What are gross profit and net profit?",
      guidance:
        "Start with revenue minus direct product cost. Then subtract operating expenses from gross profit.",
    },
    knowledgeChecks: [
      question(
        "finance-q1",
        "A machine has $1,500 in sales and $600 in product cost. What is gross profit?",
        "$900",
        "$1,500",
        "$600",
        "Gross profit equals revenue minus direct product cost: $1,500 − $600 = $900.",
      ),
      question(
        "finance-q2",
        "Why can a profitable company still have a cash problem?",
        "Cash may be tied up in inventory or waiting on customer payments.",
        "Profit always arrives in cash immediately.",
        "Revenue and bank balance are always identical.",
        "Profit measures earnings, while cash flow tracks when money actually moves.",
      ),
      question(
        "finance-q3",
        "Which statement answers 'What do we own and owe right now?'",
        "The balance sheet",
        "The income statement",
        "The customer pipeline",
        "The balance sheet is a snapshot of assets, liabilities, and equity.",
      ),
      question(
        "finance-q4",
        "If assets are $20,000 and liabilities are $8,000, what is equity?",
        "$12,000",
        "$28,000",
        "$8,000",
        "Equity equals assets minus liabilities: $20,000 − $8,000 = $12,000.",
      ),
    ],
    project: {
      title: "Write the Month 1 operator summary",
      prompt:
        "Explain whether Skadra Vending made money, why cash moved differently, and the two operating areas you would investigate next.",
      deliverables: [
        "One plain-English profit conclusion",
        "One cash-flow explanation",
        "Two operational follow-up questions",
      ],
    },
    fieldMission: {
      title: "Ask how the money moves",
      prompt:
        "Ask a business owner or manager which expense is easiest to underestimate and what causes their biggest cash surprises.",
    },
    bossBattle: {
      title: "The profitable cash crisis",
      scenario:
        "Skadra Vending reports a strong $7,000 monthly profit, but the bank balance is falling. Inventory has doubled, two large customers pay 45 days late, and a vehicle loan payment was made this week.",
      prompt: "What is your strongest first response as COO?",
      options: bossOptions(
        "Build a short cash bridge: verify receivable dates, pause unnecessary inventory buying, map upcoming obligations, and assign owners to collections and stock control.",
        "Review the income statement again and ask the team to reduce every expense by 10%.",
        "Celebrate the profit and wait another month because profitable companies cannot run out of cash.",
        "This separates profit from cash, protects service, and creates immediate ownership around the real cash drivers.",
      ),
    },
    reflectionPrompt:
      "What financial number would you now ask to see before making an operational decision, and why?",
  }),
  defineLevel({
    id: "relationship-builder",
    number: 2,
    skill: "Customer and relationship skills",
    title: "Relationship Builder",
    tagline: "Create trust before you need a favor, sale, or solution.",
    durationMinutes: 35,
    xpReward: 120,
    missionBrief:
      "Learn how curiosity, reliability, empathy, and disciplined follow-up create durable business relationships.",
    whyGabiNeedsThis:
      "A COO earns cooperation from employees, customers, vendors, property managers, partners, and sellers. People share better information and solve harder problems with someone they trust.",
    outcomes: [
      "Use listening and curiosity to understand what matters to another person.",
      "Match communication to different business personalities.",
      "Close loops with specific, reliable follow-up.",
    ],
    concepts: [
      concept(
        "Trust",
        "Confidence that someone is honest, capable, and likely to do what they said.",
        "Trust makes information move faster and reduces the friction of working together.",
        "A location manager trusts Gabi because she communicates repair times accurately and follows through.",
        "Make clear promises, keep them, and address misses early.",
        "Trying to create trust with charisma while failing to deliver.",
      ),
      concept(
        "Ask more than you talk",
        "Use thoughtful questions and real listening before presenting your own answer.",
        "People reveal needs, constraints, and motivations when they feel heard.",
        "Instead of pitching vending immediately, Gabi asks what employees complain about today.",
        "Learn what success means to the customer, employee, or partner before proposing action.",
        "Waiting silently only for your turn to speak.",
      ),
      concept(
        "Professional warmth",
        "Combine competence and clarity with genuine human interest.",
        "People remember how an interaction felt as well as what was accomplished.",
        "Gabi remembers a manager's upcoming expansion and asks about it during follow-up.",
        "Build relationships that are respectful, useful, and human.",
        "Confusing warmth with avoiding direct or difficult conversations.",
      ),
      concept(
        "Follow-up",
        "A specific next message or action that closes the loop after a conversation.",
        "Reliability is built when people do not need to chase you.",
        "After a site visit, Gabi sends the promised product mix and a date for the next call.",
        "Record owners, dates, promises, and relevant personal details.",
        "Sending a vague 'just checking in' message with no useful next step.",
      ),
    ],
    supportingTopics: ["Curiosity", "Empathy", "Respect", "Remembering details", "Reliability"],
    example: {
      title: "Four owners, four approaches",
      description:
        "A busy owner needs a concise question and a clear next step. A skeptical owner needs evidence and low-pressure curiosity. A friendly but noncommittal owner needs a specific commitment. A numbers-focused owner needs concrete economics.",
      takeaway:
        "Relationship skill is not one script. It is the ability to notice the person in front of you and adjust without becoming fake.",
    },
    practice: {
      prompt: "A property manager says, 'I only have two minutes.' How would you open the conversation?",
      guidance:
        "Respect the constraint, ask one useful question, and propose a specific follow-up instead of rushing through a full pitch.",
    },
    knowledgeChecks: [
      question(
        "relationship-q1",
        "Which action builds the most trust after promising an update Friday?",
        "Send an accurate update Friday, even if the issue is not fully resolved.",
        "Wait until everything is perfect, even if that takes two weeks.",
        "Assume they will ask if the update matters.",
        "Trust grows when expectations are clear and promises are kept.",
      ),
      question(
        "relationship-q2",
        "A skeptical owner questions every claim. What is the best approach?",
        "Ask what evidence would make the conversation useful, then answer with specifics.",
        "Talk faster and sound more confident.",
        "Avoid questions so the owner cannot object.",
        "Curiosity reveals the real concern and lets you respond with relevant evidence.",
      ),
    ],
    project: {
      title: "Create a relationship brief",
      prompt:
        "Choose one real business relationship and document what the person cares about, what you promised, and a useful next contact.",
      deliverables: ["Their priorities", "One trust-building action", "A dated follow-up"],
    },
    fieldMission: {
      title: "One genuine business conversation",
      prompt:
        "Have a 10-minute conversation with a businessperson. No selling is required. Learn what makes their work difficult and log what you heard.",
    },
    bossBattle: {
      title: "The noncommittal owner",
      scenario:
        "A friendly warehouse owner likes the vending concept but has ended three calls with 'send me something.' No decision date or decision process is clear.",
      prompt: "What should you do next?",
      options: bossOptions(
        "Send a concise summary, then ask for a 15-minute decision call with two specific times and one question about who else is involved.",
        "Keep sending general information every week until the owner decides.",
        "Assume friendliness means approval and schedule installation.",
        "This keeps the relationship warm while adding a respectful, concrete next step and uncovering the decision process.",
      ),
    },
    reflectionPrompt:
      "Which relationship habit—curiosity, reliability, empathy, or follow-up—would most improve your current work?",
  }),
  defineLevel({
    id: "the-deal-room",
    number: 3,
    skill: "Negotiation",
    title: "The Deal Room",
    tagline: "Look beneath stated demands and trade what matters.",
    durationMinutes: 40,
    xpReward: 130,
    missionBrief:
      "Learn the structure of negotiation, prepare a real alternative, and find the interests behind positions.",
    whyGabiNeedsThis:
      "COOs negotiate with vendors, employees, landlords, partners, customers, and managers. Strong negotiation protects relationships while improving terms.",
    outcomes: [
      "Separate positions from underlying interests.",
      "Prepare a BATNA before entering a negotiation.",
      "Trade across price, service, timing, risk, and responsibility.",
    ],
    concepts: [
      concept(
        "Negotiation",
        "A structured conversation where two or more sides try to reach acceptable terms.",
        "Better terms can improve economics, service, risk, and the working relationship.",
        "Skadra and a warehouse discuss commission, service frequency, machine placement, and contract length.",
        "Prepare priorities, questions, tradeoffs, and a walk-away point.",
        "Treating negotiation as a contest where the other side must lose.",
      ),
      concept(
        "Position and interest",
        "A position is what someone says they want. An interest is the reason underneath it.",
        "Interests create more ways to solve the problem than arguing over one number.",
        "The position is 20% commission. The interest may be proving value for scarce floor space.",
        "Ask what the requested term is meant to accomplish.",
        "Assuming the first demand is the only acceptable solution.",
      ),
      concept(
        "BATNA",
        "Your Best Alternative To a Negotiated Agreement—what you will do if no deal happens.",
        "A real alternative protects you from accepting a bad deal out of pressure.",
        "If this warehouse rejects Skadra, the team can pursue two other qualified locations.",
        "Improve alternatives before negotiating and know when walking away is responsible.",
        "Calling a threat a BATNA. A BATNA must be a realistic action you can take.",
      ),
      concept(
        "Tradeoffs",
        "Exchanging something inexpensive to you for something valuable to the other side, and vice versa.",
        "Good tradeoffs create value without simply splitting the difference.",
        "Skadra offers more frequent service in exchange for a lower commission and better placement.",
        "Negotiate the full package: price, timing, service, risk, length, and responsibilities.",
        "Giving concessions without receiving anything in return.",
      ),
    ],
    supportingTopics: ["Anchoring", "Silence", "Questions", "Price versus terms", "Walk-away point"],
    example: {
      title: "The 20% warehouse request",
      description:
        "The warehouse asks for 20% commission. Gabi learns their real concern is employee complaints about the current vendor. She proposes 10%, a 24-hour issue response, quarterly product surveys, and a 90-day performance review.",
      takeaway:
        "The best answer came from solving the interest instead of arguing only about the position.",
    },
    practice: {
      prompt: "Write the position, two possible interests, and your BATNA for the warehouse negotiation.",
      guidance:
        "Do not assume the stated percentage explains everything. Ask what outcome the location is trying to protect.",
    },
    knowledgeChecks: [
      question(
        "negotiation-q1",
        "What is a BATNA?",
        "The realistic action you will take if no agreement happens.",
        "The first price you say.",
        "A threat designed to scare the other side.",
        "Your alternative gives you a grounded standard for deciding whether to accept or walk away.",
      ),
      question(
        "negotiation-q2",
        "A location demands 20% commission. What should you learn first?",
        "What outcome or concern the 20% is meant to address.",
        "How quickly you can agree.",
        "Whether you can hide service fees elsewhere.",
        "The interest underneath a position often creates better options.",
      ),
    ],
    project: {
      title: "Build a one-page negotiation plan",
      prompt:
        "Prepare for a vending-location negotiation with priorities, interests, questions, tradable terms, BATNA, and walk-away point.",
      deliverables: ["Five discovery questions", "Three possible tradeoffs", "A realistic BATNA"],
    },
    fieldMission: {
      title: "Negotiate one low-stakes term",
      prompt:
        "Negotiate timing, scope, price, or responsibility in a real low-stakes situation. Log what you learned about the other side's interests.",
    },
    bossBattle: {
      title: "Warehouse terms",
      scenario:
        "The warehouse wants 20% commission and immediate installation. Your economics support 10%, and a safe installation requires two weeks. They value fast service and employee satisfaction.",
      prompt: "Which proposal is strongest?",
      options: bossOptions(
        "Offer 10%, a two-week safe install, a 24-hour service standard, product surveys, and a 90-day review; ask what evidence they need to approve.",
        "Split the difference at 15% and promise installation next week.",
        "Reject the request and explain that Skadra never negotiates.",
        "This protects the economics, addresses the real interests, and makes the next decision explicit.",
      ),
    },
    reflectionPrompt:
      "Where in your life do you tend to negotiate against a position before understanding the interest?",
  }),
  defineLevel({
    id: "sell-without-being-salesy",
    number: 4,
    skill: "Sales fundamentals",
    title: "Sell Without Being Salesy",
    tagline: "Understand the problem before proposing the solution.",
    durationMinutes: 38,
    xpReward: 130,
    missionBrief:
      "Reframe sales as diagnosis, useful communication, and a mutually clear next action.",
    whyGabiNeedsThis:
      "A COO sells ideas every day—to customers, recruits, partners, managers, and vendors. Ethical sales is helping someone make a good decision.",
    outcomes: [
      "Run a discovery conversation before pitching.",
      "Explain a relevant value proposition.",
      "Handle objections with curiosity and close on a next action.",
    ],
    concepts: [
      concept(
        "Good sales",
        "Understanding someone's problem and deciding whether you can genuinely help solve it.",
        "It prevents generic pitches and creates better-fit customers.",
        "Gabi first learns why employees dislike current vending before discussing Skadra.",
        "Diagnose needs, connect relevant value, and be honest about fit.",
        "Treating every person as someone who must be convinced.",
      ),
      concept(
        "Value proposition",
        "A clear statement of who you help, what problem you solve, and why your approach is valuable.",
        "People need to understand the practical outcome, not a list of features.",
        "Reliable, clean machines stocked with products employees want, serviced quickly without extra work for management.",
        "Translate operating capability into the result a customer cares about.",
        "Using vague claims such as 'best service' without evidence or relevance.",
      ),
      concept(
        "Objection",
        "A concern, question, or unresolved risk that prevents someone from moving forward.",
        "An objection is information about what still needs to be understood.",
        "'We already have vending' may mean switching feels risky, not that service is good.",
        "Acknowledge, ask, answer the real issue, and agree on the next step.",
        "Arguing immediately instead of learning what the objection means.",
      ),
      concept(
        "Next action",
        "A specific, mutual step with an owner and timing.",
        "A good conversation without a next step rarely becomes progress.",
        "Gabi and the manager agree on a 20-minute site walk Tuesday at 2:00.",
        "End conversations with clarity rather than pressure.",
        "Ending with 'I'll follow up sometime.'",
      ),
    ],
    supportingTopics: ["Prospecting", "Discovery", "Problem", "Relevant value", "Follow-up", "Repetition"],
    example: {
      title: "We already have vending",
      description:
        "Instead of criticizing the incumbent, Gabi asks what works well, what employees request, how outages are handled, and when the current agreement renews. She discovers the real issue is slow service.",
      takeaway:
        "The objection became useful information because Gabi stayed curious.",
    },
    practice: {
      prompt: "Write three discovery questions for a manager who says, 'Send me information.'",
      guidance:
        "Ask what information would help, what problem they are trying to solve, and what decision comes next.",
    },
    knowledgeChecks: [
      question(
        "sales-q1",
        "What is the best first response to 'We already have vending'?",
        "Ask what works well and what they would improve about the current service.",
        "Explain why their current vendor is probably bad.",
        "Immediately offer a lower price.",
        "Discovery uncovers whether a real problem exists before you propose a solution.",
      ),
      question(
        "sales-q2",
        "Which is the clearest next action?",
        "A 20-minute site walk Tuesday at 2:00 with the location manager.",
        "Stay in touch.",
        "Send more information eventually.",
        "A next action names the step, owner, and timing.",
      ),
    ],
    project: {
      title: "Build the Skadra Vending conversation",
      prompt:
        "Create a simple discovery-to-next-step conversation for a qualified vending location.",
      deliverables: ["Five discovery questions", "One value proposition", "Responses to three objections"],
    },
    fieldMission: {
      title: "Take one real sales rep",
      prompt:
        "Attempt one genuine location conversation. Rejection counts. Log the questions asked, the objection, and the next action.",
    },
    bossBattle: {
      title: "Send me something",
      scenario:
        "A plant manager says, 'We already have vending. Send me something.' Employee count is strong, but you know nothing about current service or contract timing.",
      prompt: "What is the strongest response?",
      options: bossOptions(
        "Agree to send a concise overview, then ask two quick questions about current service and schedule a specific follow-up.",
        "Send a 20-page deck and follow up in a month.",
        "Offer the lowest commission immediately to create urgency.",
        "This respects the request, gathers useful context, and creates a clear next step without pressure.",
      ),
    },
    reflectionPrompt:
      "What part of sales feels uncomfortable to you, and how does the diagnosis mindset change it?",
  }),
] as const;

