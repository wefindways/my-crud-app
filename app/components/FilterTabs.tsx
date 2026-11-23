interface FilterTabsProps {
  activeFilter: string;
  onSelectFilter: (value: string) => void;
}
export default function FilterTabs({
  activeFilter,
  onSelectFilter,
}: FilterTabsProps) {
  const FILTER_TABS = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in_progress" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <div className="flex gap-6 border-b border-zinc-200 dark:border-zinc-800 text-sm">
      {FILTER_TABS.map((tab) => (
        <button
          key={tab.label}
          onClick={() => onSelectFilter(tab.value)}
          className={`-mb-px border-b-2 pb-2.5 font-medium transition-colors cursor-pointer ${
            activeFilter === tab.value
              ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
