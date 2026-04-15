import React, { useState } from "react";
import { Server, Shield, Database, Key, Globe, LogIn, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";
import api from "../lib/api";
import { useAppContext } from "../context/AppContext";

export default function SetupPage() {
  const { setConnected } = useAppContext();
  const [creds, setCreds] = useState({
    sshHost: "",
    sshPort: "22",
    sshUser: "root",
    sshPassword: "",
    dbHost: "127.0.0.1",
    dbPort: "3306",
    dbUser: "root",
    dbPassword: "",
    dbName: "player"
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  const handleConnect = async () => {
    setLoading(true);
    // Temporarily save to localstorage so api interceptor can pick it up for the test call
    localStorage.setItem("game_panel_creds", JSON.stringify(creds));
    
    try {
      await api.get("/api/test-connection");
      toast.success("Bağlantı başarılı!");
      setConnected(true, creds);
    } catch (err: any) {
      localStorage.removeItem("game_panel_creds");
      toast.error("Bağlantı hatası: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-2xl glass-panel rounded-3xl overflow-hidden border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="p-8 border-b border-white/5 bg-white/[0.02] text-center">
          <div className="mx-auto w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <Server className="text-blue-400" size={32} />
          </div>
          <h1 className="text-3xl font-headline font-bold text-white tracking-tighter uppercase neon-glow-primary">CORE_INITIALIZATION</h1>
          <p className="text-neutral-500 text-[10px] uppercase tracking-[0.3em] mt-2">Establish secure connection to server infrastructure</p>
        </div>
        
        <div className="p-8">
          <div className="mb-8 p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-start gap-4">
            <Info className="text-blue-400 shrink-0 mt-0.5" size={20} />
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-400">CONNECTION_PROTOCOL</h4>
              <p className="text-[10px] text-neutral-400 leading-relaxed uppercase tracking-widest">
                Please provide valid SSH and MySQL credentials to authorize access to the game core and database systems.
              </p>
            </div>
          </div>

          <Tabs defaultValue="ssh" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-xl h-12">
              <TabsTrigger value="ssh" className="rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all">
                SSH_CONFIG
              </TabsTrigger>
              <TabsTrigger value="db" className="rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all">
                MYSQL_CONFIG
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ssh" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">HOST_ADDRESS</label>
                  <Input name="sshHost" value={creds.sshHost} onChange={handleChange} placeholder="127.0.0.1" className="bg-white/5 border-white/10 h-12 rounded-xl text-white focus:ring-blue-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">PORT</label>
                  <Input name="sshPort" value={creds.sshPort} onChange={handleChange} placeholder="22" className="bg-white/5 border-white/10 h-12 rounded-xl text-white focus:ring-blue-500/50" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">AUTH_USER</label>
                <Input name="sshUser" value={creds.sshUser} onChange={handleChange} placeholder="root" className="bg-white/5 border-white/10 h-12 rounded-xl text-white focus:ring-blue-500/50" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">AUTH_PASS</label>
                <Input name="sshPassword" type="password" value={creds.sshPassword} onChange={handleChange} placeholder="••••••••" className="bg-white/5 border-white/10 h-12 rounded-xl text-white focus:ring-blue-500/50" />
              </div>
            </TabsContent>

            <TabsContent value="db" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">DB_HOST</label>
                  <Input name="dbHost" value={creds.dbHost} onChange={handleChange} placeholder="localhost" className="bg-white/5 border-white/10 h-12 rounded-xl text-white focus:ring-blue-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">DB_PORT</label>
                  <Input name="dbPort" value={creds.dbPort} onChange={handleChange} placeholder="3306" className="bg-white/5 border-white/10 h-12 rounded-xl text-white focus:ring-blue-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">DB_USER</label>
                  <Input name="dbUser" value={creds.dbUser} onChange={handleChange} placeholder="root" className="bg-white/5 border-white/10 h-12 rounded-xl text-white focus:ring-blue-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">DB_NAME</label>
                  <Input name="dbName" value={creds.dbName} onChange={handleChange} placeholder="player" className="bg-white/5 border-white/10 h-12 rounded-xl text-white focus:ring-blue-500/50" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">DB_PASS</label>
                <Input name="dbPassword" type="password" value={creds.dbPassword} onChange={handleChange} placeholder="••••••••" className="bg-white/5 border-white/10 h-12 rounded-xl text-white focus:ring-blue-500/50" />
              </div>
            </TabsContent>

            <Button 
              className="w-full h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] gap-3 shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all active:scale-[0.98]" 
              onClick={handleConnect} 
              disabled={loading}
            >
              {loading ? <RefreshCw className="animate-spin" /> : <LogIn size={18} />}
              {loading ? "INITIALIZING_CONNECTION..." : "ESTABLISH_CONNECTION"}
            </Button>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

const RefreshCw = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);
