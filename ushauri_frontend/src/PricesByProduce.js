import React, { useEffect, useState } from "react";
import axios from "axios";

function PricesByProduce() {
  const [priceLogs, setPriceLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Determine the base URL dynamically or fallback to localhost
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';
    
    axios.get(`${API_BASE_URL}/api/pricelogs/`) // Uses your dynamic URL
      .then((res) => {
        setPriceLogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading price logs:", err);
        setLoading(false);
      });
  }, []);

  const groupedPrices = priceLogs.reduce((acc, log) => {
    // Robust check: uses name if available, falls back to ID, then "Unknown"
    const produceName = log.produce_name || log.produce || "Unknown Produce";
    const marketName = log.market_name || log.market || "Unknown Market";
    const priceNum = Number(log.price);

    if (!acc[produceName]) acc[produceName] = {};
    // Store price per market for this produce
    acc[produceName][marketName] = isNaN(priceNum) ? 0 : priceNum;
    return acc;
  }, {});

  if (loading) return <p>Loading prices...</p>;
  if (priceLogs.length === 0) return <p>No price logs available.</p>;

  return (
    <div style={{ padding: 20 }} className="component-container">
      <h2>Produce Prices by Market</h2>
      {Object.entries(groupedPrices).map(([produce, markets]) => (
        <div key={produce} style={{ marginBottom: 20 }} className="produce-card">
          <h3>{produce}</h3>
          <ul>
            {Object.entries(markets).map(([market, price]) => (
              <li key={market}>
                <strong>{market}:</strong> KES {price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default PricesByProduce;