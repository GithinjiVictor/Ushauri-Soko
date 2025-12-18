import React, { useEffect, useState, useMemo } from "react";
// Import Recharts (Removed unused LineChart imports)
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
            <div className="bg-emerald-600 p-2 rounded-lg text-white"><BarChart2 className="w-6 h-6" /></div>
            <span className="font-black text-xl text-gray-900 tracking-tight">Ushauri Soko</span>
        </div>
        <button onClick={onLoginClick} className="px-6 py-2.5 bg-white border border-stone-200 text-stone-700 font-bold rounded-full hover:bg-stone-100 transition-colors shadow-sm">
            Login
        </button>
      </nav>

      <div className="flex-1 flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto mt-6">
        <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-6">Market Intelligence Platform</span>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
            Know the Price.<br/><span className="text-emerald-600">Sell for Profit.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">
            Ushauri Soko gives farmers clear, actionable advice on where to sell produce to maximize net income after transport costs.
        </p>
        <div className="flex gap-4 flex-col sm:flex-row">
            <button onClick={onLoginClick} className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-full text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-transform active:scale-95 flex items-center justify-center gap-2">
                Get Started <ArrowUpRight className="w-5 h-5"/>
            </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full px-6 py-20">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <div className="bg-orange-50 w-14 h-14 rounded-2xl flex items-center justify-center text-orange-600 mb-6"><TrendingUp className="w-7 h-7"/></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Price Trends</h3>
              <p className="text-gray-500">Know if prices are rising or falling before you harvest.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 mb-6"><MapPin className="w-7 h-7"/></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Best Market Finder</h3>
              <p className="text-gray-500">We calculate transport fees to show you the <b>real</b> best market.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-600 mb-6"><Briefcase className="w-7 h-7"/></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Profit Ledger</h3>
              <p className="text-gray-500">Track your sales and revenue. Move away from paper notebooks.</p>
          </div>
      </div>
      
      <div className="text-center pb-8 text-gray-400 text-sm">
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
      if (response.ok) { onLogin(data.access, username); } else { setError("Invalid username or password"); }
    } catch (err) { setError("Server connection failed. Is Django running?"); } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-8 border border-stone-100">
        <div className="text-center mb-8">
          <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600"><BarChart2 className="w-8 h-8" /></div>
          <h1 className="text-2xl font-black text-gray-900">Ushauri Soko</h1>
          <p className="text-gray-500 text-sm mt-1">Market Intelligence Login</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2"><label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Username</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 border focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all font-medium text-gray-800" placeholder="Enter your username" required /></div>
          <div className="space-y-2"><label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 border focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all font-medium text-gray-800" placeholder="••••••••" required /></div>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium flex items-center gap-2"><X className="w-4 h-4" /> {error}</div>}
          <button type="submit" disabled={isLoading} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2">{isLoading ? "Signing in..." : "Login"}</button>
        </form>
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
          <div className="bg-emerald-50 p-4 rounded-xl flex justify-between"><span className="text-sm font-bold text-emerald-800">Net Profit</span><span className="text-xl font-black text-emerald-700">KES {Number(saleData.profit).toLocaleString()}</span></div>
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
            const productLogs = logs.filter(l => (l.produce_name || l.produce) === prod).sort((a,b) => new Date(b.date) - new Date(a.date));
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
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Market Alert</p>
                    {topMarket ? (
                        <div>
                             <p className="text-sm text-gray-500">Highest price today:</p>
                             <p className="text-xl font-black text-gray-900 mt-1">{topMarket.market_name}</p>
                             <p className="text-emerald-600 font-bold text-sm">KES {Number(topMarket.price).toFixed(0)} ({topMarket.produce_name})</p>
                        </div>
                    ) : <p className="text-gray-400">Loading...</p>}
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
                                    {insight.status === 'rising' ? <TrendingUp className="w-6 h-6"/> : insight.status === 'falling' ? <TrendingDown className="w-6 h-6"/> : <Minus className="w-6 h-6"/>}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{insight.produce}</h4>
                                    <p className="text-sm text-gray-500">
                                        {insight.status === 'rising' ? "Prices likely to rise." : insight.status === 'falling' ? "Prices dropping soon." : "Prices stable."}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-gray-400 font-bold uppercase">Forecast</p>
                                <p className={`text-xl font-black ${insight.change > 0 ? 'text-emerald-600' : insight.change < 0 ? 'text-red-600' : 'text-yellow-600'}`}>
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
        <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 flex flex-col relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Truck className="w-16 h-16 text-emerald-800" /></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-700"><MapPin className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-gray-800">{m.name}</h3>
            </div>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between p-2 bg-stone-50 rounded-lg"><span className="text-gray-500 font-medium">Transport Cost</span><span className="font-bold text-gray-900">KES {Number(m.transport_cost).toLocaleString()}</span></div>
                <div className="flex justify-between p-2 bg-stone-50 rounded-lg"><span className="text-gray-500 font-medium">Market Fee</span><span className="font-bold text-gray-900">KES {Number(m.market_fee).toLocaleString()}</span></div>
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(grouped).map(([prod, items]) => (
                <div key={prod} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                    <div className="flex items-center gap-3 mb-4 pb-2 border-b border-stone-100">
                        <div className="bg-orange-50 p-2 rounded-lg text-orange-600"><ShoppingCart className="w-5 h-5"/></div>
                        <h3 className="font-bold text-lg text-gray-800">{prod}</h3>
                    </div>
                    {items.map((i, idx) => (
                        <div key={idx} className="flex justify-between text-sm py-3 border-b border-gray-50 last:border-0 hover:bg-stone-50 px-2 rounded-lg transition-colors">
                            <span className="text-gray-600 font-medium">{i.market_name}</span>
                            <span className="font-bold text-gray-900 bg-emerald-50 px-2 py-0.5 rounded text-emerald-700">KES {Number(i.price).toFixed(0)}</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    </div>
  );
};

// 4. TRENDS TAB (Chart-Lite)
const TrendsTab = ({ logs, forecasts }) => {
  const [selectedProduce, setSelectedProduce] = useState("");
  const produceOptions = useMemo(() => [...new Set(logs.map(l => l.produce_name || l.produce))].filter(Boolean), [logs]);
  
  useEffect(() => { 
    if (produceOptions.length > 0 && !selectedProduce) setSelectedProduce(produceOptions[0]); 
  }, [produceOptions, selectedProduce]);

  // Determine trend status based on forecast
  const trendAnalysis = useMemo(() => {
    if (!selectedProduce) return null;

    // Get current price (most recent log)
    const productLogs = logs.filter(l => (l.produce_name || l.produce) === selectedProduce)
                            .sort((a, b) => new Date(b.date) - new Date(a.date));
    const currentLog = productLogs[0];
    const currentPrice = currentLog ? Number(currentLog.price) : 0;
    
    // Get forecast price
    const productForecast = (forecasts || []).find(f => f.produce === selectedProduce);
    const predictedPrice = productForecast ? Number(productForecast.predicted_price) : 0;
    // Handle date format differences (ISO vs YYYY-MM-DD)
    const forecastDate = productForecast && productForecast.date ? productForecast.date.split('T')[0] : "Next Week";

    if (!currentPrice || !predictedPrice) return null;

    const diff = predictedPrice - currentPrice;
    const percentChange = ((diff / currentPrice) * 100).toFixed(1);
    
    let status = "Stable";
    let colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
    let icon = <Minus className="w-8 h-8" />;
    let message = `${selectedProduce} prices are STABLE.`;
    let subMessage = "No major changes expected.";
    let swahili = "Bei imetulia.";

    if (percentChange > 1) {
        status = "Rising";
        colorClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
        icon = <TrendingUp className="w-8 h-8 text-emerald-600" />;
        message = `${selectedProduce} prices are RISING. Good time to sell!`;
        subMessage = "High demand expected next week.";
        swahili = "Bei zinapanda wiki ijayo.";
    } else if (percentChange < -1) {
        status = "Falling";
        colorClass = "bg-red-100 text-red-800 border-red-200";
        icon = <TrendingDown className="w-8 h-8 text-red-600" />;
        message = `${selectedProduce} prices are FALLING.`;
        subMessage = "Consider holding stock if possible.";
        swahili = "Bei zinashuka wiki ijayo.";
    }

    return { 
        currentPrice, 
        predictedPrice, 
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
  }, [logs, forecasts, selectedProduce]);

  // Simplified Sparkline Data
  const chartData = useMemo(() => {
    if (!selectedProduce) return [];
    const productLogs = logs.filter(l => (l.produce_name || l.produce) === selectedProduce)
                            .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Take last 7 days only
    const recentLogs = productLogs.slice(0, 7).reverse().map(log => ({
        date: log.date,
        price: Number(log.price),
        type: 'history'
    }));

    if (trendAnalysis && trendAnalysis.predictedPrice) {
        recentLogs.push({
            date: trendAnalysis.forecastDate,
            price: trendAnalysis.predictedPrice,
            type: 'forecast'
        });
    }
    return recentLogs;
  }, [logs, trendAnalysis, selectedProduce]);

  if (logs.length === 0) return <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-dashed border-stone-200">No historical data available.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap gap-2 p-1.5 bg-stone-100 rounded-xl w-fit">
        {produceOptions.map(opt => (
            <button key={opt} onClick={() => setSelectedProduce(opt)} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${selectedProduce === opt ? "bg-white text-emerald-800 ring-1 ring-black/5" : "text-gray-500 hover:text-gray-900 hover:bg-white/50 shadow-none"}`}>{opt}</button>
        ))}
      </div>

      {trendAnalysis && (
      <div className="grid md:grid-cols-2 gap-8">
          <div className={`rounded-[2.5rem] p-8 border-2 ${trendAnalysis.colorClass} shadow-sm relative overflow-hidden flex flex-col justify-between`}>
              <div className="absolute top-0 right-0 p-6 opacity-10 transform scale-150 origin-top-right">{trendAnalysis.icon}</div>
              <div>
                  <div className="flex items-center gap-2 mb-4">
                      <div className="bg-white/60 p-2 rounded-full backdrop-blur-sm shadow-sm">{trendAnalysis.icon}</div>
                      <span className="font-black text-sm uppercase tracking-widest opacity-80">{trendAnalysis.status} Trend</span>
                  </div>
                  <h2 className="text-3xl font-black leading-tight mb-2">{trendAnalysis.message}</h2>
                  <p className="text-lg opacity-80 font-medium italic">"{trendAnalysis.swahili}"</p>
              </div>
              <div className="mt-8 pt-8 border-t border-black/5 grid grid-cols-2 gap-4">
                  <div className="bg-white/50 rounded-2xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">Today</p>
                      <p className="text-2xl font-black">KES {trendAnalysis.currentPrice.toFixed(0)}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-white/50">
                      <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">Forecast</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-black">KES {trendAnalysis.predictedPrice.toFixed(0)}</p>
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
                        <p className="text-xs text-gray-400 font-bold uppercase">Start</p>
                        <p className="font-bold text-gray-600">KES {chartData[0]?.price.toFixed(0)}</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-stone-300" />
                    <div className="text-center">
                        <p className="text-xs text-gray-400 font-bold uppercase">Today</p>
                        <p className="font-bold text-gray-800">KES {trendAnalysis.currentPrice.toFixed(0)}</p>
                    </div>
                    <ArrowRight className={`w-6 h-6 ${trendAnalysis.diff > 0 ? 'text-emerald-400' : 'text-red-400'}`} />
                    <div className="text-center">
                        <p className="text-xs text-emerald-600 font-bold uppercase">Forecast</p>
                        <p className={`font-black text-xl ${trendAnalysis.diff > 0 ? 'text-emerald-600' : 'text-red-600'}`}>KES {trendAnalysis.predictedPrice.toFixed(0)}</p>
                    </div>
               </div>

               <div className="flex-1 min-h-[150px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorTrend" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#9ca3af" stopOpacity={0.1}/>
                                <stop offset="80%" stopColor={trendAnalysis.diff > 0 ? "#10b981" : "#ef4444"} stopOpacity={0.2}/>
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="price" stroke={trendAnalysis.diff > 0 ? "#10b981" : "#ef4444"} strokeWidth={4} fill="url(#colorTrend)" animationDuration={1500}/>
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
                <h3 className="text-3xl font-black mb-2 tracking-tight text-gray-900">Calculate Your Profit</h3>
                <p className="text-gray-500 text-base leading-relaxed">Transport costs are fixed. Find the tipping point where bulk selling justifies traveling to further markets.</p>
            </div>
            <div className="flex-shrink-0 bg-stone-50 p-6 rounded-2xl border border-stone-100 flex flex-col items-center gap-3 min-w-[200px]">
                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">Quantity to Sell</label>
                <div className="flex items-baseline gap-2"><input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-32 bg-transparent text-5xl font-black text-center text-gray-900 focus:outline-none border-b-2 border-emerald-500 focus:border-emerald-600 transition-all placeholder-gray-300" /><span className="text-gray-400 text-lg font-bold">Kgs</span></div>
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
                            <p className="text-sm font-bold text-emerald-600 mb-1 flex items-center gap-1">Best Market for <span className="text-gray-900 text-lg ml-1">{rec.produce}</span></p>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tight">{rec.bestOption.market}</h2>
                        </div>
                        <div className={`px-6 py-4 rounded-2xl text-center min-w-[160px] ${rec.bestOption.netValue > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Net Profit</p>
                            <p className="text-2xl font-black">KES {rec.bestOption.netValue.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100"><p className="text-xs font-bold text-gray-400 uppercase mb-1">Selling Price</p><p className="text-xl font-bold text-gray-900">KES {rec.bestOption.pricePerKg}<span className="text-sm font-normal text-gray-500">/kg</span></p></div>
                        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100"><p className="text-xs font-bold text-gray-400 uppercase mb-1">Gross Revenue</p><p className="text-xl font-bold text-gray-900">KES {(rec.bestOption.totalRevenue).toLocaleString()}</p></div>
                        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100"><p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Cost</p><p className="text-xl font-bold text-red-600">KES {rec.bestOption.totalCost.toLocaleString()}</p></div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <button onClick={() => onRecordSale({ produce: rec.produce, market: rec.bestOption.market, marketId: rec.bestOption.marketId, quantity: quantity, pricePerKg: rec.bestOption.pricePerKg, totalRevenue: rec.bestOption.totalRevenue, profit: rec.bestOption.netValue })} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200/50 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"><Plus className="w-5 h-5"/> Record Sale</button>
                        {rec.alternatives.length > 0 && (
                            <div><button onClick={() => toggleExpanded(rec.produce)} className="w-full flex items-center justify-between text-sm text-gray-500 hover:text-emerald-600 transition-colors group mt-2 p-2 rounded-lg hover:bg-stone-50"><span>{rec.alternatives.length} other markets analyzed</span><span className="flex items-center gap-1 font-bold">{expanded[rec.produce] ? "Hide Breakdown" : "View Breakdown"} {expanded[rec.produce] ? <ChevronDown className="w-4 h-4"/> : <ChevronRight className="w-4 h-4"/>}</span></button>
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
  if (sales.length === 0) return <div className="text-center p-16 bg-white rounded-3xl border border-dashed border-gray-300"><h3 className="text-xl font-bold text-gray-900">No Sales Recorded Yet</h3></div>;
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-900 text-white p-8 rounded-[2rem] shadow-xl"><p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-2">Total Net Profit</p><h3 className="text-4xl font-black">KES {totalRevenue.toLocaleString()}</h3></div>
            <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm"><p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Total Volume</p><h3 className="text-4xl font-black text-gray-800">{totalVolume.toLocaleString()} Kgs</h3></div>
            <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm"><p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Transactions</p><h3 className="text-4xl font-black text-gray-800">{sales.length}</h3></div>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="min-w-full"><thead className="bg-stone-50/50"><tr><th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase">Date</th><th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase">Produce</th><th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase">Market</th><th className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase">Revenue</th><th className="px-8 py-5 text-center text-xs font-bold text-gray-400 uppercase">Action</th></tr></thead>
            <tbody className="divide-y divide-stone-100">
                {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="px-8 py-5 text-sm text-gray-500">{sale.date}</td>
                        <td className="px-8 py-5 font-bold text-gray-800">{sale.produce}</td>
                        <td className="px-8 py-5 text-sm text-gray-600">{sale.market_sold_to}</td>
                        <td className="px-8 py-5 text-sm text-right font-black text-emerald-600">+ {Number(sale.total_revenue).toLocaleString()}</td>
                        <td className="px-8 py-5 text-center"><button onClick={() => onDeleteSale(sale.id)} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full"><Trash2 className="w-4 h-4"/></button></td>
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
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm text-center">
            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600"><BarChart2 className="w-10 h-10"/></div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Ushauri Soko</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
                A data-driven decision support system designed to help Kenyan smallholder farmers maximize profits. 
                We use historical data, real-time prices, and transport costs to recommend the best market for your produce.
            </p>
            <div className="flex justify-center gap-4 text-sm font-bold text-gray-400">
                <span>v1.0.0</span>
                <span>•</span>
                <span>Mama Ngina University</span>
            </div>
        </div>
    </div>
);

// --- MAIN APP ---
function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [user, setUser] = useState(localStorage.getItem('username'));
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
  const handleLogin = (accessToken, username) => {
    localStorage.setItem('access_token', accessToken); localStorage.setItem('username', username);
    setToken(accessToken); setUser(username);
    setShowLanding(false);
  };
  const handleLogout = () => {
    localStorage.removeItem('access_token'); localStorage.removeItem('username');
    setToken(null); setUser(null);
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
        
        if(mRes.status === 401) { handleLogout(); return; }

        if(mRes.ok) {
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

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-gray-800 pb-20 relative">
      <RecordSaleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} saleData={modalData} token={token} />
      <nav className="bg-white sticky top-0 z-30 border-b border-stone-100/80 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
                <div className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-600/20"><BarChart2 className="w-6 h-6" /></div>
                <div className="flex flex-col">
                    <span className="font-black text-xl text-gray-900 tracking-tight leading-none">Ushauri Soko</span>
                    <span className="text-emerald-600 text-xs font-bold tracking-wide uppercase mt-0.5">Market Intelligence</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${isUsingRealData ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-orange-50 border-orange-100 text-orange-700"}`}>
                  {isUsingRealData ? <Wifi className="w-3.5 h-3.5"/> : <WifiOff className="w-3.5 h-3.5"/>} {isUsingRealData ? "Live Database" : "Demo Mode"}
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-700"><div className="bg-stone-100 p-2 rounded-full text-gray-500"><User className="w-4 h-4"/></div><span className="hidden sm:block">{user}</span></div>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50" title="Logout"><LogOut className="w-5 h-5"/></button>
            </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-center mb-12">
            <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-stone-100 inline-flex items-center gap-1 overflow-x-auto max-w-full">
                {["dashboard", "markets", "prices", "trends", "best market", "reports", "about"].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 whitespace-nowrap ${activeTab === tab ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-gray-500 hover:bg-stone-50 hover:text-gray-900'}`}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>
        </div>
        
        {activeTab === "dashboard" && <DashboardTab markets={markets} prices={prices} sales={sales} forecasts={forecasts} logs={logs} />}
        {activeTab === "markets" && <MarketsTab markets={markets} loading={loading} />}
        {activeTab === "prices" && <PricesTab prices={prices} loading={loading} />}
        {activeTab === "trends" && <TrendsTab logs={logs} forecasts={forecasts} />}
        {activeTab === "best market" && <BestMarketTab markets={markets} prices={prices} onRecordSale={openRecordSaleModal} />}
        {activeTab === "reports" && <SalesHistory sales={sales} onDeleteSale={deleteSale} />}
        {activeTab === "about" && <AboutTab />}
      </main>
    </div>
  );
}

export default App;





// import React, { useEffect, useState, useMemo } from "react";
// // Import Recharts
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// // --- INLINE ICONS ---
// const Icon = ({ children, className }) => (
//   <svg 
//     xmlns="http://www.w3.org/2000/svg" 
//     viewBox="0 0 24 24" 
//     fill="none" 
//     stroke="currentColor" 
//     strokeWidth="2" 
//     strokeLinecap="round" 
//     strokeLinejoin="round" 
//     className={className}
//   >
//     {children}
//   </svg>
// );

// const TrendingUp = ({ className }) => (
//   <Icon className={className}>
//     <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
//     <polyline points="17 6 23 6 23 12" />
//   </Icon>
// );

// const MapPin = ({ className }) => (
//   <Icon className={className}>
//     <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
//     <circle cx="12" cy="10" r="3" />
//   </Icon>
// );

// const DollarSign = ({ className }) => (
//   <Icon className={className}>
//     <line x1="12" y1="1" x2="12" y2="23" />
//     <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
//   </Icon>
// );

// const BarChart2 = ({ className }) => (
//   <Icon className={className}>
//     <line x1="18" y1="20" x2="18" y2="10" />
//     <line x1="12" y1="20" x2="12" y2="4" />
//     <line x1="6" y1="20" x2="6" y2="14" />
//   </Icon>
// );

// const ShoppingCart = ({ className }) => (
//   <Icon className={className}>
//     <circle cx="9" cy="21" r="1" />
//     <circle cx="20" cy="21" r="1" />
//     <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
//   </Icon>
// );

// const Truck = ({ className }) => (
//   <Icon className={className}>
//     <rect x="1" y="3" width="15" height="13" />
//     <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
//     <circle cx="5.5" cy="18.5" r="2.5" />
//     <circle cx="18.5" cy="18.5" r="2.5" />
//   </Icon>
// );

// const Wifi = ({ className }) => (
//   <Icon className={className}>
//     <path d="M5 12.55a11 11 0 0 1 14.08 0" />
//     <path d="M1.42 9a16 16 0 0 1 21.16 0" />
//     <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
//     <line x1="12" y1="20" x2="12.01" y2="20" />
//   </Icon>
// );

// const WifiOff = ({ className }) => (
//   <Icon className={className}>
//     <line x1="1" y1="1" x2="23" y2="23" />
//     <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
//     <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
//     <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
//     <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
//     <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
//     <line x1="12" y1="20" x2="12.01" y2="20" />
//   </Icon>
// );

// const ChevronRight = ({ className }) => (
//   <Icon className={className}>
//     <polyline points="9 18 15 12 9 6" />
//   </Icon>
// );

// const ChevronDown = ({ className }) => (
//   <Icon className={className}>
//     <polyline points="6 9 12 15 18 9" />
//   </Icon>
// );

// const CheckCircle = ({ className }) => (
//   <Icon className={className}>
//     <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//     <polyline points="22 4 12 14.01 9 11.01" />
//   </Icon>
// );

// const Plus = ({ className }) => (
//   <Icon className={className}>
//     <line x1="12" y1="5" x2="12" y2="19" />
//     <line x1="5" y1="12" x2="19" y2="12" />
//   </Icon>
// );

// const X = ({ className }) => (
//   <Icon className={className}>
//     <line x1="18" y1="6" x2="6" y2="18" />
//     <line x1="6" y1="6" x2="18" y2="18" />
//   </Icon>
// );

// const Briefcase = ({ className }) => (
//   <Icon className={className}>
//     <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
//     <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
//   </Icon>
// );

// const Trash2 = ({ className }) => (
//   <Icon className={className}>
//     <polyline points="3 6 5 6 21 6" />
//     <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
//     <line x1="10" y1="11" x2="10" y2="17" />
//     <line x1="14" y1="11" x2="14" y2="17" />
//   </Icon>
// );

// const LogOut = ({ className }) => (
//   <Icon className={className}>
//     <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//     <polyline points="16 17 21 12 16 7" />
//     <line x1="21" y1="12" x2="9" y2="12" />
//   </Icon>
// );

// const User = ({ className }) => (
//   <Icon className={className}>
//     <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//     <circle cx="12" cy="7" r="4" />
//   </Icon>
// );

// // --- MOCK DATA ---
// const MOCK_MARKETS = [
//   { id: 1, name: "Demo Market A", transport_cost: 500, market_fee: 50 },
//   { id: 2, name: "Demo Market B", transport_cost: 300, market_fee: 30 },
// ];
// const MOCK_PRICES = [
//   { id: 1, market_name: "Demo Market A", produce_name: "Demo Tomatoes", price: 120 },
//   { id: 2, market_name: "Demo Market B", produce_name: "Demo Tomatoes", price: 110 },
// ];

// // --- LOGIN COMPONENT ---
// const LoginScreen = ({ onLogin }) => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/token/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         onLogin(data.access, username);
//       } else {
//         setError("Invalid username or password");
//       }
//     } catch (err) {
//       setError("Server connection failed. Is Django running?");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
//       <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-8 border border-stone-100">
//         <div className="text-center mb-8">
//           <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
//             <BarChart2 className="w-8 h-8" />
//           </div>
//           <h1 className="text-2xl font-black text-gray-900">Ushauri Soko</h1>
//           <p className="text-gray-500 text-sm mt-1">Market Intelligence Login</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Username</label>
//             <input 
//               type="text" 
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 border focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all font-medium text-gray-800"
//               placeholder="Enter your username"
//               required
//             />
//           </div>
          
//           <div className="space-y-2">
//             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
//             <input 
//               type="password" 
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 border focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all font-medium text-gray-800"
//               placeholder="••••••••"
//               required
//             />
//           </div>

//           {error && (
//             <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium flex items-center gap-2">
//               <X className="w-4 h-4" /> {error}
//             </div>
//           )}

//           <button 
//             type="submit" 
//             disabled={isLoading}
//             className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
//           >
//             {isLoading ? "Signing in..." : "Login to Dashboard"}
//           </button>
//         </form>
        
//         <p className="text-center text-xs text-gray-400 mt-8">
//            Don't have an account? Ask your administrator.
//         </p>
//       </div>
//     </div>
//   );
// };


// // --- COMPONENTS ---

// // 1. Record Sale Modal
// const RecordSaleModal = ({ isOpen, onClose, saleData }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   if (!isOpen) return null;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//         const payload = {
//             market_sold_to: saleData.market, 
//             produce: saleData.produce, 
//             volume_sold: parseFloat(saleData.quantity),
//             actual_price_per_unit: saleData.pricePerKg,
//             total_revenue: saleData.totalRevenue,
//             date: new Date().toISOString().split('T')[0]
//         };

//         const response = await fetch("http://127.0.0.1:8000/api/salesrecords/", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//         });

//         if (response.ok) {
//             alert("✅ Success! Sale recorded.");
//             onClose();
//             window.location.reload(); 
//         } else {
//             const errData = await response.json();
//             alert("⚠️ Failed to save.\nError Details:\n" + JSON.stringify(errData, null, 2));
//         }
//     } catch (error) {
//         alert("❌ Network Error. Is Django running?");
//     } finally {
//         setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-900/40 backdrop-blur-md animate-in fade-in duration-300">
//       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
//         <div className="bg-emerald-900 p-6 text-white flex justify-between items-start">
//           <div>
//             <h3 className="text-2xl font-bold tracking-tight">Record Sale</h3>
//             <p className="text-emerald-200 text-sm mt-1">Confirm transaction details</p>
//           </div>
//           <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
//             <X className="w-5 h-5" />
//           </button>
//         </div>
        
//         <form onSubmit={handleSubmit} className="p-8 space-y-6">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Produce</label>
//               <div className="font-bold text-gray-800 bg-stone-50 p-4 rounded-xl border border-stone-100">{saleData.produce}</div>
//             </div>
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Market</label>
//               <div className="font-bold text-gray-800 bg-stone-50 p-4 rounded-xl border border-stone-100">{saleData.market}</div>
//             </div>
//           </div>

//           <div className="space-y-1.5">
//              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quantity</label>
//              <div className="font-bold text-gray-800 bg-stone-50 p-4 rounded-xl border border-stone-100 flex items-center justify-between">
//                 <span>{saleData.quantity}</span>
//                 <span className="text-xs text-gray-400">KGS</span>
//              </div>
//           </div>

//           <div className="pt-2">
//             <div className="flex justify-between items-center bg-emerald-50 p-5 rounded-2xl border border-emerald-100/50">
//               <span className="text-sm font-bold text-emerald-800">Net Profit</span>
//               <span className="text-2xl font-black text-emerald-700">KES {Number(saleData.profit).toLocaleString()}</span>
//             </div>
//           </div>

//           <div className="pt-2 flex gap-3">
//             <button 
//               type="button" 
//               onClick={onClose}
//               className="flex-1 py-3.5 font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit" 
//               disabled={isSubmitting}
//               className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
//             >
//               {isSubmitting ? <span>Saving...</span> : <><CheckCircle className="w-5 h-5" /> Confirm</>}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const MarketList = ({ markets, loading }) => {
//   if (loading) return <div className="p-12 text-center text-gray-400 font-medium">Loading markets...</div>;
//   if (markets.length === 0) return <div className="p-12 text-center text-gray-400 font-medium">No markets found.</div>;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {markets.map((m) => (
//         <div key={m.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-100 overflow-hidden flex flex-col">
//           <div className="p-6 flex-1 relative">
//             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
//                 <Truck className="w-20 h-20 text-emerald-800" />
//             </div>
            
//             <div className="flex items-center gap-3 mb-4">
//               <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
//                 <MapPin className="w-6 h-6" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-800">{m.name}</h3>
//             </div>
            
//             <div className="space-y-4">
//                 <div className="flex justify-between items-center py-2 border-b border-gray-50">
//                     <span className="text-gray-500 text-sm font-medium">Transport Cost</span>
//                     <span className="text-gray-900 font-bold bg-gray-50 px-3 py-1 rounded-full">KES {Number(m.transport_cost).toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between items-center py-2">
//                     <span className="text-gray-500 text-sm font-medium">Market Fee</span>
//                     <span className="text-gray-900 font-bold bg-gray-50 px-3 py-1 rounded-full">KES {Number(m.market_fee).toLocaleString()}</span>
//                 </div>
//             </div>
//           </div>
//           <div className="bg-stone-50 px-6 py-3 border-t border-stone-100 flex justify-between items-center">
//              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</span>
//              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
//                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Active
//              </span>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// const PricesByProduce = ({ prices, loading }) => {
//   const groupedPrices = useMemo(() => {
//     return prices.reduce((acc, item) => {
//       const produce = item.produce_name || item.produce || "Unknown Produce";
//       const market = item.market_name || item.market || "Unknown Market";
//       const price = Number(item.price) || 0;

//       if (!acc[produce]) acc[produce] = [];
//       acc[produce].push({ market, price });
//       return acc;
//     }, {});
//   }, [prices]);

//   if (loading) return <div className="p-12 text-center text-gray-400 font-medium">Loading breakdown...</div>;
//   if (Object.keys(groupedPrices).length === 0) return <div className="p-12 text-center text-gray-400 font-medium">No price data available.</div>;

//   return (
//     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//       {Object.entries(groupedPrices).map(([produce, marketData]) => (
//         <div key={produce} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 hover:border-emerald-200 transition-colors">
//           <div className="flex items-center justify-between mb-5 border-b border-gray-50 pb-3">
//             <div className="flex items-center gap-3">
//                 <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
//                     <ShoppingCart className="w-5 h-5" />
//                 </div>
//                 <h3 className="font-bold text-lg text-gray-800">{produce}</h3>
//             </div>
//             <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-md">{marketData.length} Markets</span>
//           </div>
          
//           <ul className="space-y-3">
//             {marketData.map((data, idx) => (
//               <li key={idx} className="flex justify-between items-center text-sm group">
//                 <span className="text-gray-600 font-medium">{data.market}</span>
//                 <span className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
//                   KES {data.price.toFixed(2)}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// };

// // --- UPDATED SALES HISTORY WITH DELETE ---
// const SalesHistory = ({ sales, onDeleteSale }) => {
//   const totalRevenue = sales.reduce((acc, sale) => acc + Number(sale.total_revenue || 0), 0);
//   const totalVolume = sales.reduce((acc, sale) => acc + Number(sale.volume_sold || 0), 0);

//   if (sales.length === 0) return (
//     <div className="text-center p-16 bg-white rounded-3xl border border-dashed border-gray-300">
//         <div className="bg-gray-50 p-5 rounded-full inline-block mb-4 text-gray-400"><Briefcase className="w-10 h-10"/></div>
//         <h3 className="text-xl font-bold text-gray-900">No Sales Recorded Yet</h3>
//         <p className="text-gray-500 mt-2 max-w-sm mx-auto">Go to the Dashboard and click "Record Sale" on a recommendation to start tracking your profits.</p>
//     </div>
//   );

//   return (
//     <div className="space-y-8 animate-in fade-in duration-500">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-emerald-900 text-white p-8 rounded-[2rem] shadow-xl shadow-emerald-900/10 relative overflow-hidden group">
//                 <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover:bg-emerald-500/20 transition-all duration-700"></div>
//                 <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-2">Total Net Profit</p>
//                 <h3 className="text-4xl font-black tracking-tight">KES {totalRevenue.toLocaleString()}</h3>
//                 <p className="text-emerald-400/60 text-sm mt-4 font-medium">Lifetime Earnings</p>
//             </div>
            
//             <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
//                 <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Total Volume</p>
//                 <h3 className="text-4xl font-black text-gray-800">{totalVolume.toLocaleString()} <span className="text-lg text-gray-400 font-bold">Kgs</span></h3>
//                 <div className="mt-6 flex items-center gap-2">
//                     <div className="h-2 flex-1 bg-stone-100 rounded-full overflow-hidden">
//                         <div className="h-full bg-blue-500 w-3/4 rounded-full"></div>
//                     </div>
//                     <span className="text-xs font-bold text-blue-600">Top 10%</span>
//                 </div>
//             </div>

//             <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
//                 <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Transactions</p>
//                 <h3 className="text-4xl font-black text-gray-800">{sales.length}</h3>
//                 <p className="text-emerald-600 text-sm mt-4 font-bold flex items-center gap-1">
//                     <TrendingUp className="w-4 h-4"/> +{sales.filter(s => new Date(s.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} this week
//                 </p>
//             </div>
//         </div>

//         <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
//             <div className="p-8 border-b border-stone-100 flex items-center justify-between">
//                 <div>
//                     <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
//                     <p className="text-sm text-gray-500 mt-1">Detailed log of all verified sales</p>
//                 </div>
//                 <button className="text-emerald-600 text-sm font-bold hover:bg-emerald-50 px-4 py-2 rounded-xl transition-colors">Export CSV</button>
//             </div>
//             <div className="overflow-x-auto">
//                 <table className="min-w-full">
//                     <thead className="bg-stone-50/50">
//                         <tr>
//                             <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
//                             <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Produce</th>
//                             <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Market</th>
//                             <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Qty (Kg)</th>
//                             <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Revenue</th>
//                             <th className="px-8 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-stone-100">
//                         {sales.map((sale) => (
//                             <tr key={sale.id} className="hover:bg-emerald-50/30 transition-colors group">
//                                 <td className="px-8 py-5 text-sm text-gray-500 font-medium">{sale.date}</td>
//                                 <td className="px-8 py-5">
//                                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-100">
//                                         {sale.produce}
//                                     </span>
//                                 </td>
//                                 <td className="px-8 py-5 text-sm font-bold text-gray-800">{sale.market_sold_to || sale.market}</td>
//                                 <td className="px-8 py-5 text-sm text-right font-medium text-gray-600">{sale.volume_sold || sale.quantity}</td>
//                                 <td className="px-8 py-5 text-sm text-right font-black text-emerald-600 group-hover:text-emerald-700">
//                                     + {Number(sale.total_revenue).toLocaleString()}
//                                 </td>
//                                 <td className="px-8 py-5 text-center">
//                                     <button 
//                                         onClick={() => onDeleteSale(sale.id)}
//                                         className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all"
//                                         title="Delete Sale"
//                                     >
//                                         <Trash2 className="w-4 h-4"/>
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     </div>
//   );
// };

// const PriceTrendsChart = ({ logs }) => {
//   const [selectedProduce, setSelectedProduce] = useState("");

//   const produceOptions = useMemo(() => {
//     const names = logs.map(l => l.produce_name || l.produce);
//     return [...new Set(names)].filter(Boolean);
//   }, [logs]);

//   useEffect(() => {
//     if (produceOptions.length > 0 && !selectedProduce) {
//       setSelectedProduce(produceOptions[0]);
//     }
//   }, [produceOptions, selectedProduce]);

//   const chartData = useMemo(() => {
//     if (!selectedProduce) return [];
//     const filteredLogs = logs.filter(l => (l.produce_name || l.produce) === selectedProduce);
    
//     const groupedByDate = filteredLogs.reduce((acc, log) => {
//       const date = log.date;
//       const market = log.market_name || log.market;
//       const price = Number(log.price);
//       if (!acc[date]) acc[date] = { date }; 
//       acc[date][market] = price; 
//       return acc;
//     }, {});

//     return Object.values(groupedByDate).sort((a, b) => new Date(a.date) - new Date(b.date));
//   }, [logs, selectedProduce]);

//   const marketNames = useMemo(() => {
//     if (chartData.length === 0) return [];
//     const keys = new Set();
//     chartData.forEach(item => {
//       Object.keys(item).forEach(key => {
//         if (key !== 'date') keys.add(key);
//       });
//     });
//     return Array.from(keys);
//   }, [chartData]);

//   const LINE_COLORS = ["#059669", "#2563eb", "#d97706", "#7c3aed", "#db2777", "#dc2626"];

//   if (logs.length === 0) return <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-dashed border-gray-200">No historical data available for charts.</div>;

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-wrap gap-2 p-1.5 bg-stone-100 rounded-xl w-fit">
//         {produceOptions.map(option => (
//           <button
//             key={option}
//             onClick={() => setSelectedProduce(option)}
//             className={`px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${
//               selectedProduce === option 
//               ? "bg-white text-emerald-800 ring-1 ring-black/5" 
//               : "text-gray-500 hover:text-gray-900 hover:bg-white/50 shadow-none"
//             }`}
//           >
//             {option}
//           </button>
//         ))}
//       </div>

//       <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-100 h-[500px]">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//            <div>
//               <h3 className="text-xl font-bold text-gray-900 tracking-tight">
//                   {selectedProduce} Price Trends
//               </h3>
//               <p className="text-sm text-gray-500 font-medium">Historical price fluctuation (Last 20 Days)</p>
//            </div>
//            <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
//                 <BarChart2 className="w-4 h-4"/> Market Analysis
//            </div>
//         </div>
        
//         <ResponsiveContainer width="100%" height="80%">
//           <LineChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
//             <XAxis dataKey="date" tick={{fontSize: 12, fill: '#9ca3af', fontWeight: 500}} axisLine={false} tickLine={false} dy={10} />
//             <YAxis tick={{fontSize: 12, fill: '#9ca3af', fontWeight: 500}} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}`} dx={-10}/>
//             <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px', fontFamily: 'sans-serif' }} cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }}/>
//             <Legend verticalAlign="top" height={40} iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '14px', fontWeight: 600 }} />
//             {marketNames.map((market, index) => (
//               <Line key={market} type="monotone" dataKey={market} stroke={LINE_COLORS[index % LINE_COLORS.length]} strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: LINE_COLORS[index % LINE_COLORS.length] }} animationDuration={1500}/>
//             ))}
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// const BestMarketRecommendation = ({ markets, prices, onRecordSale }) => {
//   const [quantity, setQuantity] = useState(1);
//   const [expanded, setExpanded] = useState({});

//   const toggleExpanded = (produce) => {
//     setExpanded(prev => ({ ...prev, [produce]: !prev[produce] }));
//   };

//   const recommendations = useMemo(() => {
//     if (!markets.length || !prices.length) return [];

//     const getProduceName = (p) => p.produce_name || p.produce;
//     const getMarketName = (p) => p.market_name || p.market;
//     const uniqueProduce = [...new Set(prices.map(getProduceName).filter(Boolean))];

//     return uniqueProduce.map((produce) => {
//       const relevantPrices = prices.filter((p) => getProduceName(p) === produce);
//       const analysis = relevantPrices.map((priceEntry) => {
//         const pMarketName = getMarketName(priceEntry);
//         const market = markets.find((m) => m.name === pMarketName);
//         if (!market) return null;

//         const totalRevenue = Number(priceEntry.price) * quantity;
//         const totalCost = (Number(market.transport_cost) || 0) + (Number(market.market_fee) || 0);
//         const netValue = totalRevenue - totalCost;
        
//         return {
//           market: market.name,
//           marketId: market.id, // IMPORTANT: Capturing the ID for the backend!
//           pricePerKg: priceEntry.price,
//           totalCost,
//           totalRevenue,
//           netValue,
//         };
//       }).filter(Boolean);

//       analysis.sort((a, b) => b.netValue - a.netValue);

//       return {
//         produce,
//         bestOption: analysis[0],
//         alternatives: analysis.slice(1),
//       };
//     }).filter(rec => rec.bestOption);
//   }, [markets, prices, quantity]);

//   if (recommendations.length === 0) return <div className="text-gray-500 text-sm italic p-6 bg-white rounded-2xl border border-stone-100 text-center">Add Market and Price data to see recommendations.</div>;

//   return (
//     <div className="space-y-8">
//       {/* Hero Calculator */}
//       <div className="bg-emerald-900 rounded-3xl p-8 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
//         <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400 opacity-[0.1] rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
//         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
//             <div className="max-w-md">
//                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/50 border border-emerald-700/50 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
//                     <DollarSign className="w-3 h-3" /> Profit Engine
//                 </div>
//                 <h3 className="text-3xl font-black mb-2 tracking-tight">Calculate Your Profit</h3>
//                 <p className="text-emerald-100/80 text-base leading-relaxed">
//                     Transport costs are fixed. Find the tipping point where bulk selling justifies traveling to further markets.
//                 </p>
//             </div>
            
//             <div className="flex-shrink-0 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col items-center gap-3 min-w-[200px]">
//                 <label className="text-emerald-200 text-xs font-bold uppercase tracking-widest">Quantity to Sell</label>
//                 <div className="flex items-baseline gap-2">
//                     <input 
//                         type="number" 
//                         min="1" 
//                         value={quantity} 
//                         onChange={(e) => setQuantity(Number(e.target.value))}
//                         className="w-32 bg-transparent text-5xl font-black text-center text-white focus:outline-none focus:ring-0 border-b-2 border-emerald-500/50 focus:border-emerald-400 transition-all placeholder-emerald-700"
//                     />
//                     <span className="text-emerald-300 text-lg font-bold">Kgs</span>
//                 </div>
//             </div>
//         </div>
//       </div>

//       <div className="grid gap-8">
//         {recommendations.map((rec) => (
//             <div key={rec.produce} className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden group hover:border-emerald-100 transition-all duration-300">
//                 <div className="p-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                 <div className="p-6 md:p-8">
//                     {/* Header */}
//                     <div className="flex justify-between items-start mb-6">
//                         <div>
//                             <p className="text-sm font-bold text-emerald-600 mb-1 flex items-center gap-1">
//                                 Best Market for <span className="text-gray-900 text-lg ml-1">{rec.produce}</span>
//                             </p>
//                             <h2 className="text-4xl font-black text-gray-900 tracking-tight">{rec.bestOption.market}</h2>
//                         </div>
//                         <div className={`px-5 py-3 rounded-2xl text-center min-w-[140px] ${rec.bestOption.netValue > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
//                             <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Net Profit</p>
//                             <p className="text-xl font-black">KES {rec.bestOption.netValue.toLocaleString()}</p>
//                         </div>
//                     </div>

//                     {/* Stats Grid */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
//                             <p className="text-xs font-bold text-gray-400 uppercase mb-1">Selling Price</p>
//                             <p className="text-lg font-bold text-gray-900">KES {rec.bestOption.pricePerKg}<span className="text-sm font-normal text-gray-500">/kg</span></p>
//                         </div>
//                         <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
//                             <p className="text-xs font-bold text-gray-400 uppercase mb-1">Gross Revenue</p>
//                             <p className="text-lg font-bold text-gray-900">KES {(rec.bestOption.totalRevenue).toLocaleString()}</p>
//                         </div>
//                         <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
//                             <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Cost</p>
//                             <p className="text-lg font-bold text-red-600">KES {rec.bestOption.totalCost.toLocaleString()}</p>
//                         </div>
//                     </div>
                    
//                     {/* Action & Accordion */}
//                     <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-4">
//                         <button 
//                           onClick={() => onRecordSale({
//                             produce: rec.produce,
//                             market: rec.bestOption.market,
//                             marketId: rec.bestOption.marketId, 
//                             quantity: quantity,
//                             pricePerKg: rec.bestOption.pricePerKg,
//                             totalRevenue: rec.bestOption.totalRevenue,
//                             profit: rec.bestOption.netValue
//                           })}
//                           className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
//                         >
//                           <Plus className="w-5 h-5"/> Record This Sale
//                         </button>

//                         {rec.alternatives.length > 0 && (
//                             <div>
//                                 <button 
//                                     onClick={() => toggleExpanded(rec.produce)}
//                                     className="w-full flex items-center justify-between text-sm text-gray-500 hover:text-emerald-600 transition-colors group mt-2"
//                                 >
//                                     <span>{rec.alternatives.length} other markets analyzed</span>
//                                     <span className="flex items-center gap-1 font-bold">
//                                         {expanded[rec.produce] ? "Hide Breakdown" : "View Breakdown"} 
//                                         {expanded[rec.produce] ? <ChevronDown className="w-4 h-4"/> : <ChevronRight className="w-4 h-4"/>}
//                                     </span>
//                                 </button>

//                                 {expanded[rec.produce] && (
//                                     <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
//                                         <div className="overflow-x-auto">
//                                             <table className="min-w-full text-sm">
//                                                 <thead className="bg-stone-50 text-gray-500">
//                                                     <tr>
//                                                         <th className="px-4 py-2 text-left font-medium rounded-l-lg">Market</th>
//                                                         <th className="px-4 py-2 text-right font-medium">Price/Kg</th>
//                                                         <th className="px-4 py-2 text-right font-medium">Gross Rev</th>
//                                                         <th className="px-4 py-2 text-right font-medium">Costs</th>
//                                                         <th className="px-4 py-2 text-right font-medium rounded-r-lg">Net Profit</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody className="divide-y divide-gray-50">
//                                                     {rec.alternatives.map((alt, idx) => (
//                                                         <tr key={idx} className="hover:bg-gray-50/50">
//                                                             <td className="px-4 py-3 font-medium text-gray-900">{alt.market}</td>
//                                                             <td className="px-4 py-3 text-right text-gray-600">{alt.pricePerKg}</td>
//                                                             <td className="px-4 py-3 text-right text-gray-600">{alt.totalRevenue.toLocaleString()}</td>
//                                                             <td className="px-4 py-3 text-right text-red-500">-{alt.totalCost.toLocaleString()}</td>
//                                                             <td className={`px-4 py-3 text-right font-bold ${alt.netValue > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
//                                                                 {alt.netValue.toLocaleString()}
//                                                             </td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const LatestPricesTable = ({ prices, loading }) => {
//   if (loading) return <div className="p-12 text-center text-gray-400 font-medium">Loading prices...</div>;
//   if (!prices || prices.length === 0) return <div className="p-12 text-center text-gray-400 font-medium">No live price data.</div>;

//   return (
//     <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="min-w-full">
//             <thead className="bg-stone-50/50">
//             <tr>
//                 <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Market</th>
//                 <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Produce</th>
//                 <th className="px-6 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Current Price</th>
//             </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//             {prices.map((item, idx) => (
//                 <tr key={idx} className="group hover:bg-emerald-50/30 transition-colors">
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">{item.market_name || item.market || "Unknown"}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{item.produce_name || item.produce || "Unknown"}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-emerald-600 group-hover:text-emerald-700">
//                     KES {Number(item.price).toFixed(2)}
//                 </td>
//                 </tr>
//             ))}
//             </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// // --- MAIN APP ---

// function App() {
//   // STATE FOR AUTH
//   const [token, setToken] = useState(localStorage.getItem('access_token'));
//   const [user, setUser] = useState(localStorage.getItem('username'));

//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [markets, setMarkets] = useState([]);
//   const [prices, setPrices] = useState([]);
//   const [logs, setLogs] = useState([]); 
//   const [sales, setSales] = useState([]); 
  
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalData, setModalData] = useState(null);
  
//   const [loading, setLoading] = useState(true);
//   const [isUsingRealData, setIsUsingRealData] = useState(false);

//   const openRecordSaleModal = (data) => {
//     setModalData(data);
//     setIsModalOpen(true);
//   };

//   const handleLogin = (accessToken, username) => {
//     localStorage.setItem('access_token', accessToken);
//     localStorage.setItem('username', username);
//     setToken(accessToken);
//     setUser(username);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('username');
//     setToken(null);
//     setUser(null);
//   };

//   const deleteSale = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this sale?")) return;
//     try {
//         const response = await fetch(`http://127.0.0.1:8000/api/salesrecords/${id}/`, {
//             method: "DELETE",
//         });
//         if (response.ok) {
//             setSales(sales.filter(sale => sale.id !== id));
//             alert("Record deleted successfully.");
//         } else {
//             alert("Failed to delete record.");
//         }
//     } catch (error) {
//         console.error("Delete Error:", error);
//         alert("Error connecting to server.");
//     }
//   };

//   useEffect(() => {
//     // Only fetch data if we are logged in
//     if (!token) return;

//     const fetchData = async () => {
//       setLoading(true);
//       const headers = { 'Authorization': `Bearer ${token}` };
//       try {
//         const marketRes = await fetch("http://127.0.0.1:8000/api/markets/");
//         if (!marketRes.ok) throw new Error("Failed to fetch markets");
//         const marketData = await marketRes.json();
//         setMarkets(marketData);

//         const priceRes = await fetch("http://127.0.0.1:8000/api/latest-prices/");
//         if (!priceRes.ok) throw new Error("Failed to fetch prices");
//         const priceData = await priceRes.json();
//         setPrices(priceData);

//         const logsRes = await fetch("http://127.0.0.1:8000/api/pricelogs/");
//         if (logsRes.ok) {
//             const logsData = await logsRes.json();
//             setLogs(logsData);
//         }

//         const salesRes = await fetch("http://127.0.0.1:8000/api/salesrecords/");
//         if (salesRes.ok) {
//             const salesData = await salesRes.json();
//             setSales(salesData);
//         }

//         setIsUsingRealData(true);
//       } catch (err) {
//         console.warn("Could not connect to Django API. Switching to Mock Data.", err);
//         setIsUsingRealData(false);
//         setMarkets(MOCK_MARKETS);
//         setPrices(MOCK_PRICES);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [token]);

//   // --- GATEKEEPER: IF NO TOKEN, SHOW LOGIN ---
//   if (!token) {
//     return <LoginScreen onLogin={handleLogin} />;
//   }

//   return (
//     <div className="min-h-screen bg-stone-50 font-sans text-gray-800 pb-20 relative">
      
//       <RecordSaleModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//         saleData={modalData}
//       />

//       {/* Navbar */}
//       <nav className="bg-white sticky top-0 z-30 border-b border-stone-100/80 backdrop-blur-md bg-white/90">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-20">
//             <div className="flex items-center gap-3">
//               <div className="bg-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-600/20 text-white">
//                  <BarChart2 className="w-6 h-6" />
//               </div>
//               <div className="flex flex-col">
//                   <span className="font-black text-xl tracking-tight leading-none text-gray-900">Ushauri Soko</span>
//                   <span className="text-emerald-600 text-xs font-bold tracking-wide uppercase mt-0.5">Market Intelligence</span>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-4">
//               <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${isUsingRealData ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-orange-50 border-orange-100 text-orange-700"}`}>
//                 {isUsingRealData ? <Wifi className="w-3.5 h-3.5"/> : <WifiOff className="w-3.5 h-3.5"/>}
//                 {isUsingRealData ? "Live Database" : "Demo Mode"}
//               </div>

//               {/* User Profile & Logout */}
//               <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
//                 <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
//                   <div className="bg-stone-100 p-2 rounded-full text-gray-500">
//                     <User className="w-4 h-4" />
//                   </div>
//                   <span className="hidden sm:block">{user}</span>
//                 </div>
//                 <button 
//                   onClick={handleLogout}
//                   className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
//                   title="Logout"
//                 >
//                   <LogOut className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
//         {/* Navigation Tabs */}
//         <div className="flex justify-center mb-10">
//           <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-stone-100 inline-flex items-center gap-1">
//             {["dashboard", "sales", "markets", "trends"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-8 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
//                     activeTab === tab 
//                     ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' 
//                     : 'text-gray-500 hover:bg-stone-50 hover:text-gray-900'
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* --- DASHBOARD TAB --- */}
//         {activeTab === "dashboard" && (
//           <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
//             {/* Quick Stats Row */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {[
//                     { label: "Markets", value: markets.length },
//                     { label: "Products", value: [...new Set(prices.map(p => p.produce_name || p.produce))].length },
//                     { label: "Total Sales", value: sales.length, textClass: "text-emerald-600" },
//                     { label: "Status", value: "Active", textClass: "text-emerald-500" }
//                 ].map((stat, i) => (
//                     <div key={i} className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm">
//                         <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
//                         <p className={`text-2xl font-black ${stat.textClass || 'text-gray-900'}`}>{stat.value}</p>
//                     </div>
//                 ))}
//             </div>

//             <div className="grid lg:grid-cols-12 gap-8 items-start">
//               {/* Left Column: Recommendations (Wider) */}
//               <div className="lg:col-span-8 space-y-10">
//                  <BestMarketRecommendation 
//                     markets={markets} 
//                     prices={prices} 
//                     onRecordSale={openRecordSaleModal} 
//                  />
                 
//                  <div>
//                     <div className="flex items-center justify-between mb-6">
//                         <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                             <DollarSign className="w-6 h-6 text-emerald-600 bg-emerald-50 rounded-full p-1"/> Current Prices
//                         </h2>
//                     </div>
//                     <PricesByProduce prices={prices} loading={loading} />
//                  </div>
//               </div>

//               {/* Right Column: Live Feed (Sticky) */}
//               <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
//                 <div className="bg-white p-6 rounded-3xl shadow-lg shadow-gray-100/50 border border-stone-100">
//                     <div className="flex items-center gap-3 mb-6">
//                         <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
//                              <TrendingUp className="w-5 h-5" />
//                         </div>
//                         <div>
//                             <h2 className="text-lg font-bold text-gray-900">Live Feed</h2>
//                             <p className="text-xs text-gray-500 font-medium">Real-time market updates</p>
//                         </div>
//                     </div>
//                     <LatestPricesTable prices={prices} loading={loading} />
//                 </div>
                
//                 {/* Promo / Tip Card */}
//                 <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-3xl text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden">
//                     <div className="relative z-10">
//                         <h4 className="font-bold text-lg mb-2">Did you know?</h4>
//                         <p className="text-emerald-50/90 text-sm leading-relaxed">
//                             Selling in bulk (1000+ kgs) often makes distant cities like Nairobi more profitable despite high transport fees.
//                         </p>
//                     </div>
//                     <div className="absolute -bottom-4 -right-4 bg-white/10 w-24 h-24 rounded-full blur-2xl"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* --- SALES TAB --- */}
//         {activeTab === "sales" && (
//            <div className="space-y-8 animate-in fade-in duration-500">
//              <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm flex items-center gap-6">
//                 <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
//                     <Briefcase className="w-8 h-8" />
//                 </div>
//                 <div>
//                     <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">My Sales Ledger</h2>
//                     <p className="text-gray-500 max-w-xl">
//                         A complete history of your transactions. Track your revenue and volume over time.
//                     </p>
//                 </div>
//              </div>
//              <SalesHistory sales={sales} onDeleteSale={deleteSale} />
//            </div>
//         )}

//         {/* --- MARKETS TAB --- */}
//         {activeTab === "markets" && (
//           <div className="space-y-8 animate-in fade-in duration-500">
//              <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm flex items-center gap-6">
//                 <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600">
//                     <MapPin className="w-8 h-8" />
//                 </div>
//                 <div>
//                     <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Registered Markets</h2>
//                     <p className="text-gray-500 max-w-xl">
//                         View current logistics data, entry fees, and transport costs for all supported market destinations.
//                     </p>
//                 </div>
//              </div>
//              <MarketList markets={markets} loading={loading} />
//           </div>
//         )}

//         {/* --- TRENDS TAB --- */}
//         {activeTab === "trends" && (
//            <div className="space-y-8 animate-in fade-in duration-500">
//              <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm flex items-center gap-6">
//                 <div className="bg-purple-50 p-4 rounded-2xl text-purple-600">
//                     <BarChart2 className="w-8 h-8" />
//                 </div>
//                 <div>
//                     <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Market Intelligence</h2>
//                     <p className="text-gray-500 max-w-xl">
//                         Deep dive into historical data. Analyze 20-day price trends to predict the best time to sell your produce.
//                     </p>
//                 </div>
//              </div>
//              <PriceTrendsChart logs={logs} />
//            </div>
//         )}

//       </main>

//       <footer className="border-t border-stone-200 mt-20 bg-white">
//         <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
//           <div className="flex items-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
//               <BarChart2 className="w-6 h-6 text-emerald-600" />
//               <span className="font-black text-xl text-gray-900">Ushauri Soko</span>
//           </div>
//           <p className="text-gray-400 text-sm font-medium">© {new Date().getFullYear()} Empowering Farmers with Data.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default App;

