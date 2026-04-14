import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Play, Trash2, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import api from "../lib/api";
import { toast } from "sonner";

interface LogEntry {
  type: "input" | "output" | "error";
  content: string;
  timestamp: Date;
}

export default function Console() {
  const [command, setCommand] = useState("");
  const [cwd, setCwd] = useState("/usr/game");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const executeCommand = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!command.trim()) return;

    const newLogs: LogEntry[] = [
      ...logs,
      { type: "input", content: command, timestamp: new Date() }
    ];
    setLogs(newLogs);
    setLoading(true);

    try {
      const res = await api.post("/api/exec", { command, cwd });
      const entries: LogEntry[] = [];
      if (res.data.output) {
        entries.push({ type: "output", content: res.data.output, timestamp: new Date() });
      }
      if (res.data.errorOutput) {
        entries.push({ type: "error", content: res.data.errorOutput, timestamp: new Date() });
      }
      setLogs([...newLogs, ...entries]);
      setCommand("");
    } catch (err: any) {
      toast.error("Komut çalıştırılamadı: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => setLogs([]);

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Terminal</h2>
        <div className="flex gap-2">
          <Input 
            placeholder="Çalışma Dizini (CWD)" 
            value={cwd} 
            onChange={(e) => setCwd(e.target.value)}
            className="w-64"
          />
          <Button variant="outline" size="icon" onClick={clearLogs}>
            <Trash2 size={18} />
          </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden bg-[#0c0c0c] border-muted">
        <CardHeader className="border-b border-muted/20 py-3 bg-[#1a1a1a]">
          <CardTitle className="text-xs font-mono text-muted-foreground flex items-center gap-2">
            <TerminalIcon size={14} /> SSH CONSOLE
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-4 font-mono text-sm">
            <div className="space-y-2">
              {logs.map((log, i) => (
                <div key={i} className={`whitespace-pre-wrap ${
                  log.type === "input" ? "text-blue-400" : 
                  log.type === "error" ? "text-red-400" : "text-gray-300"
                }`}>
                  {log.type === "input" && <span className="text-muted-foreground mr-2">$</span>}
                  {log.content}
                </div>
              ))}
              {loading && <div className="text-muted-foreground animate-pulse">Komut çalıştırılıyor...</div>}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <form onSubmit={executeCommand} className="p-4 bg-[#1a1a1a] border-t border-muted/20 flex gap-2">
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Komut girin..."
              className="bg-transparent border-none focus-visible:ring-0 font-mono text-gray-300"
              disabled={loading}
            />
            <Button type="submit" size="icon" disabled={loading || !command.trim()}>
              <Send size={18} />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
