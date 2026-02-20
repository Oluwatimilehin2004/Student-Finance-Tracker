# ALU Finance Tracker

A powerful, privacy-first financial tracking application designed specifically for ALU students. Track expenses, manage budgets, and gain insights into your spending habits — all stored locally in your browser.

---

## Table of Contents

- [Features](#features)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [Keyboard Navigation](#keyboard-navigation)
- [Regex Validation](#regex-validation)
- [Accessibility](#accessibility)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core Functionality

- **Complete CRUD Operations** — Add, edit, delete, and view all transactions
- **Multi-Currency Support** — USD, EUR, and RWF with manual exchange rates
- **Real-time Validation** — Regex-powered input validation with instant feedback
- **Advanced Search** — Regex-powered search with highlighted matches
- **Data Persistence** — All data saved to localStorage
- **Import/Export** — JSON and CSV format support

### Dashboard

- **Financial Overview** — Balance, income, and expenses at a glance
- **Budget Tracking** — Monthly budget with progress bar
- **Recent Transactions** — Last 5 transactions with quick actions

### Statistics Page

- **7-Day Trend Chart** — Visual representation of spending patterns
- **Spending Cap** — Set and track monthly spending limits
- **Category Breakdown** — Top spending categories
- **ARIA Live Updates** — Real-time budget alerts

### Settings

- **Currency Management** — Switch between USD, EUR, and RWF
- **Budget Configuration** — Set monthly spending caps
- **Exchange Rates** — Manual rate adjustment
- **Data Management** — Import/Export functionality

---

## Live Demo

[View Live Demo: https://youtu.be/VrucgA53GUU?si=9LmPbWLs7ExZHX5u ](#https://youtu.be/VrucgA53GUU?si=9LmPbWLs7ExZHX5u)

---

## Tech Stack

- **HTML5** — Semantic markup and accessibility features
- **CSS3** — Custom properties, responsive design, and animations
- **Vanilla JavaScript** — No frameworks, pure ES6+
- **localStorage** — Client-side data persistence
- **Google Fonts** — Poppins & Urbanist typography

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Oluwatimilehin2004/Student-Finance-Tracker.git
cd Student-Finance-Tracker
```

Then open `index.html` using Live Server in VS Code or any local server.

---

## Usage Guide

### First Time Setup

1. Open the app — sample data loads automatically from `seed.json`
2. Navigate to **Settings** to configure your preferred currency, monthly budget cap, and exchange rates

### Adding Transactions

1. Click **Add Transaction** or press `Ctrl/Cmd + N`
2. Select **Expense** or **Income**
3. Enter the amount, description, category, and date
4. Click **Save**

### Editing and Deleting

- Click the edit icon on any transaction to modify it
- Click the delete icon and confirm to remove a transaction

### Searching

- Use regex patterns in the search field (e.g., `coffee|tea`)
- Filter by category using the dropdown
- Click column headers to sort

### Statistics

- View the 7-day spending trend chart
- Set a spending cap and monitor your progress
- Receive real-time ARIA announcements when limits are approached

---

## Keyboard Navigation

| Key | Action |
|---|---|
| `Tab` | Navigate through interactive elements |
| `Shift + Tab` | Navigate backward |
| `Enter` / `Space` | Activate focused element |
| `Ctrl/Cmd + N` | Open Add Transaction modal |
| `Esc` | Close modal / Cancel |
| `/` | Focus search input |
| `Up` / `Down` | Navigate lists, adjust numbers |
| `Tab` in modal | Cycle through form fields |

### Focus Order

1. Skip to content link
2. Sidebar navigation
3. Page header (title, date, Add button)
4. Main content (stats, budget, table)
5. Table actions (edit/delete)
6. Modal form fields

---

## Regex Validation

### Field Validations

| Field | Pattern | Description |
|---|---|---|
| Description | `^(?!\s)(?!.*\s{2})(?!.*\s$).+$` | No leading/trailing spaces or double spaces |
| Amount | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | Positive number with up to 2 decimal places |
| Date | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` | YYYY-MM-DD format |
| Category | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | Letters, spaces, and hyphens only |

### Advanced Regex Patterns

| Pattern | Purpose | Example |
|---|---|---|
| `\b(\w+)\s+\1\b` | Duplicate word detection | "coffee coffee" triggers a warning |
| `\.\d{2}\b` | Cents detection | "12.50" triggers an info message |
| `(coffee\|tea\|soda\|juice)/i` | Beverage detection | "Coffee" triggers an info message |

### Search Examples

| Pattern | Finds |
|---|---|
| `lunch` | Any transaction containing "lunch" |
| `(food\|restaurant)` | Food or restaurant transactions |
| `\d{2}\.\d{2}` | Amounts with cents |
| `^[A-Z]` | Transactions starting with a capital letter |

---

## Accessibility

### ARIA Attributes

- `role="link"` — Navigation items
- `role="button"` — Interactive elements
- `role="progressbar"` — Budget progress
- `role="dialog"` — Modals
- `role="alert"` — Error messages
- `aria-live="polite/assertive"` — Live region updates

### Features

- **Skip link** — First tab reveals a "Skip to main content" link
- **Focus indicators** — Visible outlines on all interactive elements
- **Focus trap** — Modal focus is contained within the dialog
- **Color contrast** — WCAG compliant throughout
- **Semantic HTML** — Proper landmark structure
- **Screen reader support** — Full ARIA implementation

---

## Project Structure

```
alu-finance-tracker/
├── index.html        # Main HTML file
├── style.css         # All styles (1000+ lines)
├── app.js            # Application logic (1000+ lines)
├── seed.json         # Sample transaction data
├── favicon/
│   ├── favicon-16x16.png
│   └── favicon-32x32.png
└── README.md         # Documentation
```

---

## Testing

### Manual Test Cases

- Add an expense transaction
- Add an income transaction
- Edit an existing transaction
- Delete a transaction with confirmation
- Filter by category
- Search with a regex pattern
- Sort columns
- Switch currencies
- Update the budget cap
- Import a JSON file
- Export JSON and CSV
- Toggle dark mode

### Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| Desktop (> 1024px) | Full layout |
| Tablet (768px – 1024px) | Adjusted spacing |
| Mobile (< 768px) | Single column, chart hidden |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## License

This project was created for educational purposes as part of ALU's curriculum.

---

## Author

**Papa**

- GitHub: [@Oluwatimilehin2004](https://github.com/Oluwatimilehin2004)
- Email: a.ojudun@alustudent.com

---

## Acknowledgments

- ALU for the project requirements
- Font Awesome for icon inspiration
- Google Fonts for Poppins and Urbanist
