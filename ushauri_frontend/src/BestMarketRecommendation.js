import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BestMarketRecommendation = () => {
  const [markets, setMarkets] = useState([]);
  const [prices, setPrices] = useState([]);
  const [volume, setVolume] = useState(1000); // Default volume 1000kg
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

    const fetchData = async () => {
      try {
        const [marketsRes, pricesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/markets/`),
          axios.get(`${API_BASE_URL}/api/pricelogs/`) // Changed to pricelogs based on your other component
        ]);

        setMarkets(marketsRes.data);
        setPrices(pricesRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading engine data:", err);
        setError("Failed to load market or price data. Ensure backend is running.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // The Optimization Algorithm
  useEffect(() => {
    if (markets.length === 0 || prices.length === 0) return;

    // 1. Get unique produce types
    // Use produce_name from serializer, fallback to 'Unknown'
    const produceTypes = [...new Set(prices.map(p => p.produce_name || p.produce || "Unknown"))];
    
    const newRecommendations = produceTypes.map(produce => {
      // Get all prices for this produce
      const productPrices = prices.filter(p => (p.produce_name || p.produce || "Unknown") === produce);
      
      // Calculate profit for each market option
      const options = productPrices.map(priceLog => {
        // Find the full market details (costs) matching this price log
        // Match by Name (preferred if serializer sends it) or ID
        const marketName = priceLog.market_name || priceLog.market;
        const marketDetails = markets.find(m => m.name === marketName || m.id === priceLog.market);
        
        if (!marketDetails) return null;

        // THE CORE FORMULA: (Price * Volume) - Transport - Fees
        const pricePerUnit = parseFloat(priceLog.price);
        const transportCost = parseFloat(marketDetails.transport_cost);
        const marketFee = parseFloat(marketDetails.market_fee);
        
        const grossRevenue = pricePerUnit * volume;
        const totalCost = transportCost + marketFee;
        const netProfit = grossRevenue - totalCost;

        return {
          market: marketDetails.name,
          price: pricePerUnit,
          transport: transportCost,
          fee: marketFee,
          netProfit: netProfit
        };
      }).filter(Boolean); // Remove nulls

      // Find the winner (Max Profit)
      if (options.length === 0) return null;
      
      // Sort descending by profit
      options.sort((a, b) => b.netProfit - a.netProfit);
      
      return {
        produce: produce,
        bestOption: options[0],
        allOptions: options
      };
    }).filter(Boolean);

    setRecommendations(newRecommendations);

  }, [markets, prices, volume]); // Re-run whenever data or volume changes

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="component-container recommendation-box">
      <h2>💰 Best Market Recommendation (The Engine)</h2>
      
      <div className="input-group">
        <label>Enter Volume to Sell (Kg): </label>
        <input 
          type="number" 
          value={volume} 
          onChange={(e) => setVolume(Number(e.target.value))}
          className="volume-input"
        />
      </div>

      {loading ? <p>Loading engine data...</p> : (
        <div className="results-grid">
          {recommendations.length === 0 ? <p>No recommendations available. Add market/price data.</p> :
          recommendations.map((rec, index) => (
            <div key={index} className="recommendation-card">
              <h3 className="produce-title">{rec.produce}</h3>
              
              <div className="winner-section">
                <span className="trophy">🏆 BEST CHOICE:</span>
                <span className="winner-name">{rec.bestOption.market}</span>
                <div className="profit-display">
                  Est. Net Profit: <strong>KES {rec.bestOption.netProfit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
                </div>
              </div>

              <details>
                <summary>View Calculation / Other Markets</summary>
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Market</th>
                      <th>Price/Kg</th>
                      <th>Costs (Trans+Fee)</th>
                      <th>Net Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rec.allOptions.map((opt, i) => (
                      <tr key={i} style={{fontWeight: i===0 ? 'bold' : 'normal', backgroundColor: i===0 ? '#f0fdf4' : 'transparent'}}>
                        <td>{opt.market}</td>
                        <td>{opt.price.toFixed(2)}</td>
                        <td>{(opt.transport + opt.fee).toLocaleString()}</td>
                        <td>{opt.netProfit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BestMarketRecommendation;