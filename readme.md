# 💸 Expense Tracker API (Backend)

A robust backend service for personal finance management. Users can track their income and expenses, categorize transactions, and generate monthly financial reports.

## 🚀 Features

- **User Authentication**: Secure login and registration.
- **Balance Management**: Real-time updates of total balance based on transactions.
- **Transaction Logging**: 
    - Log Income or Expenses.
    - Assign categories (e.g., Food, Salary, Rent).
    - Add optional descriptive notes.
- **Monthly Reports**: Dynamic report generation for any specific month via route parameters.

## 🛠️ Tech Stack

- **Node.js** & **Express.js**: Backend framework.
- **MongoDB**: Database for storing users and transactions.
- **JWT**: For secure user sessions.
- **Mongoose**: For data modeling.

## 📂 API Endpoints

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/v1/users/register` | Create a new account |
| POST | `/api/v1/users/login` | Login and receive token |

### Transactions
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/v1/transactions` | Log a new income/expense |
| GET | `/api/v1/transactions/report` | Get all transaction history |
| GET | `/api/v1/transactions/report?month&year` | Get report for a specific month and year (e.g., `/report?moth=3&year=2026`) |
| GET | `/api/v1/transactions/reportmonth&year&category>` | Get report for a specific month,year and category |

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Saadtariq12/ExpenseTracker.git](https://github.com/Saadtariq12/ExpenseTracker.git)
   cd ExpenseTracker
2. npm install
3.  PORT=8000
    MONGODB_URI=your_mongodb_connection_string
    ACCESS_TOKEN_SECRET=your_secret_key
4. npm run dev