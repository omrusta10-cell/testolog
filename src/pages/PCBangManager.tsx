import { useState, useEffect } from "react";
import { Globe, Search, RefreshCw, Trash2, Plus, ShieldCheck, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../components/ui/dialog";
import api from "../lib/api";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";

export default function PCBangManager() {
  const { tableMappings } = useAppContext();
  const [ips, setIps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newIp, setNewIp] = useState({ ip: "", days: "30" });

  const fetchData = async () => {
    setLoading(true);
    const table = tableMappings["pcbang_ip"] || "pcbang_ip";
    try {
      const res = await api.get(`/api/db/data?table=${table}`, {
        headers: { "x-db-name-override": "player" }
      });
      setIps(res.data);
    } catch (err: any) {
      toast.error("PC Bang IP verileri yüklenemedi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!newIp.ip) return;
    toast.success(`${newIp.ip} adresi PC Bang olarak tanımlandı (Simüle edildi)`);
    setIsAddOpen(false);
    setNewIp({ ip: "", days: "30" });
  };

  const filteredIps = ips.filter(i => 
    String(i.ip || "").includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">PC Bang Yönetimi</h2>
          <p className="text-muted-foreground">Belirli IP adreslerine özel bonuslar (EXP, Drop vb.) tanımlayın.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} disabled={loading} className="gap-2">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Yenile
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus size={18} /> Yeni IP Ekle</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni PC Bang IP Tanımla</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">IP Adresi</label>
                  <Input 
                    placeholder="Örn: 88.244.12.5" 
                    value={newIp.ip}
                    onChange={(e) => setNewIp({...newIp, ip: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Süre (Gün)</label>
                  <Input 
                    type="number"
                    placeholder="30" 
                    value={newIp.days}
                    onChange={(e) => setNewIp({...newIp, days: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>İptal</Button>
                <Button onClick={handleAdd}>Tanımla</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={20} /> Kayıtlı IP Adresleri
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP Adresi</TableHead>
                  <TableHead>Bitiş Tarihi</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIps.map((i, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono font-bold">{i.ip}</TableCell>
                    <TableCell>{i.end_time || "---"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-destructive"><Trash2 size={16} /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredIps.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10 text-muted-foreground italic">
                      Kayıtlı PC Bang IP adresi bulunamadı.
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
