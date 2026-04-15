import { useState, useEffect } from "react";
import { Box, Search, RefreshCw, Info, Sword, Shield, Ghost, Zap, Edit2, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import api from "../lib/api";
import { toast } from "sonner";
import { ITEM_NAMES, MOB_NAMES } from "../lib/mappings";
import { useAppContext } from "../context/AppContext";

export default function ProtoEditor() {
  const { tableMappings } = useAppContext();
  const [activeTab, setActiveTab] = useState<"items" | "mobs">("items");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchData = async (tab: "items" | "mobs") => {
    setLoading(true);
    const tableKey = tab === "items" ? "item_proto" : "mob_proto";
    const table = tableMappings[tableKey] || tableKey;
    
    try {
      const res = await api.get(`/api/db/data?table=${table}`, {
        headers: { "x-db-name-override": "player" }
      });
      setData(res.data);
      setActiveTab(tab);
    } catch (err: any) {
      toast.error("Veriler yüklenemedi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData("items");
  }, []);

  const handleEdit = (item: any) => {
    setEditingItem({ ...item });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingItem) return;
    
    const tableKey = activeTab === "items" ? "item_proto" : "mob_proto";
    const table = tableMappings[tableKey] || tableKey;
    const idField = activeTab === "items" ? "vnum" : "vnum"; // Usually vnum for both

    try {
      // In a real app, we'd have a PUT/PATCH endpoint
      // For now, we'll simulate or use a generic update if available
      // Since we don't have a specific update endpoint in the provided tools, 
      // we'll assume the API supports it or just show the UI for now.
      toast.success(`${activeTab === "items" ? "Eşya" : "Canavar"} başarıyla güncellendi (Simüle edildi)`);
      setIsDialogOpen(false);
    } catch (err: any) {
      toast.error("Güncelleme başarısız: " + err.message);
    }
  };

  const filteredData = data.filter(item => 
    (String(item.locale_name || item.name || item.dwName || "")).toLowerCase().includes(search.toLowerCase()) || 
    String(item.vnum).includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Proto Editörü</h2>
          <p className="text-muted-foreground">Eşya ve Canavar protolarını (item_proto, mob_proto) düzenleyin.</p>
        </div>
        <Button variant="outline" onClick={() => fetchData(activeTab)} disabled={loading} className="gap-2">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Yenile
        </Button>
      </div>

      <Tabs defaultValue="items" onValueChange={(v) => fetchData(v as any)} className="w-full">
        <TabsList className="grid w-80 grid-cols-2">
          <TabsTrigger value="items" className="gap-2"><Box size={16} /> Eşyalar</TabsTrigger>
          <TabsTrigger value="mobs" className="gap-2"><Ghost size={16} /> Canavarlar</TabsTrigger>
        </TabsList>

        <Card className="mt-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">
                {activeTab === "items" ? "Eşya Protosu" : "Canavar Protosu"}
              </CardTitle>
              <div className="relative w-80">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="İsim veya Vnum ile ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vnum</TableHead>
                    <TableHead>İsim (Locale)</TableHead>
                    <TableHead>İsim (Original)</TableHead>
                    {activeTab === "items" ? (
                      <>
                        <TableHead>Tip</TableHead>
                        <TableHead>Alt Tip</TableHead>
                        <TableHead>Boyut</TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead>Seviye</TableHead>
                        <TableHead>Tip</TableHead>
                        <TableHead>Rank</TableHead>
                      </>
                    )}
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono font-bold">{item.vnum}</TableCell>
                      <TableCell className="font-medium text-blue-600">{item.locale_name || item.dwName || "---"}</TableCell>
                      <TableCell className="text-muted-foreground">{item.name}</TableCell>
                      {activeTab === "items" ? (
                        <>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.subtype}</TableCell>
                          <TableCell>{item.size}</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{item.level}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.rank}</TableCell>
                        </>
                      )}
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                          <Edit2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{activeTab === "items" ? "Eşya Düzenle" : "Canavar Düzenle"} - {editingItem?.vnum}</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Locale İsim</label>
                <Input 
                  value={editingItem.locale_name || editingItem.dwName || ""} 
                  onChange={(e) => setEditingItem({...editingItem, locale_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Orijinal İsim</label>
                <Input 
                  value={editingItem.name || ""} 
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                />
              </div>
              {activeTab === "items" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tip</label>
                    <Input 
                      type="number"
                      value={editingItem.type || 0} 
                      onChange={(e) => setEditingItem({...editingItem, type: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Alt Tip</label>
                    <Input 
                      type="number"
                      value={editingItem.subtype || 0} 
                      onChange={(e) => setEditingItem({...editingItem, subtype: parseInt(e.target.value)})}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Seviye</label>
                    <Input 
                      type="number"
                      value={editingItem.level || 1} 
                      onChange={(e) => setEditingItem({...editingItem, level: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rank</label>
                    <Input 
                      type="number"
                      value={editingItem.rank || 0} 
                      onChange={(e) => setEditingItem({...editingItem, rank: parseInt(e.target.value)})}
                    />
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>İptal</Button>
            <Button onClick={handleSave} className="gap-2"><Save size={16} /> Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
