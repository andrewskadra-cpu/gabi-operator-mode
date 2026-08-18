import { bossOptions, concept, defineLevel, question } from "./helpers.ts";

export const levels13To16 = [
  defineLevel({
    id: "fire-yourself",
    number: 13,
    skill: "Delegation",
    title: "Fire Yourself",
    tagline: "Transfer outcomes with clarity, authority, and coaching.",
    durationMinutes: 40,
    xpReward: 145,
    missionBrief:
      "Delegate work so capability and ownership grow without turning the company into a founder-dependent machine.",
    whyGabiNeedsThis:
      "A future COO cannot personally carry every task. Scale requires other people to own outcomes inside clear standards and decision boundaries.",
    outcomes: [
      "Distinguish delegation from dumping tasks.",
      "Transfer outcome, authority, resources, standards, and checkpoints.",
      "Measure and reduce founder dependency.",
    ],
    concepts: [
      concept(
        "Delegation",
        "Assigning an outcome to another person with the authority, resources, standards, and support to own it.",
        "Delegation increases capacity and develops people while keeping accountability clear.",
        "A route lead owns weekly inventory accuracy and can change count timing within defined controls.",
        "Define the outcome, owner, authority, resources, checkpoints, and review.",
        "Giving someone a task but keeping every decision and approval.",
      ),
      concept(
        "Founder dependency",
        "A company condition where routine work and decisions still require the founder.",
        "Dependency limits growth, slows decisions, and makes the business fragile.",
        "Every refund, order, route change, and customer issue waits for Andrew or Gabi.",
        "Move repeatable decisions into roles, standards, and escalation rules.",
        "Removing founders before the team has context, capability, or controls.",
      ),
      concept(
        "Decision rights",
        "Clarity about which decisions a role can make independently and which must be escalated.",
        "Ownership without authority creates delay and frustration.",
        "A route lead may approve refunds under $50 but escalates contract changes.",
        "Match authority to the outcome and risk.",
        "Saying 'use your judgment' while punishing every decision you would have made differently.",
      ),
      concept(
        "Checkpoint",
        "A planned moment to review evidence, remove barriers, and coach before the final deadline.",
        "Checkpoints support learning without constant hovering.",
        "A new lead reviews inventory accuracy after week one, then monthly after demonstrating control.",
        "Adjust oversight to experience and risk.",
        "Micromanaging every step or disappearing until the deadline.",
      ),
    ],
    supportingTopics: ["Outcome", "Owner", "Standard", "Resources", "Coaching", "System improvement"],
    example: {
      title: "The 50-machine handoff",
      description:
        "Gabi lists every recurring task, keeps strategic relationships and major exceptions, assigns route outcomes to a lead, documents standards, defines decision rights, and creates weekly evidence reviews.",
      takeaway: "The goal is not less responsibility; it is responsibility expressed through a stronger system.",
    },
    practice: {
      prompt: "Choose one task you repeat. Rewrite it as a delegated outcome with standard, authority, and checkpoint.",
      guidance: "Describe the result, not only the activity.",
    },
    knowledgeChecks: [
      question(
        "delegation-q1",
        "What separates delegation from dumping work?",
        "A clear outcome, authority, resources, standards, checkpoints, and support.",
        "The manager no longer thinks about the result.",
        "The employee receives the longest possible task list.",
        "Real delegation transfers ownership inside a supportive operating agreement.",
      ),
      question(
        "delegation-q2",
        "What are decision rights?",
        "Clarity about decisions a role may make and what must be escalated.",
        "The founder's right to reverse every choice.",
        "A list of employee vacation days.",
        "Decision rights let ownership move at the speed and risk level the system needs.",
      ),
    ],
    project: {
      title: "Remove 70% of founder tasks",
      prompt:
        "Map a 50-machine vending business and reassign routine tasks, decisions, standards, and escalation rules so founders leave daily operations.",
      deliverables: ["Task inventory", "Delegation map", "Checkpoint and escalation rhythm"],
    },
    fieldMission: {
      title: "Delegate one real outcome",
      prompt:
        "Delegate a meaningful outcome with clear authority and a checkpoint. Log what you clarified and what you nearly kept for yourself.",
    },
    bossBattle: {
      title: "The capable new lead",
      scenario:
        "A reliable new lead can run routes but asks Gabi to approve every substitution, refund, and schedule change. Customers are waiting and Gabi is becoming the bottleneck.",
      prompt: "What is the strongest response?",
      options: bossOptions(
        "Define decision thresholds and service standards, provide examples, let the lead decide within them, review exceptions weekly, and coach from evidence.",
        "Keep approving every decision until the lead stops asking.",
        "Tell the lead to use judgment with no boundaries or follow-up.",
        "This transfers real authority while preserving controls, learning, and customer speed.",
      ),
    },
    reflectionPrompt: "What do you keep doing because teaching and trusting someone else feels slower today?",
  }),
  defineLevel({
    id: "skadra-realty-operator",
    number: 14,
    skill: "Real estate fundamentals",
    title: "Skadra Realty Operator",
    tagline: "Improve the property by improving the resident and operating experience.",
    durationMinutes: 46,
    xpReward: 150,
    missionBrief:
      "Learn the operating language of real estate and design a practical turnaround for a struggling property.",
    whyGabiNeedsThis:
      "Real estate value depends on occupancy, rent collection, maintenance, leasing, communication, and resident experience—not only the purchase price.",
    outcomes: [
      "Explain rent, vacancy, occupancy, property management, maintenance, leasing, NOI, and cap rate.",
      "Connect resident experience to financial performance.",
      "Build a 90-day operating turnaround plan.",
    ],
    concepts: [
      concept(
        "Vacancy and occupancy",
        "Vacancy is the share of space not rented. Occupancy is the share currently rented.",
        "Empty units reduce revenue while many property costs continue.",
        "Three empty units in a 20-unit building equal 15% vacancy and 85% occupancy.",
        "Improve leasing speed, retention, readiness, reputation, and pricing discipline.",
        "Filling units at any cost without checking tenant quality or economics.",
      ),
      concept(
        "Property management",
        "The operating work of leasing, rent collection, maintenance, communication, compliance, vendors, and resident experience.",
        "Property performance depends on daily management after the acquisition closes.",
        "A manager coordinates a repair, updates the resident, checks vendor quality, and closes the work order.",
        "Set service standards and inspect both operating metrics and resident feedback.",
        "Treating property management as only collecting rent.",
      ),
      concept(
        "NOI",
        "Net Operating Income: property revenue minus operating expenses before financing and taxes.",
        "NOI shows the property's core operating performance and strongly influences value.",
        "$240,000 annual property revenue minus $150,000 operating expenses equals $90,000 NOI.",
        "Grow sustainable revenue and improve costs without damaging the asset or resident experience.",
        "Subtracting the mortgage payment when calculating NOI.",
      ),
      concept(
        "Cap rate",
        "A simple yield measure that compares annual NOI with property value.",
        "It helps compare price and operating income, though it does not capture every risk or financing detail.",
        "$90,000 NOI divided by a $1.5 million value is a 6% cap rate.",
        "Understand how operating improvements may change NOI and perceived value.",
        "Treating cap rate as a complete investment decision by itself.",
      ),
      concept(
        "Resident experience",
        "The full experience of living at the property, including leasing, communication, maintenance, safety, cleanliness, and respect.",
        "Experience affects reviews, renewals, referrals, collections, and vacancy.",
        "Fast repair acknowledgment and reliable completion increase confidence even when a part must be ordered.",
        "Turn feedback and work-order patterns into operating improvement.",
        "Assuming low rent excuses poor communication.",
      ),
    ],
    supportingTopics: ["Rent", "Leasing", "Maintenance", "Residential", "Multifamily", "Retail", "Office", "Industrial", "Land"],
    example: {
      title: "The 20-unit turnaround",
      description:
        "The building has 15% vacancy, slow maintenance, poor reviews, bad communication, and unreliable landscaping. Gabi first stabilizes service and communication, cleans up open work orders, improves unit readiness, and then strengthens leasing.",
      takeaway: "A property turnaround begins with operating credibility, not cosmetic marketing alone.",
    },
    practice: {
      prompt: "If annual revenue is $300,000 and operating expenses are $195,000, what is NOI?",
      guidance: "Subtract property operating expenses from property revenue. Do not subtract financing or taxes.",
    },
    knowledgeChecks: [
      question(
        "realty-q1",
        "What is NOI?",
        "Property revenue minus operating expenses before financing and taxes.",
        "Property revenue minus the mortgage only.",
        "The property's asking price.",
        "NOI measures the core operation before deal-specific financing and taxes.",
      ),
      question(
        "realty-q2",
        "Why does resident experience affect property performance?",
        "It influences renewals, reviews, collections, referrals, and vacancy.",
        "It matters only at luxury properties.",
        "It has no connection to operating results.",
        "Resident trust and service quality show up in retention and reputation.",
      ),
    ],
    project: {
      title: "Build the 90-day property turnaround",
      prompt:
        "Create a phased plan for the 20-unit building across service, communication, maintenance, leasing, vendors, and measures.",
      deliverables: ["First 14-day stabilization", "Days 15–45 repair plan", "Days 46–90 improvement scorecard"],
    },
    fieldMission: {
      title: "Speak with a property operator",
      prompt:
        "Ask a property manager which resident issue consumes the most time and what operating signal they wish they had earlier.",
    },
    bossBattle: {
      title: "Vacancy versus service",
      scenario:
        "The owner wants aggressive leasing to fix 15% vacancy. Twelve work orders are overdue, reviews mention poor communication, and two occupied units may not renew.",
      prompt: "What is the strongest first move?",
      options: bossOptions(
        "Stabilize maintenance and communication immediately while preparing units and a focused leasing plan; track work orders, renewals, leads, and occupancy together.",
        "Offer deep discounts to fill every vacant unit this week.",
        "Pause all leasing until every property issue is permanently solved.",
        "This protects current residents, restores operating credibility, and still moves vacancy through coordinated action.",
      ),
    },
    reflectionPrompt: "Which property metric would you pair with a resident-experience signal so the number has context?",
  }),
  defineLevel({
    id: "multi-unit-mindset",
    number: 15,
    skill: "Franchise fundamentals",
    title: "Multi-Unit Mindset",
    tagline: "Operate the system consistently while learning across locations.",
    durationMinutes: 44,
    xpReward: 150,
    missionBrief:
      "Understand the franchise model, unit economics, brand standards, and the management system required to grow beyond one location.",
    whyGabiNeedsThis:
      "A multi-unit COO must deliver the brand through people, labor, rent, quality, customer experience, and local execution across many sites.",
    outcomes: [
      "Explain franchise, franchisor, franchisee, fees, territory, and brand standards.",
      "Read the basic operating economics of one unit.",
      "Identify what changes when one location becomes ten.",
    ],
    concepts: [
      concept(
        "Franchise, franchisor, and franchisee",
        "A franchise lets an operator use another company's brand and system. The franchisor owns the system; the franchisee operates the location.",
        "The model combines a proven playbook with local execution responsibility.",
        "Skadra could own locations under a brand while hiring managers and following required standards.",
        "Evaluate both the system offered and the capability required to operate it.",
        "Assuming buying a brand removes the need for excellent local management.",
      ),
      concept(
        "Franchise fee and royalty",
        "The franchise fee is typically an upfront payment for joining the system. A royalty is an ongoing payment, often tied to sales.",
        "These costs affect startup cash and continuing unit economics.",
        "A unit pays an initial fee plus 6% of sales as an ongoing royalty.",
        "Include every recurring fee when evaluating whether unit performance supports growth.",
        "Calculating profit before franchise and marketing fees.",
      ),
      concept(
        "Unit economics",
        "The revenue, costs, and profit produced by one location or unit.",
        "A model should work at the unit level before multiplying locations.",
        "One store's sales must cover product, labor, rent, royalties, local costs, and manager support.",
        "Know the drivers and break-even point of each unit.",
        "Assuming ten weak units automatically create a strong company.",
      ),
      concept(
        "Brand standards",
        "Required ways a franchise presents and operates to create a consistent customer promise.",
        "Consistency protects customer trust across locations.",
        "Food safety, service steps, approved products, signage, and store appearance follow defined standards.",
        "Build audit, training, and coaching systems that make standards real.",
        "Treating compliance as a paperwork exercise instead of customer protection.",
      ),
      concept(
        "Multi-unit ownership",
        "Operating several locations through managers, shared systems, and portfolio-level oversight.",
        "Ten units create management layers, talent needs, comparisons, and risk concentration that one unit does not.",
        "A district leader coaches five general managers using common sales, labor, quality, and retention scorecards.",
        "Design leadership capacity before adding locations.",
        "Running ten locations as ten separate founder-dependent jobs.",
      ),
    ],
    supportingTopics: ["Marketing fee", "Territory", "Franchise agreement", "Labor", "Rent", "General manager"],
    example: {
      title: "Comparing three franchises",
      description:
        "Concept A has strong sales but heavy labor. Concept B has lower sales and better margins but weak training. Concept C has attractive demand but expensive rent and a thin manager bench.",
      takeaway: "The best operational fit depends on the complete system, people requirements, and repeatability—not top-line sales alone.",
    },
    practice: {
      prompt: "List five costs that must be included when evaluating one franchise unit.",
      guidance: "Include product, labor, rent, royalties, marketing fees, and local operating costs.",
    },
    knowledgeChecks: [
      question(
        "franchise-q1",
        "What is a franchise royalty?",
        "An ongoing payment to the franchisor, often based on sales.",
        "The one-time security deposit paid to a landlord.",
        "Profit kept by the general manager.",
        "Royalties are recurring system costs that affect unit economics.",
      ),
      question(
        "franchise-q2",
        "Why is operating ten locations different from one?",
        "It requires managers, shared systems, consistent standards, and portfolio-level oversight.",
        "The same founder can simply work ten times longer.",
        "Brand standards stop mattering after the first location.",
        "Multi-unit scale depends on leadership and systems, not personal heroics.",
      ),
    ],
    project: {
      title: "Compare three franchise operating models",
      prompt:
        "Create an operating scorecard covering unit economics, labor, rent, training, management, brand standards, demand, and multi-unit readiness.",
      deliverables: ["Comparison scorecard", "Key operating risk", "Recommended next diligence question"],
    },
    fieldMission: {
      title: "Visit a franchise",
      prompt:
        "Observe consistency, service, cleanliness, staffing, and local adaptation. Log one strength and one operating question.",
    },
    bossBattle: {
      title: "The tenth location",
      scenario:
        "The first three units perform well under founder attention. Skadra is offered seven more, but manager turnover is high, training is informal, and unit reporting is inconsistent.",
      prompt: "What is the strongest recommendation?",
      options: bossOptions(
        "Pause the full rollout, standardize training and reporting, strengthen the manager bench, test the system at one or two additional units, then scale against evidence.",
        "Accept all seven because the first three are profitable.",
        "Reject franchising permanently because manager turnover exists.",
        "This protects the opportunity while building the leadership and operating system required for responsible scale.",
      ),
    },
    reflectionPrompt: "Which system must exist before a strong single location can become a strong portfolio?",
  }),
  defineLevel({
    id: "integration-commander",
    number: 16,
    skill: "M&A fundamentals",
    title: "Integration Commander",
    tagline: "Protect what made the company valuable while building its next chapter.",
    durationMinutes: 55,
    xpReward: 180,
    missionBrief:
      "Learn the acquisition lifecycle and lead a people-centered, customer-protective first 100 days after a company changes hands.",
    whyGabiNeedsThis:
      "Andrew may focus deeply on price, return, financing, and deal terms. Gabi's COO lens protects people, customers, operations, management, culture, and integration after close.",
    outcomes: [
      "Explain M&A, due diligence, closing, and integration in plain language.",
      "Separate financial attractiveness from operational readiness.",
      "Build a first 100 days plan that protects trust and improves systems.",
    ],
    concepts: [
      concept(
        "M&A",
        "Mergers and acquisitions: ways companies combine or one company buys another.",
        "Skadra may buy an existing business rather than build every capability from zero.",
        "Skadra acquires Midwest Industrial Services from a retiring owner.",
        "Evaluate whether people, customers, management, and operations can transition successfully.",
        "Thinking the work is finished when the deal closes.",
      ),
      concept(
        "Due diligence",
        "The structured investigation of a business before completing a deal.",
        "It tests assumptions and reveals financial, legal, customer, people, and operating risks.",
        "Gabi reviews customer concentration, manager capability, turnover, processes, systems, and culture signals.",
        "Ask what must be true for the operation to perform after ownership changes.",
        "Treating diligence as only verifying financial statements.",
      ),
      concept(
        "Integration",
        "Transitioning an acquired company into new ownership without destroying what made it valuable.",
        "Customers, employees, knowledge, and operating continuity can be lost through careless change.",
        "Skadra keeps trusted customer-facing practices while documenting work and strengthening management.",
        "Sequence communication, stabilization, learning, quick wins, and longer-term change.",
        "Changing everything immediately to prove new ownership is in charge.",
      ),
      concept(
        "First 100 days",
        "A phased plan for communication, stabilization, learning, decisions, and operating improvement after close.",
        "Early choices shape trust and protect continuity while leaders learn the business.",
        "Days 1–30 protect people and customers; 31–60 strengthen visibility; 61–100 begin prioritized improvements.",
        "Define owners, signals, communication, quick wins, and what will not change yet.",
        "Creating an impressive project list with no sequence or ownership.",
      ),
      concept(
        "Operational attractiveness",
        "How workable and improvable the company is across people, customers, systems, culture, management, and risk.",
        "Strong economics can be undermined by owner dependency, weak management, or fragile customer relationships.",
        "A 9/10 financial target may score 4/10 operationally because the retiring owner holds every key relationship.",
        "Give deal teams a clear operating view without replacing financial analysis.",
        "Reducing operational quality to one impression from a site visit.",
      ),
    ],
    supportingTopics: ["Identify", "Analyze", "Value", "Negotiate", "Finance", "Close", "Culture", "Quick wins"],
    example: {
      title: "Midwest Industrial Services",
      description:
        "The company has 38 employees, a retiring owner, nervous staff, seller-dependent customer relationships, undocumented processes, uncertain managers, and outdated technology.",
      takeaway: "The asset is not only equipment and earnings. It is a living system of people, knowledge, trust, and routines.",
    },
    practice: {
      prompt: "Name three questions Gabi should ask before close about people, customers, and operations.",
      guidance: "Ask what depends on the seller, where knowledge lives, which customers are fragile, and who can lead through change.",
    },
    knowledgeChecks: [
      question(
        "ma-q1",
        "What is integration?",
        "Transitioning an acquired company into new ownership without destroying what made it valuable.",
        "Only changing the company logo after closing.",
        "The price negotiation before diligence.",
        "Integration protects continuity while people, systems, and ownership change.",
      ),
      question(
        "ma-q2",
        "What does operational attractiveness evaluate?",
        "People, customers, management, systems, culture, execution risk, and improvement potential.",
        "Only the purchase multiple.",
        "Only whether equipment looks new.",
        "The COO lens explains whether the company can perform and improve after the transaction.",
      ),
      question(
        "ma-q3",
        "Why identify what not to change in the first 100 days?",
        "Some practices, relationships, and cultural strengths are part of the value being acquired.",
        "No change should ever happen after an acquisition.",
        "New owners should avoid learning about the business.",
        "Deliberate restraint protects value while leaders earn context and trust.",
      ),
    ],
    project: {
      title: "Build the first 100 days plan",
      prompt:
        "Create a phased integration plan for Midwest Industrial Services covering people, communication, customers, operations, management, culture, quick wins, what not to change, and long-term improvements.",
      deliverables: ["Days 1–30 trust and continuity", "Days 31–60 visibility and management", "Days 61–100 prioritized improvement"],
    },
    fieldMission: {
      title: "Ask about a business transition",
      prompt:
        "Speak with someone who experienced new ownership, leadership change, or a merger. Ask what leaders communicated well and what created uncertainty.",
    },
    bossBattle: {
      title: "The day-12 customer crisis",
      scenario:
        "Twelve days after close, the seller is unavailable, a top customer threatens to leave, a respected supervisor may resign, and employees hear a rumor that layoffs are coming.",
      prompt: "What is Gabi's strongest response?",
      options: bossOptions(
        "Create one coordinated response: contact the customer with ownership and a continuity plan, meet the supervisor, address employees with facts and listening, stabilize service, and capture the seller-dependent knowledge gap.",
        "Announce a full reorganization to demonstrate control.",
        "Wait for complete information so communication cannot be criticized.",
        "This protects the key relationships and operation immediately while converting the crisis into integration learning.",
      ),
    },
    reflectionPrompt:
      "What would employees and customers need to see from you before they believed new ownership could be trusted?",
  }),
] as const;
