import React, { useEffect, useState, useMemo } from "react";
// Import Recharts (Removed unused LineChart imports)
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import AdminDashboard from "./AdminDashboard";
import ReportsDashboard from "./ReportsDashboard";
import SellHoldAdvisor from "./components/Decision/SellHoldAdvisor";

// --- CONFIGURATION ---
const API_BASE_URL = "http://127.0.0.1:8000";

// --- INLINE ICONS ---
const Icon = ({ children, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        {children}
    </svg>
);

const TrendingUp = ({ className }) => (<Icon className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></Icon>);
const TrendingDown = ({ className }) => (<Icon className={className}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></Icon>);
const Minus = ({ className }) => (<Icon className={className}><line x1="5" y1="12" x2="19" y2="12" /></Icon>);
const MapPin = ({ className }) => (<Icon className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></Icon>);
const DollarSign = ({ className }) => (<Icon className={className}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></Icon>);
const BarChart2 = ({ className }) => (<Icon className={className}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></Icon>);
const ShoppingCart = ({ className }) => (<Icon className={className}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></Icon>);
const Truck = ({ className }) => (<Icon className={className}><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></Icon>);
const Wifi = ({ className }) => (<Icon className={className}><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></Icon>);
const WifiOff = ({ className }) => (<Icon className={className}><line x1="1" y1="1" x2="23" y2="23" /><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" /><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" /><path d="M10.71 5.05A16 16 0 0 1 22.58 9" /><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></Icon>);
const ChevronRight = ({ className }) => (<Icon className={className}><polyline points="9 18 15 12 9 6" /></Icon>);
const ChevronDown = ({ className }) => (<Icon className={className}><polyline points="6 9 12 15 18 9" /></Icon>);
const CheckCircle = ({ className }) => (<Icon className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></Icon>);
const Plus = ({ className }) => (<Icon className={className}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>);
const X = ({ className }) => (<Icon className={className}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>);
const Briefcase = ({ className }) => (<Icon className={className}><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></Icon>);
const Trash2 = ({ className }) => (<Icon className={className}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></Icon>);
const LogOut = ({ className }) => (<Icon className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></Icon>);
const User = ({ className }) => (<Icon className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon>);
const ArrowRight = ({ className }) => (<Icon className={className}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Icon>);
const ArrowUpRight = ({ className }) => (<Icon className={className}><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></Icon>);

// --- 1. LANDING PAGE ---
const LandingPage = ({ onLoginClick }) => {
    return (
        <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
            <nav className="px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-200"><BarChart2 className="w-6 h-6" /></div>
                    <span className="font-bold text-xl text-stone-800 tracking-tight">Ushauri Soko</span>
                </div>
                <button onClick={onLoginClick} className="px-6 py-2.5 bg-white border border-stone-200 text-stone-600 font-bold rounded-full hover:bg-stone-50 transition-colors shadow-sm hover:shadow-md">
                    Login
                </button>
            </nav>

            <div className="flex-1 flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto mt-6">
                <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-6 border border-emerald-100">Market Intelligence Platform</span>
                <h1 className="text-5xl md:text-7xl font-bold text-stone-800 mb-6 tracking-tight leading-tight">
                    Know the Price.<br /><span className="text-emerald-600">Sell for Profit.</span>
                </h1>
                <p className="text-xl text-stone-500 mb-10 max-w-2xl leading-relaxed">
                    Ushauri Soko gives farmers clear, actionable advice on where to sell produce to maximize net income after transport costs.
                </p>
                <div className="flex gap-4 flex-col sm:flex-row">
                    <button onClick={onLoginClick} className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-transform active:scale-95 flex items-center justify-center gap-2">
                        Get Started <ArrowUpRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full px-6 py-20">
                <div className="bg-white p-8 rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-100 hover:shadow-lg transition-all duration-300">
                    <div className="bg-orange-50 w-14 h-14 rounded-2xl flex items-center justify-center text-orange-600 mb-6"><TrendingUp className="w-7 h-7" /></div>
                    <h3 className="text-xl font-bold text-stone-800 mb-2">Price Trends</h3>
                    <p className="text-stone-500">Know if prices are rising or falling before you harvest.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-100 hover:shadow-lg transition-all duration-300">
                    <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 mb-6"><MapPin className="w-7 h-7" /></div>
                    <h3 className="text-xl font-bold text-stone-800 mb-2">Best Market Finder</h3>
                    <p className="text-stone-500">We calculate transport fees to show you the <b>real</b> best market.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-100 hover:shadow-lg transition-all duration-300">
                    <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-600 mb-6"><Briefcase className="w-7 h-7" /></div>
                    <h3 className="text-xl font-bold text-stone-800 mb-2">Profit Ledger</h3>
                    <p className="text-stone-500">Track your sales and revenue. Move away from paper notebooks.</p>
                </div>
            </div>

            <div className="text-center pb-8 text-stone-400 text-sm">
                © {new Date().getFullYear()} Ushauri Soko. Empowering Farmers.
            </div>
        </div>
    );
}

// --- 2. LOGIN SCREEN ---
const LoginScreen = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_BASE_URL}/api/token/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                // FIX: Pass is_staff to handler
                onLogin(data.access, username, data.is_staff);
            } else {
                setError("Invalid username or password");
            }
        } catch (err) { setError("Server connection failed. Is Django running?"); } finally { setIsLoading(false); }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-8 border border-stone-100">
                <div className="text-center mb-8">
                    <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600"><BarChart2 className="w-8 h-8" /></div>
                    <h1 className="text-2xl font-bold text-stone-800">Ushauri Soko</h1>
                    <p className="text-stone-500 text-sm mt-1">Market Intelligence Login</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2"><label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Username</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-stone-50 border-stone-200 border focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all font-medium text-stone-800" placeholder="Enter your username" required /></div>
                    <div className="space-y-2"><label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-stone-50 border-stone-200 border focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all font-medium text-stone-800" placeholder="••••••••" required /></div>
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium flex items-center gap-2"><X className="w-4 h-4" /> {error}</div>}
                    <button type="submit" disabled={isLoading} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2">{isLoading ? "Signing in..." : "Login"}</button>
                </form>
                <div className="mt-8 pt-8 border-t border-stone-100 text-center">
                    <p className="text-stone-500 text-sm">Don't have an account?</p>
                    <p className="text-emerald-600 font-bold text-sm mt-1">Contact your Administrator to get access.</p>
                </div>
            </div>
        </div>
    );
};

// --- SHARED COMPONENTS ---
const RecordSaleModal = ({ isOpen, onClose, saleData, token }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                market_sold_to: saleData.market,
                produce: saleData.produce,
                volume_sold: parseFloat(saleData.quantity),
                actual_price_per_unit: saleData.pricePerKg,
                total_revenue: saleData.totalRevenue,
                date: new Date().toISOString().split('T')[0]
            };
            const response = await fetch(`${API_BASE_URL}/api/salesrecords/`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            if (response.ok) { alert("✅ Success! Sale recorded."); onClose(); window.location.reload(); }
            else { const errData = await response.json(); alert("⚠️ Failed to save.\n" + JSON.stringify(errData, null, 2)); }
        } catch (error) { alert("❌ Network Error."); } finally { setIsSubmitting(false); }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20">
                <div className="bg-emerald-900 p-6 text-white flex justify-between items-start">
                    <div><h3 className="text-2xl font-bold tracking-tight">Record Sale</h3><p className="text-emerald-200 text-sm mt-1">Confirm details</p></div>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4"><div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Produce</label><div className="font-bold bg-stone-50 p-3 rounded-lg">{saleData.produce}</div></div><div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Market</label><div className="font-bold bg-stone-50 p-3 rounded-lg">{saleData.market}</div></div></div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase">Quantity</label><div className="font-bold bg-stone-50 p-3 rounded-lg">{saleData.quantity} Kgs</div></div>
                    <div className="bg-emerald-50 p-4 rounded-xl flex justify-between"><span className="text-sm font-bold text-emerald-800">Pesa Mfukoni <span className="text-[10px] opacity-70 block">(Net Profit)</span></span><span className="text-xl font-bold text-emerald-700">KES {Number(saleData.profit).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
                    <div className="pt-2 flex gap-3"><button type="button" onClick={onClose} className="flex-1 py-3.5 font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors" disabled={isSubmitting}>Cancel</button><button type="submit" disabled={isSubmitting} className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">{isSubmitting ? <span>Saving...</span> : <><CheckCircle className="w-5 h-5" /> Confirm</>}</button></div>
                </form>
            </div>
        </div>
    );
};

// --- TAB COMPONENTS ---

// 1. DASHBOARD COMPONENT (Chart-Lite)
const DashboardTab = ({ markets, prices, sales, forecasts, logs }) => {
    // Generate Insights from Data
    const insights = useMemo(() => {
        const uniqueProduce = [...new Set(prices.map(p => p.produce_name || p.produce))];
        return uniqueProduce.map(prod => {
            const productLogs = logs.filter(l => (l.produce_name || l.produce) === prod).sort((a, b) => new Date(b.date) - new Date(a.date));
            const currentPrice = productLogs[0] ? Number(productLogs[0].price) : 0;
            const forecast = forecasts.find(f => f.produce === prod);
            const predictedPrice = forecast ? Number(forecast.predicted_price) : currentPrice;

            const change = predictedPrice - currentPrice;
            let status = "stable";
            if (change > 2) status = "rising";
            if (change < -2) status = "falling";

            return { produce: prod, currentPrice, predictedPrice, status, change };
        }).filter(i => i.currentPrice > 0);
    }, [prices, logs, forecasts]);

    // Top Market
    const topMarket = prices.length > 0 ? prices.reduce((max, p) => Number(p.price) > Number(max.price) ? p : max, prices[0]) : null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header with Date */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Today's Overview</h2>
                    <p className="text-stone-500 text-sm">Real-time market insights. <span className="italic text-stone-400">- (Habari za Soko)</span></p>
                </div>
                <div className="bg-white px-5 py-2 rounded-xl shadow-sm border border-stone-100 text-emerald-700 font-bold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Market Alert</p>
                    {topMarket ? (
                        <div>
                            <p className="text-sm text-stone-500">Highest price today:</p>
                            <p className="text-xl font-bold text-stone-900 mt-1">{topMarket.market_name}</p>
                            <p className="text-emerald-600 font-bold text-sm">KES {Number(topMarket.price).toFixed(0)} ({topMarket.produce_name})</p>
                        </div>
                    ) : <p className="text-stone-400">Loading...</p>}
                </div>
                <div className="bg-emerald-900 p-6 rounded-3xl shadow-lg text-white relative overflow-hidden flex flex-col justify-center">
                    <div className="relative z-10">
                        <p className="text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">Quick Action</p>
                        <h3 className="font-bold text-lg mb-1">Sell for Profit</h3>
                        <p className="text-xs text-emerald-200">Use the calculator in "Best Market" tab.</p>
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-white/10 w-24 h-24 rounded-full blur-2xl"></div>
                </div>
            </div>

            {/* Insights List (Chart-Lite) */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Market Pulse</h3>
                <div className="space-y-4">
                    {insights.map((insight, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${insight.status === 'rising' ? 'bg-emerald-100 text-emerald-600' : insight.status === 'falling' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    {insight.status === 'rising' ? <TrendingUp className="w-6 h-6" /> : insight.status === 'falling' ? <TrendingDown className="w-6 h-6" /> : <Minus className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{insight.produce}</h4>
                                    <p className="text-sm text-gray-500">
                                        {insight.status === 'rising' ? "Prices likely to rise." : insight.status === 'falling' ? "Prices dropping soon." : "Prices stable."}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-stone-400 font-bold uppercase">Forecast</p>
                                <p className={`text-xl font-bold ${insight.change > 0 ? 'text-emerald-600' : insight.change < 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                                    KES {insight.predictedPrice.toFixed(0)}
                                </p>
                            </div>
                        </div>
                    ))}
                    {insights.length === 0 && <div className="text-center p-8 text-gray-400">Loading insights...</div>}
                </div>
            </div>
        </div>
    );
};

// 2. MARKETS TAB (Logistics)
const MarketsTab = ({ markets, loading }) => {
    if (loading) return <div className="p-12 text-center text-gray-400 font-medium">Loading markets...</div>;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {markets.map((m) => (
                <div key={m.id} className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 flex flex-col relative overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Truck className="w-24 h-24 text-emerald-900" /></div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-700"><MapPin className="w-6 h-6" /></div>
                        <h3 className="text-2xl font-bold text-stone-900 tracking-tight">{m.name}</h3>
                    </div>
                    <div className="space-y-4 text-sm mt-auto">
                        <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl"><span className="text-stone-500 font-bold uppercase text-xs tracking-wide">Transport</span><span className="font-bold text-stone-900 text-base">KES {Number(m.transport_cost).toLocaleString()}</span></div>
                        <div className="flex justify-between items-center p-3 bg-stone-50 rounded-xl"><span className="text-stone-500 font-bold uppercase text-xs tracking-wide">Market Fee</span><span className="font-bold text-stone-900 text-base">KES {Number(m.market_fee).toLocaleString()}</span></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// 3. PRICES TAB (Raw Data)
const PricesTab = ({ prices, loading }) => {
    if (loading) return <div className="p-12 text-center text-gray-400 font-medium">Loading...</div>;

    // Group by produce for cleaner view
    const grouped = prices.reduce((acc, item) => {
        const prod = item.produce_name || "Unknown";
        if (!acc[prod]) acc[prod] = [];
        acc[prod].push(item);
        return acc;
    }, {});

    // Usability Fix: Sort items by Price Descending (Highest First)
    Object.keys(grouped).forEach(key => {
        grouped[key].sort((a, b) => Number(b.price) - Number(a.price));
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(grouped).map(([prod, items]) => (
                    <div key={prod} className="bg-white rounded-3xl shadow-sm border border-stone-100 p-6 hover:border-emerald-200 transition-colors">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                            <div className="bg-orange-50 p-2.5 rounded-xl text-orange-600"><ShoppingCart className="w-5 h-5" /></div>
                            <h3 className="font-bold text-xl text-stone-900 tracking-tight">{prod}</h3>
                        </div>
                        <div className="space-y-2">
                            {items.map((i, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm py-3 px-4 hover:bg-stone-50 rounded-xl transition-colors group">
                                    <span className="text-stone-600 font-bold group-hover:text-stone-900 transition-colors">{i.market_name}</span>
                                    <span className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">KES {Number(i.price).toFixed(0)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 4. TRENDS TAB (Chart-Lite)
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-xl shadow-lg border border-stone-100">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">{new Date(label).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                <p className="text-lg font-bold text-emerald-600">KES {payload[0].value.toFixed(0)}</p>
                {payload[0].payload.type === 'forecast' && <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Forecast</p>}
            </div>
        );
    }
    return null;
};

const TrendsTab = ({ logs, forecasts }) => {
    const [selectedProduce, setSelectedProduce] = useState("");
    const [selectedMarket, setSelectedMarket] = useState("");

    const produceOptions = useMemo(() => [...new Set(logs.map(l => l.produce_name || l.produce))].filter(Boolean), [logs]);
    const marketOptions = useMemo(() => {
        if (!selectedProduce) return [];
        const relevantLogs = logs.filter(l => (l.produce_name || l.produce) === selectedProduce);
        return [...new Set(relevantLogs.map(l => l.market_name || l.market))].filter(Boolean);
    }, [logs, selectedProduce]);

    useEffect(() => {
        if (produceOptions.length > 0 && !selectedProduce) setSelectedProduce(produceOptions[0]);
    }, [produceOptions, selectedProduce]);

    useEffect(() => {
        if (marketOptions.length > 0 && (!selectedMarket || !marketOptions.includes(selectedMarket))) {
            setSelectedMarket(marketOptions[0]);
        }
    }, [marketOptions, selectedMarket]);

    // Determine trend status based on forecast
    const trendAnalysis = useMemo(() => {
        if (!selectedProduce || !selectedMarket) return null;

        // Get current price (most recent log)
        const productLogs = logs.filter(l => (l.produce_name || l.produce) === selectedProduce && (l.market_name || l.market) === selectedMarket)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        const currentLog = productLogs[0];
        const currentPrice = currentLog ? Number(currentLog.price) : 0;

        // Get forecast price
        const productForecast = (forecasts || []).find(f =>
            f &&
            String(f.produce).trim() === String(selectedProduce).trim() &&
            String(f.market).trim() === String(selectedMarket).trim()
        );
        const predictedPrice = productForecast ? Number(productForecast.predicted_price) : 0;
        // Handle date format differences (ISO vs YYYY-MM-DD)
        const forecastDate = productForecast && productForecast.date ? productForecast.date.split('T')[0] : "Next Week";

        if (!currentPrice || !predictedPrice) return null;

        const diff = predictedPrice - currentPrice;
        const percentChange = ((diff / currentPrice) * 100).toFixed(1);

        let status = "Stable";
        let colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
        let icon = <Minus className="w-8 h-8" />;
        let message = `${selectedProduce} prices in ${selectedMarket} are STABLE.`;
        let subMessage = "No major changes expected.";
        let swahili = "Bei imetulia.";

        if (percentChange > 1) {
            status = "Rising";
            colorClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
            icon = <TrendingUp className="w-8 h-8 text-emerald-600" />;
            message = `${selectedProduce} prices in ${selectedMarket} are RISING. Good time to sell!`;
            subMessage = "High demand expected next week.";
            swahili = "Bei zinapanda wiki ijayo.";
        } else if (percentChange < -1) {
            status = "Falling";
            colorClass = "bg-red-100 text-red-800 border-red-200";
            icon = <TrendingDown className="w-8 h-8 text-red-600" />;
            message = `${selectedProduce} prices in ${selectedMarket} are FALLING.`;
            subMessage = "Consider holding stock if possible.";
            swahili = "Bei zinashuka wiki ijayo.";
        }

        return {
            currentPrice,
            predictedPrice,
            market: selectedMarket,
            diff,
            percentChange,
            status,
            colorClass,
            icon,
            message,
            subMessage,
            swahili,
            forecastDate
        };
    }, [logs, forecasts, selectedProduce, selectedMarket]);

    // Simplified Sparkline Data
    const chartData = useMemo(() => {
        if (!selectedProduce || !selectedMarket) return [];

        // 1. Filter by produce AND market
        const productLogs = logs.filter(l => (l.produce_name || l.produce) === selectedProduce && (l.market_name || l.market) === selectedMarket);

        // 2. Group by Date to handle multiple entries on same day (take latest/max)
        const dailyMap = new Map();
        productLogs.forEach(log => {
            // Assume date is 'YYYY-MM-DD' or ISO. normalize to day.
            const day = log.date.split('T')[0];
            // If multiple, overwrite (effectively taking the last one processed, or we could avg)
            // Since we want the latest state, just taking one is fine for now, or max price.
            // Let's stick to simple "latest recorded" for that day.
            if (!dailyMap.has(day)) {
                dailyMap.set(day, log);
            }
        });

        // 3. Convert back to array and Sort Descending (Newest First)
        const uniqueDays = Array.from(dailyMap.values())
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        // 4. Take top 7 (Newest Unique Days) and Reverse for Chart
        const recentLogs = uniqueDays.slice(0, 7).reverse().map(log => ({
            date: log.date.split('T')[0],
            price: Number(log.price),
            type: 'history'
        }));

        // 5. Add Forecast Point
        if (trendAnalysis && trendAnalysis.predictedPrice) {
            recentLogs.push({
                date: trendAnalysis.forecastDate, // Forecast date is already future
                price: trendAnalysis.predictedPrice,
                type: 'forecast'
            });
        }
        return recentLogs;
    }, [logs, trendAnalysis, selectedProduce, selectedMarket]);

    if (logs.length === 0) return <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-dashed border-stone-200">No historical data available.</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                <div className="flex flex-wrap gap-2 p-1.5 bg-stone-100 rounded-xl w-fit">
                    {produceOptions.map(opt => (
                        <button key={opt} onClick={() => setSelectedProduce(opt)} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${selectedProduce === opt ? "bg-white text-emerald-800 ring-1 ring-black/5" : "text-gray-500 hover:text-gray-900 hover:bg-white/50 shadow-none"}`}>{opt}</button>
                    ))}
                </div>

                {marketOptions.length > 0 && (
                    <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-xl">
                        <span className="text-xs font-bold text-stone-400 uppercase ml-2 mr-1">Market:</span>
                        <select
                            value={selectedMarket}
                            onChange={(e) => setSelectedMarket(e.target.value)}
                            className="bg-white text-sm font-bold text-stone-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm border-r-8 border-transparent"
                        >
                            {marketOptions.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {trendAnalysis && (
                <div className="grid md:grid-cols-2 gap-8">
                    <div className={`rounded-[2.5rem] p-8 border-2 ${trendAnalysis.colorClass} shadow-sm relative overflow-hidden flex flex-col justify-between`}>
                        <div className="absolute top-0 right-0 p-6 opacity-10 transform scale-150 origin-top-right">{trendAnalysis.icon}</div>
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-white/60 p-2 rounded-full backdrop-blur-sm shadow-sm">{trendAnalysis.icon}</div>
                                <span className="font-bold text-sm uppercase tracking-widest opacity-80">{trendAnalysis.status} Trend</span>
                            </div>
                            <h2 className="text-3xl font-bold leading-tight mb-2">{trendAnalysis.message}</h2>
                            <p className="text-lg opacity-80 font-medium italic">"{trendAnalysis.swahili}"</p>
                        </div>
                        <div className="mt-8 pt-8 border-t border-black/5 grid grid-cols-2 gap-4">
                            <div className="bg-white/50 rounded-2xl p-4">
                                <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">Today</p>
                                <p className="text-2xl font-bold">KES {trendAnalysis.currentPrice.toFixed(0)}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-white/50">
                                <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">Forecast</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-2xl font-bold">KES {trendAnalysis.predictedPrice.toFixed(0)}</p>
                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${trendAnalysis.diff > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{trendAnalysis.diff > 0 ? '+' : ''}{trendAnalysis.percentChange}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Visual Price Path</h3>
                            <span className="text-xs font-bold bg-stone-100 text-stone-500 px-3 py-1 rounded-full">Past 7 Days → Next Week</span>
                        </div>

                        <div className="flex items-center justify-between px-4 mb-8">
                            <div className="text-center">
                                <p className="text-xs text-stone-400 font-bold uppercase">Start</p>
                                <p className="font-bold text-stone-600">KES {chartData[0]?.price.toFixed(0)}</p>
                            </div>
                            <ArrowRight className="w-6 h-6 text-stone-300" />
                            <div className="text-center">
                                <p className="text-xs text-stone-400 font-bold uppercase">Today</p>
                                <p className="font-bold text-stone-800">KES {trendAnalysis.currentPrice.toFixed(0)}</p>
                            </div>
                            <ArrowRight className={`w-6 h-6 ${trendAnalysis.diff > 0 ? 'text-emerald-400' : 'text-red-400'}`} />
                            <div className="text-center">
                                <p className="text-xs text-emerald-600 font-bold uppercase">Forecast</p>
                                <p className={`font-bold text-xl ${trendAnalysis.diff > 0 ? 'text-emerald-600' : 'text-red-600'}`}>KES {trendAnalysis.predictedPrice.toFixed(0)}</p>
                            </div>
                        </div>

                        <div className="flex-1 min-h-[150px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTrend" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#9ca3af" stopOpacity={0.1} />
                                            <stop offset="80%" stopColor={trendAnalysis.diff > 0 ? "#10b981" : "#ef4444"} stopOpacity={0.2} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#a8a29e', fontWeight: 'bold' }}
                                        tickFormatter={(str) => new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                    />
                                    <YAxis
                                        hide={true}
                                        domain={['auto', 'auto']}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#d6d3d1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                    <Area
                                        type="monotone"
                                        dataKey="price"
                                        stroke={trendAnalysis.diff > 0 ? "#10b981" : "#ef4444"}
                                        strokeWidth={3}
                                        fill="url(#colorTrend)"
                                        animationDuration={1500}
                                        dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: trendAnalysis.diff > 0 ? "#10b981" : "#ef4444" }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-4 italic">AI prediction based on recent market volatility.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// 5. BEST MARKET TAB (Profit Calculator)
const BestMarketTab = ({ markets, prices, onRecordSale }) => {
    const [quantity, setQuantity] = useState(1);
    const [expanded, setExpanded] = useState({});
    const toggleExpanded = (produce) => { setExpanded(prev => ({ ...prev, [produce]: !prev[produce] })); };

    const recommendations = useMemo(() => {
        if (!markets.length || !prices.length) return [];
        const uniqueProduce = [...new Set(prices.map(p => p.produce_name || p.produce).filter(Boolean))];
        return uniqueProduce.map((produce) => {
            const relevantPrices = prices.filter((p) => (p.produce_name || p.produce) === produce);
            const analysis = relevantPrices.map((priceEntry) => {
                const pMarketName = priceEntry.market_name || priceEntry.market;
                const market = markets.find((m) => m.name === pMarketName);
                if (!market) return null;
                const totalRevenue = Number(priceEntry.price) * quantity;
                const totalCost = (Number(market.transport_cost) || 0) + (Number(market.market_fee) || 0);
                const netValue = totalRevenue - totalCost;
                return { market: market.name, marketId: market.id, pricePerKg: priceEntry.price, totalCost, totalRevenue, netValue };
            }).filter(Boolean);
            analysis.sort((a, b) => b.netValue - a.netValue);
            return { produce, bestOption: analysis[0], alternatives: analysis.slice(1) };
        }).filter(rec => rec.bestOption);
    }, [markets, prices, quantity]);

    if (recommendations.length === 0) return <div className="text-center p-6 bg-white rounded-2xl border">Add Data to see recommendations.</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div className="max-w-md">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4"><DollarSign className="w-3 h-3" /> Profit Engine</div>
                        <h3 className="text-3xl font-bold mb-2 tracking-tight text-stone-800">Calculate Your Profit</h3>
                        <p className="text-stone-500 text-base leading-relaxed">Transport costs are fixed. Find the tipping point where bulk selling justifies traveling to further markets.</p>
                        <p className="text-sm font-bold text-stone-400 mt-2 italic">"Piga hesabu chagua soko."</p>
                    </div>
                    <div className="flex-shrink-0 bg-stone-50 p-6 rounded-3xl border border-stone-100 flex flex-col items-center gap-3 min-w-[200px]">
                        <label className="text-stone-400 text-xs font-bold uppercase tracking-widest">Quantity to Sell</label>
                        <div className="flex items-baseline gap-2"><input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-32 bg-transparent text-5xl font-bold text-center text-stone-900 focus:outline-none border-b-2 border-emerald-500 focus:border-emerald-600 transition-all placeholder-stone-300" /><span className="text-stone-400 text-lg font-bold">Kgs</span></div>
                    </div>
                </div>
            </div>

            <div className="grid gap-8">
                {recommendations.map((rec) => (
                    <div key={rec.produce} className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden group hover:border-emerald-200 transition-all duration-300">
                        <div className="p-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="text-sm font-bold text-emerald-600 mb-1 flex items-center gap-1">Best Market for <span className="text-stone-800 text-lg ml-1">{rec.produce}</span></p>
                                    <h2 className="text-4xl font-bold text-stone-800 tracking-tight">{rec.bestOption.market}</h2>
                                </div>
                                <div className={`px-6 py-4 rounded-3xl text-center min-w-[160px] ${rec.bestOption.netValue > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Pesa Mfukoni</p>
                                    <p className="text-2xl font-bold">KES {rec.bestOption.netValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100"><p className="text-xs font-bold text-stone-400 uppercase mb-1">Selling Price</p><p className="text-xl font-bold text-stone-900">KES {rec.bestOption.pricePerKg}<span className="text-sm font-normal text-stone-500">/kg</span></p></div>
                                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100"><p className="text-xs font-bold text-stone-400 uppercase mb-1">Gross Revenue</p><p className="text-xl font-bold text-stone-900">KES {(rec.bestOption.totalRevenue).toLocaleString()}</p></div>
                                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100"><p className="text-xs font-bold text-stone-400 uppercase mb-1">Total Cost</p><p className="text-xl font-bold text-red-600">KES {rec.bestOption.totalCost.toLocaleString()}</p></div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <button onClick={() => onRecordSale({ produce: rec.produce, market: rec.bestOption.market, marketId: rec.bestOption.marketId, quantity: quantity, pricePerKg: rec.bestOption.pricePerKg, totalRevenue: rec.bestOption.totalRevenue, profit: rec.bestOption.netValue })} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200/50 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"><Plus className="w-5 h-5" /> Record Sale</button>
                                {rec.alternatives.length > 0 && (
                                    <div><button onClick={() => toggleExpanded(rec.produce)} className="w-full flex items-center justify-between text-sm text-gray-500 hover:text-emerald-600 transition-colors group mt-2 p-2 rounded-lg hover:bg-stone-50"><span>{rec.alternatives.length} other markets analyzed</span><span className="flex items-center gap-1 font-bold">{expanded[rec.produce] ? "Hide Breakdown" : "View Breakdown"} {expanded[rec.produce] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</span></button>
                                        {expanded[rec.produce] && (
                                            <div className="mt-4 animate-in slide-in-from-top-2 duration-300 border rounded-xl overflow-hidden border-stone-100">
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full text-sm">
                                                        <thead className="bg-stone-50 text-gray-500"><tr><th className="px-4 py-3 text-left font-bold text-xs uppercase">Market</th><th className="px-4 py-3 text-right font-bold text-xs uppercase">Price/Kg</th><th className="px-4 py-3 text-right font-bold text-xs uppercase">Gross</th><th className="px-4 py-3 text-right font-bold text-xs uppercase">Costs</th><th className="px-4 py-3 text-right font-bold text-xs uppercase">Net Profit</th></tr></thead>
                                                        <tbody className="divide-y divide-gray-50">{rec.alternatives.map((alt, idx) => (<tr key={idx} className="hover:bg-gray-50/50"><td className="px-4 py-3 font-medium text-gray-900">{alt.market}</td><td className="px-4 py-3 text-right text-gray-600">{alt.pricePerKg}</td><td className="px-4 py-3 text-right text-gray-600">{alt.totalRevenue.toLocaleString()}</td><td className="px-4 py-3 text-right text-red-500">-{alt.totalCost.toLocaleString()}</td><td className={`px-4 py-3 text-right font-bold ${alt.netValue > 0 ? 'text-emerald-600' : 'text-red-600'}`}>{alt.netValue.toLocaleString()}</td></tr>))}</tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 6. REPORTS (SALES HISTORY) TAB
const SalesHistory = ({ sales, onDeleteSale }) => {
    const totalRevenue = sales.reduce((acc, sale) => acc + Number(sale.total_revenue || 0), 0);
    const totalVolume = sales.reduce((acc, sale) => acc + Number(sale.volume_sold || 0), 0);
    if (sales.length === 0) return <div className="text-center p-16 bg-white rounded-3xl border border-dashed border-stone-200"><h3 className="text-xl font-bold text-stone-900">No Sales Recorded Yet</h3></div>;
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-900 text-white p-8 rounded-[2rem] shadow-xl"><p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-2">Total Net Profit</p><h3 className="text-4xl font-black">KES {totalRevenue.toLocaleString()}</h3></div>
                <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm"><p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Total Volume</p><h3 className="text-4xl font-black text-gray-800">{totalVolume.toLocaleString()} Kgs</h3></div>
                <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm"><p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Transactions</p><h3 className="text-4xl font-black text-gray-800">{sales.length}</h3></div>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full"><thead className="bg-stone-50/80 backdrop-blur-sm"><tr><th className="px-8 py-5 text-left text-xs font-black text-stone-400 uppercase tracking-widest">Date</th><th className="px-8 py-5 text-left text-xs font-black text-stone-400 uppercase tracking-widest">Produce</th><th className="px-8 py-5 text-left text-xs font-black text-stone-400 uppercase tracking-widest">Market</th><th className="px-8 py-5 text-right text-xs font-black text-stone-400 uppercase tracking-widest">Revenue</th><th className="px-8 py-5 text-center text-xs font-black text-stone-400 uppercase tracking-widest">Action</th></tr></thead>
                        <tbody className="divide-y divide-stone-100">
                            {sales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-emerald-50/40 transition-colors group">
                                    <td className="px-8 py-5 text-sm font-bold text-stone-500">{sale.date}</td>
                                    <td className="px-8 py-5 font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">{sale.produce}</td>
                                    <td className="px-8 py-5 text-sm font-medium text-stone-600">{sale.market_sold_to}</td>
                                    <td className="px-8 py-5 text-sm text-right font-black text-emerald-600">+ {Number(sale.total_revenue).toLocaleString()}</td>
                                    <td className="px-8 py-5 text-center"><button onClick={() => onDeleteSale(sale.id)} className="text-stone-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                                </tr>
                            ))}
                        </tbody></table>
                </div>
            </div>
        </div>
    );
};

// 7. ABOUT TAB
const AboutTab = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
        {/* Header Section */}
        <div className="bg-emerald-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-xl shadow-emerald-900/20">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

            <div className="relative z-10">
                <div className="bg-white/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/10 shadow-lg">
                    <BarChart2 className="w-12 h-12 text-emerald-300" />
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Ushauri Soko</h2>
                <p className="text-emerald-100/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                    Empowering farmers with data-driven market intelligence. We bridge the gap between farm and market, ensuring you always get the best price for your produce.
                </p>
            </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 font-bold">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Price Forecasting</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                    Advanced algorithms analyze 7-day rolling averages to predict future price trends, helping you decide when to sell.
                </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4 font-bold">
                    <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Profit Engine</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                    Don't just guess. Input your quantity, and our engine calculates net profit after transport and market fees.
                </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4 font-bold">
                    <Wifi className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Data</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                    Access up-to-the-minute market prices from 50+ major markets across Kenya. Powered by reliable field data.
                </p>
            </div>
        </div>

        {/* Contact/Credits */}
        <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">Need specific market data?</h4>
                <p className="text-gray-500 text-sm">Contact the administration for custom reports and API access.</p>
            </div>
            <div className="flex items-center gap-4 text-sm font-bold text-gray-400 bg-white px-6 py-3 rounded-xl border border-stone-200 shadow-sm">
                <span>Version 1.2.0</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>Mama Ngina University</span>
            </div>
        </div>
    </div>
);

// --- MAIN APP ---
function App() {
    const [token, setToken] = useState(sessionStorage.getItem('access_token'));
    const [user, setUser] = useState(sessionStorage.getItem('username'));
    const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem('is_staff') === 'true');
    const [activeTab, setActiveTab] = useState("dashboard");
    const [markets, setMarkets] = useState([]);
    const [prices, setPrices] = useState([]);
    const [logs, setLogs] = useState([]);
    const [sales, setSales] = useState([]);
    const [forecasts, setForecasts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUsingRealData, setIsUsingRealData] = useState(false);
    const [showLanding, setShowLanding] = useState(!token);

    const openRecordSaleModal = (data) => { setModalData(data); setIsModalOpen(true); };
    const handleLogin = (accessToken, username, isStaff) => {
        sessionStorage.setItem('access_token', accessToken);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('is_staff', isStaff);

        setToken(accessToken);
        setUser(username);
        setIsAdmin(isStaff);
        setShowLanding(false);
    };
    const handleLogout = () => {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('is_staff');

        setToken(null);
        setUser(null);
        setIsAdmin(false);
        setShowLanding(true);
    };

    const deleteSale = async (id) => {
        if (!window.confirm("Delete this sale?")) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/salesrecords/${id}/`, {
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) { setSales(sales.filter(s => s.id !== id)); alert("Deleted."); }
        } catch (e) { alert("Error deleting."); }
    };

    useEffect(() => {
        if (!token) return;
        const fetchData = async () => {
            setLoading(true);
            const headers = { 'Authorization': `Bearer ${token}` };
            try {
                const [mRes, pRes, lRes, sRes, fRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/markets/`, { headers }),
                    fetch(`${API_BASE_URL}/api/latest-prices/`, { headers }),
                    fetch(`${API_BASE_URL}/api/pricelogs/`, { headers }),
                    fetch(`${API_BASE_URL}/api/salesrecords/`, { headers }),
                    fetch(`${API_BASE_URL}/api/forecasts/`, { headers })
                ]);

                if (mRes.status === 401) { handleLogout(); return; }

                if (mRes.ok) {
                    setMarkets(await mRes.json());
                    setPrices(await pRes.json());
                    setLogs(await lRes.json());
                    setSales(await sRes.json());
                    setForecasts(await fRes.json());
                    setIsUsingRealData(true);
                }
            } catch (err) { console.warn("Fetch error", err); } finally { setLoading(false); }
        };
        fetchData();
    }, [token]);

    if (showLanding && !token) return <LandingPage onLoginClick={() => setShowLanding(false)} />;
    if (!token && !showLanding) return <LoginScreen onLogin={handleLogin} />;

    // NEW: Admin Dashboard Render
    if (isAdmin) {
        return <AdminDashboard token={token} onLogout={handleLogout} />;
    }

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-gray-800 pb-20 relative">
            <RecordSaleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} saleData={modalData} token={token} />
            <nav className="bg-white sticky top-0 z-30 border-b border-stone-100/80 backdrop-blur-md bg-white/90">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
                        <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-lg shadow-emerald-200/50"><BarChart2 className="w-6 h-6" /></div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xl text-stone-800 tracking-tight leading-none">Ushauri Soko</span>
                            <span className="text-emerald-600 text-xs font-bold tracking-wide uppercase mt-0.5">Market Intelligence</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${isUsingRealData ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-orange-50 border-orange-100 text-orange-700"}`}>
                            {isUsingRealData ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />} {isUsingRealData ? "Live Database" : "Demo Mode"}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-stone-700"><div className="bg-stone-100 p-2 rounded-full text-stone-500"><User className="w-4 h-4" /></div><span className="hidden sm:block">{user}</span></div>
                        <button onClick={handleLogout} className="text-stone-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50" title="Logout"><LogOut className="w-5 h-5" /></button>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex justify-center mb-12">
                    <div className="bg-white p-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-100 inline-flex items-center gap-1 overflow-x-auto max-w-full">
                        <div className="bg-white p-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-100 inline-flex items-center gap-1 overflow-x-auto max-w-full">
                            {["dashboard", "markets", "prices", "trends", "best market", "reports", "about"].map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 text-sm font-bold rounded-full transition-all duration-300 whitespace-nowrap flex flex-col items-center leading-none gap-1 ${activeTab === tab ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'}`}>
                                    <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                                    {tab === "dashboard" && <span className="text-[9px] opacity-70 font-normal">Nyumbani</span>}
                                    {tab === "markets" && <span className="text-[9px] opacity-70 font-normal">Soko</span>}
                                    {tab === "prices" && <span className="text-[9px] opacity-70 font-normal">Bei</span>}
                                    {tab === "trends" && <span className="text-[9px] opacity-70 font-normal">Mwelekeo</span>}
                                    {tab === "best market" && <span className="text-[9px] opacity-70 font-normal">Faida</span>}
                                    {tab === "reports" && <span className="text-[9px] opacity-70 font-normal">Ripoti</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {activeTab === "dashboard" && (
                    <div className="space-y-8">
                        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight mb-2">AI Market Assistant</h2>
                                    <p className="text-emerald-100/80 max-w-xl text-sm md:text-base">We've analyzed recent trends to give you actionable advice. Check the forecast before you sell.</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest animate-pulse">
                                    Live Analysis
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        </div>
                        <SellHoldAdvisor token={token} />
                        <DashboardTab markets={markets} prices={prices} sales={sales} forecasts={forecasts} logs={logs} />
                    </div>
                )}
                {activeTab === "markets" && <MarketsTab markets={markets} loading={loading} />}
                {activeTab === "prices" && <PricesTab prices={prices} loading={loading} />}
                {activeTab === "trends" && <TrendsTab logs={logs} forecasts={forecasts} />}
                {activeTab === "best market" && <BestMarketTab markets={markets} prices={prices} onRecordSale={openRecordSaleModal} />}
                {activeTab === "reports" && (
                    <div className="space-y-8">
                        <ReportsDashboard token={token} />
                        <SalesHistory sales={sales} onDeleteSale={deleteSale} />
                    </div>
                )}
                {activeTab === "about" && <AboutTab />}
            </main>
        </div>
    );
}

export default App;





