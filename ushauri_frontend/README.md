Ushauri Soko 🌽📉
Ushauri Soko ("Market Advice") is a Decision Support System (DSS) for smallholder farmers in Kenya. It uses historical data and transport cost analysis to recommend the most profitable market for selling agricultural produce.

🚀 Features
Profit Calculator: Determines the best market based on transport costs vs. volume.
Price Forecasting: Predicts next-day prices using Simple Moving Average (SMA).
Sales Ledger: Digital bookkeeping for farmers to track revenue.
Visual Trends: Interactive charts showing price history and forecasts.Secure: JWT Authentication protects user data.


🛠️ Tech StackBackend: Django, Django REST Framework, Python.
Frontend: React.js, Tailwind CSS, Recharts.
Database: SQLite (Dev), PostgreSQL (Prod).⚙️ 


Installation Guide
Prerequisites
Python 3.10+
Node.js & npm1. 


1. Backend Setup (Django)# Navigate to backend folder
cd ushauri_backend
# Create virtual environment
python -m venv venv
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Run server
python manage.py runserver


2. Frontend Setup (React)# Navigate to frontend folder
cd ushauri_frontend
# Install dependencies
npm install

# Run development server
npm start
Access the app at http://localhost:3000🧪 

Testing the Logic
1. Log in with your superuser credentials.
2. Go to the "Best Market" tab.
3. Enter a small quantity (e.g., 50 kgs) -> System should recommend Local Market (due to low transport cost).
4. Enter a large quantity (e.g., 2000 kgs) -> System should recommend Nairobi (due to higher selling price).📄 LicenseAcademic Project - Mama Ngina University College.