import { useState, useEffect } from "react";
import { Ghost, Search, RefreshCw, Trash2, Plus, Edit2, Package, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import api from "../lib/api";
import { toast } from "sonner";
import { ITEM_NAMES, MOB_NAMES } from "../lib/mappings";
import { useAppContext } from "../context/AppContext";

export default function MobDropManager() {
  const { tableMappings } = useAppContext();
  const [drops, setDrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const table = tableMappings["mob_drop_item"] || "mob_drop_item";
    try {
      const res = await api.get(`/api/db/data?table=${table}`, {
        headers: { "x-db-name-override": "player" }
      });
      setDrops(res.data);
    } catch (err: any) {
      toast.error("Düşen eşya verileri yüklenemedi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredDrops = drops.filter(d => 
    String(d.mob_vnum || d.mob).includes(search) || 
    String(d.item_vnum || d.vnum).includes(search) ||
    (MOB_NAMES[d.mob_vnum || d.mob] || "").toLowerCase().includes(search.toLowerCase()) ||
    (ITEM_NAMES[d.item_vnum || d.vnum] || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Canavar Drop Yönetimi</h2>
          <p className="text-muted-foreground">Canavarlardan düşen eşyaları (mob_drop_item) yönetin.</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading} className="gap-2">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Yenile
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Ghost className="text-purple-500" size={20} /> Drop Listesi
            </CardTitle>
            <div className="relative w-80">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Canavar veya Eşya ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[650px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Canavar (Vnum)</TableHead>
                  <TableHead>Eşya (Vnum)</TableHead>
                  <TableHead>Adet</TableHead>
                  <TableHead>Olasılık</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrops.map((d, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold">{MOB_NAMES[d.mob_vnum || d.mob] || "Bilinmeyen Canavar"}</span>
                        <span className="text-xs text-muted-foreground font-mono">{d.mob_vnum || d.mob}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-blue-600">{ITEM_NAMES[d.item_vnum || d.vnum] || "Bilinmeyen Eşya"}</span>
                        <span className="text-xs text-muted-foreground font-mono">{d.item_vnum || d.vnum}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{d.count || 1}</TableCell>
                    <TableCell className="font-mono text-emerald-600">{d.prob || d.percent || "---"}%</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon"><Edit2 size={16} /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive"><Trash2 size={16} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDrops.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">
                      Drop kaydı bulunamadı.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
