export default function FeedbackContentPreview({ content, maxLength = 80 }) {
  if (!content) return <span className="text-text-muted italic">No content</span>;

  const truncated = content.length > maxLength
    ? content.slice(0, maxLength) + '...'
    : content;

  return (
    <span className="text-sm text-text-primary" title={content}>
      {truncated}
    </span>
  );
}
