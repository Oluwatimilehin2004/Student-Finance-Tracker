

📊 ALU Finance Tracker
A powerful, privacy-first financial tracking application designed specifically for ALU students. Track expenses, manage budgets, and gain insights into your spending habits - all stored locally in your browser.

https://screenshot.png

📋 Table of Contents
Features

Live Demo

Tech Stack

Installation

Usage Guide

Keyboard Navigation

Regex Validation

Accessibility

Project Structure

Contributing

License

✨ Features
Core Functionality
✅ Complete CRUD Operations - Add, edit, delete, and view all transactions

✅ Multi-Currency Support - USD, EUR, and RWF with manual exchange rates

✅ Real-time Validation - Regex-powered input validation with instant feedback

✅ Advanced Search - Regex-powered search with highlight matches

✅ Data Persistence - All data saved to localStorage

✅ Import/Export - JSON and CSV format support

Dashboard
📊 Financial Overview - Balance, income, and expenses at a glance

📈 Budget Tracking - Monthly budget with progress bar

🕒 Recent Transactions - Last 5 transactions with quick actions

Statistics Page
📉 7-Day Trend Chart - Visual representation of spending patterns

🎯 Spending Cap - Set and track monthly spending limits

🏷️ Category Breakdown - Top spending categories

🔔 ARIA Live Updates - Real-time budget alerts

Settings
💱 Currency Management - Switch between USD, EUR, RWF

💰 Budget Configuration - Set monthly spending caps

🔄 Exchange Rates - Manual rate adjustment

📁 Data Management - Import/Export functionality

🌐 Live Demo
View Live Demo

🛠️ Tech Stack
HTML5 - Semantic markup, accessibility features

CSS3 - Custom properties, responsive design, animations

Vanilla JavaScript - No frameworks, pure ES6+

LocalStorage - Client-side data persistence

Google Fonts - Poppins & Urbanist typography

📦 Installation
Clone the repository

bash
git clone https://github.com/yourusername/alu-finance-tracker.git
cd alu-finance-tracker
Project Structure

text
alu-finance-tracker/
├── index.html          # Main application
├── style.css           # All styles
├── app.js              # Application logic
├── seed.json           # Sample data
├── favicon/            # Icon assets
│   ├── favicon-16x16.png
│   └── favicon-32x32.png
└── README.md           # Documentation
Run Locally

Use Live Server in VS Code or any local server

Open index.html in your browser

🚀 Usage Guide
First Time Setup
Open the app - sample data loads automatically from seed.json

Navigate to Settings to configure:

Preferred currency

Monthly budget cap

Exchange rates

Adding Transactions
Click "Add Transaction" button or press Ctrl/Cmd + N

Select Expense or Income

Enter amount, description, category, and date

Click Save

Editing/Deleting
Click Edit (✏️) icon on any transaction

Click Delete (🗑️) icon and confirm

Searching
Use regex patterns in search (e.g., coffee|tea)

Filter by category dropdown

Click column headers to sort

Statistics
View 7-day spending trend chart

Set spending cap and monitor progress

Get real-time ARIA announcements

⌨️ Keyboard Navigation
Key	Action
Tab	Navigate through interactive elements
Shift + Tab	Navigate backward
Enter / Space	Activate focused element
Ctrl/Cmd + N	Open Add Transaction modal
Esc	Close modal / Cancel
/	Focus search input
↑ / ↓	Navigate lists, adjust numbers
Tab in modal	Cycle through form fields
Focus Order
Skip to content link

Sidebar navigation

Page header (title, date, Add button)

Main content (stats, budget, table)

Table actions (edit/delete)

Modal form fields

🔍 Regex Validation
Field Validations
Field	Pattern	Description
Description	^(?!\s)(?!.*\s{2})(?!.*\s$).+$	No leading/trailing spaces or double spaces
Amount	^(0|[1-9]\d*)(\.\d{1,2})?$	Positive number with up to 2 decimals
Date	^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$	YYYY-MM-DD format
Category	^[A-Za-z]+(?:[ -][A-Za-z]+)*$	Letters, spaces, and hyphens only
Advanced Regex Patterns
Pattern	Purpose	Example
\b(\w+)\s+\1\b	Duplicate word detection	"coffee coffee" → Warning
\.\d{2}\b	Cents detection	"12.50" → Info message
(coffee|tea|soda|juice)/i	Beverage detection	"Coffee" → Info message
Search Examples
Pattern	Finds
lunch	Any transaction with "lunch"
(food|restaurant)	Food or restaurant transactions
\d{2}\.\d{2}	Amounts with cents
^[A-Z]	Transactions starting with capital letter
♿ Accessibility
ARIA Attributes
role="link" - Navigation items

role="button" - Interactive elements

role="progressbar" - Budget progress

role="dialog" - Modals

role="alert" - Error messages

aria-live="polite/assertive" - Live region updates

Features
✅ Skip link - First tab reveals "Skip to main content"

✅ Focus indicators - Visible outlines on all elements

✅ Focus trap - Modal focus management

✅ Color contrast - WCAG compliant

✅ Semantic HTML - Proper landmark structure

✅ Screen reader support - Full ARIA implementation

📁 Project Structure
text
alu-finance-tracker/
├── 📄 index.html          # Main HTML file
├── 📄 style.css           # All styles (1000+ lines)
├── 📄 app.js              # Application logic (1000+ lines)
├── 📄 seed.json           # Sample transaction data
├── 📁 favicon/            # Icon assets
│   ├── favicon-16x16.png
│   └── favicon-32x32.png
└── 📄 README.md           # Documentation
🧪 Testing
Manual Test Cases
Add expense transaction

Add income transaction

Edit existing transaction

Delete transaction with confirmation

Filter by category

Search with regex

Sort columns

Switch currencies

Update budget cap

Import JSON file

Export JSON/CSV

Toggle dark mode

Responsive Breakpoints
Desktop > 1024px - Full layout

Tablet 768px - 1024px - Adjusted spacing

Mobile < 768px - Single column, hidden chart

🤝 Contributing
Fork the repository

Create feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
This project is created for educational purposes as part of ALU's curriculum.

👨‍💻 Author
Papa

GitHub: @Oluwatimilehin2004

Email: a.ojudun@alustudent.com

🙏 Acknowledgments
ALU for the project requirements

Font Awesome for icon inspiration

Google Fonts for Poppins and Urbanist

Built with ❤️ by Papa