import { useState, useEffect } from "react";
import { RefreshCw, Search, Trash2, Info, ArrowRightLeft, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import api from "../lib/api";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";

export default function EmpireChangeManager() {
  const { tableMappings } = useAppContext();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const changeTable = tableMappings["change_empire"] || "change_empire";
      const res = await api.get(`/api/db/data?table=${changeTable}`, {
        headers: { "x-db-name-override": "player" }
      });
      setLogs(res.data);
    } catch (err: any) {
      toast.error("Krallık değişim logları yüklenemedi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLogs = logs.filter(l => 
    String(l.account_id || "").includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Krallık Değişim Kayıtları</h2>
          <p className="text-muted-foreground">Oyuncuların krallık değiştirme geçmişini (player.change_empire) görüntüleyin.</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading} className="gap-2">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Yenile
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Hesap ID ile ara..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft size={20} className="text-blue-500" /> Değişim Geçmişi
          </CardTitle>
          <CardDescription>Krallık değiştiren hesaplar ve durumları.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hesap ID</TableHead>
                <TableHead>Eski Krallık</TableHead>
                <TableHead>Yeni Krallık</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Kayıt bulunamadı.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((l, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <User size={14} className="text-muted-foreground" /> {l.account_id}
                    </TableCell>
                    <TableCell>{l.old_empire || "-"}</TableCell>
                    <TableCell className="font-bold text-primary">{l.new_empire || "-"}</TableCell>
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
