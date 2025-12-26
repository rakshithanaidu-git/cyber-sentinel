import { useState, useCallback } from "react";
import { Search, Shield, Terminal, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThreatMeter } from "./ThreatMeter";
import { FeatureList } from "./FeatureList";
import { ScanHistory } from "./ScanHistory";
import { analyzeURL, type AnalysisResult } from "@/lib/phishingDetector";
import { cn } from "@/lib/utils";

export function URLAnalyzer() {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  const handleScan = useCallback(async () => {
    if (!url.trim()) return;

    setIsScanning(true);
    setResult(null);

    // Simulate network delay for effect
    await new Promise(resolve => setTimeout(resolve, 1500));

    const analysisResult = analyzeURL(url.trim());
    setResult(analysisResult);
    setHistory(prev => [analysisResult, ...prev].slice(0, 10));
    setIsScanning(false);
  }, [url]);

  const handleHistorySelect = (selectedResult: AnalysisResult) => {
    setResult(selectedResult);
    setUrl(selectedResult.url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && url.trim()) {
      handleScan();
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-mono text-xl font-bold text-foreground text-glow">
                PhishGuard
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                URL Threat Detection System
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* URL Input Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="font-mono text-sm text-muted-foreground">
                Enter URL to analyze
              </span>
              <span className="terminal-cursor text-primary">_</span>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pr-10 bg-background/50"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              <Button 
                variant="scan" 
                onClick={handleScan}
                disabled={!url.trim() || isScanning}
                className="min-w-32"
              >
                {isScanning ? (
                  <>
                    <Zap className="w-4 h-4 animate-pulse" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Scanning Animation */}
        {isScanning && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative h-32 rounded-xl border border-primary/30 bg-card/30 overflow-hidden">
              <div className="scan-line absolute inset-0" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-mono text-sm text-primary animate-pulse">
                    ANALYZING URL...
                  </div>
                  <div className="font-mono text-xs text-muted-foreground mt-2">
                    Checking for phishing indicators
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && !isScanning && (
          <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">
            {/* Threat Meter */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur">
                <ThreatMeter score={result.threatScore} level={result.threatLevel} />
                
                <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
                  <p className="text-sm text-foreground font-medium">{result.summary}</p>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-background/50 border border-border font-mono text-xs break-all text-muted-foreground">
                  {result.url}
                </div>
              </div>
            </div>

            {/* Feature Analysis */}
            <div className="lg:col-span-2">
              <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur">
                <FeatureList features={result.features} />
              </div>
            </div>
          </div>
        )}

        {/* History Section */}
        <div className="max-w-3xl mx-auto mt-12">
          <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur">
            <ScanHistory history={history} onSelect={handleHistorySelect} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <Shield className="w-4 h-4 text-primary" />
              <span>PhishGuard v1.0</span>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              Educational tool for phishing detection demonstration
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
