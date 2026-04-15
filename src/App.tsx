import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { LayoutDashboard, FolderTree, Database, Terminal, Settings as SettingsIcon, Menu, X, LogOut, Users, UserCircle, ShieldCheck, Trophy, Zap, Box, ShoppingBag, ScrollText, Package, Lock, UserX, Heart, History, MessageSquare, Ban, Globe, Gift, Map, Medal, Home, Calendar, Megaphone, ShieldX, Sparkles, ShieldAlert, Ticket, Crown, Navigation, Store, RefreshCw, Server, ShieldAlert as ShieldAlertIcon, FileCode, HardDrive, ArrowRightLeft, MessageCircle, TrendingUp, MapPin, Bug, Wrench, Activity, Shield, Dog, Gem, Gavel, Coins, LayoutGrid, Tag, Swords, Vote, Fish, FileText } from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Toaster, toast } from "sonner";
import { AppProvider, useAppContext } from "./context/AppContext";
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
import LogViewer from "./pages/LogViewer";
import MessengerManager from "./pages/MessengerManager";
import AffectManager from "./pages/AffectManager";
import BanwordManager from "./pages/BanwordManager";
import PrivManager from "./pages/PrivManager";
import ItemAwardManager from "./pages/ItemAwardManager";
import LandManager from "./pages/LandManager";
import RankingManager from "./pages/RankingManager";
import ObjectManager from "./pages/ObjectManager";
import EventManager from "./pages/EventManager";
import NoticeManager from "./pages/NoticeManager";
import IPBanManager from "./pages/IPBanManager";
import ItemAttrManager from "./pages/ItemAttrManager";
import ChatLogManager from "./pages/ChatLogManager";
import WhisperLogManager from "./pages/WhisperLogManager";
import TradeLogManager from "./pages/TradeLogManager";
import MarketAnalytics from "./pages/MarketAnalytics";
import MapStatistics from "./pages/MapStatistics";
import HackLogManager from "./pages/HackLogManager";
import CouponManager from "./pages/CouponManager";
import VipManager from "./pages/VipManager";
import SkillManager from "./pages/SkillManager";
import RefineManager from "./pages/RefineManager";
import WarpManager from "./pages/WarpManager";
import ShopItemManager from "./pages/ShopItemManager";
import ServerControl from "./pages/ServerControl";
import SysLogViewer from "./pages/SysLogViewer";
import QuestCompiler from "./pages/QuestCompiler";
import ConfigEditor from "./pages/ConfigEditor";
import BackupManager from "./pages/BackupManager";
import ProtoSyncManager from "./pages/ProtoSyncManager";
import CoreCrashAnalyzer from "./pages/CoreCrashAnalyzer";
import MaintenanceManager from "./pages/MaintenanceManager";
import ServerPerformance from "./pages/ServerPerformance";
import DropManager from "./pages/DropManager";
import FirewallManager from "./pages/FirewallManager";
import OfflineShopManager from "./pages/OfflineShopManager";
import PetManager from "./pages/PetManager";
import DragonSoulManager from "./pages/DragonSoulManager";
import MonarchManager from "./pages/MonarchManager";
import PCBangManager from "./pages/PCBangManager";
import EmpireChangeManager from "./pages/EmpireChangeManager";
import YangExchangeManager from "./pages/YangExchangeManager";
import CardGameManager from "./pages/CardGameManager";
import LotteryManager from "./pages/LotteryManager";
import GuildWarManager from "./pages/GuildWarManager";
import AuctionManager from "./pages/AuctionManager";
import HorseManager from "./pages/HorseManager";
import ShopPriceManager from "./pages/ShopPriceManager";
import HighscoreManager from "./pages/HighscoreManager";
import GuildMemberManager from "./pages/GuildMemberManager";
import OfflineShopDetailManager from "./pages/OfflineShopDetailManager";
import AdvancedLogManager from "./pages/AdvancedLogManager";
import ProtoEditor from "./pages/ProtoEditor";
import MobDropManager from "./pages/MobDropManager";
import SystemLogViewer from "./pages/SystemLogViewer";

import SystemMappings from "./pages/SystemMappings";

const SidebarItem = ({ icon: Icon, label, to, active, isConnected }: { icon: any, label: string, to: string, active: boolean, isConnected: boolean }) => {
  if (!isConnected && to !== "/") {
    return (
      <div 
        onClick={() => toast.error("Lütfen önce SSH ve MySQL bağlantılarını sağlayın.")}
        className="flex items-center gap-3 px-4 py-3 text-neutral-500 opacity-50 cursor-not-allowed font-medium text-sm uppercase tracking-widest"
      >
        <Icon size={18} />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <Link to={to}>
      <div className={`flex items-center gap-3 px-4 py-3 transition-all duration-300 rounded-lg group font-medium text-sm uppercase tracking-widest ${
        active 
          ? "bg-primary/10 text-primary border-r-4 border-secondary" 
          : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800"
      }`}>
        <Icon size={18} className={active ? "text-primary" : "text-neutral-500 group-hover:text-neutral-300"} />
        <span>{label}</span>
      </div>
    </Link>
  );
};

const Layout = ({ children, onLogout, isConnected }: { children: React.ReactNode, onLogout: () => void, isConnected: boolean }) => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-neutral-950/60 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-8 h-16 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-blue-400 uppercase font-headline">NEON_ARCHITECT</Link>
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/proto-editor" className={`font-headline tracking-tight uppercase text-sm transition-colors ${location.pathname === "/proto-editor" ? "text-blue-400 border-b-2 border-blue-400 pb-1" : "text-neutral-400 hover:text-neutral-200"}`}>Item_Proto</Link>
            <Link to="/game-data" className={`font-headline tracking-tight uppercase text-sm transition-colors ${location.pathname === "/game-data" ? "text-blue-400 border-b-2 border-blue-400 pb-1" : "text-neutral-400 hover:text-neutral-200"}`}>Oyun Verileri</Link>
            <Link to="/skills" className={`font-headline tracking-tight uppercase text-sm transition-colors ${location.pathname === "/skills" ? "text-blue-400 border-b-2 border-blue-400 pb-1" : "text-neutral-400 hover:text-neutral-200"}`}>Beceri</Link>
            <Link to="/item-attrs" className={`font-headline tracking-tight uppercase text-sm transition-colors ${location.pathname === "/item-attrs" ? "text-blue-400 border-b-2 border-blue-400 pb-1" : "text-neutral-400 hover:text-neutral-200"}`}>Efsun</Link>
            <Link to="/refines" className={`font-headline tracking-tight uppercase text-sm transition-colors ${location.pathname === "/refines" ? "text-blue-400 border-b-2 border-blue-400 pb-1" : "text-neutral-400 hover:text-neutral-200"}`}>Refine</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-neutral-400 hover:bg-white/5 rounded-lg transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button className="p-2 text-neutral-400 hover:bg-white/5 active:scale-95 duration-200 rounded-lg">
            <Activity size={20} />
          </button>
          <Link to="/settings" className="p-2 text-neutral-400 hover:bg-white/5 active:scale-95 duration-200 rounded-lg">
            <SettingsIcon size={20} />
          </Link>
          <div className="h-8 w-8 rounded-full overflow-hidden border border-primary/20">
            <img alt="Admin Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgiVIgtbIg4LNjdy3ZG1nmeAIw-3k9V4IVQcmgGJaCbz5Y1ixlf5cJCWXnauM8cBY1hfXoHUJTR7I7ffzJawCl_h1JHXz8I_pYqaEkyyMQxUBH7O1HFtTx9tpAVwnDAnl60C-lOkMHxe9CrgZx4KYOoF0fWdm8RIdDkJnimJYWVLDSttxtx8GtXWZWgPwIH7zIPl1bH69d0QYrig_o2br37lIB2GomlQFCrtQDRAYcX0pDWp6k6_csXtoVAB0tYvMtW0D8Dd-T6rfO" />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 0, x: isSidebarOpen ? 0 : -260 }}
        className="fixed left-0 top-0 h-screen bg-neutral-900 flex flex-col py-6 gap-4 z-40 pt-20 border-r border-white/5 overflow-hidden"
      >
        <div className="px-6 mb-4">
          <h3 className="text-emerald-400 font-headline text-xs font-bold uppercase tracking-widest">ADM_CORE_01</h3>
          <p className="text-neutral-500 text-[10px] tracking-[0.2em] uppercase">SYSTEM_ACTIVE</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" active={location.pathname === "/"} isConnected={isConnected} />
          <SidebarItem icon={Users} label="Oyuncular" to="/players" active={location.pathname === "/players"} isConnected={isConnected} />
          <SidebarItem icon={UserCircle} label="Hesaplar" to="/accounts" active={location.pathname === "/accounts"} isConnected={isConnected} />
          <SidebarItem icon={ShoppingBag} label="Nesne Market" to="/shops" active={location.pathname === "/shops"} isConnected={isConnected} />
          <SidebarItem icon={Store} label="Pazarlar" to="/offline-shops" active={location.pathname === "/offline-shops"} isConnected={isConnected} />
          <SidebarItem icon={History} label="Log Yönetimi" to="/logs" active={location.pathname === "/logs"} isConnected={isConnected} />
          <SidebarItem icon={Server} label="Core Status" to="/server-control" active={location.pathname === "/server-control"} isConnected={isConnected} />
          <SidebarItem icon={SettingsIcon} label="Sistem Ayarları" to="/server-settings" active={location.pathname === "/server-settings"} isConnected={isConnected} />
          
          <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest opacity-50">
            Gelişmiş
          </div>
          <SidebarItem icon={FileCode} label="Proto Editörü" to="/proto-editor" active={location.pathname === "/proto-editor"} isConnected={isConnected} />
          <SidebarItem icon={Zap} label="Beceriler" to="/skills" active={location.pathname === "/skills"} isConnected={isConnected} />
          <SidebarItem icon={RefreshCw} label="Yükseltmeler" to="/refines" active={location.pathname === "/refines"} isConnected={isConnected} />
          <SidebarItem icon={Sparkles} label="Efsunlar" to="/item-attrs" active={location.pathname === "/item-attrs"} isConnected={isConnected} />
          <SidebarItem icon={Terminal} label="Console" to="/console" active={location.pathname === "/console"} isConnected={isConnected} />
        </nav>

        <div className="mt-auto px-4 pt-4 border-t border-white/5">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-error/80 hover:text-error hover:bg-error/5 transition-all duration-300 rounded-lg font-medium text-sm uppercase tracking-widest"
          >
            <LogOut size={18} />
            <span>Güvenli Çıkış</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 overflow-auto relative pt-16 transition-all duration-300 ${isSidebarOpen ? "ml-[260px]" : "ml-0"}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-8 min-h-screen"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Toaster position="top-right" theme="dark" />
    </div>
  );
};

import ChatBot from "./components/ChatBot";

const MainApp = () => {
  const { isConnected, setConnected } = useAppContext();

  const handleLogout = () => {
    setConnected(false);
  };

  return (
    <Router>
      <Layout onLogout={handleLogout} isConnected={isConnected}>
        <Routes>
          <Route path="/" element={isConnected ? <Dashboard /> : <SetupPage />} />
          {isConnected && (
            <>
              <Route path="/players" element={<PlayerManager />} />
              <Route path="/players-deleted" element={<PlayerDeletedManager />} />
              <Route path="/inventory" element={<InventoryManager />} />
              <Route path="/safebox" element={<SafeboxManager />} />
              <Route path="/accounts" element={<AccountManager />} />
              <Route path="/guilds" element={<GuildManager />} />
              <Route path="/marriages" element={<MarriageManager />} />
              <Route path="/messenger" element={<MessengerManager />} />
              <Route path="/affects" element={<AffectManager />} />
              <Route path="/awards" element={<ItemAwardManager />} />
              <Route path="/lands" element={<LandManager />} />
              <Route path="/ranking" element={<RankingManager />} />
              <Route path="/objects" element={<ObjectManager />} />
              <Route path="/events" element={<EventManager />} />
              <Route path="/notices" element={<NoticeManager />} />
              <Route path="/ip-bans" element={<IPBanManager />} />
              <Route path="/firewall" element={<FirewallManager />} />
              <Route path="/hack-logs" element={<HackLogManager />} />
              <Route path="/chat-logs" element={<ChatLogManager />} />
              <Route path="/whisper-logs" element={<WhisperLogManager />} />
              <Route path="/trade-logs" element={<TradeLogManager />} />
              <Route path="/offline-shops" element={<OfflineShopManager />} />
              <Route path="/pets" element={<PetManager />} />
              <Route path="/dragon-soul" element={<DragonSoulManager />} />
              <Route path="/monarch" element={<MonarchManager />} />
              <Route path="/pcbang" element={<PCBangManager />} />
              <Route path="/empire-changes" element={<EmpireChangeManager />} />
              <Route path="/yang-exchanges" element={<YangExchangeManager />} />
              <Route path="/card-game" element={<CardGameManager />} />
              <Route path="/lottery" element={<LotteryManager />} />
              <Route path="/guild-wars" element={<GuildWarManager />} />
              <Route path="/auctions" element={<AuctionManager />} />
              <Route path="/horses" element={<HorseManager />} />
              <Route path="/item-awards" element={<ItemAwardManager />} />
              <Route path="/shop-prices" element={<ShopPriceManager />} />
              <Route path="/highscores" element={<HighscoreManager />} />
              <Route path="/guild-members" element={<GuildMemberManager />} />
              <Route path="/offline-shop-details" element={<OfflineShopDetailManager />} />
              <Route path="/advanced-logs" element={<AdvancedLogManager />} />
              <Route path="/proto-editor" element={<ProtoEditor />} />
              <Route path="/mob-drops" element={<MobDropManager />} />
              <Route path="/system-logs" element={<SystemLogViewer />} />
              <Route path="/pcbang" element={<PCBangManager />} />
              <Route path="/market-analytics" element={<MarketAnalytics />} />
              <Route path="/map-stats" element={<MapStatistics />} />
              <Route path="/coupons" element={<CouponManager />} />
              <Route path="/vips" element={<VipManager />} />
              <Route path="/skills" element={<SkillManager />} />
              <Route path="/refines" element={<RefineManager />} />
              <Route path="/warps" element={<WarpManager />} />
              <Route path="/item-attrs" element={<ItemAttrManager />} />
              <Route path="/banwords" element={<BanwordManager />} />
              <Route path="/privs" element={<PrivManager />} />
              <Route path="/server-control" element={<ServerControl />} />
              <Route path="/performance" element={<ServerPerformance />} />
              <Route path="/core-crash" element={<CoreCrashAnalyzer />} />
              <Route path="/maintenance" element={<MaintenanceManager />} />
              <Route path="/syslogs" element={<SysLogViewer />} />
              <Route path="/quest-compiler" element={<QuestCompiler />} />
              <Route path="/config-editor" element={<ConfigEditor />} />
              <Route path="/backups" element={<BackupManager />} />
              <Route path="/proto-sync" element={<ProtoSyncManager />} />
              <Route path="/gms" element={<GMManager />} />
              <Route path="/logs" element={<LogViewer />} />
              <Route path="/shops" element={<ShopManager />} />
              <Route path="/shop-items" element={<ShopItemManager />} />
              <Route path="/drops" element={<DropManager />} />
              <Route path="/quests" element={<QuestManager />} />
              <Route path="/server-settings" element={<ServerSettings />} />
              <Route path="/game-data" element={<GameData />} />
              <Route path="/files" element={<FileExplorer />} />
              <Route path="/db" element={<DatabaseManager />} />
              <Route path="/console" element={<Console />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/system-mappings" element={<SystemMappings />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
      <ChatBot />
    </Router>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
