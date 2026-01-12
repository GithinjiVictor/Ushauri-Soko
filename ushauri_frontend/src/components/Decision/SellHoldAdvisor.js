import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

const API_BASE_URL = "http://127.0.0.1:8000";

const SellHoldAdvisor = ({ token }) => {
    const [forecasts, setForecasts] = useState([]);
    const [latestPrices, setLatestPrices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [forecastRes, priceRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/forecasts/`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_BASE_URL}/api/latest-prices/`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setForecasts(forecastRes.data);
                setLatestPrices(priceRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching advisor data:", error);
                setLoading(false);
            }
        };

        if (token) fetchData();
    }, [token]);

    const getAdvice = (forecast) => {
        // Find current price for this produce in this market
        const currentPriceLog = latestPrices.find(p =>
            p.market_name === forecast.market &&
            p.produce_name === forecast.produce
        );

        const currentPrice = currentPriceLog ? parseFloat(currentPriceLog.price) : null;
        const predictedPrice = parseFloat(forecast.predicted_price);

        // Default if we don't have current price info (Fallback to bullish for optimism, or neutral)
        if (currentPrice === null) {
            return {
                action: "NO DATA",
                color: "bg-gray-100 text-gray-800 border-gray-200",
                icon: <Minus className="w-5 h-5 text-gray-400" />,
                reason: "No current price data available to compare."
            };
        }

        const isBullish = predictedPrice > currentPrice;
        const diff = predictedPrice - currentPrice;
        const percent = ((diff / currentPrice) * 100).toFixed(1);

        if (isBullish) {
            return {
                action: "HOLD",
                color: "bg-emerald-100 text-emerald-800 border-emerald-200",
                icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
                reason: `Prices expected to RISE to ${predictedPrice} (+${percent}%).`,
                current: currentPrice
            };
        } else {
            return {
                action: "SELL",
                color: "bg-rose-100 text-rose-800 border-rose-200",
                icon: <TrendingDown className="w-5 h-5 text-rose-600" />,
                reason: `Prices expected to DROP to ${predictedPrice} (${percent}%).`,
                current: currentPrice
            };
        }
    };

    if (loading) return <div className="p-4 text-center text-gray-400">Loading Intelligence...</div>;

    if (forecasts.length === 0) return (
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-stone-100 text-center">
            <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Not enough data to generate advice.</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="bg-purple-600 text-white p-1 rounded-md"><TrendingUp className="w-4 h-4" /></span>
                AI Trade Advisor
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {forecasts.slice(0, 6).map((item, idx) => {
                    const advice = getAdvice(item);
                    return (
                        <div key={idx} className={`p-5 rounded-2xl border-2 ${advice.color} flex flex-col justify-between shadow-sm relative overflow-hidden transition-all hover:scale-[1.02]`}>
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                {advice.icon}
                            </div>

                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider opacity-70">{item.market}</p>
                                        <h3 className="font-black text-lg">{item.produce}</h3>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-mono font-bold text-xl block">{item.predicted_price}</span>
                                        {advice.current && <span className="text-xs font-bold opacity-60 line-through">was {advice.current}</span>}
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-black/5">
                                    <div className="flex items-center gap-2 font-black text-lg mb-1">
                                        {advice.icon}
                                        <span>{advice.action}</span>
                                    </div>
                                    <p className="text-sm font-medium leading-tight opacity-90">
                                        {advice.reason}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SellHoldAdvisor;
