import { useState, useEffect } from "react";
import { Gem, Search, RefreshCw, Trash2, Edit2, Info, Shield, Zap, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import api from "../lib/api";
import { toast } from "sonner";
import { ITEM_NAMES } from "../lib/mappings";
import { useAppContext } from "../context/AppContext";

export default function DragonSoulManager() {
  const { tableMappings } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dsItems, setDsItems] = useState<any[]>([]);

  const fetchDS = async () => {
    setLoading(true);
    try {
      const dsTable = tableMappings["dragon_soul"] || "dragonsoul_items";
      const res = await api.get(`/api/db/data?table=${dsTable}`, {
        headers: { "x-db-name-override": "player" }
      });
      setDsItems(res.data);
    } catch (err: any) {
      toast.error("Ejderha Taşı verileri yüklenemedi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDS();
  }, []);

  const filteredDS = dsItems.filter(item => 
    String(item.id).includes(search) || 
    String(item.owner_id).includes(search) ||
    String(item.vnum).includes(search) ||
    (ITEM_NAMES[item.vnum] || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ejderha Taşı Sistemi (DSS)</h2>
          <p className="text-muted-foreground">Oyuncu envanterindeki ve takılı olan ejderha taşlarını yönetin.</p>
        </div>
        <Button variant="outline" onClick={fetchDS} disabled={loading} className="gap-2">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Yenile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Gem size={24} /></div>
            <div>
              <div className="text-xs text-muted-foreground font-bold uppercase">Toplam Taş</div>
              <div className="text-xl font-bold">{dsItems.length}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><Shield size={24} /></div>
            <div>
              <div className="text-xs text-muted-foreground font-bold uppercase">Takılı Taşlar</div>
              <div className="text-xl font-bold">{dsItems.filter(i => i.window === 'DRAGON_SOUL_EQUIP').length}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><Sparkles size={24} /></div>
            <div>
              <div className="text-xs text-muted-foreground font-bold uppercase">Mükemmel Taşlar</div>
              <div className="text-xl font-bold">{dsItems.filter(i => i.vnum >= 110000 && i.vnum <= 119999).length}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><Zap size={24} /></div>
            <div>
              <div className="text-xs text-muted-foreground font-bold uppercase">Efsanevi Taşlar</div>
              <div className="text-xl font-bold">{dsItems.filter(i => i.vnum >= 120000).length}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Ejderha Taşı Listesi</CardTitle>
            <CardDescription>Sunucudaki tüm ejderha taşları.</CardDescription>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Eşya adı, ID veya Sahip ID ile ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Sahip ID</TableHead>
                  <TableHead>Eşya</TableHead>
                  <TableHead>Konum</TableHead>
                  <TableHead>Efsunlar</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDS.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.id}</TableCell>
                    <TableCell className="font-bold text-blue-600">{item.owner_id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold">{ITEM_NAMES[item.vnum] || `Taş (${item.vnum})`}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">VNUM: {item.vnum}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${item.window === 'DRAGON_SOUL_EQUIP' ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                        {item.window === 'DRAGON_SOUL_EQUIP' ? "TAKILI" : "ENVANTER"}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                      {item.attrtype0 ? `Attr: ${item.attrtype0}:${item.attrvalue0}` : "Efsunsuz"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon"><Edit2 size={16} /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive"><Trash2 size={16} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDS.length === 0 && !loading && (
                  <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Ejderha taşı bulunamadı.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
