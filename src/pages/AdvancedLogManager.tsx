import { useState, useEffect } from "react";
import { ScrollText, Search, RefreshCw, Clock, Info, TrendingUp, Coins, Package, User, ShieldAlert, Fish, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import api from "../lib/api";
import { toast } from "sonner";

const LOG_TABLES = [
  { id: "levellog", label: "Seviye Log", icon: TrendingUp },
  { id: "goldlog", label: "Yang Log", icon: Coins },
  { id: "itemlog", label: "Eşya Log", icon: Package },
  { id: "loginlog", label: "Giriş Log", icon: User },
  { id: "shout_log", label: "Bağırma Log", icon: ScrollText },
  { id: "fish_log", label: "Balık Log", icon: Fish },
  { id: "speed_hack", label: "Hız Hilesi", icon: ShieldAlert },
  { id: "quest_reward_log", label: "Görev Ödül", icon: Zap },
];

export default function AdvancedLogManager() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("levellog");

  const fetchLogs = async (table: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/db/data?table=${table}`, {
        headers: { "x-db-name-override": "log" }
      });
      setLogs(res.data);
      setActiveTab(table);
    } catch (err: any) {
      toast.error(`${table} verileri yüklenemedi: ` + err.message);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(activeTab);
  }, [activeTab]);

  const filteredLogs = logs.filter(l => 
    Object.values(l).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gelişmiş Log Analizi</h2>
          <p className="text-muted-foreground">Oyun içi tüm detaylı log kayıtlarını (log.*) inceleyin.</p>
        </div>
        <Button variant="outline" onClick={() => fetchLogs(activeTab)} disabled={loading} className="gap-2">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Yenile
        </Button>
      </div>

      <Tabs defaultValue="levellog" onValueChange={setActiveTab} className="w-full">
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <TabsList className="inline-flex w-max p-1">
            {LOG_TABLES.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                <tab.icon size={14} /> {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        <Card className="mt-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">
                {LOG_TABLES.find(t => t.id === activeTab)?.label} Kayıtları
              </CardTitle>
              <div className="relative w-80">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Loglarda ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    {logs.length > 0 ? (
                      Object.keys(logs[0]).map(key => (
                        <TableHead key={key} className="capitalize">{key.replace(/_/g, ' ')}</TableHead>
                      ))
                    ) : (
                      <TableHead>Veri Yok</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log, idx) => (
                    <TableRow key={idx}>
                      {Object.values(log).map((val: any, i) => (
                        <TableCell key={i} className="text-xs font-mono">
                          {val instanceof Date ? val.toLocaleString() : String(val)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {filteredLogs.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-10 text-muted-foreground italic">
                        Kayıt bulunamadı.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
