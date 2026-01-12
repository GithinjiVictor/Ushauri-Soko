import React, { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPriceLogs, getMarkets, getProduce } from '../../api';

// Curated High-Contrast Palette
const PALETTE = [
    '#2563eb', // Blue
    '#dc2626', // Red
    '#16a34a', // Green
    '#d97706', // Amber
    '#9333ea', // Purple
    '#0891b2', // Cyan
    '#db2777', // Pink
    '#4b5563', // Gray
];

const PriceTrendChart = ({ token }) => {
    const [originalData, setOriginalData] = useState([]); // Store raw processed data
    const [chartData, setChartData] = useState([]); // Filtered data for chart

    const [markets, setMarkets] = useState([]);
    const [produceList, setProduceList] = useState([]);

    const [selectedProduce, setSelectedProduce] = useState('');
    const [selectedMarkets, setSelectedMarkets] = useState([]); // IDs of selected markets

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInitialData();
    }, [token]);

    const fetchInitialData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const [marketsRes, produceRes] = await Promise.all([getMarkets(config), getProduce(config)]);
            setMarkets(marketsRes.data);
            setProduceList(produceRes.data);

            // Defaults
            if (produceRes.data.length > 0) setSelectedProduce(produceRes.data[0].id);
            // Default select top 3 markets to avoid clutter
            if (marketsRes.data.length > 0) setSelectedMarkets(marketsRes.data.slice(0, 3).map(m => m.id));

        } catch (error) {
            console.error("Error fetching options:", error);
        }
    };

    useEffect(() => {
        if (selectedProduce) {
            fetchPriceLogs();
        }
    }, [selectedProduce, token]);

    // Re-filter data when selected markets change
    useEffect(() => {
        if (originalData.length > 0) {
            filterChartData(originalData);
        }
    }, [selectedMarkets, originalData]);

    const fetchPriceLogs = async () => {
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    produce: selectedProduce,
                    // Optional: Add date range if needed, e.g. last 30 days default
                    // start_date: ... 
                }
            };
            const response = await getPriceLogs(config);
            const filteredLogs = response.data;

            // Group by Date
            const processedData = {};

            filteredLogs.forEach(log => {
                const date = log.date;
                // Get Market ID for filtering reference
                const marketId = log.market && log.market.id ? log.market.id : log.market;
                const marketObj = markets.find(m => m.id === marketId);
                const marketName = log.market_name || (marketObj ? marketObj.name : "Unknown");

                if (!processedData[date]) {
                    processedData[date] = { date };
                }
                // Store price keyed by Market Name (for Recharts)
                processedData[date][marketName] = parseFloat(log.price);
            });

            const sortedData = Object.values(processedData).sort((a, b) => new Date(a.date) - new Date(b.date));
            setOriginalData(sortedData);
            filterChartData(sortedData);

        } catch (error) {
            console.error("Error fetching price logs:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterChartData = (data) => {
        // Recharts just needs the keys to exist in the object. 
        // We control which Lines are rendered based on selectedMarkets.
        setChartData(data);
    };

    const toggleMarket = (id) => {
        setSelectedMarkets(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const getMarketName = (id) => markets.find(m => m.id === id)?.name || id;

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Market Price Trends</h3>
                    <p className="text-sm text-gray-500">Compare prices over time.</p>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center gap-4">
                    <select
                        value={selectedProduce}
                        onChange={(e) => setSelectedProduce(e.target.value)}
                        className="bg-stone-50 border border-stone-200 text-gray-700 text-sm font-bold rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-2.5"
                    >
                        {produceList.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
                {markets.map((market, index) => (
                    <button
                        key={market.id}
                        onClick={() => toggleMarket(market.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${selectedMarkets.includes(market.id)
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-white border-stone-200 text-gray-400 hover:border-gray-300'}`}
                    >
                        {selectedMarkets.includes(market.id) && <span className="mr-1" style={{ color: PALETTE[index % PALETTE.length] }}>●</span>}
                        {market.name}
                    </button>
                ))}
            </div>

            <div style={{ width: '100%', height: 350 }}>
                {loading ? (
                    <div className="flex items-center justify-center h-full text-gray-400 font-bold">Loading Data...</div>
                ) : (
                    <ResponsiveContainer>
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }}
                                tickFormatter={(str) => new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            />
                            <YAxis tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend />
                            {markets.filter(m => selectedMarkets.includes(m.id)).map((market, index) => (
                                <Line
                                    key={market.id}
                                    type="monotone"
                                    dataKey={market.name}
                                    stroke={PALETTE[index % PALETTE.length]}
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                    connectNulls
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
            <p className="text-center text-xs text-stone-400 mt-4 italic">Click markers above to toggle markets.</p>
        </div>
    );
};

export default PriceTrendChart;
