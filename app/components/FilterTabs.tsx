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
    <div className="flex gap-2 text-sm">
      {FILTER_TABS.map((tab) => (
        <button
          key={tab.label}
          onClick={() => onSelectFilter(tab.value)}
          className={`rounded-full border px-3 py-1 ${
            activeFilter === tab.value ? "bg-zinc-900 text-white" : ""
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
