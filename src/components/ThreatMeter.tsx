import { cn } from "@/lib/utils";
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";

interface ThreatMeterProps {
  score: number;
  level: 'safe' | 'low' | 'medium' | 'high' | 'critical';
}

export function ThreatMeter({ score, level }: ThreatMeterProps) {
  const getColor = () => {
    switch (level) {
      case 'safe': return 'text-success';
      case 'low': return 'text-accent';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
      case 'critical': return 'text-destructive animate-threat-pulse';
      default: return 'text-muted-foreground';
    }
  };

  const getBgColor = () => {
    switch (level) {
      case 'safe': return 'bg-success';
      case 'low': return 'bg-accent';
      case 'medium': return 'bg-warning';
      case 'high': return 'bg-destructive';
      case 'critical': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getIcon = () => {
    switch (level) {
      case 'safe': return <ShieldCheck className="w-16 h-16" />;
      case 'low': return <Shield className="w-16 h-16" />;
      case 'medium': return <ShieldAlert className="w-16 h-16" />;
      case 'high': return <ShieldX className="w-16 h-16" />;
      case 'critical': return <ShieldX className="w-16 h-16" />;
      default: return <Shield className="w-16 h-16" />;
    }
  };

  const getLabel = () => {
    switch (level) {
      case 'safe': return 'SAFE';
      case 'low': return 'LOW RISK';
      case 'medium': return 'MEDIUM RISK';
      case 'high': return 'HIGH RISK';
      case 'critical': return 'CRITICAL';
      default: return 'UNKNOWN';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={cn("transition-colors duration-300", getColor())}>
        {getIcon()}
      </div>
      
      <div className="w-full max-w-xs">
        <div className="flex justify-between mb-2 font-mono text-xs text-muted-foreground">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden border border-border">
          <div 
            className={cn("h-full transition-all duration-500 ease-out", getBgColor())}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className="text-center">
        <div className={cn("font-mono text-2xl font-bold", getColor())}>
          {score}%
        </div>
        <div className={cn("font-mono text-sm tracking-widest", getColor())}>
          {getLabel()}
        </div>
      </div>
    </div>
  );
}
