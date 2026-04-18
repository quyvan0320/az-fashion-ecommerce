import { Star } from "lucide-react";

const StarDisplay = ({
  rating,
  size = 14,
}: {
  rating: number;
  size?: number;
}) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-200"
          }
        />
      ))}
    </div>
  );
};

export default StarDisplay;
