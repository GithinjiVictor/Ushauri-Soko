import React, { useState, useEffect, useCallback } from 'react';
import {
    Users, ShoppingCart, TrendingUp, Truck, Plus, Trash2,
    LogOut, Shield, DollarSign, Pencil, X, Upload
} from 'lucide-react';

const API_BASE_URL = "http://127.0.0.1:8000";

const AdminDashboard = ({ token, onLogout }) => {
    const [activeTab, setActiveTab] = useState("markets");
    const [markets, setMarkets] = useState([]);
    const [produce, setProduce] = useState([]);
    const [users, setUsers] = useState([]);
    const [sales, setSales] = useState([]);
    const [priceLogs, setPriceLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- FETCH DATA ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            const [mRes, pRes, uRes, sRes, lRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/markets/`, { headers }),
                fetch(`${API_BASE_URL}/api/produce/`, { headers }),
                fetch(`${API_BASE_URL}/api/users/`, { headers }),
                fetch(`${API_BASE_URL}/api/salesrecords/`, { headers }),
                fetch(`${API_BASE_URL}/api/pricelogs/`, { headers })
            ]);

            if (mRes.ok) setMarkets(await mRes.json());
            if (pRes.ok) setProduce(await pRes.json());
            if (uRes.ok) setUsers(await uRes.json());
            if (sRes.ok) setSales(await sRes.json());
            if (lRes.ok) setPriceLogs(await lRes.json());
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- GENERIC DELETE HANDLER ---
    const handleDelete = async (endpoint, id, setter, currentList) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/${endpoint}/${id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setter(currentList.filter(item => item.id !== id));
                alert("Deleted successfully.");
            } else {
                alert("Failed to delete.");
            }
        } catch (e) {
            alert("Error deleting item.");
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-gray-800 flex">
            {/* SIDEBAR */}
            <aside className="w-64 bg-emerald-900 text-white fixed h-full shadow-2xl z-20 hidden md:block">
                <div className="p-6 border-b border-emerald-800">
                    <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-6 h-6 text-emerald-400" />
                        <span className="font-black text-xl tracking-tight">Admin<span className="text-emerald-400">Portal</span></span>
                    </div>
                    <p className="text-emerald-300 text-xs uppercase tracking-widest pl-8">Ushauri Soko</p>
                </div>
                <nav className="p-4 space-y-2">
                    {[
                        { id: 'markets', label: 'Markets', icon: <Truck className="w-5 h-5" /> },
                        { id: 'produce', label: 'Produce', icon: <ShoppingCart className="w-5 h-5" /> },
                        { id: 'logs', label: 'Price Logs', icon: <TrendingUp className="w-5 h-5" /> },
                        { id: 'sales', label: 'Sales Records', icon: <DollarSign className="w-5 h-5" /> },
                        { id: 'users', label: 'User Mgmt', icon: <Users className="w-5 h-5" /> },
                        { id: 'import', label: 'Bulk Import', icon: <Upload className="w-5 h-5" /> },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === item.id ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-900/50' : 'text-emerald-200 hover:bg-emerald-800/50 hover:text-white'}`}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t border-emerald-800">
                    <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-900/30 text-red-200 rounded-xl hover:bg-red-900/50 transition-colors font-bold text-sm">
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            {/* MOBILE HEADER */}
            <div className="md:hidden fixed top-0 w-full bg-emerald-900 text-white z-20 p-4 flex justify-between items-center shadow-md">
                <span className="font-black text-lg">Admin Portal</span>
                <button onClick={onLogout}><LogOut className="w-5 h-5" /></button>
            </div>

            {/* MAIN CONTENT */}
            <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10 overflow-y-auto min-h-screen">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                        <p className="text-gray-500 mt-1">Manage system data and records.</p>
                    </div>
                    <button onClick={fetchData} className="px-4 py-2 bg-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-300 transition-colors">Refresh Data</button>
                </header>

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading data...</div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeTab === 'markets' && <MarketsManager markets={markets} setMarkets={setMarkets} token={token} onDelete={(id) => handleDelete('markets', id, setMarkets, markets)} />}
                        {activeTab === 'produce' && <ProduceManager produce={produce} setProduce={setProduce} token={token} onDelete={(id) => handleDelete('produce', id, setProduce, produce)} />}
                        {activeTab === 'logs' && <PriceLogManager logs={priceLogs} setLogs={setPriceLogs} markets={markets} produce={produce} token={token} onDelete={(id) => handleDelete('pricelogs', id, setPriceLogs, priceLogs)} />}
                        {activeTab === 'sales' && <SalesViewer sales={sales} users={users} />}
                        {activeTab === 'users' && <UserManager users={users} setUsers={setUsers} token={token} onDelete={(id) => handleDelete('users', id, setUsers, users)} />}
                        {activeTab === 'import' && <BulkImportManager token={token} />}
                    </div>
                )}
            </main>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const MarketsManager = ({ markets, setMarkets, token, onDelete }) => {
    const [newItem, setNewItem] = useState({ name: '', transport_cost: '', market_fee: '' });
    const [editingId, setEditingId] = useState(null);

    const handleEdit = (market) => {
        setNewItem({ name: market.name, transport_cost: market.transport_cost, market_fee: market.market_fee });
        setEditingId(market.id);
    };

    const handleCancel = () => {
        setNewItem({ name: '', transport_cost: '', market_fee: '' });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `${API_BASE_URL}/api/markets/${editingId}/` : `${API_BASE_URL}/api/markets/`;

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newItem)
            });

            if (res.ok) {
                const updated = await res.json();
                if (editingId) {
                    setMarkets(markets.map(m => m.id === editingId ? updated : m));
                    alert("Market updated!");
                } else {
                    setMarkets([...markets, updated]);
                    alert("Market added!");
                }
                handleCancel();
            } else alert(`Failed to ${editingId ? 'update' : 'add'}.`);
        } catch (e) { alert("Error."); }
    };

    return (
        <div className="space-y-8">
            <div className={`p-6 rounded-2xl shadow-sm border transaction-colors ${editingId ? 'bg-amber-50 border-amber-200' : 'bg-white border-stone-100'}`}>
                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${editingId ? 'text-amber-700' : 'text-stone-800'}`}>
                    {editingId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5 text-emerald-600" />}
                    {editingId ? 'Edit Market' : 'Add New Market'}
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Name</label><input required className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Nairobi" /></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Transport Cost</label><input required type="number" className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={newItem.transport_cost} onChange={e => setNewItem({ ...newItem, transport_cost: e.target.value })} placeholder="0.00" /></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Market Fee</label><input required type="number" className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={newItem.market_fee} onChange={e => setNewItem({ ...newItem, market_fee: e.target.value })} placeholder="0.00" /></div>
                    <div className="flex gap-2">
                        {editingId && <button type="button" onClick={handleCancel} className="px-4 py-2.5 bg-stone-200 text-stone-600 font-bold rounded-lg hover:bg-stone-300 transition-colors"><X className="w-5 h-5" /></button>}
                        <button type="submit" className={`flex-1 px-6 py-2.5 font-bold rounded-lg transition-colors text-white ${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>{editingId ? 'Update' : 'Add'}</button>
                    </div>
                </form>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <table className="min-w-full text-sm">
                    <thead className="bg-emerald-50/50"><tr><th className="px-6 py-4 text-left font-bold text-gray-400 uppercase text-xs">ID</th><th className="px-6 py-4 text-left font-bold text-gray-600">Name</th><th className="px-6 py-4 text-right font-bold text-gray-600">Transport</th><th className="px-6 py-4 text-right font-bold text-gray-600">Fee</th><th className="px-6 py-4 text-center font-bold text-gray-400">Action</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">{markets.map(m => (
                        <tr key={m.id} className={`transition-colors ${editingId === m.id ? 'bg-amber-50' : 'hover:bg-gray-50/50'}`}>
                            <td className="px-6 py-4 text-gray-400">#{m.id}</td>
                            <td className="px-6 py-4 font-bold text-gray-900">{m.name}</td>
                            <td className="px-6 py-4 text-right text-gray-600">{Number(m.transport_cost).toLocaleString()}</td>
                            <td className="px-6 py-4 text-right text-gray-600">{Number(m.market_fee).toLocaleString()}</td>
                            <td className="px-6 py-4 text-center flex justify-center gap-2">
                                <button onClick={() => handleEdit(m)} className="text-amber-400 hover:text-amber-600 hover:bg-amber-50 p-2 rounded-lg transition-colors" disabled={editingId !== null && editingId !== m.id}><Pencil className="w-4 h-4" /></button>
                                <button onClick={() => onDelete(m.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" disabled={editingId !== null}><Trash2 className="w-4 h-4" /></button>
                            </td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </div>
    );
};

const ProduceManager = ({ produce, setProduce, token, onDelete }) => {
    const [newItem, setNewItem] = useState({ name: '', unit: '' });
    const [editingId, setEditingId] = useState(null);

    const handleEdit = (item) => {
        setNewItem({ name: item.name, unit: item.unit });
        setEditingId(item.id);
    };

    const handleCancel = () => {
        setNewItem({ name: '', unit: '' });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `${API_BASE_URL}/api/produce/${editingId}/` : `${API_BASE_URL}/api/produce/`;

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newItem)
            });

            if (res.ok) {
                const updated = await res.json();
                if (editingId) {
                    setProduce(produce.map(p => p.id === editingId ? updated : p));
                    alert("Produce updated!");
                } else {
                    setProduce([...produce, updated]);
                    alert("Produce added!");
                }
                handleCancel();
            } else alert(`Failed to ${editingId ? 'update' : 'add'}.`);
        } catch (e) { alert("Error."); }
    };

    return (
        <div className="space-y-8">
            <div className={`p-6 rounded-2xl shadow-sm border transaction-colors ${editingId ? 'bg-amber-50 border-amber-200' : 'bg-white border-stone-100'}`}>
                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${editingId ? 'text-amber-700' : 'text-stone-800'}`}>
                    {editingId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5 text-emerald-600" />}
                    {editingId ? 'Edit Produce' : 'Add Produce'}
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Produce Name</label><input required className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Tomatoes" /></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Unit of Measure</label><input required className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={newItem.unit} onChange={e => setNewItem({ ...newItem, unit: e.target.value })} placeholder="e.g. Kg, Crate, Box" /></div>
                    <div className="flex gap-2">
                        {editingId && <button type="button" onClick={handleCancel} className="px-4 py-2.5 bg-stone-200 text-stone-600 font-bold rounded-lg hover:bg-stone-300 transition-colors"><X className="w-5 h-5" /></button>}
                        <button type="submit" className={`flex-1 px-6 py-2.5 font-bold rounded-lg transition-colors text-white ${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>{editingId ? 'Update' : 'Add'}</button>
                    </div>
                </form>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <table className="min-w-full text-sm">
                    <thead className="bg-emerald-50/50"><tr><th className="px-6 py-4 text-left font-bold text-gray-400 uppercase text-xs">ID</th><th className="px-6 py-4 text-left font-bold text-gray-600">Name</th><th className="px-6 py-4 text-left font-bold text-gray-600">Unit</th><th className="px-6 py-4 text-center font-bold text-gray-400">Action</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">{produce.map(p => (
                        <tr key={p.id} className={`transition-colors ${editingId === p.id ? 'bg-amber-50' : 'hover:bg-gray-50/50'}`}>
                            <td className="px-6 py-4 text-gray-400">#{p.id}</td>
                            <td className="px-6 py-4 font-bold text-gray-900">{p.name}</td>
                            <td className="px-6 py-4 text-gray-600 bg-gray-50 rounded-lg inline-block my-2 mx-6 px-2 py-0.5 text-xs font-bold uppercase tracking-wider border border-gray-200">{p.unit}</td>
                            <td className="px-6 py-4 text-center flex justify-center gap-2">
                                <button onClick={() => handleEdit(p)} className="text-amber-400 hover:text-amber-600 hover:bg-amber-50 p-2 rounded-lg transition-colors" disabled={editingId !== null && editingId !== p.id}><Pencil className="w-4 h-4" /></button>
                                <button onClick={() => onDelete(p.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" disabled={editingId !== null}><Trash2 className="w-4 h-4" /></button>
                            </td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </div>
    );
};

const PriceLogManager = ({ logs, setLogs, markets, produce, token, onDelete }) => {
    const [newItem, setNewItem] = useState({ market: '', produce: '', price: '', date: new Date().toISOString().split('T')[0] });
    const [filterMarket, setFilterMarket] = useState('');
    const [filterProduce, setFilterProduce] = useState('');

    const filteredLogs = logs.filter(l => {
        const marketMatch = !filterMarket || String(l.market) === String(filterMarket) || l.market_name === markets.find(m => String(m.id) === String(filterMarket))?.name;
        const produceMatch = !filterProduce || String(l.produce) === String(filterProduce) || l.produce_name === produce.find(p => String(p.id) === String(filterProduce))?.name;
        return marketMatch && produceMatch;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/api/pricelogs/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newItem)
            });
            if (res.ok) {
                const added = await res.json();
                // Add friendly names for display immediately
                added.market_name = markets.find(m => m.id === Number(newItem.market))?.name;
                added.produce_name = produce.find(p => p.id === Number(newItem.produce))?.name;
                setLogs([added, ...logs]);
                setNewItem({ ...newItem, price: '' });
                alert("Price Logged!");
            } else alert("Failed.");
        } catch (e) { alert("Error."); }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-emerald-600" /> Record Price</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Date</label><input required type="date" className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={newItem.date} onChange={e => setNewItem({ ...newItem, date: e.target.value })} /></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Market</label><select required className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={newItem.market} onChange={e => setNewItem({ ...newItem, market: e.target.value })}><option value="">Select...</option>{markets.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Produce</label><select required className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={newItem.produce} onChange={e => setNewItem({ ...newItem, produce: e.target.value })}><option value="">Select...</option>{produce.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Price</label><input required type="number" className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} placeholder="0.00" /></div>
                    <button type="submit" className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors">Record</button>
                </form>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <select className="px-4 py-2 bg-white rounded-lg border border-stone-200 text-sm font-bold text-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={filterMarket} onChange={e => setFilterMarket(e.target.value)}>
                    <option value="">All Markets</option>
                    {markets.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <select className="px-4 py-2 bg-white rounded-lg border border-stone-200 text-sm font-bold text-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={filterProduce} onChange={e => setFilterProduce(e.target.value)}>
                    <option value="">All Produce</option>
                    {produce.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <table className="min-w-full text-sm">
                    <thead className="bg-emerald-50/50"><tr><th className="px-6 py-4 text-left font-bold text-gray-400 uppercase text-xs">Date</th><th className="px-6 py-4 text-left font-bold text-gray-600">Market</th><th className="px-6 py-4 text-left font-bold text-gray-600">Produce</th><th className="px-6 py-4 text-right font-bold text-gray-600">Price</th><th className="px-6 py-4 text-center font-bold text-gray-400">Action</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">{filteredLogs.map(l => (<tr key={l.id} className="hover:bg-gray-50/50"><td className="px-6 py-4 text-gray-500">{l.date}</td><td className="px-6 py-4 font-bold text-gray-900">{l.market_name}</td><td className="px-6 py-4 font-medium text-gray-700">{l.produce_name}</td><td className="px-6 py-4 text-right font-bold text-emerald-600">{Number(l.price).toLocaleString()}</td><td className="px-6 py-4 text-center"><button onClick={() => onDelete(l.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button></td></tr>))}</tbody>
                </table>
            </div>
        </div>
    );
};

const SalesViewer = ({ sales, users }) => {
    const getUserName = (userId) => {
        if (!userId) return '?';
        const user = users?.find(u => u.id === userId);
        return user ? user.username : `User #${userId}`;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="p-6 border-b border-stone-100"><h3 className="text-lg font-bold">Sales History (Read-Only)</h3></div>
            <table className="min-w-full text-sm">
                <thead className="bg-emerald-50/50"><tr><th className="px-6 py-4 text-left font-bold text-gray-400 uppercase text-xs">Date</th><th className="px-6 py-4 text-left font-bold text-gray-600">Username</th><th className="px-6 py-4 text-left font-bold text-gray-600">Market</th><th className="px-6 py-4 text-left font-bold text-gray-600">Produce</th><th className="px-6 py-4 text-right font-bold text-gray-600">Volume</th><th className="px-6 py-4 text-right font-bold text-gray-600">Revenue</th></tr></thead>
                <tbody className="divide-y divide-gray-100">{sales.map(s => (<tr key={s.id} className="hover:bg-gray-50/50"><td className="px-6 py-4 text-gray-500">{s.date}</td><td className="px-6 py-4 text-gray-500 italic font-medium">{getUserName(s.user)}</td><td className="px-6 py-4 font-bold text-gray-900">{s.market_sold_to}</td><td className="px-6 py-4 font-medium text-gray-700">{s.produce}</td><td className="px-6 py-4 text-right text-gray-600">{s.volume_sold}</td><td className="px-6 py-4 text-right font-bold text-emerald-600">{Number(s.total_revenue).toLocaleString()}</td></tr>))}</tbody>
            </table>
        </div>
    );
};

const UserManager = ({ users, setUsers, token, onDelete }) => {
    const [newItem, setNewItem] = useState({ username: '', password: '', email: '', is_staff: false });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/api/users/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newItem)
            });
            if (res.ok) {
                setUsers([...users, await res.json()]);
                setNewItem({ username: '', password: '', email: '', is_staff: false });
                alert("User created!");
            } else alert("Failed to create user. Username might differ.");
        } catch (e) { alert("Error."); }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-emerald-600" /> Create New User</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Username</label><input required className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={newItem.username} onChange={e => setNewItem({ ...newItem, username: e.target.value })} /></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Password</label><input required type="password" className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={newItem.password} onChange={e => setNewItem({ ...newItem, password: e.target.value })} /></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-gray-400 uppercase">Email</label><input type="email" className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={newItem.email} onChange={e => setNewItem({ ...newItem, email: e.target.value })} /></div>
                    <div className="flex items-center gap-4 pb-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={newItem.is_staff} onChange={e => setNewItem({ ...newItem, is_staff: e.target.checked })} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300" />
                            <span className="font-bold text-sm text-gray-700">Is Admin?</span>
                        </label>
                        <button type="submit" className="flex-1 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors">Create</button>
                    </div>
                </form>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <table className="min-w-full text-sm">
                    <thead className="bg-emerald-50/50"><tr><th className="px-6 py-4 text-left font-bold text-gray-400 uppercase text-xs">ID</th><th className="px-6 py-4 text-left font-bold text-gray-600">Username</th><th className="px-6 py-4 text-left font-bold text-gray-600">Role</th><th className="px-6 py-4 text-center font-bold text-gray-400">Action</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">{users.map(u => (<tr key={u.id} className="hover:bg-gray-50/50"><td className="px-6 py-4 text-gray-500">#{u.id}</td><td className="px-6 py-4 font-bold text-gray-900">{u.username}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${u.is_staff ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{u.is_staff ? 'Admin' : 'Farmer'}</span></td><td className="px-6 py-4 text-center"><button onClick={() => onDelete(u.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button></td></tr>))}</tbody>
                </table>
            </div>
        </div>
    );
};

const BulkImportManager = ({ token }) => {
    const [file, setFile] = useState(null);
    const [type, setType] = useState('markets');
    const [message, setMessage] = useState('');

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_BASE_URL}/api/import/${type}/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }, // Form-data headers are handled automatically
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                setFile(null);
            } else {
                setMessage("Error: " + data.error);
            }
        } catch (error) {
            setMessage("Upload failed.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Upload className="w-6 h-6 text-emerald-600" /> Bulk Data Import
            </h3>

            <form onSubmit={handleUpload} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Data Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                        <option value="markets">Markets</option>
                        <option value="produce">Produce</option>
                        <option value="pricelogs">Price Logs</option>
                        <option value="users">Users</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Upload Excel File (.xlsx)</label>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-emerald-50 file:text-emerald-700
                          hover:file:bg-emerald-100"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!file}
                    className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Upload and Import
                </button>

                {message && (
                    <div className={`p-4 rounded-xl text-sm font-bold ${message.includes('Error') || message.includes('failed') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {message}
                    </div>
                )}
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-500 uppercase mb-4">Instructions</h4>
                <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                    <li><strong>Markets</strong>: Columns 'Name', 'Transport Cost', 'Market Fee'</li>
                    <li><strong>Produce</strong>: Columns 'Name', 'Unit'</li>
                    <li><strong>Price Logs</strong>: Columns 'Market', 'Produce', 'Price', 'Date' (YYYY-MM-DD)</li>
                    <li><strong>Users</strong>: Columns 'Username', 'Password', 'Email', 'IsAdmin'</li>
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
