import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { LayoutDashboard, FolderTree, Database, Terminal, Settings as SettingsIcon, Menu, X, LogOut, Users, UserCircle, ShieldCheck, Trophy, Zap, Box, ShoppingBag, ScrollText, Package, Lock, UserX, Heart } from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Toaster } from "sonner";
import Dashboard from "./pages/Dashboard";
import FileExplorer from "./pages/FileExplorer";
import DatabaseManager from "./pages/DatabaseManager";
import Console from "./pages/Console";
import SetupPage from "./pages/SetupPage";
import PlayerManager from "./pages/PlayerManager";
import AccountManager from "./pages/AccountManager";
import Settings from "./pages/Settings";
import GMManager from "./pages/GMManager";
import GuildManager from "./pages/GuildManager";
import ServerSettings from "./pages/ServerSettings";
import GameData from "./pages/GameData";
import ShopManager from "./pages/ShopManager";
import QuestManager from "./pages/QuestManager";
import InventoryManager from "./pages/InventoryManager";
import SafeboxManager from "./pages/SafeboxManager";
import PlayerDeletedManager from "./pages/PlayerDeletedManager";
import MarriageManager from "./pages/MarriageManager";

const SidebarItem = ({ icon: Icon, label, to, active }: { icon: any, label: string, to: string, active: boolean }) => (
  <Link to={to}>
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-muted text-muted-foreground"
    }`}>
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </div>
  </Link>
);

const Layout = ({ children, onLogout }: { children: React.ReactNode, onLogout: () => void }) => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="border-r bg-card flex flex-col z-20"
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-xl font-bold tracking-tighter">GAME PANEL</h1>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-muted rounded-md">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <SidebarItem icon={LayoutDashboard} label={isSidebarOpen ? "Dashboard" : ""} to="/" active={location.pathname === "/"} />
          
          <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {isSidebarOpen ? "Yönetim" : "---"}
          </div>
          <SidebarItem icon={Users} label={isSidebarOpen ? "Oyuncular" : ""} to="/players" active={location.pathname === "/players"} />
          <SidebarItem icon={UserX} label={isSidebarOpen ? "Silinenler" : ""} to="/players-deleted" active={location.pathname === "/players-deleted"} />
          <SidebarItem icon={Package} label={isSidebarOpen ? "Envanter" : ""} to="/inventory" active={location.pathname === "/inventory"} />
          <SidebarItem icon={Lock} label={isSidebarOpen ? "Depolar" : ""} to="/safebox" active={location.pathname === "/safebox"} />
          <SidebarItem icon={UserCircle} label={isSidebarOpen ? "Hesaplar" : ""} to="/accounts" active={location.pathname === "/accounts"} />
          <SidebarItem icon={Trophy} label={isSidebarOpen ? "Loncalar" : ""} to="/guilds" active={location.pathname === "/guilds"} />
          <SidebarItem icon={Heart} label={isSidebarOpen ? "Evlilikler" : ""} to="/marriages" active={location.pathname === "/marriages"} />
          <SidebarItem icon={ShoppingBag} label={isSidebarOpen ? "Marketler" : ""} to="/shops" active={location.pathname === "/shops"} />
          <SidebarItem icon={ScrollText} label={isSidebarOpen ? "Questler" : ""} to="/quests" active={location.pathname === "/quests"} />
          <SidebarItem icon={ShieldCheck} label={isSidebarOpen ? "GM Yönetimi" : ""} to="/gms" active={location.pathname === "/gms"} />
          
          <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {isSidebarOpen ? "Sistem" : "---"}
          </div>
          <SidebarItem icon={Zap} label={isSidebarOpen ? "Sunucu Ayarları" : ""} to="/server-settings" active={location.pathname === "/server-settings"} />
          <SidebarItem icon={Box} label={isSidebarOpen ? "Oyun Verileri" : ""} to="/game-data" active={location.pathname === "/game-data"} />
          <SidebarItem icon={FolderTree} label={isSidebarOpen ? "Dosyalar" : ""} to="/files" active={location.pathname === "/files"} />
          <SidebarItem icon={Database} label={isSidebarOpen ? "Veritabanı" : ""} to="/db" active={location.pathname === "/db"} />
          <SidebarItem icon={Terminal} label={isSidebarOpen ? "Console" : ""} to="/console" active={location.pathname === "/console"} />
        </nav>

        <div className="p-4 border-t space-y-2">
          <SidebarItem icon={SettingsIcon} label={isSidebarOpen ? "Ayarlar" : ""} to="/settings" active={location.pathname === "/settings"} />
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 text-destructive transition-all duration-200"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Çıkış Yap</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Toaster position="top-right" />
    </div>
  );
};

export default function App() {
  const [isConnected, setIsConnected] = useState(!!localStorage.getItem("game_panel_creds"));

  const handleLogout = () => {
    localStorage.removeItem("game_panel_creds");
    setIsConnected(false);
  };

  if (!isConnected) {
    return (
      <>
        <SetupPage onConnected={() => setIsConnected(true)} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <Router>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/players" element={<PlayerManager />} />
          <Route path="/players-deleted" element={<PlayerDeletedManager />} />
          <Route path="/inventory" element={<InventoryManager />} />
          <Route path="/safebox" element={<SafeboxManager />} />
          <Route path="/accounts" element={<AccountManager />} />
          <Route path="/guilds" element={<GuildManager />} />
          <Route path="/marriages" element={<MarriageManager />} />
          <Route path="/gms" element={<GMManager />} />
          <Route path="/shops" element={<ShopManager />} />
          <Route path="/quests" element={<QuestManager />} />
          <Route path="/server-settings" element={<ServerSettings />} />
          <Route path="/game-data" element={<GameData />} />
          <Route path="/files" element={<FileExplorer />} />
          <Route path="/db" element={<DatabaseManager />} />
          <Route path="/console" element={<Console />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}
