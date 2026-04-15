import { useState, useEffect } from "react";
import { Gavel, Search, RefreshCw, Trash2, Info, User, Clock, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import api from "../lib/api";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";

export default function AuctionManager() {
  const { tableMappings } = useAppContext();
  const [auctions, setAuctions] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const auctionTable = tableMappings["offlineshop_auctions"] || "offlineshop_auctions";
      const offerTable = tableMappings["offlineshop_auction_offers"] || "offlineshop_auction_offers";

      const [aucRes, offRes] = await Promise.all([
        api.get(`/api/db/data?table=${auctionTable}`, { headers: { "x-db-name-override": "player" } }),
        api.get(`/api/db/data?table=${offerTable}`, { headers: { "x-db-name-override": "player" } })
      ]);

      setAuctions(aucRes.data);
      setOffers(offRes.data);
    } catch (err: any) {
      toast.error("Açık artırma verileri yüklenemedi: " + err.message);
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
          <h2 className="text-3xl font-bold tracking-tight">Açık Artırma Yönetimi</h2>
          <p className="text-muted-foreground">Çevrimdışı pazar açık artırmalarını ve teklifleri yönetin.</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading} className="gap-2">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Yenile
        </Button>
      </div>

      <Tabs defaultValue="auctions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="auctions" className="gap-2"><Gavel size={16} /> Aktif Müzayedeler</TabsTrigger>
          <TabsTrigger value="offers" className="gap-2"><Coins size={16} /> Verilen Teklifler</TabsTrigger>
        </TabsList>

        <TabsContent value="auctions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Müzayede Listesi</CardTitle>
              <CardDescription>Sistemdeki aktif açık artırmalar.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Sahibi (PID)</TableHead>
                    <TableHead>Eşya ID</TableHead>
                    <TableHead>Başlangıç Fiyatı</TableHead>
                    <TableHead>Bitiş Zamanı</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auctions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Müzayede bulunamadı.</TableCell>
                    </TableRow>
                  ) : (
                    auctions.map((a, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono">{a.id}</TableCell>
                        <TableCell>{a.owner_id}</TableCell>
                        <TableCell>{a.item_id}</TableCell>
                        <TableCell className="text-amber-500 font-bold">{Number(a.start_price).toLocaleString()} Yang</TableCell>
                        <TableCell>{a.finish_time}</TableCell>
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
              <CardTitle>Teklif Geçmişi</CardTitle>
              <CardDescription>Müzayedelere verilen tüm teklifler.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Müzayede ID</TableHead>
                    <TableHead>Teklif Veren (PID)</TableHead>
                    <TableHead>Miktar</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Teklif bulunamadı.</TableCell>
                    </TableRow>
                  ) : (
                    offers.map((o, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono">{o.auction_id}</TableCell>
                        <TableCell>{o.buyer_id}</TableCell>
                        <TableCell className="text-emerald-500 font-bold">{Number(o.price).toLocaleString()} Yang</TableCell>
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
