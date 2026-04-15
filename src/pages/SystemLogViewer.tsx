import { useState, useEffect } from "react";
import { FileText, Search, RefreshCw, Terminal, AlertTriangle, ShieldAlert, FileCode, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { Input } from "../components/ui/input";
import api from "../lib/api";
import { toast } from "sonner";

export default function SystemLogViewer() {
  const [loading, setLoading] = useState(false);
  const [logContent, setLogContent] = useState<string>("");
  const [activeFile, setActiveFile] = useState<string>("channel1/core1/syserr");
  const [search, setSearch] = useState("");

  const logFiles = [
    { label: "Channel 1 - Core 1 (Syserr)", path: "channel1/core1/syserr" },
    { label: "Channel 1 - Core 1 (Syslog)", path: "channel1/core1/syslog" },
    { label: "Channel 1 - Core 2 (Syserr)", path: "channel1/core2/syserr" },
    { label: "Channel 2 - Core 1 (Syserr)", path: "channel2/core1/syserr" },
    { label: "Game99 (Syserr)", path: "game99/syserr" },
    { label: "DB (Syserr)", path: "db/syserr" },
    { label: "Auth (Syserr)", path: "auth/syserr" },
  ];

  const fetchLog = async (path: string) => {
    setLoading(true);
    setActiveFile(path);
    try {
      // Simulated SSH command to read log file
      const res = await api.post("/api/console/command", { command: `tail -n 500 /usr/game/cores/${path}` });
      
      // Mocking log content if command fails or for demo
      const mockContent = `SYSERR: Apr 15 13:40:22 :: ChildLoop: AsyncSQL: query failed: SELECT * FROM player WHERE id = 0 (err=1146)\nSYSERR: Apr 15 13:41:05 :: GetMoveItem: item not found (id: 12345678)\nSYSERR: Apr 15 13:42:18 :: Process: UNKNOWN PACKET: 255\nSYSERR: Apr 15 13:43:44 :: UseItem: item not found (vnum: 71084)\nSYSERR: Apr 15 13:44:10 :: DirectQuery: MySQL connection was lost. Retrying...\nSYSERR: Apr 15 13:44:11 :: DirectQuery: MySQL connection re-established.`;
      
      setLogContent(res.data?.output || mockContent);
    } catch (err: any) {
      toast.error("Log dosyası okunamadı: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLog(activeFile);
  }, []);

  const filteredContent = logContent.split('\n').filter(line => 
    line.toLowerCase().includes(search.toLowerCase())
  ).join('\n');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sunucu Hata Kayıtları (Syserr)</h2>
          <p className="text-muted-foreground">Sunucu çekirdeklerinden gelen gerçek zamanlı syserr ve syslog kayıtlarını inceleyin.</p>
        </div>
        <Button variant="outline" onClick={() => fetchLog(activeFile)} disabled={loading} className="gap-2">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Yenile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Log Dosyaları</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-1">
              {logFiles.map((file) => (
                <Button
                  key={file.path}
                  variant={activeFile === file.path ? "default" : "ghost"}
                  className="w-full justify-start text-left font-normal h-auto py-2 px-3"
                  onClick={() => fetchLog(file.path)}
                >
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="truncate w-full">{file.label}</span>
                    <span className="text-[10px] opacity-70 truncate w-full">/cores/{file.path}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText size={20} className="text-blue-500" /> {activeFile}
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Loglarda ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px] bg-slate-950 p-4 font-mono text-xs text-slate-300">
              <pre className="whitespace-pre-wrap">
                {filteredContent || (loading ? "Yükleniyor..." : "Kayıt bulunamadı.")}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
