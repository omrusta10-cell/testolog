import { useState, useEffect } from "react";
import { Trophy, Search, RefreshCw, Trash2, Info, User, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import api from "../lib/api";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";

export default function HighscoreManager() {
  const { tableMappings } = useAppContext();
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const scoreTable = tableMappings["highscore"] || "highscore";
      const res = await api.get(`/api/db/data?table=${scoreTable}`, {
        headers: { "x-db-name-override": "player" }
      });
      setScores(res.data);
    } catch (err: any) {
      toast.error("Yüksek skor verileri yüklenemedi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredScores = scores.filter(s => 
    String(s.pid || "").includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Yüksek Skorlar</h2>
          <p className="text-muted-foreground">Oyuncuların çeşitli sistemlerdeki yüksek skorlarını (player.highscore) yönetin.</p>
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
            <Trophy size={20} className="text-yellow-500" /> Skor Listesi
          </CardTitle>
          <CardDescription>Sistem bazlı en yüksek puanlar.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Oyuncu ID (PID)</TableHead>
                <TableHead>Sistem</TableHead>
                <TableHead>Skor</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Kayıt bulunamadı.</TableCell>
                </TableRow>
              ) : (
                filteredScores.map((s, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{s.pid}</TableCell>
                    <TableCell>{s.type || "Genel"}</TableCell>
                    <TableCell className="font-bold text-yellow-500">{s.score}</TableCell>
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
