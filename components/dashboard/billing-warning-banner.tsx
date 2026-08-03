import { AlertCircle } from 'lucide-react';

export function BillingWarningBanner() {
  return (
    <div className="flex gap-4 rounded-lg border border-red-500/20 bg-red-950/20 p-4 mb-6">
      <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-foreground">
          Your bot is currently paused
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Your subscription is inactive. Reactivate to resume automatic replies.
        </p>
      </div>
    </div>
  );
}
