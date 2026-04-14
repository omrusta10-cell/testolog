import { useState, useEffect } from "react";
import { Package, Search, RefreshCw, Trash2, Edit2, Info, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import api from "../lib/api";
import { toast } from "sonner";

export default function InventoryManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/db/data?table=item", {
        headers: { "x-db-name-override": "player" }
      });
      setItems(res.data);
    } catch (err: any) {
      toast.error("Eşya verileri yüklenemedi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter(item => 
    String(item.owner_id).includes(search) || 
    String(item.vnum).includes(search) ||
    String(item.id).includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Envanter Yönetimi</h2>
          <p className="text-muted-foreground">Oyuncuların üzerindeki eşyaları (player.item) görüntüleyin ve yönetin.</p>
        </div>
        <Button variant="outline" onClick={fetchItems} disabled={loading} className="gap-2">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Yenile
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Package className="text-emerald-500" size={20} /> Eşya Kayıtları
            </CardTitle>
            <div className="relative w-80">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Eşya ID, VNUM veya Sahip ID ile ara..."
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
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Sahip ID</TableHead>
                  <TableHead>VNUM</TableHead>
                  <TableHead>Adet</TableHead>
                  <TableHead>Konum</TableHead>
                  <TableHead>Sıra</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs font-bold">{item.id}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <User size={14} className="text-muted-foreground" />
                      <span className="font-medium">{item.owner_id}</span>
                    </TableCell>
                    <TableCell className="font-mono text-blue-500">{item.vnum}</TableCell>
                    <TableCell>{item.count}</TableCell>
                    <TableCell className="text-xs uppercase">{item.window}</TableCell>
                    <TableCell>{item.pos}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Detaylar">
                          <Info size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredItems.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground italic">
                      Eşya kaydı bulunamadı.
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
