import React from 'react';
import SalesChart from './components/Reports/SalesChart';
import PriceTrendChart from './components/Reports/PriceTrendChart';
import axios from 'axios';
import { Download } from 'lucide-react';

const ReportsDashboard = ({ token }) => {

    const downloadReport = async (type, format = 'excel') => {
        try {
            const endpoint = format === 'pdf' ? `${type}/pdf` : type;
            const extension = format === 'pdf' ? 'pdf' : 'xlsx';

            const response = await axios.get(`http://127.0.0.1:8000/api/export/${endpoint}/`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}_report.${extension}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download report.");
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Analytics & Reports</h1>
                    <div className="flex gap-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-400 uppercase">Sales Report</span>
                            <div className="flex gap-2">
                                <button onClick={() => downloadReport('sales', 'excel')} className="px-3 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow hover:bg-emerald-700 transition-transform active:scale-95 text-xs flex items-center gap-1">
                                    <Download className="w-3 h-3" /> Excel
                                </button>
                                <button onClick={() => downloadReport('sales', 'pdf')} className="px-3 py-2 bg-rose-600 text-white font-bold rounded-lg shadow hover:bg-rose-700 transition-transform active:scale-95 text-xs flex items-center gap-1">
                                    <Download className="w-3 h-3" /> PDF
                                </button>
                            </div>
                        </div>
                        <div className="w-px bg-gray-300 mx-2"></div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-400 uppercase">Price Data</span>
                            <div className="flex gap-2">
                                <button onClick={() => downloadReport('prices', 'excel')} className="px-3 py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition-transform active:scale-95 text-xs flex items-center gap-1">
                                    <Download className="w-3 h-3" /> Excel
                                </button>
                                <button onClick={() => downloadReport('prices', 'pdf')} className="px-3 py-2 bg-rose-600 text-white font-bold rounded-lg shadow hover:bg-rose-700 transition-transform active:scale-95 text-xs flex items-center gap-1">
                                    <Download className="w-3 h-3" /> PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Sales Section */}
                    <section>
                        <SalesChart token={token} />
                    </section>

                    {/* Trends Section */}
                    <section>
                        <PriceTrendChart token={token} />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ReportsDashboard;
