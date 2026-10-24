import React from 'react';
import { AlertCircle, RefreshCw, Inbox } from 'lucide-react';

export function LoadingSpinner({ message = 'Loading forecast analytics...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-slate-200">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-[#00338D] rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}

export function ErrorState({
  title = 'Failed to load data',
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-xl border border-red-200 text-center">
      <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
        <AlertCircle size={24} />
      </div>
      <h3 className="text-base font-bold text-[#0C233C] mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-5">
        {message || 'An error occurred while communicating with the decision support API.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#00338D] hover:bg-[#0C233C] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          <RefreshCw size={15} />
          Retry Request
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title = 'No data available',
  message = 'There are no records matching the selected parameters or filters.',
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-xl border border-slate-200 text-center">
      <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
        <Inbox size={24} />
      </div>
      <h3 className="text-base font-bold text-[#0C233C] mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md">{message}</p>
    </div>
  );
}
