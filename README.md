# Financial Ledger API (Double-Entry Bookkeeping)

A backend REST API that implements a **double-entry accounting ledger** for a mock banking system. The application focuses on **correctness, data integrity, and auditability**, rather than simple CRUD operations.

This project demonstrates how real-world financial systems track money movements using immutable ledger entries and ACID-compliant database transactions.

---

##  Features

* Create user accounts (checking/savings style)
* Perform internal transfers between accounts
* Double-entry bookkeeping (debit + credit for every transfer)
* Immutable ledger (append-only transaction history)
* Accurate balance calculation derived from ledger entries
* Prevention of negative balances
* Safe handling of concurrent transfers using database transactions

---

##  Tech Stack

* **Backend:** Node.js, Express
* **Database:** MySQL 8.x
* **Driver:** mysql2
* **ID Generation:** UUID
* **Environment Management:** dotenv
* **Testing:** Postman

---

##  Project Structure

```
ledger-core/
├── backend/
│   ├── api/                # Route definitions
│   │   ├── account.api.js
│   │   └── transfer.api.js
│   ├── handlers/           # Controllers / request handlers
│   │   ├── account.handler.js
│   │   └── transfer.handler.js
│   ├── logic/              # Core business logic (ledger)
│   │   └── ledger.logic.js
│   ├── database/           # Database connection
│   │   └── connection.js
│   ├── app.js              # Express app setup
│   └── start.js            # Server entry point
│
├── database_sql/
│   └── tables.sql          # Database schema
│
├── .gitignore
├── package.json
└── README.md
```

---

##  Local Setup Instructions

###  Prerequisites

* Node.js (v18+ recommended)
* MySQL Server 8.x
* Git

---

###  Clone the Repository

```bash
git clone <your-github-repo-url>
cd ledger-core
```

---

###  Install Dependencies

```bash
npm install
```

---

###  Database Setup (MySQL)

Login to MySQL:

```bash
mysql -u root -p
```

Create database:

```sql
CREATE DATABASE ledgerdb;
EXIT;
```

Create tables:

```bash
mysql -u root -p ledgerdb < database_sql/tables.sql
```

---

###  Environment Configuration

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ledgerdb
PORT=3000
```

>  **Do not commit `.env` to GitHub**

---

###  Run the Server

```bash
node backend/start.js
```

Expected output:

```
Ledger API running on port 3000
```

---

## 🔌 API Endpoints

### Create Account

`POST /accounts`

```json
{
  "user_name": "Asha",
  "account_type": "savings",
  "currency": "INR"
}
```

---

### Transfer Money

`POST /transfers`

```json
{
  "fromAccount": "ACCOUNT_ID_1",
  "toAccount": "ACCOUNT_ID_2",
  "amount": 100,
  "description": "Test transfer"
}
```

---

##  Design Decisions

### Double-Entry Bookkeeping Model

Each financial transfer generates **exactly two ledger entries**:

* A **debit** from the source account
* A **credit** to the destination account

The sum of all ledger entries for a transaction is always zero, ensuring accounting correctness.

Ledger entries are **immutable** and stored in an append-only table.

---

### ACID Transactions Strategy

All operations involved in a transfer (balance check, transaction creation, ledger inserts) are wrapped in a **single database transaction**:

* `BEGIN`
* Perform validations and inserts
* `COMMIT` on success
* `ROLLBACK` on failure

This guarantees:

* **Atomicity** – all or nothing
* **Consistency** – database remains valid
* **Isolation** – safe concurrent execution
* **Durability** – committed data persists

---

### Transaction Isolation Level

The system relies on MySQL’s default **READ COMMITTED** isolation level, which:

* Prevents dirty reads
* Is sufficient for preventing inconsistent balances
* Balances correctness and performance for this use case

---

### Balance Calculation & Negative Balance Prevention

* Account balances are **not stored** in the accounts table
* Balances are calculated dynamically by summing ledger entries

```sql
SUM(credit amounts) - SUM(debit amounts)
```

Before committing a transfer, the system checks if the source account’s resulting balance would become negative. If so, the transaction is rolled back.

---

##  Architecture Overview (Textual Diagram)

```
Client (Postman)
   |
   v
API Layer (Express Routes)
   |
   v
Handler Layer (Controllers)
   |
   v
Ledger Logic (Business Rules)
   |
   v
MySQL Database (ACID Transactions)
```

---

##  Database Schema (ERD Description)

### Accounts

* id (PK)
* user_name
* account_type
* currency
* status

### Transactions

* id (PK)
* type
* status
* description

### Ledger Entries

* id (PK)
* account_id (FK → Accounts)
* transaction_id (FK → Transactions)
* entry_type (debit / credit)
* amount
* created_at

---

##  API Testing

A Postman collection is provided to test:

* Account creation
* Transfers

Use Postman or curl to verify API behavior and inspect ledger entries directly in MySQL.

---

##  Conclusion

This project demonstrates a **correct, auditable, and industry-aligned financial ledger system**. It emphasizes correctness over convenience and reflects real-world backend design principles used in banking and payment systems.

---

##  Author

Surekha Reddy Gudimetla
