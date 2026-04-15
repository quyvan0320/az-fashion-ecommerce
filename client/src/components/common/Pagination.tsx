import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({
  pagination,
  handleParams,
  page: currentPage,
}: {
  pagination: any;
  handleParams: (updates: Record<string, string>) => void;
  page: string | number;
}) => {
  const page = Number(currentPage);

  return (
    <div>
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            onClick={() => handleParams({ page: String(page - 1) })}
            className={`${!pagination.hasPrev ? "invisible" : ""} w-10 h-10 flex items-center justify-center rounded-full bg-brand-grey`}
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === pagination.totalPages ||
                Math.abs(p - page) <= 1,
            )
            .reduce<(number | "...")[]>((acc, p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "..." ? (
                <span
                  key={`dots-${i}`}
                  className="w-10 h-10 flex items-center justify-center text-brand-black"
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => handleParams({ page: String(p) })}
                  className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                    page === p
                      ? "bg-brand-black text-brand-light"
                      : "bg-brand-grey text-brand-black hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ),
            )}

          <button
            onClick={() => handleParams({ page: String(page + 1) })}
            className={`${!pagination.hasNext ? "invisible" : ""} w-10 h-10 flex items-center justify-center rounded-full bg-brand-grey`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
