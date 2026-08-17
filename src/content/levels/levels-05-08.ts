import { bossOptions, concept, defineLevel, question } from "@/content/levels/helpers";

export const levels05To08 = [
  defineLevel({
    id: "run-the-machine",
    number: 5,
    skill: "Business operations",
    title: "Run the Machine",
    tagline: "Turn resources into a consistent customer result.",
    durationMinutes: 42,
    xpReward: 135,
    missionBrief:
      "See a business as connected inputs, processes, outputs, customers, feedback, and improvement loops.",
    whyGabiNeedsThis:
      "Operations is the center of the COO role. Your job is to make good performance repeatable even when the founders are not personally pushing every task.",
    outcomes: [
      "Map a process from input to customer outcome.",
      "Find bottlenecks, unclear ownership, and quality risks.",
      "Improve capacity and efficiency without sacrificing the customer.",
    ],
    concepts: [
      concept(
        "Operations",
        "Everything required to turn resources into a consistent product or service.",
        "A strong idea only becomes a strong business when execution is reliable.",
        "Inventory is received, stored, routed, stocked, sold, recorded, and reordered.",
        "Design the system, assign ownership, watch performance, and improve it.",
        "Thinking operations means only fixing emergencies.",
      ),
      concept(
        "Bottleneck",
        "The step that limits the output or speed of the whole process.",
        "Improving other steps may not help until the bottleneck is addressed.",
        "Ten routes are ready, but one person must approve every restock order.",
        "Measure where work queues, waits, or repeatedly fails.",
        "Calling every inconvenience a bottleneck.",
      ),
      concept(
        "Standardization",
        "Defining the reliable best-known way to complete repeated work.",
        "Standards reduce variation and make training and improvement possible.",
        "Every machine visit follows the same clean, count, stock, test, and report checklist.",
        "Create clear SOPs while allowing escalation for unusual conditions.",
        "Making a standard so rigid that employees cannot use judgment.",
      ),
      concept(
        "Capacity and efficiency",
        "Capacity is how much the system can produce. Efficiency is how well it uses time, money, and resources.",
        "Growth fails when demand exceeds capacity or waste consumes the benefit.",
        "A route can serve 12 machines daily, but poor sequencing wastes two hours.",
        "Balance workload, staffing, route design, service levels, and customer impact.",
        "Maximizing speed while quality and safety decline.",
      ),
      concept(
        "Ownership",
        "One clearly named person is accountable for the outcome and follow-through.",
        "Shared awareness without clear ownership creates dropped work.",
        "The route lead owns resolving stockouts within the service standard.",
        "Assign outcomes, authority, standards, and checkpoints.",
        "Naming several owners so no one feels fully responsible.",
      ),
    ],
    supportingTopics: ["Input", "Process", "Output", "Customer", "Feedback", "Quality", "Improvement"],
    example: {
      title: "The Skadra Vending operating loop",
      description:
        "Inventory arrives → is stored → routes are planned → machines are cleaned and stocked → customers buy → sales and counts are recorded → exceptions are fixed → new demand informs the next order.",
      takeaway:
        "Every broken handoff is an opportunity to improve the system, not just remind someone to try harder.",
    },
    practice: {
      prompt: "Map the five steps between an empty machine slot being noticed and the product being restored.",
      guidance: "Name the input, each handoff, the owner, the expected time, and the customer outcome.",
    },
    knowledgeChecks: [
      question(
        "operations-q1",
        "What is a bottleneck?",
        "The step that limits the output or speed of the entire process.",
        "Any task an employee dislikes.",
        "The most expensive asset in the business.",
        "The bottleneck controls total flow, so improving it often has the highest leverage.",
      ),
      question(
        "operations-q2",
        "What makes ownership clear?",
        "One person owns a defined outcome, standard, authority, and follow-up.",
        "Everyone is generally responsible.",
        "The founder checks every task.",
        "Clear ownership connects accountability with the authority and information needed to act.",
      ),
    ],
    project: {
      title: "Map the vending service loop",
      prompt:
        "Document the complete process from inventory arrival through customer feedback, then identify one bottleneck and one quality checkpoint.",
      deliverables: ["Process map", "Named owners", "One measurable improvement"],
    },
    fieldMission: {
      title: "Observe one real process",
      prompt:
        "Watch a repeated process at a business. Record the delay, handoff, waste, customer impact, and one respectful improvement idea.",
    },
    bossBattle: {
      title: "Ten machines, five problems",
      scenario:
        "One machine is empty at a top account, one card reader is down, a low-volume unit needs cleaning, inventory count is late, and tomorrow's route is not assigned.",
      prompt: "What is the strongest operating response?",
      options: bossOptions(
        "Protect immediate customer/revenue risks first, assign owners and deadlines, then fix route planning and inventory controls so the failures do not repeat.",
        "Personally visit all ten machines and postpone planning until later.",
        "Send a group message asking everyone to help however they can.",
        "This prioritizes by impact, creates ownership, and preserves time for prevention instead of endless firefighting.",
      ),
    },
    reflectionPrompt: "Which recurring problem around you is actually a system problem rather than a motivation problem?",
  }),
  defineLevel({
    id: "executive-presence-one",
    number: 6,
    skill: "Professional communication",
    title: "Executive Presence I",
    tagline: "Make the situation, impact, recommendation, and next step clear.",
    durationMinutes: 34,
    xpReward: 125,
    missionBrief:
      "Communicate with concise context, calm tone, clear judgment, and an explicit next action.",
    whyGabiNeedsThis:
      "A COO coordinates people under pressure. Clear updates help leaders make decisions and help teams act without guessing.",
    outcomes: [
      "Use the SIRN framework for business updates.",
      "Match tone and detail to the audience.",
      "Prepare for difficult conversations with facts and direction.",
    ],
    concepts: [
      concept(
        "Executive presence",
        "The ability to communicate calm judgment, credibility, and direction—especially when the situation is unclear.",
        "Teams take cues from how leaders frame problems and decisions.",
        "Gabi reports a failure plainly, proposes a response, and avoids blame or drama.",
        "Bring facts, impact, a recommendation, and a decision or next step.",
        "Mistaking confidence for pretending to know everything.",
      ),
      concept(
        "SIRN update",
        "Situation, Impact, Recommendation, Next step.",
        "This structure helps a reader quickly understand what happened and what should occur.",
        "Card reader failed; card sales are stopped; replace today; Maya owns repair and will update by 3:00.",
        "Use it in texts, email, meetings, and escalations.",
        "Sending a long timeline before stating the decision needed.",
      ),
      concept(
        "Tone",
        "The attitude communicated by word choice, pacing, and level of directness.",
        "The same facts can create trust or defensiveness depending on delivery.",
        "A firm service-recovery note can still acknowledge the customer's frustration.",
        "Be respectful, specific, and appropriately direct.",
        "Using softness to avoid clarity or bluntness to perform authority.",
      ),
      concept(
        "Conciseness",
        "Including the information needed for understanding and action without unnecessary words.",
        "Leaders and operators process many decisions; clarity preserves time.",
        "A four-line SIRN update replaces three paragraphs of scattered context.",
        "Lead with the point, then add evidence and detail as needed.",
        "Removing so much context that the reader cannot make a sound decision.",
      ),
    ],
    supportingTopics: ["Professional email", "Business text", "Meetings", "Confidence", "Difficult conversations"],
    example: {
      title: "From vague to executive",
      description:
        "Instead of 'Machine 3 is messed up,' write: 'Machine 3's card reader failed this morning. Card purchases drive most sales, so revenue is affected. I recommend replacement today. Maya is coordinating and will confirm restoration by 3:00.'",
      takeaway: "The improved message makes the problem, judgment, ownership, and follow-up visible.",
    },
    practice: {
      prompt: "Rewrite: 'The route is behind and people are annoyed. What should we do?'",
      guidance: "Use Situation, Impact, Recommendation, and Next step in four concise lines.",
    },
    knowledgeChecks: [
      question(
        "communication-q1",
        "Which part of SIRN states what you believe should happen?",
        "Recommendation",
        "Situation",
        "Impact",
        "The recommendation turns facts into responsible judgment.",
      ),
      question(
        "communication-q2",
        "What does concise communication require?",
        "Enough context for action, expressed without unnecessary words.",
        "The fewest possible words regardless of meaning.",
        "Only a confident tone and no evidence.",
        "Concise communication protects both clarity and attention.",
      ),
    ],
    project: {
      title: "Build three executive updates",
      prompt:
        "Write a routine update, an escalation, and a difficult-conversation opening using the SIRN structure.",
      deliverables: ["Routine update", "Urgent escalation", "Difficult-conversation opening"],
    },
    fieldMission: {
      title: "Send one clearer update",
      prompt: "Use SIRN in a real message this week. Log what changed in the response you received.",
    },
    bossBattle: {
      title: "The Monday outage",
      scenario:
        "A high-volume machine failed over the weekend. The customer is frustrated, the technician is not yet confirmed, and Andrew asks for an update.",
      prompt: "Which update demonstrates the strongest executive presence?",
      options: bossOptions(
        "State the failure and customer impact, name the current unknown, recommend an immediate service backup, assign confirmation ownership, and set the next update time.",
        "Explain every event from Friday onward and end by asking what Andrew wants to do.",
        "Say the team is handling it and avoid details until the repair is complete.",
        "This communicates facts without hiding uncertainty and creates a confident operating response.",
      ),
    },
    reflectionPrompt: "Which communication habit would most increase confidence in your leadership?",
  }),
  defineLevel({
    id: "build-the-room",
    number: 7,
    skill: "Networking",
    title: "Build the Room Before You Need It",
    tagline: "Create genuine professional relationships over time.",
    durationMinutes: 32,
    xpReward: 120,
    missionBrief:
      "Build a useful network through curiosity, value, memory, and consistent follow-up—not contact collecting.",
    whyGabiNeedsThis:
      "Future operators need trusted people across customers, vendors, finance, law, real estate, franchising, leadership, and community life.",
    outcomes: [
      "Make a clear, natural introduction.",
      "Ask useful questions and record what matters.",
      "Follow up with relevance before asking for help.",
    ],
    concepts: [
      concept(
        "Networking",
        "Building genuine professional relationships before you need something from the person.",
        "A trusted network brings insight, referrals, talent, problem solving, and perspective.",
        "Gabi stays in touch with a property manager by sharing a useful vendor recommendation months before requesting an introduction.",
        "Invest in people consistently and with no immediate transaction required.",
        "Collecting names and only contacting people when you need something.",
      ),
      concept(
        "Useful introduction",
        "A short explanation of who you are, what you are learning or building, and why you are interested in the other person.",
        "It gives context without turning the conversation into a speech.",
        "I'm Gabi. I'm learning operations at Skadra Ventures and would love to hear how you built your first service team.",
        "Create enough context to invite a real conversation.",
        "Giving a résumé-length monologue.",
      ),
      concept(
        "Offer value",
        "Help in a way that is relevant, honest, and proportionate to the relationship.",
        "Healthy networks are reciprocal over time, not purely extractive.",
        "Send an article, make a thoughtful introduction, or remember an important milestone.",
        "Notice what people care about and look for authentic ways to help.",
        "Forcing a favor the other person did not ask for.",
      ),
      concept(
        "Relationship memory",
        "Recording context, priorities, promises, and next-contact timing.",
        "Good intentions disappear in busy weeks unless the system remembers.",
        "G-OPS notes how you met, what they care about, and the next contact date.",
        "Use the Network tool as a lightweight relationship operating system.",
        "Writing sensitive or unnecessary personal information.",
      ),
    ],
    supportingTopics: ["Introductions", "Curiosity", "Follow-up", "Staying in touch", "Community leadership"],
    example: {
      title: "A banker relationship before financing",
      description:
        "Gabi meets a local banker at an event, asks about small-business patterns, follows up with a useful market note, and checks in quarterly. When Skadra later needs financing insight, the conversation begins with trust and context.",
      takeaway: "The relationship was built before the request.",
    },
    practice: {
      prompt: "Write a two-sentence introduction for a business owner you admire.",
      guidance: "Offer context, show genuine interest, and ask one question they might enjoy answering.",
    },
    knowledgeChecks: [
      question(
        "networking-q1",
        "What makes networking different from collecting contacts?",
        "It builds genuine, ongoing professional relationships before a need appears.",
        "It focuses on having the largest list.",
        "It requires immediately pitching every person.",
        "A network becomes valuable through trust, context, and mutual usefulness over time.",
      ),
      question(
        "networking-q2",
        "What is the best follow-up after a useful conversation?",
        "A specific thank-you that references the discussion and offers a relevant next touch.",
        "Add them to a mass mailing list without asking.",
        "Wait until you need a favor.",
        "Relevant follow-up proves you listened and helps the relationship continue naturally.",
      ),
    ],
    project: {
      title: "Build your first relationship map",
      prompt:
        "Add five people or relationship categories that matter to your future COO role and plan one useful next touch.",
      deliverables: ["Five relationship entries", "Context for each", "One dated next action"],
    },
    fieldMission: {
      title: "Reach out to one person",
      prompt:
        "Send a genuine note to a business owner, franchisee, property manager, vendor, banker, CPA, attorney, executive, or community leader.",
    },
    bossBattle: {
      title: "The conference room",
      scenario:
        "You attend an event alone. A respected operator is speaking with two people, and the session starts in six minutes.",
      prompt: "What is the strongest approach?",
      options: bossOptions(
        "Join respectfully, introduce yourself briefly, ask one relevant question, and request permission to follow up after the event.",
        "Wait until you can deliver your entire background and business idea.",
        "Interrupt with a request for a mentoring meeting.",
        "This respects time, creates a real connection, and earns a natural next step without forcing intimacy.",
      ),
    },
    reflectionPrompt: "Who should know you five years from now, and what value can you begin offering today?",
  }),
  defineLevel({
    id: "customer-hero",
    number: 8,
    skill: "Customer service",
    title: "Customer Hero",
    tagline: "Recover trust when the experience breaks.",
    durationMinutes: 36,
    xpReward: 130,
    missionBrief:
      "Design customer experiences intentionally and use service recovery to restore confidence after failure.",
    whyGabiNeedsThis:
      "The COO turns brand promises into daily reality. Customers experience the system through speed, cleanliness, communication, reliability, and recovery.",
    outcomes: [
      "See the complete customer experience, not only the transaction.",
      "Use the service-recovery loop after a failure.",
      "Prevent repeat issues by improving the system.",
    ],
    concepts: [
      concept(
        "Customer experience",
        "Every interaction someone has with the business before, during, and after buying.",
        "Customers judge the whole experience, including effort, reliability, communication, and recovery.",
        "A stocked machine still creates a poor experience if it is dirty or refunds are difficult.",
        "Measure the experience at each touchpoint and connect issues to operating owners.",
        "Treating customer experience as friendliness only.",
      ),
      concept(
        "Service recovery",
        "What the company does after something goes wrong.",
        "A thoughtful recovery can restore trust and reveal system weaknesses.",
        "After a three-day stockout, Gabi acknowledges the miss, restores service, updates the manager, and changes the alert.",
        "Listen, acknowledge, solve, communicate, follow up, and prevent repeat.",
        "Giving an apology without fixing the issue or cause.",
      ),
      concept(
        "Acknowledge",
        "Show that you understand the customer's experience and why it matters.",
        "People need to know the problem is being taken seriously before they trust the solution.",
        "You should not have had to report this twice. We missed our service standard.",
        "Name the impact without becoming defensive.",
        "Using a scripted apology that avoids responsibility.",
      ),
      concept(
        "Prevent repeat",
        "Change the process, standard, ownership, or signal that allowed the failure.",
        "Recovery is incomplete if the same customer experiences the same issue again.",
        "A stockout alert now triggers at 20% inventory and assigns the route lead.",
        "Translate complaints into operating improvements.",
        "Blaming one employee without examining the system.",
      ),
    ],
    supportingTopics: ["Listen", "Solve", "Communicate", "Follow up", "Customer Trust Score"],
    example: {
      title: "Empty for three days",
      description:
        "Gabi listens to the location manager, acknowledges the missed standard, restores products that day, confirms completion, checks back in 48 hours, and creates a low-stock alert with a named owner.",
      takeaway: "Recovery addresses the person, the immediate problem, and the system.",
    },
    practice: {
      prompt: "Write the first two sentences you would say to a manager whose machine has been empty for three days.",
      guidance: "Acknowledge the experience and impact before explaining or proposing.",
    },
    knowledgeChecks: [
      question(
        "service-q1",
        "What completes a strong service recovery?",
        "Fix the issue, communicate, follow up, and change the system to prevent repeat.",
        "Offer an apology and move on.",
        "Explain why the customer caused the issue.",
        "Recovery restores the immediate experience and improves the underlying operation.",
      ),
      question(
        "service-q2",
        "What is customer experience?",
        "Every interaction someone has with the business.",
        "Only the moment a purchase occurs.",
        "The friendliness of one employee.",
        "Experience includes discovery, buying, use, support, effort, and recovery.",
      ),
    ],
    project: {
      title: "Design a service-recovery standard",
      prompt:
        "Create a response playbook for stockouts, payment failures, and cleanliness complaints.",
      deliverables: ["Response time", "Communication template", "Prevention action for each failure"],
    },
    fieldMission: {
      title: "Observe one customer experience",
      prompt:
        "Score a business in the Customer Experience Lab, then write what Skadra Ventures would do differently.",
    },
    bossBattle: {
      title: "Three complaints at once",
      scenario:
        "A key site has an empty drink row, another reports a failed refund, and a third says the machine area is dirty. All three expect an update today.",
      prompt: "What is your strongest response?",
      options: bossOptions(
        "Acknowledge each customer, triage by impact, assign owners and response times, confirm restoration, then review why monitoring failed across sites.",
        "Handle the loudest customer personally and ask the others to wait.",
        "Send the same apology to all three and discuss prevention next month.",
        "This protects every relationship, creates visible ownership, and converts the pattern into an operating improvement.",
      ),
    },
    reflectionPrompt: "Think of a service failure you remember. What made the recovery build or lose trust?",
  }),
] as const;

