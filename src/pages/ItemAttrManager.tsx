import { useState, useEffect } from "react";
import { Sparkles, Search, RefreshCw, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import api from "../lib/api";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";

const APPLY_TYPES: Record<string, string> = {
  "APPLY_STR": "Güç",
  "APPLY_DEX": "Çeviklik",
  "APPLY_CON": "Canlılık",
  "APPLY_INT": "Zeka",
  "APPLY_MAX_HP": "Max HP",
  "APPLY_MAX_SP": "Max SP",
  "APPLY_ATT_SPEED": "Saldırı Hızı",
  "APPLY_MOV_SPEED": "Hareket Hızı",
  "APPLY_CAST_SPEED": "Büyü Hızı",
  "APPLY_HP_REGEN": "HP Üretimi",
  "APPLY_SP_REGEN": "SP Üretimi",
  "APPLY_POISON_PCT": "Zehirlenme Değişimi",
  "APPLY_STUN_PCT": "Sersemletme Şansı",
  "APPLY_SLOW_PCT": "Yavaşlatma Şansı",
  "APPLY_CRITICAL_PCT": "Kritik Vuruş Şansı",
  "APPLY_PENETRATE_PCT": "Delici Vuruş Şansı",
  "APPLY_ATTBONUS_HUMAN": "Yarı İnsanlara Karşı Güç",
  "APPLY_ATTBONUS_ANIMAL": "Hayvanlara Karşı Güç",
  "APPLY_ATTBONUS_ORC": "Orklara Karşı Güç",
  "APPLY_ATTBONUS_MILGYU": "Mistiklere Karşı Güç",
  "APPLY_ATTBONUS_UNDEAD": "Ölümsüzlere Karşı Güç",
  "APPLY_ATTBONUS_DEVIL": "Şeytanlara Karşı Güç",
  "APPLY_STEAL_HP": "Hasar HP Tarafından Emilecek",
  "APPLY_STEAL_SP": "Hasar SP Tarafından Emilecek",
  "APPLY_MANA_BURN_PCT": "Mana Çalma Şansı",
  "APPLY_BLOCK": "Yakın Dövüş Bloklama",
  "APPLY_DODGE": "Oklardan Korunma",
  "APPLY_RESIST_SWORD": "Kılıç Savunması",
  "APPLY_RESIST_TWOHAND": "Çiftel Savunması",
  "APPLY_RESIST_DAGGER": "Bıçak Savunması",
  "APPLY_RESIST_BELL": "Çan Savunması",
  "APPLY_RESIST_FAN": "Yelpaze Savunması",
  "APPLY_RESIST_BOW": "Oka Karşı Dayanıklılık",
  "APPLY_RESIST_FIRE": "Ateşe Karşı Dayanıklılık",
  "APPLY_RESIST_ELEC": "Şimşeğe Karşı Dayanıklılık",
  "APPLY_RESIST_MAGIC": "Büyüye Karşı Dayanıklılık",
  "APPLY_RESIST_WIND": "Rüzgara Karşı Dayanıklılık",
  "APPLY_REFLECT_MELEE": "Yakın Dövüş Yansıtma",
  "APPLY_POISON_REDUCE": "Zehre Karşı Koyma",
  "APPLY_EXP_DOUBLE_BONUS": "Tecrübe Bonusu Şansı",
  "APPLY_GOLD_DOUBLE_BONUS": "İki Kat Altın Düşme Şansı",
  "APPLY_ITEM_DROP_BONUS": "Eşya Düşme Şansı",
  "APPLY_POTION_BONUS": "İksir Bonusu",
  "APPLY_STUN": "Sersemletme",
  "APPLY_SLOW": "Yavaşlatma",
  "APPLY_POISON": "Zehirleme",
  "APPLY_ATT_GRADE_BONUS": "Saldırı Değeri",
  "APPLY_DEF_GRADE_BONUS": "Savunma Değeri",
  "APPLY_MAGIC_ATT_GRADE": "Büyülü Saldırı Değeri",
  "APPLY_MAGIC_DEF_GRADE": "Büyü Savunması",
  "APPLY_CURSE_PCT": "Lanetleme Şansı",
  "APPLY_MAX_STAMINA": "Max Dayanıklılık",
  "APPLY_ATT_BONUS_TO_WARRIOR": "Savaşçılara Karşı Güçlü",
  "APPLY_ATT_BONUS_TO_ASSASSIN": "Ninjalara Karşı Güçlü",
  "APPLY_ATT_BONUS_TO_SURA": "Suralara Karşı Güçlü",
  "APPLY_ATT_BONUS_TO_SHAMAN": "Şamanlara Karşı Güçlü",
  "APPLY_ATT_BONUS_TO_MONSTER": "Canavarlara Karşı Güçlü",
  "APPLY_MALL_ATTBONUS": "Saldırı Değeri +%",
  "APPLY_MALL_DEFBONUS": "Savunma Değeri +%",
  "APPLY_MALL_EXPBONUS": "Tecrübe Bonusu +%",
  "APPLY_MALL_ITEMBONUS": "Eşya Düşme Şansı +%",
  "APPLY_MALL_GOLDBONUS": "Altın Düşme Şansı +%",
  "APPLY_MAX_HP_PCT": "Max HP +%",
  "APPLY_MAX_SP_PCT": "Max SP +%",
  "APPLY_SKILL_DAMAGE_BONUS": "Beceri Hasarı",
  "APPLY_NORMAL_ATT_DAMAGE_BONUS": "Ortalama Hasar",
  "APPLY_SKILL_DEFEND_BONUS": "Beceri Hasarına Karşı Koyma",
  "APPLY_NORMAL_ATT_DEFEND_BONUS": "Ortalama Hasara Karşı Koyma",
  "APPLY_RESIST_WARRIOR": "Savaşçı Saldırılarına Karşı Savunma",
  "APPLY_RESIST_ASSASSIN": "Ninja Saldırılarına Karşı Savunma",
  "APPLY_RESIST_SURA": "Sura Saldırılarına Karşı Savunma",
  "APPLY_RESIST_SHAMAN": "Şaman Saldırılarına Karşı Savunma",
};

export default function ItemAttrManager() {
  const { tableMappings } = useAppContext();
  const [attrs, setAttrs] = useState<any[]>([]);
  const [rareAttrs, setRareAttrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("normal");

  const fetchData = async () => {
    setLoading(true);
    try {
      const attrTable = tableMappings["item_attr"] || "item_attr";
      const rareAttrTable = tableMappings["item_attr_rare"] || "item_attr_rare";

      const [attrRes, rareRes] = await Promise.all([
        api.get(`/api/db/data?table=${attrTable}`, { headers: { "x-db-name-override": "player" } }),
        api.get(`/api/db/data?table=${rareAttrTable}`, { headers: { "x-db-name-override": "player" } })
      ]);

      setAttrs(attrRes.data);
      setRareAttrs(rareRes.data);
    } catch (err: any) {
      toast.error("Efsun verileri yüklenemedi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const currentList = activeTab === "normal" ? attrs : rareAttrs;

  const filteredAttrs = currentList.filter(a => 
    (a.apply || "").toLowerCase().includes(search.toLowerCase()) ||
    (APPLY_TYPES[a.apply] || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Efsun Oranları Yönetimi</h2>
          <p className="text-muted-foreground">Eşya efsun oranlarını ve 6-7. efsunları (rare) yönetin.</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading} className="gap-2">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Yenile
        </Button>
      </div>

      <Tabs defaultValue="normal" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-80 grid-cols-2">
          <TabsTrigger value="normal">Normal Efsunlar</TabsTrigger>
          <TabsTrigger value="rare">6-7. Efsunlar</TabsTrigger>
        </TabsList>

        <Card className="mt-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-amber-500" size={20} /> {activeTab === "normal" ? "Efsun Listesi" : "6-7. Efsun Listesi"}
              </CardTitle>
              <div className="relative w-80">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Efsun adı veya kod ile ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[650px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Efsun (Kod)</TableHead>
                    <TableHead>Açıklama</TableHead>
                    <TableHead>Olasılık</TableHead>
                    <TableHead>Seviye 1</TableHead>
                    <TableHead>Seviye 2</TableHead>
                    <TableHead>Seviye 3</TableHead>
                    <TableHead>Seviye 4</TableHead>
                    <TableHead>Seviye 5</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttrs.map((a, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs font-bold text-blue-600">{a.apply}</TableCell>
                      <TableCell className="font-medium">{APPLY_TYPES[a.apply] || "Bilinmeyen Efsun"}</TableCell>
                      <TableCell className="text-xs font-mono">{a.prob}</TableCell>
                      <TableCell className="font-bold">{a.lv1}</TableCell>
                      <TableCell className="font-bold">{a.lv2}</TableCell>
                      <TableCell className="font-bold">{a.lv3}</TableCell>
                      <TableCell className="font-bold">{a.lv4}</TableCell>
                      <TableCell className="font-bold">{a.lv5}</TableCell>
                    </TableRow>
                  ))}
                  {filteredAttrs.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10 text-muted-foreground italic">
                        Efsun kaydı bulunamadı.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
