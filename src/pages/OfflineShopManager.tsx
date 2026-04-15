import { useState, useEffect } from "react";
import { Store, ShoppingBag, History, Coins, Search, RefreshCw, Trash2, Edit2, AlertTriangle, Gavel, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import api from "../lib/api";
import { toast } from "sonner";
import { ITEM_NAMES } from "../lib/mappings";
import { useAppContext } from "../context/AppContext";

export default function OfflineShopManager() {
  const { tableMappings } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("shops");
  
  // Data states
  const [shops, setShops] = useState<any[]>([]);
  const [shopItems, setShopItems] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const shopsTable = tableMappings["offlineshop_shops"] || "offlineshop_shops";
      const itemsTable = tableMappings["offlineshop_items"] || "offlineshop_shop_items";
      const salesTable = tableMappings["offlineshop_sales"] || "offline_shop_sales";
      const auctionsTable = tableMappings["offlineshop_auctions"] || "offlineshop_auctions";
      const offersTable = tableMappings["offlineshop_offers"] || "offlineshop_offers";

      // Fetch data based on active tab or all at once
      const [shopsRes, itemsRes, salesRes, auctionsRes, offersRes] = await Promise.all([
        api.get(`/api/db/data?table=${shopsTable}`, { headers: { "x-db-name-override": "player" } }).catch(() => ({ data: [] })),
        api.get(`/api/db/data?table=${itemsTable}`, { headers: { "x-db-name-override": "player" } }).catch(() => ({ data: [] })),
        api.get(`/api/db/data?table=${salesTable}`, { headers: { "x-db-name-override": "player" } }).catch(() => ({ data: [] })),
        api.get(`/api/db/data?table=${auctionsTable}`, { headers: { "x-db-name-override": "player" } }).catch(() => ({ data: [] })),
        api.get(`/api/db/data?table=${offersTable}`, { headers: { "x-db-name-override": "player" } }).catch(() => ({ data: [] }))
      ]);

      setShops(shopsRes.data);
      setShopItems(itemsRes.data);
      setSales(salesRes.data);
      setAuctions(auctionsRes.data);
      setOffers(offersRes.data);
    } catch (err: any) {
      toast.error("Veriler yüklenirken hata oluştu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatYang = (val: number) => {
    if (val >= 1000000000) return (val / 1000000000).toFixed(2) + "T";
    if (val >= 1000000) return (val / 1000000).toFixed(2) + "M";
    if (val >= 1000) return (val / 1000).toFixed(2) + "K";
    return val.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Çevrimdışı Pazar Yönetimi</h2>
          <p className="text-muted-foreground">Pazarları, açık artırmaları ve teklifleri yönetin.</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading} className="gap-2">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Yenile
        </Button>
      </div>

      <Tabs defaultValue="shops" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="shops" className="gap-2"><Store size={16} /> Aktif Pazarlar</TabsTrigger>
          <TabsTrigger value="items" className="gap-2"><ShoppingBag size={16} /> Pazar Eşyaları</TabsTrigger>
          <TabsTrigger value="sales" className="gap-2"><History size={16} /> Satış Geçmişi</TabsTrigger>
          <TabsTrigger value="auctions" className="gap-2"><Gavel size={16} /> Açık Artırmalar</TabsTrigger>
          <TabsTrigger value="offers" className="gap-2"><AlertTriangle size={16} /> Teklifler</TabsTrigger>
        </TabsList>

        {/* TAB: AKTİF PAZARLAR */}
        <TabsContent value="shops">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Aktif Pazarlar</CardTitle>
                <CardDescription>Sunucuda şu an açık olan tüm çevrimdışı pazarlar.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Sahip veya isim ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Sahip (Owner ID)</TableHead>
                      <TableHead>Pazar Adı</TableHead>
                      <TableHead>Konum</TableHead>
                      <TableHead>Kalan Süre</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shops.filter(s => String(s.owner_id).includes(search) || (s.name && s.name.toLowerCase().includes(search.toLowerCase()))).map((shop, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs">{shop.id}</TableCell>
                        <TableCell className="font-bold text-blue-600">{shop.owner_id}</TableCell>
                        <TableCell className="font-medium">{shop.name || "İsimsiz Pazar"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">Harita: {shop.map_index} ({shop.x}, {shop.y})</TableCell>
                        <TableCell className="font-mono text-xs">{shop.duration} dk</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="text-destructive"><Trash2 size={16} /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {shops.length === 0 && !loading && (
                      <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Aktif pazar bulunamadı.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: PAZAR EŞYALARI */}
        <TabsContent value="items">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pazar Eşyaları</CardTitle>
                <CardDescription>Pazarlarda satışta olan tüm eşyalar.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Eşya veya VNUM ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pazar ID</TableHead>
                      <TableHead>Eşya</TableHead>
                      <TableHead>Adet</TableHead>
                      <TableHead>Fiyat</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shopItems.filter(item => String(item.vnum).includes(search) || (ITEM_NAMES[item.vnum] || "").toLowerCase().includes(search.toLowerCase())).map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs">{item.shop_id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold">{ITEM_NAMES[item.vnum] || `Eşya (${item.vnum})`}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">VNUM: {item.vnum}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{item.count}</TableCell>
                        <TableCell className="font-mono text-xs font-bold text-emerald-600">{formatYang(item.price)} Yang</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon"><Edit2 size={16} /></Button>
                          <Button variant="ghost" size="icon" className="text-destructive"><Trash2 size={16} /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: SATIŞ GEÇMİŞİ */}
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Satış Geçmişi</CardTitle>
              <CardDescription>Tamamlanan tüm pazar işlemleri.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Satıcı</TableHead>
                      <TableHead>Alıcı</TableHead>
                      <TableHead>Eşya</TableHead>
                      <TableHead className="text-right">Fiyat</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs text-muted-foreground font-mono">{new Date(sale.time).toLocaleString()}</TableCell>
                        <TableCell className="font-bold text-blue-600">{sale.seller_name}</TableCell>
                        <TableCell className="font-bold text-emerald-600">{sale.buyer_name}</TableCell>
                        <TableCell className="font-medium">{ITEM_NAMES[sale.item_vnum] || `Eşya (${sale.item_vnum})`}</TableCell>
                        <TableCell className="text-right font-mono text-xs font-bold text-amber-600">{formatYang(sale.price)} Yang</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: AÇIK ARTIRMALAR */}
        <TabsContent value="auctions">
          <Card>
            <CardHeader>
              <CardTitle>Açık Artırmalar</CardTitle>
              <CardDescription>Devam eden ve biten açık artırmalar.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Sahip</TableHead>
                      <TableHead>Eşya</TableHead>
                      <TableHead>Başlangıç Fiyatı</TableHead>
                      <TableHead>En Yüksek Teklif</TableHead>
                      <TableHead className="text-right">Durum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auctions.map((auc, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs">{auc.id}</TableCell>
                        <TableCell className="font-bold">{auc.owner_id}</TableCell>
                        <TableCell className="font-medium">{ITEM_NAMES[auc.vnum] || `Eşya (${auc.vnum})`}</TableCell>
                        <TableCell className="font-mono text-xs">{formatYang(auc.start_price)}</TableCell>
                        <TableCell className="font-mono text-xs text-blue-600 font-bold">{formatYang(auc.current_price)}</TableCell>
                        <TableCell className="text-right">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${auc.is_finished ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"}`}>
                            {auc.is_finished ? "BİTTİ" : "DEVAM EDİYOR"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: TEKLİFLER */}
        <TabsContent value="offers">
          <Card>
            <CardHeader>
              <CardTitle>Pazar Teklifleri</CardTitle>
              <CardDescription>Eşyalara yapılan aktif teklifler.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Teklif Veren</TableHead>
                      <TableHead>Pazar Sahibi</TableHead>
                      <TableHead>Teklif Miktarı</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offers.map((offer, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs">{offer.id}</TableCell>
                        <TableCell className="font-bold text-blue-600">{offer.offer_from}</TableCell>
                        <TableCell className="font-bold text-emerald-600">{offer.offer_to}</TableCell>
                        <TableCell className="font-mono text-xs font-bold text-amber-600">{formatYang(offer.price)} Yang</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="text-destructive"><Trash2 size={16} /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
