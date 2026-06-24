import { getTranslations } from "next-intl/server";
import { getReviewsByTarget, getAverageRating } from "@/lib/queries";
import { StarRating } from "@/components/star-rating";
import { BadgeCheck } from "lucide-react";

type ReviewListProps = {
  targetType: "salon" | "provider";
  targetId: string;
};

export async function ReviewList({ targetType, targetId }: ReviewListProps) {
  const t = await getTranslations("salon-detail.reviews");
  const [reviews, stats] = await Promise.all([
    getReviewsByTarget(targetType, targetId),
    getAverageRating(targetType, targetId),
  ]);

  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted">
        {t("empty")}
      </p>
    );
  }

  // La locale est résolue par next-intl via les headers de requête.
  // On n'a pas besoin de la passer explicitement ici : Intl.DateTimeFormat
  // utilisera la locale active du serveur, ce qui est correct pour le rendu SSR.
  const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      {/* Résumé */}
      <div className="flex items-center gap-3">
        <StarRating value={Math.round(stats.average)} size="sm" />
        <span className="text-sm font-medium">
          {t("ratingLabel", { average: stats.average.toFixed(1) })}
        </span>
        <span className="text-sm text-muted">
          {t("ratingCount", { count: stats.count })}
        </span>
      </div>

      {/* Liste des avis */}
      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-lg border border-border bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <StarRating value={review.rating} size="sm" />
                {review.role && (
                  <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                    {t(`roles.${review.role}` as Parameters<typeof t>[0]) ?? review.role}
                  </span>
                )}
                {review.is_verified && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-700">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {t("verified")}
                  </span>
                )}
              </div>
              <time className="shrink-0 text-xs text-muted">
                {dateFormatter.format(new Date(review.created_at))}
              </time>
            </div>

            {review.title && (
              <p className="mt-2 text-sm font-semibold">{review.title}</p>
            )}

            {review.body && (
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {review.body}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
