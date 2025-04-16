import React, { memo } from "react";

interface ArticleProgressProps {
  progress: number;
}

const ArticleProgress = memo(function ArticleProgress({
  progress,
}: ArticleProgressProps) {
  const progressPercent = Math.max(0, Math.min(100, progress * 100));

  return (
    <div
      className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded overflow-hidden fixed top-0 left-0 right-0 z-50"
      aria-label="Scroll progress"
      role="progressbar"
      aria-valuenow={Math.round(progressPercent)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-primary transition-all duration-200"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  );
});

export default ArticleProgress;
