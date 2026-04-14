import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Cpu, HardDrive, Activity, Users, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <Card className="overflow-hidden border-none shadow-md bg-card/50 backdrop-blur-sm">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <h3 className="text-3xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Sunucu durumuna ve hızlı istatistiklere göz atın.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Activity} label="Sunucu Durumu" value="Aktif" color="bg-emerald-500" />
        <StatCard icon={Users} label="Online Oyuncu" value="1,248" color="bg-blue-500" />
        <StatCard icon={Cpu} label="CPU Kullanımı" value="12%" color="bg-amber-500" />
        <StatCard icon={HardDrive} label="Disk Alanı" value="42 GB" color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Son İşlemler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Quest Okutuldu", target: "main_quest.quest", time: "2 dakika önce", user: "Admin" },
                { action: "Dosya Düzenlendi", target: "item_proto.txt", time: "15 dakika önce", user: "Admin" },
                { action: "Build Başlatıldı", target: "game source", time: "1 saat önce", user: "Admin" },
                { action: "Tablo Güncellendi", target: "player", time: "3 saat önce", user: "Admin" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-background">
                      <Server size={18} />
                    </div>
                    <div>
                      <p className="font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.target}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.user}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sunucu Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck size={16} /> Güvenlik Duvarı
              </div>
              <span className="text-sm font-bold text-emerald-500">Açık</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>RAM Kullanımı</span>
                <span className="font-medium">4.2 GB / 16 GB</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[26%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Disk Kullanımı</span>
                <span className="font-medium">42 GB / 100 GB</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[42%]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
