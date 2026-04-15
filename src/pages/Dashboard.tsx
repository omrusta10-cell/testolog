import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Server, Cpu, HardDrive, Activity, Users, ShieldCheck, Zap, ArrowUpRight, Database, Terminal, Store, Dog, Shield } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../lib/api";
import { useAppContext } from "../context/AppContext";

const StatCard = ({ icon: Icon, label, value, color, subtext }: { icon: any, label: string, value: string | number, color: string, subtext?: string }) => (
  <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 group hover:border-white/20 transition-all duration-300">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-xl bg-white/5 ${color} transition-colors duration-300`}>
        <Icon size={24} />
      </div>
      <ArrowUpRight size={16} className="text-neutral-600 group-hover:text-neutral-400 transition-colors" />
    </div>
    <div>
      <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-headline font-bold text-white tracking-tight">{value}</h3>
      {subtext && <p className="text-[10px] text-neutral-600 uppercase tracking-widest mt-1">{subtext}</p>}
    </div>
  </div>
);

export default function Dashboard() {
  const { tableMappings } = useAppContext();
  const [stats, setStats] = useState<any>({
    onlinePlayers: 0,
    offlineShops: 0,
    totalPets: 0,
    cpuUsage: "0%",
    diskUsage: "0 GB",
    status: "Yükleniyor..."
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/stats", {
          headers: {
            "x-offlineshop-table": tableMappings["offlineshop_shops"] || "offlineshop_shops",
            "x-petsystem-table": tableMappings["pet_system"] || "new_petsystem"
          }
        });
        setStats(res.data);
        
        const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setChartData(prev => {
          const newData = [...prev, { time: now, players: res.data.onlinePlayers }];
          if (newData.length > 15) newData.shift();
          return newData;
        });
      } catch (err) {
        console.error("Stats error:", err);
        setStats(prev => ({ ...prev, status: "Bağlantı Hatası" }));
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [tableMappings]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold text-white tracking-tighter uppercase neon-glow-primary">SYSTEM_OVERVIEW</h1>
          <p className="text-neutral-500 text-xs uppercase tracking-[0.3em] mt-2">Real-time server monitoring & management</p>
        </div>
        <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-xl border-white/5">
          <div className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${stats.status === "Aktif" ? "bg-emerald-400" : "bg-red-400"}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${stats.status === "Aktif" ? "bg-emerald-500" : "bg-red-500"}`}></span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            CORE_STATUS: <span className={stats.status === "Aktif" ? "text-emerald-400" : "text-red-400"}>{stats.status.toUpperCase()}</span>
          </span>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Status Card */}
        <div className="md:col-span-8 glass-panel p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Server size={120} className="text-blue-400" />
          </div>
          <div className="relative z-10">
            <h3 className="text-blue-400 font-headline text-xs font-bold uppercase tracking-widest mb-6">SYSTEM_CORE_01</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1">Online_Players</p>
                <p className="text-4xl font-headline font-bold text-white">{stats.onlinePlayers}</p>
              </div>
              <div>
                <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1">Active_Shops</p>
                <p className="text-4xl font-headline font-bold text-white">{stats.offlineShops}</p>
              </div>
              <div>
                <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1">Total_Pets</p>
                <p className="text-4xl font-headline font-bold text-white">{stats.totalPets}</p>
              </div>
              <div>
                <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1">Uptime</p>
                <p className="text-4xl font-headline font-bold text-white">99.9%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Card */}
        <div className="md:col-span-4 glass-panel p-8 rounded-3xl">
          <h3 className="text-purple-400 font-headline text-xs font-bold uppercase tracking-widest mb-6">SERVER_RESOURCES</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-neutral-400">
                <span>CPU_LOAD</span>
                <span>{stats.cpuUsage}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: stats.cpuUsage }}
                  className="h-full bg-blue-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-neutral-400">
                <span>MEMORY_USAGE</span>
                <span>45%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "45%" }}
                  className="h-full bg-purple-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-neutral-400">
                <span>DISK_SPACE</span>
                <span>{stats.diskUsage}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  className="h-full bg-emerald-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chart Card */}
        <div className="md:col-span-9 glass-panel p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-blue-400 font-headline text-xs font-bold uppercase tracking-widest">ACTIVE_USERS_TIMELINE</h3>
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-400" />
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Live_Feed</span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#525252" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => val}
                />
                <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0e0e0e', 
                    borderColor: '#ffffff10', 
                    borderRadius: '12px',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="players" 
                  stroke="#60a5fa" 
                  strokeWidth={2} 
                  dot={false} 
                  isAnimationActive={true} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="md:col-span-3 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-3xl flex-1 flex flex-col justify-between group hover:bg-blue-400/5 transition-colors">
            <h3 className="text-blue-400 font-headline text-[10px] font-bold uppercase tracking-widest mb-4">QUICK_ACTIONS</h3>
            <div className="space-y-3">
              <Link to="/console" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group/btn">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 group-hover/btn:text-white">Open_Console</span>
                <Terminal size={14} className="text-neutral-500 group-hover/btn:text-blue-400" />
              </Link>
              <Link to="/server-control" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group/btn">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 group-hover/btn:text-white">Server_Control</span>
                <Zap size={14} className="text-neutral-500 group-hover/btn:text-emerald-400" />
              </Link>
              <Link to="/db" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group/btn">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 group-hover/btn:text-white">Database_Manager</span>
                <Database size={14} className="text-neutral-500 group-hover/btn:text-purple-400" />
              </Link>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-3xl bg-emerald-400/5 border-emerald-400/20">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={20} className="text-emerald-400" />
              <h3 className="text-emerald-400 font-headline text-[10px] font-bold uppercase tracking-widest">SECURITY_STATUS</h3>
            </div>
            <p className="text-neutral-400 text-[10px] leading-relaxed uppercase tracking-widest">All systems operational. Firewall active and monitoring traffic.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
