import { memo } from "react";
import { Star } from "lucide-react";

const StarRating = memo(({ rating = 0 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.round(rating)
              ? "text-orange-400 fill-orange-400"
              : "text-gray-300 fill-gray-300"
          }`}
        />
      ))}
    </div>
  );
});

StarRating.displayName = "StarRating";

export default StarRating;
