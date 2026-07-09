import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LiveUpdates from "../components/LiveUpdates";
import {
  Wallet as WalletIcon, TrendingUp, TrendingDown, DollarSign,
  ArrowDownLeft, ArrowUpRight, Plus, Minus,
  Clock, CheckCircle, XCircle, BarChart3
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import { getWallet, getTransactions, deposit,withdraw } from "../api/walletApi";

const WEEK_DATA = [
  { day: "Mon", balance: 10000 },
  { day: "Tue", balance: 10800 },
  { day: "Wed", balance: 10500 },
  { day: "Thu", balance: 11200 },
  { day: "Fri", balance: 10900 },
  { day: "Sat", balance: 12100 },
  { day: "Sun", balance: 12450 },
];

const totalInvested = 0;
const totalEarned = 0;
const winRate = 0;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2.5 shadow-xl">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-bold text-blue-600">
          🪙 {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const formatTransaction = (tx) => {
  switch (tx.type) {
    case "CREDIT":
      return {
        id: tx._id,
        type: "credit",
        icon: <Plus size={15} />,
        iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        title: "Credit",
        desc: tx.description,
        amount: `+${tx.amount.toLocaleString()}`,
        amountColor: "text-emerald-600 dark:text-emerald-400",
        date: new Date(tx.createdAt).toLocaleString(),
        status: "completed",
      };

    case "DEBIT":
      return {
        id: tx._id,
        type: "debit",
        icon: <Minus size={15} />,
        iconBg: "bg-red-100 dark:bg-red-900/30",
        iconColor: "text-red-600 dark:text-red-400",
        title: "Debit",
        desc: tx.description,
        amount: `-${tx.amount.toLocaleString()}`,
        amountColor: "text-red-500 dark:text-red-400",
        date: new Date(tx.createdAt).toLocaleString(),
        status: "completed",
      };

    case "MARKET_BUY":
      return {
        id: tx._id,
        type: "debit",
        icon: <ArrowUpRight size={15} />,
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        iconColor: "text-orange-600 dark:text-orange-400",
        title: "Market Buy",
        desc: tx.description,
        amount: `-${tx.amount.toLocaleString()}`,
        amountColor: "text-red-500 dark:text-red-400",
        date: new Date(tx.createdAt).toLocaleString(),
        status: "completed",
      };

    case "MARKET_SELL":
      return {
        id: tx._id,
        type: "credit",
        icon: <ArrowDownLeft size={15} />,
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        title: "Market Sell",
        desc: tx.description,
        amount: `+${tx.amount.toLocaleString()}`,
        amountColor: "text-emerald-600 dark:text-emerald-400",
        date: new Date(tx.createdAt).toLocaleString(),
        status: "completed",
      };

    case "REWARD":
      return {
        id: tx._id,
        type: "credit",
        icon: <DollarSign size={15} />,
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
        title: "Reward",
        desc: tx.description,
        amount: `+${tx.amount.toLocaleString()}`,
        amountColor: "text-emerald-600 dark:text-emerald-400",
        date: new Date(tx.createdAt).toLocaleString(),
        status: "completed",
      };

    default:
      return tx;
  }
};

export default function Wallet() {
  const [darkMode, setDarkMode] = useState(false);
  const [liveUpdatesOpen, setLiveUpdatesOpen] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [inputAmount, setInputAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [filter, setFilter] = useState("All");

  const filteredTx = (transactions || []).filter((t) => {
    if (filter === "Credits") return t.type === "credit";
    if (filter === "Debits") return t.type === "debit";
    return true;
  });

  useEffect(() => {
    const fetchWallet = async () => {
      try{

        const wallet = await getWallet();
        const tx = await getTransactions();

        setBalance(wallet.walletBalance);
        setTransactions(tx.map(formatTransaction));

      }catch(error){
        console.error(error);
      }
    };

    fetchWallet();

  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);


  const handleDeposit = async () => {
    const amt = parseInt(inputAmount);
    if (!amt || amt <= 0) return;
    
    try{
      await deposit(amt);

      const wallet = await getWallet();
      const tx = await getTransactions();

      setBalance(wallet.walletBalance);
      sestTransactions(tx.map(formatTransaction));

      setInputAmount("");
      setShowDeposit(false);

    }catch(error){

      console.error(error);

    }
  };

  const handleWithdraw = async () => {
    const amt = parseInt(inputAmount);
    if (!amt || amt <= 0 || amt > balance) return;
    try{

      await withdraw(amt);

      const wallet = await getWallet();
      const tx = await getTransactions();

      setBalance(wallet.walletBalance);
      setTransactions(tx.map(formatTransaction));

      setInputAmount("");
      setShowWithdraw(false);

    }catch(error){
      console.error(error);
    }

  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-200">
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        liveUpdatesOpen={liveUpdatesOpen}
        setLiveUpdatesOpen={setLiveUpdatesOpen}
      />

      <div className="flex max-w-7xl mx-auto">
        <main className="flex-1 min-w-0 px-4 py-6 space-y-5">

          {/* ── Page Heading ── */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 flex items-center justify-center shadow-lg hover:shadow-blue-300/40 hover:scale-105 transition-all duration-300">
              <WalletIcon size={22} className="text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Wallet
            </h1>
          </div>

          {/* ── Balance Card ── */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 dark:hover:shadow-blue-900/50 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-white/10">
            {/* Decorative blobs */}
            <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-teal-400/10 pointer-events-none" />
            {/* Subtle shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

            <div className="relative z-10">
              <p className="text-blue-200 text-sm font-medium mb-1">Total Balance</p>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl sm:text-5xl font-bold text-white">
                  🪙 {balance.toLocaleString()}
                </span>
                <span className="text-blue-200 text-sm mb-1.5">coins</span>
              </div>

              {/* Deposit / Withdraw buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeposit(true); setShowWithdraw(false); setInputAmount(""); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-blue-700 font-semibold text-sm hover:bg-blue-50 hover:scale-[1.03] active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Plus size={16} className="group-hover:rotate-90 transition-transform duration-200" />
                  Deposit
                </button>
                <button
                  onClick={() => { setShowWithdraw(true); setShowDeposit(false); setInputAmount(""); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/30 text-white font-semibold text-sm transition-all duration-200 border border-white/20 hover:border-white/40 hover:scale-[1.03] active:scale-95 shadow-sm hover:shadow-md"
                >
                  <Minus size={16} />
                  Withdraw
                </button>
              </div>
            </div>
          </div>

          {/* ── Deposit modal ── */}
          {showDeposit && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-blue-100 dark:border-blue-900/40 p-5 shadow-lg ring-1 ring-blue-100/50 dark:ring-blue-900/20 transition-all duration-300">
              <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <Plus size={16} className="text-emerald-500" /> Deposit Coins
              </h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  placeholder="Enter amount..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                />
                <button
                  onClick={handleDeposit}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowDeposit(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95"
                >
                  Cancel
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                {[500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setInputAmount(String(amt))}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/40 dark:hover:to-cyan-900/40 hover:scale-[1.04] active:scale-95 transition-all duration-200 border border-blue-100/50 dark:border-blue-800/30"
                  >
                    +{amt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Withdraw modal ── */}
          {showWithdraw && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900/40 p-5 shadow-lg ring-1 ring-red-100/50 dark:ring-red-900/20 transition-all duration-300">
              <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <Minus size={16} className="text-red-500" /> Withdraw Coins
              </h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  placeholder={`Max: ${balance.toLocaleString()}`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200"
                />
                <button
                  onClick={handleWithdraw}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowWithdraw(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95"
                >
                  Cancel
                </button>
              </div>
              {inputAmount && parseInt(inputAmount) > balance && (
                <p className="text-red-500 text-xs mt-2">Insufficient balance</p>
              )}
            </div>
          )}

          {/* ── Stats row ── */}
          <div className="grid grid-cols-3 gap-3">
            {/* Total Invested */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center shadow-sm hover:shadow-lg dark:hover:shadow-gray-900/60 hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 group">
              <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                <TrendingDown size={18} className="text-orange-500" />
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-0.5">Total Invested</p>
              <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                🪙 {totalInvested.toLocaleString()}
              </p>
            </div>

            {/* Total Earned */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center shadow-sm hover:shadow-lg dark:hover:shadow-gray-900/60 hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 group">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp size={18} className="text-emerald-500" />
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-0.5">Total Earned</p>
              <p className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                🪙 {totalEarned.toLocaleString()}
              </p>
            </div>

            {/* Win Rate */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 text-center shadow-sm hover:shadow-lg dark:hover:shadow-gray-900/60 hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 group">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 size={18} className="text-blue-500" />
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-0.5">Win Rate</p>
              <p className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                {winRate}%
              </p>
              {/* Mini progress bar */}
              <div className="mt-2 w-full h-1 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-700"
                  style={{ width: `${winRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── Analytics Graph ── */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-xl dark:hover:shadow-gray-900/60 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white text-base">Wallet Analytics</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Balance trend this week</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-600 text-white shadow-sm">
                7 Days
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={WEEK_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="url(#lineGrad)"
                  strokeWidth={3}
                  fill="url(#balanceGrad)"
                  dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 7, fill: "#06b6d4", stroke: "#fff", strokeWidth: 2 }}
                />
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#2563eb" />
                    <stop offset="50%"  stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#0d9488" />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* ── Transaction History ── */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 overflow-hidden pb-4">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-bold text-gray-900 dark:text-white text-base">
                Transaction History
              </h2>
              {/* Filter buttons */}
              <div className="flex gap-1.5">
                {["All", "Credits", "Debits"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-[1.04] active:scale-95 ${
                      filter === f
                        ? "bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-600 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction rows */}
            {filteredTx.length > 0 ? (
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {filteredTx.map((tx) => (
                  <div
                    key={tx.id}
                    className={`flex items-center gap-3 px-5 py-4 hover:bg-blue-100 dark:hover:bg-gray-800/50 transition-all duration-200 border-l-2 border-l-transparent ${tx.borderGlow} group cursor-pointer`}
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl ${tx.iconBg} ${tx.iconColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                      {tx.icon}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{tx.title}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{tx.desc}</p>
                    </div>
                    {/* Right */}
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${tx.amountColor}`}>🪙 {tx.amount}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1 justify-end">
                        <CheckCircle size={10} className="text-emerald-400" />
                        {tx.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="text-3xl mb-2">💸</p>
                <p className="text-sm font-medium">No transactions here</p>
              </div>
            )}
          </div>

        </main>

        {/* ── Desktop Live Updates sidebar ── */}
        {liveUpdatesOpen && (
          <aside className="hidden lg:flex flex-col w-72 shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
            <LiveUpdates onClose={() => setLiveUpdatesOpen(false)} />
          </aside>
        )}
      </div>

      {/* ── Mobile Live Updates panel ── */}
      {liveUpdatesOpen && (
        <div className="lg:hidden fixed top-16 right-0 z-40 h-[calc(100vh-4rem)] w-72 max-w-[85vw] flex flex-col bg-white dark:bg-gray-950 shadow-2xl border-l border-gray-100 dark:border-gray-800">
          <LiveUpdates onClose={() => setLiveUpdatesOpen(false)} />
        </div>
      )}
    </div>
  );
}