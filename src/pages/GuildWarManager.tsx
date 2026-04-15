import { useState, useEffect } from "react";
import { Swords, Search, RefreshCw, Trash2, Info, Trophy, Calendar, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import api from "../lib/api";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";

export default function GuildWarManager() {
  const { tableMappings } = useAppContext();
  const [wars, setWars] = useState<any[]>([]);
  const [bets, setBets] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const warTable = tableMappings["guild_war"] || "guild_war";
      const betTable = tableMappings["guild_war_bet"] || "guild_war_bet";
      const resTable = tableMappings["guild_war_reservation"] || "guild_war_reservation";

      const [warRes, betRes, resRes] = await Promise.all([
        api.get(`/api/db/data?table=${warTable}`, { headers: { "x-db-name-override": "player" } }),
        api.get(`/api/db/data?table=${betTable}`, { headers: { "x-db-name-override": "player" } }),
        api.get(`/api/db/data?table=${resTable}`, { headers: { "x-db-name-override": "player" } })
      ]);

      setWars(warRes.data);
      setBets(betRes.data);
      setReservations(resRes.data);
    } catch (err: any) {
      toast.error("Lonca savaşı verileri yüklenemedi: " + err.message);
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
          <h2 className="text-3xl font-bold tracking-tight">Lonca Savaşları Yönetimi</h2>
          <p className="text-muted-foreground">Aktif savaşlar, bahisler ve savaş rezervasyonlarını yönetin.</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading} className="gap-2">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Yenile
        </Button>
      </div>

      <Tabs defaultValue="wars" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="wars" className="gap-2"><Swords size={16} /> Aktif Savaşlar</TabsTrigger>
          <TabsTrigger value="bets" className="gap-2"><Coins size={16} /> Bahisler</TabsTrigger>
          <TabsTrigger value="reservations" className="gap-2"><Calendar size={16} /> Rezervasyonlar</TabsTrigger>
        </TabsList>

        <TabsContent value="wars" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Savaş Listesi</CardTitle>
              <CardDescription>player.guild_war tablosundaki aktif ve geçmiş savaşlar.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lonca 1</TableHead>
                    <TableHead>Lonca 2</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wars.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Savaş kaydı bulunamadı.</TableCell>
                    </TableRow>
                  ) : (
                    wars.map((w, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{w.guild1}</TableCell>
                        <TableCell className="font-medium">{w.guild2}</TableCell>
                        <TableCell>{w.type}</TableCell>
                        <TableCell>{w.state}</TableCell>
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

        <TabsContent value="bets" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bahis Kayıtları</CardTitle>
              <CardDescription>Lonca savaşları üzerine oynanan bahisler.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Savaş ID</TableHead>
                    <TableHead>Oyuncu</TableHead>
                    <TableHead>Lonca</TableHead>
                    <TableHead>Miktar</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Bahis kaydı bulunamadı.</TableCell>
                    </TableRow>
                  ) : (
                    bets.map((b, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{b.war_id}</TableCell>
                        <TableCell>{b.login}</TableCell>
                        <TableCell>{b.guild}</TableCell>
                        <TableCell className="text-amber-500 font-mono">{Number(b.gold).toLocaleString()} Yang</TableCell>
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

        <TabsContent value="reservations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Savaş Rezervasyonları</CardTitle>
              <CardDescription>Planlanmış lonca savaşları.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lonca 1</TableHead>
                    <TableHead>Lonca 2</TableHead>
                    <TableHead>Zaman</TableHead>
                    <TableHead>Bahis</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Rezervasyon bulunamadı.</TableCell>
                    </TableRow>
                  ) : (
                    reservations.map((r, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{r.guild1}</TableCell>
                        <TableCell>{r.guild2}</TableCell>
                        <TableCell>{r.time}</TableCell>
                        <TableCell>{r.bet_gold}</TableCell>
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
