import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import type { FeatureAnalysis } from "@/lib/phishingDetector";

interface FeatureListProps {
  features: FeatureAnalysis[];
}

export function FeatureList({ features }: FeatureListProps) {
  const getIcon = (severity: FeatureAnalysis['severity'], detected: boolean) => {
    if (!detected) return <CheckCircle className="w-4 h-4 text-success" />;
    
    switch (severity) {
      case 'info': return <Info className="w-4 h-4 text-primary" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'danger': return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getBorderColor = (severity: FeatureAnalysis['severity'], detected: boolean) => {
    if (!detected) return 'border-success/30';
    
    switch (severity) {
      case 'info': return 'border-primary/30';
      case 'warning': return 'border-warning/30';
      case 'danger': return 'border-destructive/30';
      default: return 'border-border';
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-mono text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        Feature Analysis
      </h3>
      
      <div className="grid gap-2">
        {features.map((feature, index) => (
          <div
            key={index}
            className={cn(
              "p-3 rounded-lg border bg-card/50 backdrop-blur transition-all duration-200 hover:bg-card",
              getBorderColor(feature.severity, feature.detected)
            )}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {getIcon(feature.severity, feature.detected)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm font-medium text-foreground">
                  {feature.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {feature.description}
                </div>
              </div>
              <div className={cn(
                "px-2 py-0.5 rounded text-xs font-mono uppercase",
                feature.detected 
                  ? feature.severity === 'danger' 
                    ? 'bg-destructive/20 text-destructive'
                    : feature.severity === 'warning'
                    ? 'bg-warning/20 text-warning'
                    : 'bg-primary/20 text-primary'
                  : 'bg-success/20 text-success'
              )}>
                {feature.detected ? 'Detected' : 'Clear'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
