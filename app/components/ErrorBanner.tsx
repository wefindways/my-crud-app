import { AlertCircle, RefreshCw, X } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
}

export default function ErrorBanner({ message, onRetry, onDismiss }: ErrorBannerProps) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950/40 dark:text-red-300 dark:border-red-900">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{message}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onRetry}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 rounded dark:text-red-300 dark:hover:bg-red-900/50 cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" /> Retry
        </button>
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-red-100 rounded text-red-500 hover:text-red-700 dark:hover:bg-red-900/50 cursor-pointer"
          aria-label="Dismiss error"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
