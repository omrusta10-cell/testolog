import { useState, useEffect } from "react";
import { Dog, Search, RefreshCw, Trash2, Edit2, Heart, Zap, Activity, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import api from "../lib/api";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";

export default function PetManager() {
  const { tableMappings } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pets, setPets] = useState<any[]>([]);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const petTable = tableMappings["pet_system"] || "new_petsystem";
      const res = await api.get(`/api/db/data?table=${petTable}`, {
        headers: { "x-db-name-override": "player" }
      });
      setPets(res.data);
    } catch (err: any) {
      toast.error("Pet verileri yüklenemedi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const filteredPets = pets.filter(pet => 
    String(pet.id).includes(search) || 
    String(pet.owner_id).includes(search) ||
    (pet.name && pet.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Yeni Pet Sistemi Yönetimi</h2>
          <p className="text-muted-foreground">Oyuncu petlerini, seviyelerini ve özelliklerini yönetin.</p>
        </div>
        <Button variant="outline" onClick={fetchPets} disabled={loading} className="gap-2">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Yenile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity size={16} className="text-emerald-500" /> Toplam Pet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pets.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap size={16} className="text-blue-500" /> En Yüksek Seviye
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pets.length > 0 ? Math.max(...pets.map(p => p.level || 0)) : 0}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart size={16} className="text-amber-500" /> Aktif Petler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pets.filter(p => p.is_active).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Pet Listesi</CardTitle>
            <CardDescription>Sunucudaki tüm oyuncu petleri.</CardDescription>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pet adı, ID veya Sahip ID ile ara..."
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
                  <TableHead>Pet Adı</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Tecrübe</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPets.map((pet) => (
                  <TableRow key={pet.id}>
                    <TableCell className="font-mono text-xs">{pet.id}</TableCell>
                    <TableCell className="font-bold text-blue-600">{pet.owner_id}</TableCell>
                    <TableCell className="font-bold">{pet.name || "İsimsiz Pet"}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-600 font-bold text-xs">
                        Lv. {pet.level}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{pet.exp?.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${pet.is_active ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                        {pet.is_active ? "AKTİF" : "PASİF"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon"><Edit2 size={16} /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive"><Trash2 size={16} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPets.length === 0 && !loading && (
                  <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">Pet bulunamadı.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
