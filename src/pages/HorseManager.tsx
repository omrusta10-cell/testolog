import { useState, useEffect } from "react";
import { Search, RefreshCw, Trash2, Info, User, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import api from "../lib/api";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";

export default function HorseManager() {
  const { tableMappings } = useAppContext();
  const [horses, setHorses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const horseTable = tableMappings["horse_name"] || "horse_name";
      const res = await api.get(`/api/db/data?table=${horseTable}`, {
        headers: { "x-db-name-override": "player" }
      });
      setHorses(res.data);
    } catch (err: any) {
      toast.error("At verileri yüklenemedi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredHorses = horses.filter(h => 
    String(h.id || "").includes(search) || 
    (h.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">At Yönetimi</h2>
          <p className="text-muted-foreground">Oyuncu atlarını ve isimlerini (player.horse_name) yönetin.</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading} className="gap-2">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Yenile
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="At ismi veya Oyuncu ID ile ara..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart size={20} className="text-red-500" /> At Listesi
          </CardTitle>
          <CardDescription>Sistemde isimlendirilmiş atlar.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Oyuncu ID (PID)</TableHead>
                <TableHead>At İsmi</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHorses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Kayıt bulunamadı.</TableCell>
                </TableRow>
              ) : (
                filteredHorses.map((h, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{h.id}</TableCell>
                    <TableCell className="font-bold text-primary">{h.name}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-destructive"><Trash2 size={18} /></Button>
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
