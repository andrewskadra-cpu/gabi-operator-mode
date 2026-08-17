import type { Campaign } from "@/content/types";

export const operatorFoundations = {
  id: "operator-foundations",
  eyebrow: "Campaign 01",
  title: "Operator Foundations",
  description:
    "Build the judgment, cadence, and communication habits behind reliable execution.",
  outcome:
    "Turn a business priority into a clear operating plan with visible ownership and follow-through.",
  lessons: [
    {
      id: "orient-to-the-mission",
      title: "Orient to the mission",
      description: "Connect daily decisions to the outcome that matters most.",
      durationMinutes: 12,
      status: "available",
    },
    {
      id: "build-the-operating-rhythm",
      title: "Build the operating rhythm",
      description: "Create a cadence for planning, updates, decisions, and review.",
      durationMinutes: 18,
      status: "draft",
    },
    {
      id: "close-the-loop",
      title: "Close the loop",
      description: "Make ownership, evidence, and follow-through unmistakable.",
      durationMinutes: 15,
      status: "draft",
    },
  ],
} as const satisfies Campaign;
