import { useState, useEffect } from "react";
import { Users, Search, RefreshCw, Edit2, ShieldAlert, ShieldCheck, Trash2, UserPlus, UserMinus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import api from "../lib/api";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";

export default function PlayerManager() {
  const { tableMappings } = useAppContext();
  const [players, setPlayers] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchPlayersAndAccounts = async () => {
    setLoading(true);
    try {
      // Use mapped table names if available
      const playerTable = tableMappings["player"] || "player";
      const accountTable = tableMappings["account"] || "account";

      // Fetch players
      const playerRes = await api.get(`/api/db/data?table=${playerTable}`, {
        headers: { "x-db-name-override": "player" }
      });
      
      // Fetch accounts for mapping
      const accRes = await api.get(`/api/db/data?table=${accountTable}`, {
        headers: { "x-db-name-override": "account" }
      });

      const accMap: Record<string, string> = {};
      accRes.data.forEach((a: any) => {
        accMap[String(a.id)] = a.login;
      });

      setAccounts(accMap);
      setPlayers(playerRes.data);
    } catch (err: any) {
      toast.error("Veriler yüklenemedi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayersAndAccounts();
  }, []);

  const filteredPlayers = players.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    String(p.id).includes(search) ||
    (accounts[String(p.account_id)] || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (player: any) => {
    setSelectedPlayer({ ...player });
    setIsEditDialogOpen(true);
  };

  const savePlayer = async () => {
    try {
      // In a real app, we'd have a specific update endpoint
      // For now, we'll simulate it or use a generic exec if needed
      // But let's assume we'll add an update endpoint later or just toast success for now
      toast.success(`${selectedPlayer.name} başarıyla güncellendi (Simüle edildi)`);
      setIsEditDialogOpen(false);
      fetchPlayersAndAccounts();
    } catch (err: any) {
      toast.error("Güncelleme hatası: " + err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold text-white tracking-tighter uppercase neon-glow-primary">PLAYER_MANAGEMENT</h1>
          <p className="text-neutral-500 text-xs uppercase tracking-[0.3em] mt-2">Manage players, accounts and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="SEARCH_PLAYER..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-xs uppercase tracking-widest h-11 rounded-xl focus:ring-primary/50"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={fetchPlayersAndAccounts} 
            disabled={loading} 
            className="h-11 px-6 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest gap-2"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> 
            SYNC_DATA
          </Button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border-white/5">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h3 className="text-blue-400 font-headline text-xs font-bold uppercase tracking-widest">ACTIVE_PLAYERS_DATABASE</h3>
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest">
            Total_Records: <span className="text-white">{filteredPlayers.length}</span>
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-[10px] uppercase tracking-widest text-neutral-500 py-4 pl-8">ID_HASH</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest text-neutral-500 py-4">ACCOUNT_LOGIN</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest text-neutral-500 py-4">PLAYER_NAME</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest text-neutral-500 py-4 text-center">LVL</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest text-neutral-500 py-4 text-right">GOLD_RESERVE</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest text-neutral-500 py-4">LAST_ACCESS</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest text-neutral-500 py-4 text-right pr-8">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.map((player) => (
                <TableRow key={player.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <TableCell className="font-mono text-[10px] text-neutral-500 pl-8">{player.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-tight">
                        {accounts[String(player.account_id)] || "NULL_ACCOUNT"}
                      </span>
                      <span className="text-[9px] text-neutral-600 font-mono">UID: {player.account_id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-headline font-bold text-white tracking-tight">{player.name}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center h-7 w-10 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-emerald-400">
                      {player.level}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-xs font-mono text-amber-400/80">{player.gold.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="text-[10px] text-neutral-500 uppercase tracking-widest">
                    {new Date(player.last_play).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(player)} className="h-8 w-8 rounded-lg hover:bg-blue-400/10 hover:text-blue-400">
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-amber-400/10 hover:text-amber-400">
                        <ShieldAlert size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-error/10 hover:text-error">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-neutral-950 border-white/10 rounded-3xl p-8 max-w-md">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-headline font-bold text-white tracking-tight uppercase">EDIT_PLAYER_DATA</DialogTitle>
            <p className="text-neutral-500 text-[10px] uppercase tracking-widest">Modifying: {selectedPlayer?.name}</p>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">LEVEL_OVERRIDE</label>
              <Input 
                type="number" 
                className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
                value={selectedPlayer?.level || ""} 
                onChange={(e) => setSelectedPlayer({...selectedPlayer, level: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">GOLD_RESERVE</label>
              <Input 
                type="number" 
                className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
                value={selectedPlayer?.gold || ""} 
                onChange={(e) => setSelectedPlayer({...selectedPlayer, gold: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">EXP_POINTS</label>
              <Input 
                type="number" 
                className="bg-white/5 border-white/10 h-12 rounded-xl text-white" 
                value={selectedPlayer?.exp || ""} 
                onChange={(e) => setSelectedPlayer({...selectedPlayer, exp: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter className="mt-8 gap-3">
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="h-12 rounded-xl uppercase text-[10px] font-bold tracking-widest px-8">CANCEL</Button>
            <Button onClick={savePlayer} className="h-12 rounded-xl bg-blue-500 hover:bg-blue-600 text-white uppercase text-[10px] font-bold tracking-widest px-8 shadow-[0_0_20px_rgba(59,130,246,0.3)]">SAVE_CHANGES</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
