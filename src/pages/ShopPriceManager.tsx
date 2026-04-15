import { useState, useEffect } from "react";
import { Tag, Search, RefreshCw, Trash2, Info, User, Package, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import api from "../lib/api";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";

export default function ShopPriceManager() {
  const { tableMappings } = useAppContext();
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const priceTable = tableMappings["myshop_pricelist"] || "myshop_pricelist";
      const res = await api.get(`/api/db/data?table=${priceTable}`, {
        headers: { "x-db-name-override": "player" }
      });
      setPrices(res.data);
    } catch (err: any) {
      toast.error("Fiyat listesi verileri yüklenemedi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPrices = prices.filter(p => 
    String(p.item_vnum || "").includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pazar Fiyat Listesi</h2>
          <p className="text-muted-foreground">Oyuncuların pazar fiyat tercihlerini (player.myshop_pricelist) görüntüleyin.</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading} className="gap-2">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Yenile
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Eşya Vnum ile ara..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag size={20} className="text-blue-500" /> Kayıtlı Fiyatlar
          </CardTitle>
          <CardDescription>Oyuncuların eşyalar için belirlediği son satış fiyatları.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Oyuncu ID (PID)</TableHead>
                <TableHead>Eşya Vnum</TableHead>
                <TableHead>Fiyat</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Kayıt bulunamadı.</TableCell>
                </TableRow>
              ) : (
                filteredPrices.map((p, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{p.owner_id}</TableCell>
                    <TableCell className="font-mono">{p.item_vnum}</TableCell>
                    <TableCell className="font-bold text-emerald-500">{Number(p.price).toLocaleString()} Yang</TableCell>
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
