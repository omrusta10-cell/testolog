import { useState, useEffect } from "react";
import { RefreshCw, Search, Trash2, Info, LayoutGrid, User, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import api from "../lib/api";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";

export default function CardGameManager() {
  const { tableMappings } = useAppContext();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const cardTable = tableMappings["card"] || "card";
      const res = await api.get(`/api/db/data?table=${cardTable}`, {
        headers: { "x-db-name-override": "player" }
      });
      setLogs(res.data);
    } catch (err: any) {
      toast.error("Kart oyunu verileri yüklenemedi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLogs = logs.filter(l => 
    String(l.pid || "").includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kart Oyunu (Okey) Kayıtları</h2>
          <p className="text-muted-foreground">Oyuncuların kart oyunu (player.card) istatistiklerini ve puanlarını yönetin.</p>
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
            <LayoutGrid size={20} className="text-purple-500" /> Oyuncu Puanları
          </CardTitle>
          <CardDescription>Kart oyununda en yüksek puanı alan oyuncular.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Oyuncu ID (PID)</TableHead>
                <TableHead>Puan (Score)</TableHead>
                <TableHead>Kazanma Sayısı</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Kayıt bulunamadı.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((l, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <User size={14} className="text-muted-foreground" /> {l.pid}
                    </TableCell>
                    <TableCell className="font-bold text-purple-500">{l.score || 0}</TableCell>
                    <TableCell>{l.win_count || 0}</TableCell>
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
