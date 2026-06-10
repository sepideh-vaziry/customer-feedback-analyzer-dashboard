export default function SimilarityBadge({ score }) {
  if (score == null) return null;

  const percent = Math.round(score * 100);
  let colorClass = 'bg-success-50 text-success-700 border-success-200';
  if (percent >= 90) {
    colorClass = 'bg-success-50 text-success-700 border-success-200';
  } else if (percent >= 70) {
    colorClass = 'bg-primary-50 text-primary-700 border-primary-200';
  } else if (percent >= 50) {
    colorClass = 'bg-warning-50 text-warning-700 border-warning-200';
  } else {
    colorClass = 'bg-muted-50 text-muted-600 border-muted-200';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${colorClass}`}>
      {percent}% Match
    </span>
  );
}
