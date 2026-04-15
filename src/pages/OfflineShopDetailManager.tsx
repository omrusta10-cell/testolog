import { useState, useEffect } from "react";
import { Store, Search, RefreshCw, Trash2, Info, User, Package, Coins, HandCoins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import api from "../lib/api";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";

export default function OfflineShopDetailManager() {
  const { tableMappings } = useAppContext();
  const [safeboxItems, setSafeboxItems] = useState<any[]>([]);
  const [safeboxValutes, setSafeboxValutes] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const itemsTable = tableMappings["offlineshop_safebox_items"] || "offlineshop_safebox_items";
      const valutesTable = tableMappings["offlineshop_safebox_valutes"] || "offlineshop_safebox_valutes";
      const offersTable = tableMappings["offlineshop_offers"] || "offlineshop_offers";

      const [itemsRes, valutesRes, offersRes] = await Promise.all([
        api.get(`/api/db/data?table=${itemsTable}`, { headers: { "x-db-name-override": "player" } }),
        api.get(`/api/db/data?table=${valutesTable}`, { headers: { "x-db-name-override": "player" } }),
        api.get(`/api/db/data?table=${offersTable}`, { headers: { "x-db-name-override": "player" } })
      ]);

      setSafeboxItems(itemsRes.data);
      setSafeboxValutes(valutesRes.data);
      setOffers(offersRes.data);
    } catch (err: any) {
      toast.error("Pazar detay verileri yüklenemedi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pazar Detay Yönetimi</h2>
          <p className="text-muted-foreground">Pazar deposu eşyaları, paraları ve gelen teklifleri yönetin.</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading} className="gap-2">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Yenile
        </Button>
      </div>

      <Tabs defaultValue="safebox_items" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="safebox_items" className="gap-2"><Package size={16} /> Depo Eşyaları</TabsTrigger>
          <TabsTrigger value="safebox_valutes" className="gap-2"><Coins size={16} /> Depo Paraları</TabsTrigger>
          <TabsTrigger value="offers" className="gap-2"><HandCoins size={16} /> Gelen Teklifler</TabsTrigger>
        </TabsList>

        <TabsContent value="safebox_items" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pazar Deposu Eşyaları</CardTitle>
              <CardDescription>Oyuncuların pazar deposunda bekleyen satılmamış veya çekilmiş eşyaları.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sahibi (PID)</TableHead>
                    <TableHead>Eşya Vnum</TableHead>
                    <TableHead>Adet</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeboxItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Depoda eşya bulunamadı.</TableCell>
                    </TableRow>
                  ) : (
                    safeboxItems.map((i, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{i.owner_id}</TableCell>
                        <TableCell className="font-mono">{i.vnum}</TableCell>
                        <TableCell>{i.count}</TableCell>
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
        </TabsContent>

        <TabsContent value="safebox_valutes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pazar Deposu Paraları</CardTitle>
              <CardDescription>Satışlardan elde edilen ve henüz çekilmemiş Yang/Ejderha Parası.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sahibi (PID)</TableHead>
                    <TableHead>Miktar</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeboxValutes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Depoda para bulunamadı.</TableCell>
                    </TableRow>
                  ) : (
                    safeboxValutes.map((v, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{v.owner_id}</TableCell>
                        <TableCell className="font-bold text-emerald-500">{Number(v.amount).toLocaleString()} Yang</TableCell>
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
        </TabsContent>

        <TabsContent value="offers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pazar Teklifleri</CardTitle>
              <CardDescription>Pazardaki eşyalar için oyuncular tarafından yapılan teklifler.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pazar ID</TableHead>
                    <TableHead>Teklif Veren (PID)</TableHead>
                    <TableHead>Eşya ID</TableHead>
                    <TableHead>Teklif Miktarı</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Teklif bulunamadı.</TableCell>
                    </TableRow>
                  ) : (
                    offers.map((o, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{o.shop_id}</TableCell>
                        <TableCell>{o.buyer_id}</TableCell>
                        <TableCell>{o.item_id}</TableCell>
                        <TableCell className="font-bold text-blue-500">{Number(o.price).toLocaleString()} Yang</TableCell>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
