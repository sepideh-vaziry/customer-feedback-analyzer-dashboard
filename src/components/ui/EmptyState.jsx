import { Link } from 'react-router-dom';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      {Icon && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 text-primary-400 mb-6 shadow-sm">
          <Icon size={32} />
        </div>
      )}
      <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-text-muted max-w-sm mb-6 font-medium leading-relaxed">{description}</p>
      )}
      {action && (
        <div className="mt-2">{action}</div>
      )}
    </div>
  );
}
