import { useState, useEffect } from "react";
import { User, Search, RefreshCw, Key, Ban, CheckCircle, Trash2, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import api from "../lib/api";
import { toast } from "sonner";

export default function AccountManager() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/db/data?table=account", {
        headers: { "x-db-name-override": "account" }
      });
      setAccounts(res.data);
    } catch (err: any) {
      toast.error("Hesaplar yüklenemedi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter(a => 
    a.login.toLowerCase().includes(search.toLowerCase()) || 
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold text-white tracking-tighter uppercase neon-glow-primary">ACCOUNT_MANAGEMENT</h1>
          <p className="text-neutral-500 text-xs uppercase tracking-[0.3em] mt-2">Manage user accounts, security and access</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="SEARCH_ACCOUNT..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-xs uppercase tracking-widest h-11 rounded-xl focus:ring-primary/50"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={fetchAccounts} 
            disabled={loading} 
            className="h-11 px-6 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest gap-2"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> 
            SYNC_DATA
          </Button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border-white/5">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h3 className="text-blue-400 font-headline text-xs font-bold uppercase tracking-widest">USER_ACCOUNTS_DATABASE</h3>
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest">
            Total_Records: <span className="text-white">{filteredAccounts.length}</span>
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-[10px] uppercase tracking-widest text-neutral-500 py-4 pl-8">ID_HASH</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest text-neutral-500 py-4">LOGIN_ID</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest text-neutral-500 py-4">EMAIL_ADDRESS</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest text-neutral-500 py-4">STATUS</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest text-neutral-500 py-4">REG_DATE</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest text-neutral-500 py-4 text-right pr-8">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <TableCell className="font-mono text-[10px] text-neutral-500 pl-8">{account.id}</TableCell>
                  <TableCell>
                    <span className="text-sm font-headline font-bold text-white tracking-tight uppercase">{account.login}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-neutral-400">{account.email}</span>
                  </TableCell>
                  <TableCell>
                    {account.status === "OK" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                        <CheckCircle size={10} /> ACTIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-error/10 text-error text-[10px] font-bold uppercase tracking-widest border border-error/20">
                        <Ban size={10} /> BANNED
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-[10px] text-neutral-500 uppercase tracking-widest">
                    {new Date(account.create_time).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" title="Reset Password" className="h-8 w-8 rounded-lg hover:bg-blue-400/10 hover:text-blue-400">
                        <Key size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" title="Send Email" className="h-8 w-8 rounded-lg hover:bg-purple-400/10 hover:text-purple-400">
                        <Mail size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${account.status === "OK" ? "hover:bg-amber-400/10 hover:text-amber-400" : "hover:bg-emerald-400/10 hover:text-emerald-400"}`}>
                        {account.status === "OK" ? <Ban size={14} /> : <CheckCircle size={14} />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
