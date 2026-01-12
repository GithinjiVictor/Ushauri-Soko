
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getSales } from '../../api';

const SalesChart = ({ token }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [token]);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token} ` } };
            const response = await getSales(config);
            // Process data: aggregate revenue by date
            const rawData = response.data;

            const aggregated = rawData.reduce((acc, curr) => {
                const date = curr.date;
                if (!acc[date]) {
                    acc[date] = { date, revenue: 0 };
                }
                acc[date].revenue += parseFloat(curr.total_revenue);
                return acc;
            }, {});

            // Convert to array and sort by date
            const chartData = Object.values(aggregated).sort((a, b) => new Date(a.date) - new Date(b.date));
            setData(chartData);
        } catch (error) {
            console.error("Error fetching sales data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading Sales Data...</div>;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Sales Performance (Revenue)</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#82ca9d" name="Total Revenue (KES)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SalesChart;
