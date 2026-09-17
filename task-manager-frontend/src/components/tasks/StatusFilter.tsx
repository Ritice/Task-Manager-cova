import type { TaskStatus } from '../../types';

export type FilterValue = 'ALL' | TaskStatus;

const OPTIONS: { value: FilterValue; label: string }[] = [
  { value: 'ALL', label: 'Tout' },
  { value: 'TODO', label: 'À faire' },
  { value: 'IN_PROGRESS', label: 'En cours' },
  { value: 'DONE', label: 'Terminé' },
];

export default function StatusFilter({
  value,
  onChange,
}: {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}) {
  return (
    <div className="inline-flex rounded border border-line bg-surface p-1 text-sm">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded px-3 py-1.5 font-medium transition-colors cursor-pointer ${
            value === option.value
              ? 'bg-moss text-paper'
              : 'text-ink-soft hover:text-ink'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
