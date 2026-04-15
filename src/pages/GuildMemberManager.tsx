import { useState, useEffect } from "react";
import { Users, Search, RefreshCw, Trash2, Shield, Star, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import api from "../lib/api";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";

export default function GuildMemberManager() {
  const { tableMappings } = useAppContext();
  const [members, setMembers] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const memberTable = tableMappings["guild_member"] || "guild_member";
      const gradeTable = tableMappings["guild_grade"] || "guild_grade";
      const commentTable = tableMappings["guild_comment"] || "guild_comment";

      const [memRes, gradRes, commRes] = await Promise.all([
        api.get(`/api/db/data?table=${memberTable}`, { headers: { "x-db-name-override": "player" } }),
        api.get(`/api/db/data?table=${gradeTable}`, { headers: { "x-db-name-override": "player" } }),
        api.get(`/api/db/data?table=${commentTable}`, { headers: { "x-db-name-override": "player" } })
      ]);

      setMembers(memRes.data);
      setGrades(gradRes.data);
      setComments(commRes.data);
    } catch (err: any) {
      toast.error("Lonca detay verileri yüklenemedi: " + err.message);
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
          <h2 className="text-3xl font-bold tracking-tight">Lonca Detay Yönetimi</h2>
          <p className="text-muted-foreground">Lonca üyeleri, rütbeler ve yorumları yönetin.</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading} className="gap-2">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Yenile
        </Button>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members" className="gap-2"><Users size={16} /> Üyeler</TabsTrigger>
          <TabsTrigger value="grades" className="gap-2"><Shield size={16} /> Rütbeler</TabsTrigger>
          <TabsTrigger value="comments" className="gap-2"><MessageSquare size={16} /> Yorumlar</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lonca Üyeleri</CardTitle>
              <CardDescription>player.guild_member tablosundaki tüm üyeler.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lonca ID</TableHead>
                    <TableHead>Oyuncu ID (PID)</TableHead>
                    <TableHead>Derece (Grade)</TableHead>
                    <TableHead>Teklif (Offer)</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Üye kaydı bulunamadı.</TableCell>
                    </TableRow>
                  ) : (
                    members.map((m, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono">{m.guild_id}</TableCell>
                        <TableCell>{m.pid}</TableCell>
                        <TableCell>{m.grade}</TableCell>
                        <TableCell>{m.offer}</TableCell>
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

        <TabsContent value="grades" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lonca Rütbeleri</CardTitle>
              <CardDescription>Lonca içindeki rütbe tanımları ve yetkiler.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lonca ID</TableHead>
                    <TableHead>Derece</TableHead>
                    <TableHead>Rütbe Adı</TableHead>
                    <TableHead>Yetki</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Rütbe kaydı bulunamadı.</TableCell>
                    </TableRow>
                  ) : (
                    grades.map((g, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono">{g.guild_id}</TableCell>
                        <TableCell>{g.grade}</TableCell>
                        <TableCell className="font-bold">{g.name}</TableCell>
                        <TableCell>{g.auth}</TableCell>
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

        <TabsContent value="comments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lonca Yorumları</CardTitle>
              <CardDescription>Lonca panosuna yazılan yorumlar.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Lonca ID</TableHead>
                    <TableHead>Yazar</TableHead>
                    <TableHead>Yorum</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Yorum bulunamadı.</TableCell>
                    </TableRow>
                  ) : (
                    comments.map((c, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono">{c.id}</TableCell>
                        <TableCell>{c.guild_id}</TableCell>
                        <TableCell>{c.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{c.content}</TableCell>
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
