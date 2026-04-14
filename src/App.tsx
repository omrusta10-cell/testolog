import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { LayoutDashboard, FolderTree, Database, Terminal, Settings, Menu, X, LogOut } from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Toaster } from "sonner";
import Dashboard from "./pages/Dashboard";
import FileExplorer from "./pages/FileExplorer";
import DatabaseManager from "./pages/DatabaseManager";
import Console from "./pages/Console";
import SetupPage from "./pages/SetupPage";

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

        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem icon={LayoutDashboard} label={isSidebarOpen ? "Dashboard" : ""} to="/" active={location.pathname === "/"} />
          <SidebarItem icon={FolderTree} label={isSidebarOpen ? "File Explorer" : ""} to="/files" active={location.pathname === "/files"} />
          <SidebarItem icon={Database} label={isSidebarOpen ? "Database" : ""} to="/db" active={location.pathname === "/db"} />
          <SidebarItem icon={Terminal} label={isSidebarOpen ? "Console" : ""} to="/console" active={location.pathname === "/console"} />
        </nav>

        <div className="p-4 border-t space-y-2">
          <SidebarItem icon={Settings} label={isSidebarOpen ? "Settings" : ""} to="/settings" active={location.pathname === "/settings"} />
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
          <Route path="/files" element={<FileExplorer />} />
          <Route path="/db" element={<DatabaseManager />} />
          <Route path="/console" element={<Console />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}
