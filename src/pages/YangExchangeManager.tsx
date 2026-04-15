import { useState, useEffect } from "react";
import { RefreshCw, Search, Trash2, Info, Coins, User, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import api from "../lib/api";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";

export default function YangExchangeManager() {
  const { tableMappings } = useAppContext();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const exchangeTable = tableMappings["exchange_yang"] || "exchange_yang";
      const res = await api.get(`/api/db/data?table=${exchangeTable}`, {
        headers: { "x-db-name-override": "player" }
      });
      setLogs(res.data);
    } catch (err: any) {
      toast.error("Yang transfer kayıtları yüklenemedi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLogs = logs.filter(l => 
    String(l.pid1 || "").includes(search) || 
    String(l.pid2 || "").includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Yang Transfer Kayıtları</h2>
          <p className="text-muted-foreground">Oyuncular arası Yang transferlerini (player.exchange_yang) takip edin.</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading} className="gap-2">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Yenile
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Oyuncu ID (PID) ile ara..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins size={20} className="text-amber-500" /> Transfer Geçmişi
          </CardTitle>
          <CardDescription>Gerçekleşen Yang takasları ve miktarları.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gönderen (PID1)</TableHead>
                <TableHead></TableHead>
                <TableHead>Alan (PID2)</TableHead>
                <TableHead>Miktar</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Kayıt bulunamadı.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((l, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{l.pid1}</TableCell>
                    <TableCell><ArrowRight size={14} className="text-muted-foreground" /></TableCell>
                    <TableCell className="font-medium">{l.pid2}</TableCell>
                    <TableCell className="font-bold text-amber-500 font-mono">{Number(l.yang).toLocaleString()} Yang</TableCell>
                    <TableCell>{l.date || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
