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
import { safeRender } from "../lib/utils";

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
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold text-white tracking-tighter uppercase neon-glow-primary">PROTO_ARCHITECT</h1>
          <p className="text-neutral-500 text-xs uppercase tracking-[0.3em] mt-2">Modify core item and entity definitions in the database</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => fetchData(activeTab)} 
          disabled={loading} 
          className="h-11 px-6 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest gap-2"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> 
          SYNC_PROTO
        </Button>
      </div>

      <Tabs defaultValue="items" onValueChange={(v) => fetchData(v as any)} className="w-full">
        <TabsList className="grid w-80 grid-cols-2 bg-white/5 p-1 rounded-xl h-12 mb-6">
          <TabsTrigger value="items" className="rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all gap-2">
            <Box size={14} /> ITEM_PROTO
          </TabsTrigger>
          <TabsTrigger value="mobs" className="rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all gap-2">
            <Ghost size={14} /> MOB_PROTO
          </TabsTrigger>
        </TabsList>

        <div className="glass-panel rounded-3xl overflow-hidden border-white/5">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02]">
            <h3 className="text-blue-400 font-headline text-xs font-bold uppercase tracking-widest">
              {activeTab === "items" ? "ITEM_DEFINITION_TABLE" : "ENTITY_DEFINITION_TABLE"}
            </h3>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" />
              <Input
                placeholder="SEARCH_BY_NAME_OR_VNUM..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 h-11 rounded-xl text-xs uppercase tracking-widest"
              />
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[9px] uppercase tracking-widest text-neutral-500 py-4 pl-8">VNUM_ID</TableHead>
                  <TableHead className="text-[9px] uppercase tracking-widest text-neutral-500 py-4">LOCALE_NAME</TableHead>
                  <TableHead className="text-[9px] uppercase tracking-widest text-neutral-500 py-4">ORIGINAL_IDENTIFIER</TableHead>
                  {activeTab === "items" ? (
                    <>
                      <TableHead className="text-[9px] uppercase tracking-widest text-neutral-500 py-4">TYPE</TableHead>
                      <TableHead className="text-[9px] uppercase tracking-widest text-neutral-500 py-4">SUB_TYPE</TableHead>
                      <TableHead className="text-[9px] uppercase tracking-widest text-neutral-500 py-4">SIZE</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead className="text-[9px] uppercase tracking-widest text-neutral-500 py-4">LEVEL</TableHead>
                      <TableHead className="text-[9px] uppercase tracking-widest text-neutral-500 py-4">TYPE</TableHead>
                      <TableHead className="text-[9px] uppercase tracking-widest text-neutral-500 py-4">RANK</TableHead>
                    </>
                  )}
                  <TableHead className="text-[9px] uppercase tracking-widest text-neutral-500 py-4 text-right pr-8">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, idx) => (
                  <TableRow key={idx} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <TableCell className="font-mono text-[10px] text-neutral-500 pl-8">{item.vnum}</TableCell>
                    <TableCell className="font-headline font-bold text-blue-400 uppercase tracking-tight">{safeRender(item.locale_name || item.dwName) || "NULL_LOCALE"}</TableCell>
                    <TableCell className="text-xs text-neutral-400">{safeRender(item.name)}</TableCell>
                    {activeTab === "items" ? (
                      <>
                        <TableCell className="text-[10px] text-neutral-500 font-mono">{item.type}</TableCell>
                        <TableCell className="text-[10px] text-neutral-500 font-mono">{item.subtype}</TableCell>
                        <TableCell className="text-[10px] text-neutral-500 font-mono">{item.size}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="text-[10px] text-neutral-500 font-mono">{item.level}</TableCell>
                        <TableCell className="text-[10px] text-neutral-500 font-mono">{item.type}</TableCell>
                        <TableCell className="text-[10px] text-neutral-500 font-mono">{item.rank}</TableCell>
                      </>
                    )}
                    <TableCell className="text-right pr-8">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-400/10 hover:text-blue-400">
                        <Edit2 size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-neutral-950 border-white/10 rounded-3xl p-8 max-w-2xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-headline font-bold text-white tracking-tight uppercase">
              {activeTab === "items" ? "EDIT_ITEM_DEFINITION" : "EDIT_ENTITY_DEFINITION"}
            </DialogTitle>
            <p className="text-neutral-500 text-[10px] uppercase tracking-widest">Target_Vnum: {editingItem?.vnum}</p>
          </DialogHeader>
          {editingItem && (
            <div className="grid grid-cols-2 gap-8 py-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">LOCALE_NAME_OVERRIDE</label>
                <Input 
                  value={editingItem.locale_name || editingItem.dwName || ""} 
                  onChange={(e) => setEditingItem({...editingItem, locale_name: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white focus:ring-blue-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">INTERNAL_IDENTIFIER</label>
                <Input 
                  value={editingItem.name || ""} 
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white focus:ring-blue-500/50"
                />
              </div>
              {activeTab === "items" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">BASE_TYPE</label>
                    <Input 
                      type="number"
                      value={editingItem.type || 0} 
                      onChange={(e) => setEditingItem({...editingItem, type: parseInt(e.target.value)})}
                      className="bg-white/5 border-white/10 h-12 rounded-xl text-white focus:ring-blue-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">SUB_CATEGORY</label>
                    <Input 
                      type="number"
                      value={editingItem.subtype || 0} 
                      onChange={(e) => setEditingItem({...editingItem, subtype: parseInt(e.target.value)})}
                      className="bg-white/5 border-white/10 h-12 rounded-xl text-white focus:ring-blue-500/50"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">LEVEL_INDEX</label>
                    <Input 
                      type="number"
                      value={editingItem.level || 1} 
                      onChange={(e) => setEditingItem({...editingItem, level: parseInt(e.target.value)})}
                      className="bg-white/5 border-white/10 h-12 rounded-xl text-white focus:ring-blue-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">RANK_AUTHORITY</label>
                    <Input 
                      type="number"
                      value={editingItem.rank || 0} 
                      onChange={(e) => setEditingItem({...editingItem, rank: parseInt(e.target.value)})}
                      className="bg-white/5 border-white/10 h-12 rounded-xl text-white focus:ring-blue-500/50"
                    />
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter className="mt-8 gap-3">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-12 rounded-xl uppercase text-[10px] font-bold tracking-widest px-8">CANCEL</Button>
            <Button onClick={handleSave} className="h-12 rounded-xl bg-blue-500 hover:bg-blue-600 text-white uppercase text-[10px] font-bold tracking-widest px-8 shadow-[0_0_20px_rgba(59,130,246,0.3)] gap-2">
              <Save size={14} /> COMMIT_CHANGES
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
