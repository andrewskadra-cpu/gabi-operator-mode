import { bossOptions, concept, defineLevel, question } from "./helpers.ts";

export const levels09To12 = [
  defineLevel({
    id: "brand-guardian",
    number: 9,
    skill: "Marketing",
    title: "Brand Guardian",
    tagline: "Make the right customer understand and remember the right promise.",
    durationMinutes: 36,
    xpReward: 125,
    missionBrief:
      "Separate marketing, branding, and sales, then create positioning that connects a real customer problem to credible value.",
    whyGabiNeedsThis:
      "Operations delivers the brand promise. A COO must understand what customers expect, how they discover the company, and whether daily execution supports the reputation.",
    outcomes: [
      "Distinguish marketing, branding, and sales.",
      "Define a target customer, problem, value proposition, and position.",
      "Connect acquisition with retention and reputation.",
    ],
    concepts: [
      concept(
        "Marketing",
        "How people discover and understand a business and its offer.",
        "Even excellent service cannot grow if qualified customers do not know it exists.",
        "Skadra shares a clear location case study with property managers who fit its service model.",
        "Keep messages grounded in operational truth and customer needs.",
        "Treating marketing as posting frequently without a target or purpose.",
      ),
      concept(
        "Branding",
        "What people associate with the business based on its promises and behavior.",
        "A brand reduces uncertainty when the experience consistently matches the expectation.",
        "Skadra becomes known for clean machines, relevant products, fast response, and low manager effort.",
        "Protect consistency across service, communication, people, and presentation.",
        "Thinking a logo alone creates a brand.",
      ),
      concept(
        "Positioning",
        "The specific place you want to hold in a target customer's mind compared with alternatives.",
        "Clear positioning helps the right customer quickly understand why you fit.",
        "The low-effort, responsive vending partner for busy industrial workplaces.",
        "Choose a believable difference the operation can repeatedly deliver.",
        "Claiming to be everything for everyone.",
      ),
      concept(
        "Acquisition and retention",
        "Acquisition wins a new customer. Retention keeps a good customer over time.",
        "Growth is expensive and fragile if customers leave as quickly as they arrive.",
        "A proposal wins the location; reliable stocking, service, and follow-up retain it.",
        "Coordinate sales promises with the team's capacity to deliver.",
        "Celebrating new accounts while ignoring recurring dissatisfaction.",
      ),
    ],
    supportingTopics: ["Target customer", "Customer problem", "Reputation", "Referral", "Value proposition"],
    example: {
      title: "Positioning Skadra Vending",
      description:
        "Target: industrial workplaces with 75–500 employees. Problem: unreliable service creates complaints and manager work. Promise: clean, tailored vending with fast issue response and proactive communication.",
      takeaway: "Strong positioning begins with a specific customer and a real problem the operation can solve.",
    },
    practice: {
      prompt: "Describe Skadra Vending's target customer, problem, promise, and evidence in four lines.",
      guidance: "Avoid generic words such as quality unless you explain what customers can observe.",
    },
    knowledgeChecks: [
      question(
        "marketing-q1",
        "Which statement best describes branding?",
        "What people associate with the business after experiencing its promises and behavior.",
        "Only the logo and colors.",
        "Any action that immediately closes a sale.",
        "A brand is built by the full pattern of promise, delivery, and reputation.",
      ),
      question(
        "marketing-q2",
        "Why does retention matter?",
        "Growth is fragile if newly acquired customers quickly leave.",
        "Retention removes the need for customer service.",
        "Only acquisition creates value.",
        "Keeping good customers protects revenue, reputation, and learning.",
      ),
    ],
    project: {
      title: "Build the Skadra Vending position",
      prompt:
        "Create a positioning brief with target customer, problem, value proposition, evidence, and retention promise.",
      deliverables: ["Target profile", "Positioning statement", "Three proof points"],
    },
    fieldMission: {
      title: "Audit one local brand",
      prompt:
        "Choose a business, compare what it promises with what it delivers, and log one gap and one strength.",
    },
    bossBattle: {
      title: "The attractive campaign",
      scenario:
        "A campaign promising the cheapest price creates many leads, but Skadra's strength is reliable service and the operating model cannot profitably support the promised discount.",
      prompt: "What should Gabi recommend?",
      options: bossOptions(
        "Stop the mismatched promise, reposition around reliable low-effort service, define proof, and align sales qualification with operating capacity.",
        "Keep the campaign because lead volume is the only useful marketing measure.",
        "Ask operations to absorb the losses until the brand becomes famous.",
        "This protects economics and trust by making marketing promise what operations can credibly deliver.",
      ),
    },
    reflectionPrompt: "What would you want customers to say about a Skadra company when no one from Skadra is present?",
  }),
  defineLevel({
    id: "inventory-boss",
    number: 10,
    skill: "Inventory management",
    title: "Inventory Boss",
    tagline: "Keep the right product available without trapping cash in the wrong stock.",
    durationMinutes: 40,
    xpReward: 135,
    missionBrief:
      "Balance availability, cash, waste, demand, and replenishment across different customer locations.",
    whyGabiNeedsThis:
      "Inventory turns cash into products and products back into cash. Poor inventory decisions create stockouts, waste, shrinkage, and frustrated customers.",
    outcomes: [
      "Explain stockout, overstock, shrinkage, reorder point, lead time, and turnover.",
      "Adjust product mix for location-specific demand.",
      "Set replenishment signals before service fails.",
    ],
    concepts: [
      concept(
        "Inventory",
        "Products or items held before they are sold or used.",
        "Inventory enables sales but ties up cash and creates risk until it moves.",
        "Drinks and snacks in storage and inside machines are Skadra inventory.",
        "Balance customer availability with cash, space, freshness, and theft risk.",
        "Treating full shelves as proof of good inventory management.",
      ),
      concept(
        "Stockout and overstock",
        "A stockout means running out. Overstock means buying more than demand needs.",
        "Stockouts lose sales and trust; overstock traps cash and may expire.",
        "Water sells out during a heat wave while slow snacks occupy two shelves.",
        "Use demand patterns and service frequency to set location-specific targets.",
        "Applying the same product quantity to every location.",
      ),
      concept(
        "Shrinkage",
        "Inventory that disappears through damage, theft, spoilage, or recording mistakes.",
        "Shrinkage reduces profit and can reveal control problems.",
        "The count says 24 drinks should remain, but only 20 are present.",
        "Track differences, investigate patterns, and improve handling controls.",
        "Automatically blaming employees without checking process and data quality.",
      ),
      concept(
        "Reorder point and lead time",
        "The reorder point triggers a new order. Lead time is how long replacement stock takes to arrive.",
        "Ordering must happen early enough to cover demand during the wait.",
        "If a drink sells 10 units daily and delivery takes 4 days, ordering at 40 plus safety stock helps avoid a gap.",
        "Set signals using demand, delivery time, and a reasonable buffer.",
        "Waiting until the shelf is empty to place the order.",
      ),
      concept(
        "Inventory turnover",
        "How efficiently inventory sells and is replaced over a period.",
        "Faster healthy turnover returns cash sooner; very slow turnover may signal poor mix or excess buying.",
        "A gym machine sells through water weekly while a candy item sits for two months.",
        "Compare turnover by product and location, then adjust the mix.",
        "Maximizing turnover by holding so little stock that customers face outages.",
      ),
    ],
    supportingTopics: ["Safety stock", "Demand shift", "Product mix", "Cycle count", "Cash tied up"],
    example: {
      title: "Three locations, three demand patterns",
      description:
        "A gym over-indexes on water and protein snacks, an office favors coffee and balanced snacks, and a hot warehouse experiences a rapid summer drink surge.",
      takeaway: "Inventory standards need consistent logic but location-specific quantities.",
    },
    practice: {
      prompt: "A drink sells 8 units daily, delivery takes 5 days, and safety stock is 12. What is a simple reorder point?",
      guidance: "Expected lead-time demand is 8 × 5. Add the 12-unit safety buffer.",
    },
    knowledgeChecks: [
      question(
        "inventory-q1",
        "What is shrinkage?",
        "Inventory lost through damage, theft, spoilage, or recording mistakes.",
        "The planned reduction of a product price.",
        "Any product that sells quickly.",
        "Shrinkage is the gap between what records say should exist and what actually remains.",
      ),
      question(
        "inventory-q2",
        "Why does lead time affect the reorder point?",
        "The business needs enough stock to cover demand while replacement inventory is on the way.",
        "Lead time determines the selling price.",
        "A longer lead time always improves cash flow.",
        "Orders must be triggered early enough to avoid running out during the wait.",
      ),
    ],
    project: {
      title: "Build a three-location inventory plan",
      prompt:
        "Set product mix, reorder signals, safety stock, and review rhythm for a gym, office, and warehouse.",
      deliverables: ["Demand assumptions", "Reorder logic", "One shrinkage control"],
    },
    fieldMission: {
      title: "Observe inventory in the wild",
      prompt:
        "Visit a store or service business and note one stockout, overstock, or replenishment signal. Explain the customer and cash impact.",
    },
    bossBattle: {
      title: "Heat wave demand spike",
      scenario:
        "Temperatures jump for a week. Warehouse drink sales double, the gym wants more water, and office demand stays flat. Supplier lead time extends by two days.",
      prompt: "What is the strongest response?",
      options: bossOptions(
        "Reforecast by location, move available drinks toward highest-impact demand, adjust reorder points for longer lead time, communicate risk, and monitor daily.",
        "Double every product order at every location.",
        "Keep the existing plan because changing it creates inconsistency.",
        "This adapts to real demand and lead time while protecting cash from unnecessary overstock.",
      ),
    },
    reflectionPrompt: "Where have you seen too much or too little inventory damage the customer experience?",
  }),
  defineLevel({
    id: "build-the-team",
    number: 11,
    skill: "Hiring",
    title: "Build the Team",
    tagline: "Hire for an owned outcome, not a vague list of tasks.",
    durationMinutes: 42,
    xpReward: 140,
    missionBrief:
      "Define what a role must accomplish, evaluate realistic candidates, and design the first weeks for success.",
    whyGabiNeedsThis:
      "A COO builds the team that makes the operating system real. A poor role definition creates poor hiring even when interviews feel good.",
    outcomes: [
      "Define the outcome, responsibilities, authority, and standards of a role.",
      "Evaluate experience, attitude, learning ability, and evidence.",
      "Connect selection with onboarding and performance expectations.",
    ],
    concepts: [
      concept(
        "Role outcome",
        "The measurable result the role is responsible for producing.",
        "Clear outcomes make recruiting, interviewing, coaching, and evaluation more useful.",
        "A route lead owns accurate, on-time service for 50 machines—not simply 'help with routes.'",
        "Start every hiring plan by defining success at 30, 90, and 365 days.",
        "Beginning with a long task list that never states the result.",
      ),
      concept(
        "Experience versus attitude",
        "Experience shows prior exposure; attitude includes ownership, curiosity, reliability, and willingness to learn.",
        "Some roles require proven technical skill, while others can train skill more easily than behavior.",
        "One candidate knows vending software but blames past teams; another learns quickly and shows strong follow-through.",
        "Decide which capabilities must exist on day one and which can be taught.",
        "Assuming either experience or attitude always wins in every role.",
      ),
      concept(
        "Structured interview",
        "A consistent set of role-relevant questions and evidence checks used across candidates.",
        "Structure reduces bias and makes candidate comparisons more grounded.",
        "Every route-lead candidate explains a past service failure and how they prevented repeat.",
        "Use work samples, behavioral questions, and consistent scorecards.",
        "Hiring based mainly on chemistry during an unstructured conversation.",
      ),
      concept(
        "Onboarding",
        "The planned process that helps a new employee understand the role, standards, people, tools, and early priorities.",
        "A strong hire can still fail in a confusing system.",
        "The new route lead receives a 30-day plan, trainer, service standards, and weekly checkpoints.",
        "Make expectations, support, and feedback visible from day one.",
        "Treating onboarding as paperwork plus a quick tour.",
      ),
    ],
    supportingTopics: ["Responsibilities", "Skills", "Characteristics", "Compensation", "References", "Expectations"],
    example: {
      title: "Five realistic candidates",
      description:
        "A veteran brings deep skill but resists systems. A high-potential learner lacks route experience. A referral is trusted but weak with customers. A strong supervisor expects higher pay. A reliable internal candidate has never managed.",
      takeaway: "There is no perfect résumé; the operator compares evidence against the role's real outcomes and risks.",
    },
    practice: {
      prompt: "Define the primary outcome and three success measures for Skadra Vending's first route lead.",
      guidance: "Use observable results such as service completion, stock accuracy, response time, and customer feedback.",
    },
    knowledgeChecks: [
      question(
        "hiring-q1",
        "What should come before writing interview questions?",
        "Define the outcome the role owns and what success looks like.",
        "Choose the most impressive job title.",
        "Decide which candidate you already like.",
        "The outcome anchors the responsibilities, evidence, interview, and scorecard.",
      ),
      question(
        "hiring-q2",
        "Why use a structured interview?",
        "It compares candidates against consistent, role-relevant evidence.",
        "It guarantees the cheapest candidate wins.",
        "It removes all need for human judgment.",
        "Structure improves fairness and decision quality while preserving judgment.",
      ),
    ],
    project: {
      title: "Design the first route-lead role",
      prompt:
        "Create the role outcome, responsibilities, required and trainable skills, scorecard, interview questions, and 30-day onboarding plan.",
      deliverables: ["Role scorecard", "Five interview questions", "30-day onboarding plan"],
    },
    fieldMission: {
      title: "Ask about a first employee",
      prompt:
        "Ask an owner or manager what they got right or wrong with an early hire and what they would screen for now.",
    },
    bossBattle: {
      title: "The final two",
      scenario:
        "Candidate A has five years of route experience but weak follow-through references. Candidate B has one year of experience, strong service examples, high learning speed, and excellent reliability evidence.",
      prompt: "What is the strongest decision process?",
      options: bossOptions(
        "Return to must-have day-one skills, test both with the same work sample, verify references, score risks, and choose against the role outcome—not résumé length.",
        "Automatically choose Candidate A because years of experience settle the question.",
        "Automatically choose Candidate B because attitude always matters more than skill.",
        "This uses consistent evidence and the real job requirements instead of a slogan about experience or attitude.",
      ),
    },
    reflectionPrompt: "Which hiring signal do you personally tend to overvalue?",
  }),
  defineLevel({
    id: "lead-the-team",
    number: 12,
    skill: "Leadership",
    title: "Lead the Team",
    tagline: "Set standards, build trust, coach growth, and hold the line.",
    durationMinutes: 44,
    xpReward: 145,
    missionBrief:
      "Practice the daily leadership behaviors that create clarity, accountability, development, and healthy culture.",
    whyGabiNeedsThis:
      "A COO scales through leaders and teams. Culture is shaped by what leaders explain, reward, coach, tolerate, and consistently do.",
    outcomes: [
      "Use both management and leadership intentionally.",
      "Give clear feedback with observation, impact, expectation, and support.",
      "Balance trust, accountability, fairness, and recognition.",
    ],
    concepts: [
      concept(
        "Manager and leader",
        "Management creates planning, coordination, and control. Leadership creates direction, trust, commitment, and growth.",
        "Teams need both reliable systems and meaningful human direction.",
        "Gabi sets a service schedule as a manager and helps the team understand the customer promise as a leader.",
        "Choose the behavior the moment needs instead of treating one label as superior.",
        "Assuming leadership is inspiring speech while management is unimportant administration.",
      ),
      concept(
        "Accountability",
        "A clear expectation plus ownership, evidence, consequences, and follow-through.",
        "Standards become real only when leaders consistently notice and respond.",
        "The route standard is 98% completion, reviewed weekly with coaching and action on misses.",
        "Make standards visible, give support, and follow through fairly.",
        "Using surprise punishment after expectations were vague.",
      ),
      concept(
        "Feedback",
        "Useful information that helps someone understand behavior, impact, expectation, and support.",
        "Timely specific feedback helps people improve before patterns become larger problems.",
        "Observation: two routes closed without counts. Impact: purchasing is guessing. Expectation: close counts by 5:00. Support: retraining is available.",
        "Use Observation, Impact, Expectation, and Support.",
        "Giving labels about personality instead of evidence about behavior.",
      ),
      concept(
        "Culture",
        "The repeated behaviors and norms a group learns are expected, rewarded, and tolerated.",
        "Culture shapes decisions when the leader is not in the room.",
        "Teams learn that customer issues are surfaced early because leaders thank candor and solve causes.",
        "Model standards, recognize good behavior, and address harmful patterns.",
        "Treating culture as company slogans or social events.",
      ),
    ],
    supportingTopics: ["Coaching", "Trust", "Recognition", "Fairness", "Conflict", "Decision making"],
    example: {
      title: "A missed route standard",
      description:
        "Gabi addresses two incomplete closeouts with observable facts, explains the purchasing impact, restates the standard, asks about barriers, and agrees on retraining plus a one-week checkpoint.",
      takeaway: "Strong feedback is direct about the standard and curious about the cause.",
    },
    practice: {
      prompt: "Write a four-part feedback message for an employee who repeatedly sends customer updates late.",
      guidance: "Separate the observed behavior from assumptions about personality or intent.",
    },
    knowledgeChecks: [
      question(
        "leadership-q1",
        "What makes feedback actionable?",
        "Specific observation, impact, expectation, and available support.",
        "A general statement that the employee needs a better attitude.",
        "Waiting until the annual review to mention the pattern.",
        "Actionable feedback names what happened and what improvement looks like.",
      ),
      question(
        "leadership-q2",
        "What most strongly shapes culture?",
        "Repeated behaviors leaders model, reward, coach, and tolerate.",
        "The words on the office wall.",
        "One team-building event each year.",
        "Culture is learned from daily operating reality.",
      ),
    ],
    project: {
      title: "Create a team leadership standard",
      prompt:
        "Define five team behaviors, how each will be measured or observed, and how leaders will coach and recognize them.",
      deliverables: ["Five behaviors", "Feedback examples", "Recognition and accountability rhythm"],
    },
    fieldMission: {
      title: "Recognize one specific behavior",
      prompt:
        "Give someone sincere, specific recognition that connects what they did to its impact.",
    },
    bossBattle: {
      title: "The high performer with bad behavior",
      scenario:
        "A top route employee produces strong numbers but dismisses teammates, hides mistakes, and ignores process. Others are beginning to copy the behavior.",
      prompt: "What should Gabi do?",
      options: bossOptions(
        "Address the specific behavior and impact immediately, restate nonnegotiable standards, offer support, set a checkpoint, and follow through on consequences regardless of output.",
        "Ignore the behavior because strong numbers matter most.",
        "Publicly criticize the employee so the team sees accountability.",
        "This protects performance and culture through direct, fair, private, and evidence-based leadership.",
      ),
    },
    reflectionPrompt: "What behavior would your future team learn is acceptable by watching only what you tolerate?",
  }),
] as const;
