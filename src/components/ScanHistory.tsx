import { cn } from "@/lib/utils";
import { Clock, ExternalLink } from "lucide-react";
import type { AnalysisResult } from "@/lib/phishingDetector";

interface ScanHistoryProps {
  history: AnalysisResult[];
  onSelect: (result: AnalysisResult) => void;
}

export function ScanHistory({ history, onSelect }: ScanHistoryProps) {
  const getThreatColor = (level: AnalysisResult['threatLevel']) => {
    switch (level) {
      case 'safe': return 'bg-success';
      case 'low': return 'bg-accent';
      case 'medium': return 'bg-warning';
      case 'high': return 'bg-destructive';
      case 'critical': return 'bg-destructive animate-pulse';
      default: return 'bg-muted';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground font-mono">
          No scans yet. Enter a URL to analyze.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-mono text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Recent Scans
      </h3>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
        {history.map((result, index) => (
          <button
            key={index}
            onClick={() => onSelect(result)}
            className="w-full text-left p-3 rounded-lg border border-border bg-card/30 hover:bg-card/60 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className={cn("w-2 h-2 rounded-full shrink-0", getThreatColor(result.threatLevel))} />
              
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs text-foreground truncate">
                  {truncateUrl(result.url)}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{formatTime(result.timestamp)}</span>
                  <span>•</span>
                  <span className="uppercase">{result.threatLevel}</span>
                  <span>•</span>
                  <span>{result.threatScore}%</span>
                </div>
              </div>

              <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
