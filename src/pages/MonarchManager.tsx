import { useState, useEffect } from "react";
import { Crown, Search, RefreshCw, Trash2, Info, Users, Gavel, Calendar, Vote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import api from "../lib/api";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";

export default function MonarchManager() {
  const { tableMappings } = useAppContext();
  const [monarchs, setMonarchs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const monarchTable = tableMappings["monarch"] || "monarch";
      const candidacyTable = tableMappings["monarch_candidacy"] || "monarch_candidacy";
      const electionTable = tableMappings["monarch_election"] || "monarch_election";

      const [monarchRes, candidacyRes, electionRes] = await Promise.all([
        api.get(`/api/db/data?table=${monarchTable}`, { headers: { "x-db-name-override": "player" } }).catch(() => ({ data: [] })),
        api.get(`/api/db/data?table=${candidacyTable}`, { headers: { "x-db-name-override": "player" } }).catch(() => ({ data: [] })),
        api.get(`/api/db/data?table=${electionTable}`, { headers: { "x-db-name-override": "player" } }).catch(() => ({ data: [] }))
      ]);

      setMonarchs(monarchRes.data);
      setCandidates(candidacyRes.data);
      setElections(electionRes.data);
    } catch (err: any) {
      toast.error("Krallık verileri yüklenemedi: " + err.message);
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
          <h2 className="text-3xl font-bold tracking-tight">Krallık (Monarşi) Yönetimi</h2>
          <p className="text-muted-foreground">Kralları, seçim adaylarını ve oylama sonuçlarını yönetin.</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading} className="gap-2">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Yenile
        </Button>
      </div>

      <Tabs defaultValue="monarchs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monarchs" className="gap-2"><Crown size={16} /> Mevcut Krallar</TabsTrigger>
          <TabsTrigger value="candidates" className="gap-2"><Users size={16} /> Adaylar</TabsTrigger>
          <TabsTrigger value="elections" className="gap-2"><Vote size={16} /> Seçim Kayıtları</TabsTrigger>
        </TabsList>

        <TabsContent value="monarchs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Krallar Listesi</CardTitle>
              <CardDescription>player.monarch tablosundaki mevcut yöneticiler.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Krallık</TableHead>
                    <TableHead>Oyuncu ID (PID)</TableHead>
                    <TableHead>İsim</TableHead>
                    <TableHead>Hazine (Gold)</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monarchs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Kayıt bulunamadı.</TableCell>
                    </TableRow>
                  ) : (
                    monarchs.map((m, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-bold">{m.empire === 1 ? "Shinsoo" : m.empire === 2 ? "Chunjo" : "Jinno"}</TableCell>
                        <TableCell>{m.pid}</TableCell>
                        <TableCell className="text-primary font-bold">{m.name || "Bilinmiyor"}</TableCell>
                        <TableCell className="text-amber-500 font-mono">{Number(m.money).toLocaleString()} Yang</TableCell>
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

        <TabsContent value="candidates" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Aday Listesi</CardTitle>
              <CardDescription>Seçimlere katılan adaylar.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Oyuncu ID (PID)</TableHead>
                    <TableHead>İsim</TableHead>
                    <TableHead>Krallık</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Aday bulunamadı.</TableCell>
                    </TableRow>
                  ) : (
                    candidates.map((c, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{c.pid}</TableCell>
                        <TableCell className="font-bold">{c.name}</TableCell>
                        <TableCell>{c.empire === 1 ? "Shinsoo" : c.empire === 2 ? "Chunjo" : "Jinno"}</TableCell>
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

        <TabsContent value="elections" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Seçim Kayıtları</CardTitle>
              <CardDescription>Oylama sonuçları ve seçim geçmişi.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Oyuncu ID (PID)</TableHead>
                    <TableHead>Oy Sayısı</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {elections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Seçim kaydı bulunamadı.</TableCell>
                    </TableRow>
                  ) : (
                    elections.map((e, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{e.pid}</TableCell>
                        <TableCell className="font-bold text-emerald-500">{e.count} Oy</TableCell>
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
