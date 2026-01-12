# Ushauri Soko 🥬📊
> **Market Intelligence for Kenyan Farmers**

**Ushauri Soko** ("Market Advice" in Swahili) is a data-driven decision support system designed to help smallholder farmers in Kenya maximize their profits. By analyzing historical price trends, real-time market data, and transport costs, the application recommends the best markets to sell produce, ensuring farmers move away from guesswork and towards data-backed decisions.

---

## 🚀 Features

*   **📈 Price Trends & Forecasting**: Analyze 7-day historical price trends and see future price predictions for different crops using Simple Moving Average (SMA) algorithms.
*   **💰 Profit Engine**: A built-in calculator that takes your produce quantity and location to compute **Net Profit** (Revenue - Transport Costs - Market Fees).
*   **🌍 Multi-Market Support**: Compare prices across different markets (e.g., Nairobi vs. Nakuru vs. Eldorado) to find arbitrage opportunities.
*   **📡 Real-Time Data**: Switch between a "Demo Mode" and "Live Database" to see actual market prices.
*   **📊 Interactive Charts**: Visual graphs with tooltips to spot rising and falling market trends instantly.

---

## 🛠️ Tools Used

### **Frontend**
*   **React.js**: Core framework for building a dynamic, single-page application.
*   **Tailwind CSS**: For a modern, responsive, and beautiful user interface (Glassmorphism, Gradients).
*   **Recharts**: For rendering the interactive Price Trend Area Charts.
*   **Lucide React**: For consistent and clean iconography.

### **Backend**
*   **Django REST Framework (DRF)**: Robust API for managing Markets, Produce, Price Logs, and Sales Records.
*   **Python**: Core logic for forecast algorithms and data processing.
*   **SQLite**: Lightweight database for development.

---

## 💻 How To Run

### Prerequisites
*   Node.js (v16+)
*   Python (v3.8+)

### 1. Start the Backend (Django)
Navigate to the root directory:
```bash
# Activate virtual environment (Windows)
./venv/Scripts/activate

# Run the server
python manage.py runserver
```
*The API will run at `http://127.0.0.1:8000/`*

### 2. Start the Frontend (React)
Open a new terminal and navigate to the frontend folder:
```bash
cd ushauri_frontend

# Install dependencies (if first time)
npm install

# Start the dev server
npm start
```
*The app will open at `http://localhost:3000/`*

---

## 🧠 What I Have Learned
Building Ushauri Soko has been a deep dive into **Full-Stack Development**:

1.  **Frontend-Backend Integration**: Connecting a React frontend to a Django API using `fetch` and JWT Authentication.
2.  **Data Visualization**: Learning how to map raw JSON data from an API into meaningful charts using `Recharts`.
3.  **State Management**: Using React hooks (`useState`, `useMemo`, `useEffect`) to build complex filters (like the Market Filter in Trends) that react instantly to user input.
4.  **Algorithm Implementation**: Translating a business requirement ("Predict prices") into code using a Simple Moving Average algorithm on the backend.
5.  **User Experience (UX)**: designing for non-technical users (farmers) by using clear indicators (Green = Rising, Red = Falling) and "Net Profit" calculations.

---

**© 2025 Mama Ngina University Project**
