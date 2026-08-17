import type { Campaign, CampaignLesson } from "@/content/types";

interface CampaignOverviewProps {
  readonly campaign: Campaign;
}

const statusLabels: Record<CampaignLesson["status"], string> = {
  available: "Ready",
  locked: "Locked",
  draft: "Coming next",
} as const;

export function CampaignOverview({ campaign }: CampaignOverviewProps) {
  return (
    <section className="campaign" aria-labelledby="campaign-title">
      <div className="campaign__intro">
        <div>
          <p className="eyebrow">{campaign.eyebrow}</p>
          <h2 id="campaign-title">{campaign.title}</h2>
        </div>
        <p>{campaign.description}</p>
      </div>

      <div className="lesson-list" aria-label="Campaign lessons">
        {campaign.lessons.map((lesson: CampaignLesson, index: number) => (
          <article className="lesson" key={lesson.id}>
            <div className="lesson__number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="lesson__copy">
              <div className="lesson__title-row">
                <h3>{lesson.title}</h3>
                <span className={"status status--" + lesson.status}>
                  {statusLabels[lesson.status]}
                </span>
              </div>
              <p>{lesson.description}</p>
            </div>
            <p className="lesson__duration">{lesson.durationMinutes} min</p>
          </article>
        ))}
      </div>
    </section>
  );
}
