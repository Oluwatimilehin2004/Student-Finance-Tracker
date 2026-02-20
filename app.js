// ALU Finance Tracker - Complete Working Version
(function() {
    'use strict';

    // ========== DATA ==========
    let state = {
        transactions: [],
        settings: {
            currency: 'USD',
            budgetCap: 1000,
            theme: 'light',
            exchangeRates: { USD: 1, EUR: 0.92, RWF: 1455 }
        },
        editingId: null,
        cap: 1000 // For stats page
    };

    // ========== DOM ELEMENTS ==========
    const elements = {};

    // ========== VALIDATION RULES ==========
    const VALIDATORS = {
        description: {
            pattern: /^(?!\s)(?!.*\s{2})(?!.*\s$).+$/,
            message: 'No leading/trailing spaces or double spaces'
        },
        amount: {
            pattern: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
            message: 'Positive number with up to 2 decimals'
        },
        date: {
            pattern: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
            message: 'Use YYYY-MM-DD format'
        },
        category: {
            pattern: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
            message: 'Letters, spaces, and hyphens only'
        },
        duplicateWords: /\b(\w+)\s+\1\b/i,
        hasCents: /\.\d{2}\b/,
        isBeverage: /(coffee|tea|soda|juice)/i
    };

    // ========== UTILITY FUNCTIONS ==========
    const utils = {
        // FIXED: Currency conversion for all 3 currencies
        formatCurrency: (amount) => {
            const currency = state.settings.currency;
            const rate = state.settings.exchangeRates[currency] || 1;
            
            // Convert USD to target currency
            const converted = amount * rate;
            
            // Format based on currency
            if (currency === 'USD') {
                // USD: $1,234.56
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(converted);
            }
            
            if (currency === 'EUR') {
                // EUR: €1.234,56 (European format)
                return new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(converted);
            }
            
            if (currency === 'RWF') {
                // RWF: 1,234,567 Frw (no decimals)
                const rounded = Math.round(converted);
                return new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(rounded) + ' Frw';
            }
            
            // Fallback
            return converted.toFixed(2) + ' ' + currency;
        },

        formatDate: (dateString) => {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        },

        generateId: () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5),

        validateField: (field, value) => {
            const errors = [];
            const warnings = [];

            if (!value) return { errors: ['Required'], warnings: [] };

            if (field === 'description') {
                if (!VALIDATORS.description.pattern.test(value)) {
                    errors.push(VALIDATORS.description.message);
                }
                if (VALIDATORS.duplicateWords.test(value)) {
                    warnings.push('Duplicate words detected');
                }
                if (VALIDATORS.isBeverage.test(value)) {
                    warnings.push('Beverage purchase detected');
                }
            }
            else if (field === 'amount') {
                if (!VALIDATORS.amount.pattern.test(value)) {
                    errors.push(VALIDATORS.amount.message);
                } else if (VALIDATORS.hasCents.test(value)) {
                    warnings.push('Includes cents');
                }
            }
            else if (field === 'date') {
                if (!VALIDATORS.date.pattern.test(value)) {
                    errors.push(VALIDATORS.date.message);
                }
            }
            else if (field === 'category') {
                if (!VALIDATORS.category.pattern.test(value)) {
                    errors.push(VALIDATORS.category.message);
                }
            }

            return { errors, warnings };
        },

        filterTransactions: (transactions, search, category) => {
            let filtered = [...transactions];

            if (search) {
                try {
                    const regex = new RegExp(search, 'i');
                    filtered = filtered.filter(t => 
                        regex.test(t.description) || regex.test(t.category)
                    );
                } catch (e) {}
            }

            if (category && category !== 'all') {
                filtered = filtered.filter(t => t.category === category);
            }

            return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        },

        highlightText: (text, search) => {
            if (!search) return text;
            try {
                const regex = new RegExp(search, 'i');
                return text.replace(regex, match => `<span class="highlight">${match}</span>`);
            } catch (e) {
                return text;
            }
        },

        setTheme: (theme) => {
            if (theme === 'dark') {
                document.body.classList.add('dark');
                const icon = document.getElementById('theme-icon');
                if (icon) icon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>';
            } else {
                document.body.classList.remove('dark');
                const icon = document.getElementById('theme-icon');
                if (icon) icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
            }
        },

        showNotification: (msg) => alert(msg)
    };

    // ========== DASHBOARD FUNCTIONS ==========
    const dashboard = {
        calculateStats: () => {
            let balance = 0, income = 0, expenses = 0;
            
            state.transactions.forEach(t => {
                balance += t.amount;
                if (t.amount > 0) income += t.amount;
                else expenses += Math.abs(t.amount);
            });
            
            return { balance, income, expenses };
        },

        update: () => {
            const stats = dashboard.calculateStats();
            const budgetCap = state.settings.budgetCap || 1000;
            
            if (elements.balance) {
                elements.balance.textContent = utils.formatCurrency(stats.balance);
            }
            if (elements.income) {
                elements.income.textContent = utils.formatCurrency(stats.income);
            }
            if (elements.expenses) {
                elements.expenses.textContent = utils.formatCurrency(stats.expenses);
            }
            
            if (elements.budgetSpent) {
                elements.budgetSpent.textContent = utils.formatCurrency(stats.expenses);
            }
            if (elements.spentAmount) {
                elements.spentAmount.textContent = utils.formatCurrency(stats.expenses);
            }
            
            const remaining = budgetCap - stats.expenses;
            if (elements.remainingAmount) {
                elements.remainingAmount.textContent = utils.formatCurrency(Math.max(0, remaining));
            }
            
            const percentage = budgetCap > 0 ? Math.min((stats.expenses / budgetCap) * 100, 100) : 0;
            if (elements.budgetProgress) {
                elements.budgetProgress.style.width = percentage + '%';
            }
            
            dashboard.renderRecent();
        },

        renderRecent: () => {
            if (!elements.transactionsList) return;
            
            const recent = [...state.transactions]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5);
            
            if (recent.length === 0) {
                elements.transactionsList.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 30px;">No transactions yet</td></tr>';
                return;
            }

            elements.transactionsList.innerHTML = recent.map(t => {
                const amountClass = t.amount > 0 ? 'income-row' : 'expense-row';
                return `
                    <tr>
                        <td>${utils.formatDate(t.date)}</td>
                        <td>${t.description}</td>
                        <td><span class="category-badge">${t.category}</span></td>
                        <td class="${amountClass}">${utils.formatCurrency(Math.abs(t.amount))}</td>
                        <td class="actions">
                            <button class="action-btn" onclick="window.app.edit('${t.id}')">
                                <svg viewBox="0 0 24 24"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                            </button>
                            <button class="action-btn" onclick="window.app.delete('${t.id}')">
                                <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    };

    // ========== STATS PAGE FUNCTIONS ==========
    const stats = {
        calculate: () => {
            const now = new Date();
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            
            const last7Days = state.transactions.filter(t => 
                new Date(t.date) >= sevenDaysAgo && t.amount < 0
            );

            const totalSpent = last7Days.reduce((sum, t) => sum + Math.abs(t.amount), 0);
            
            const categoryTotals = {};
            last7Days.forEach(t => {
                const cat = t.category;
                categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(t.amount);
            });

            let topCategory = '-';
            let topAmount = 0;
            Object.entries(categoryTotals).forEach(([name, amount]) => {
                if (amount > topAmount) {
                    topCategory = name;
                    topAmount = amount;
                }
            });

            const dailyTotals = [];
            const labels = [];
            
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                
                const dayTotal = last7Days
                    .filter(t => t.date === dateStr)
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
                
                dailyTotals.push(dayTotal);
                labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            }

            return {
                totalRecords: last7Days.length,
                totalSpent,
                topCategory,
                dailyTotals,
                labels
            };
        },

        update: () => {
            const data = stats.calculate();
            const cap = state.cap || state.settings.budgetCap || 1000;
            
            if (elements.totalRecords) {
                elements.totalRecords.textContent = data.totalRecords;
            }
            if (elements.totalSpent) {
                elements.totalSpent.textContent = utils.formatCurrency(data.totalSpent);
            }
            if (elements.topCategory) {
                elements.topCategory.textContent = data.topCategory;
            }
            
            stats.renderChart(data.dailyTotals, data.labels);
            
            const percentage = cap > 0 ? Math.min((data.totalSpent / cap) * 100, 100) : 0;
            if (elements.progressFill) {
                elements.progressFill.style.width = percentage + '%';
            }
            if (elements.progressPercentage) {
                elements.progressPercentage.textContent = percentage.toFixed(1) + '%';
            }
            if (elements.currentSpending) {
                elements.currentSpending.textContent = utils.formatCurrency(data.totalSpent);
            }
            
            stats.updateAriaMessage(data.totalSpent, cap);
        },

        renderChart: (dailyTotals, labels) => {
            if (!elements.barChart) return;
            
            const maxValue = Math.max(...dailyTotals, 1);
            
            if (dailyTotals.every(val => val === 0)) {
                elements.barChart.innerHTML = `
                    <div class="empty-chart-message" style="
                        text-align: center; 
                        padding: 40px 20px; 
                        color: var(--text-secondary);
                        background: var(--bg-white);
                        border-radius: 8px;
                        width: 100%;
                    ">
                        <div style="font-size: 48px; margin-bottom: 10px;">📊</div>
                        <div style="font-size: 16px; font-weight: 600; margin-bottom: 5px;">No expenses in last 7 days</div>
                        <div style="font-size: 14px;">Add some expenses to see your spending trend!</div>
                    </div>
                `;
                return;
            }
            
            const maxBarHeight = 140;
            
            elements.barChart.innerHTML = dailyTotals.map((value, index) => {
                const heightPercentage = (value / maxValue) * 100;
                const barHeightPx = (heightPercentage / 100) * maxBarHeight;
                
                return `
                    <div class="bar-wrapper" style="
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: flex-end;
                        height: 100%;
                        gap: 4px;
                    ">
                        <div class="bar-value" style="
                            font-size: 11px;
                            color: var(--red);
                            font-weight: 600;
                            margin-bottom: 2px;
                        ">${utils.formatCurrency(value)}</div>
                        <div class="bar" style="
                            width: 70%;
                            background: linear-gradient(180deg, #D00D2D 0%, #a00a24 100%);
                            border-radius: 6px 6px 2px 2px;
                            height: ${barHeightPx}px;
                            transition: height 0.3s ease;
                            box-shadow: 0 -2px 5px rgba(208,13,45,0.2);
                        "></div>
                        <div class="bar-label" style="
                            font-size: 12px;
                            color: var(--text-secondary);
                            font-weight: 500;
                            margin-top: 4px;
                        ">${labels[index]}</div>
                    </div>
                `;
            }).join('');
        },

        updateAriaMessage: (totalSpent, cap) => {
            const remaining = cap - totalSpent;
            const percentage = cap > 0 ? (totalSpent / cap) * 100 : 0;
            
            let message = '';
            let politeness = 'polite';
            let icon = '💰';
            
            if (totalSpent === 0) {
                message = 'No spending in last 7 days. Set a cap to track.';
                icon = '📊';
            } else if (remaining < 0) {
                message = `⚠️ Exceeded cap by ${utils.formatCurrency(Math.abs(remaining))}!`;
                politeness = 'assertive';
                icon = '⚠️';
            } else if (percentage >= 90) {
                message = `⚠️ ${percentage.toFixed(1)}% used. ${utils.formatCurrency(remaining)} left.`;
                icon = '⚡';
            } else if (percentage >= 75) {
                message = `📈 ${percentage.toFixed(1)}% used. ${utils.formatCurrency(remaining)} left.`;
                icon = '📈';
            } else {
                message = `✅ ${utils.formatCurrency(remaining)} remaining of ${utils.formatCurrency(cap)}.`;
                icon = '✅';
            }
            
            if (elements.liveMessage) elements.liveMessage.textContent = message;
            if (elements.liveIcon) elements.liveIcon.textContent = icon;
            if (elements.liveStatus) elements.liveStatus.textContent = `${percentage.toFixed(1)}% used`;
            
            if (elements.ariaLiveRegion) {
                elements.ariaLiveRegion.setAttribute('aria-live', politeness);
                if (politeness === 'assertive') {
                    elements.ariaLiveRegion.setAttribute('role', 'alert');
                } else {
                    elements.ariaLiveRegion.removeAttribute('role');
                }
            }
        }
    };

    // ========== TRANSACTIONS PAGE FUNCTIONS ==========
    const transactions = {
        renderAll: () => {
            if (!elements.allTransactionsList) return;
            
            const search = elements.searchAll ? elements.searchAll.value : '';
            const category = elements.categoryFilterAll ? elements.categoryFilterAll.value : 'all';
            
            const filtered = utils.filterTransactions(state.transactions, search, category);
            
            if (filtered.length === 0) {
                elements.allTransactionsList.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 30px;">No transactions</td></tr>';
                return;
            }

            elements.allTransactionsList.innerHTML = filtered.map(t => {
                const amountClass = t.amount > 0 ? 'income-row' : 'expense-row';
                return `
                    <tr>
                        <td>${utils.formatDate(t.date)}</td>
                        <td>${utils.highlightText(t.description, search)}</td>
                        <td><span class="category-badge">${t.category}</span></td>
                        <td class="${amountClass}">${utils.formatCurrency(Math.abs(t.amount))}</td>
                        <td class="actions">
                            <button class="action-btn" onclick="window.app.edit('${t.id}')">
                                <svg viewBox="0 0 24 24"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                            </button>
                            <button class="action-btn" onclick="window.app.delete('${t.id}')">
                                <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');

            const categories = [...new Set(state.transactions.map(t => t.category))];
            if (elements.categoryFilterAll) {
                elements.categoryFilterAll.innerHTML = '<option value="all">All Categories</option>' + 
                    categories.map(c => `<option value="${c}">${c}</option>`).join('');
            }
        }
    };

    // ========== STORAGE ==========
    const storage = {
        save: () => {
            localStorage.setItem('finance_data', JSON.stringify({
                transactions: state.transactions,
                settings: state.settings
            }));
        },

        load: () => {
            const data = localStorage.getItem('finance_data');
            if (data) {
                try {
                    const parsed = JSON.parse(data);
                    state.transactions = parsed.transactions || [];
                    state.settings = { ...state.settings, ...parsed.settings };
                    state.cap = state.settings.budgetCap || 1000;
                    return true;
                } catch (e) {}
            }
            return false;
        },

        loadSeed: async () => {
            try {
                const response = await fetch('seed.json');
                const seed = await response.json();
                state.transactions = seed.transactions || [];
                state.settings = { ...state.settings, ...seed.settings };
                state.cap = state.settings.budgetCap || 1000;
                storage.save();
                return true;
            } catch (e) {
                state.transactions = [
                    { id: '1', description: 'Lunch', amount: -25.50, category: 'Food', date: '2025-09-25' },
                    { id: '2', description: 'Salary', amount: 2500, category: 'Income', date: '2025-09-20' }
                ];
                return false;
            }
        },

        importJSON: (json) => {
            try {
                const data = JSON.parse(json);
                if (data.transactions) {
                    const newTx = data.transactions.map(t => ({ ...t, id: utils.generateId() }));
                    state.transactions = [...state.transactions, ...newTx];
                    storage.save();
                    return true;
                }
            } catch (e) {}
            return false;
        },

        exportJSON: () => {
            const data = {
                transactions: state.transactions,
                settings: state.settings,
                exported: new Date().toISOString()
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `finance-export-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
        },

        exportCSV: () => {
            const headers = ['Date', 'Description', 'Category', 'Amount'];
            const rows = state.transactions.map(t => [
                t.date,
                `"${t.description.replace(/"/g, '""')}"`,
                t.category,
                t.amount
            ]);
            const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `finance-export-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
        }
    };

    // ========== REFRESH ALL PAGES ==========
    function refreshAllData() {
        storage.save();
        dashboard.update();
        dashboard.renderRecent();
        transactions.renderAll();
        stats.update();
        console.log('All pages refreshed');
    }

    // ========== TRANSACTION CRUD ==========
    function addTransaction(transactionData) {
        const transaction = {
            id: utils.generateId(),
            ...transactionData,
            createdAt: new Date().toISOString()
        };
        state.transactions.push(transaction);
        refreshAllData();
        utils.showNotification('Transaction added');
        return true;
    }

    function updateTransaction(id, updates) {
        const index = state.transactions.findIndex(t => t.id === id);
        if (index === -1) return false;
        state.transactions[index] = { ...state.transactions[index], ...updates };
        refreshAllData();
        utils.showNotification('Transaction updated');
        return true;
    }

    function deleteTransaction(id) {
        state.transactions = state.transactions.filter(t => t.id !== id);
        refreshAllData();
        utils.showNotification('Transaction deleted');
        return true;
    }

    // ========== CACHE DOM ELEMENTS ==========
    function cacheElements() {
        elements.navItems = document.querySelectorAll('.nav-item[data-page]');
        elements.pages = document.querySelectorAll('.page');
        elements.themeToggle = document.getElementById('theme-toggle');
        
        // Dashboard
        elements.balance = document.getElementById('balance');
        elements.income = document.getElementById('income');
        elements.expenses = document.getElementById('expenses');
        elements.budgetSpent = document.getElementById('budget-spent');
        elements.budgetProgress = document.getElementById('budget-progress');
        elements.spentAmount = document.getElementById('spent-amount');
        elements.remainingAmount = document.getElementById('remaining-amount');
        elements.transactionsList = document.getElementById('transactions-list');
        
        // Transactions page
        elements.allTransactionsList = document.getElementById('all-transactions-list');
        elements.search = document.getElementById('search');
        elements.searchAll = document.getElementById('search-all');
        elements.categoryFilter = document.getElementById('category-filter');
        elements.categoryFilterAll = document.getElementById('category-filter-all');
        
        // Stats page
        elements.totalRecords = document.getElementById('totalRecords');
        elements.totalSpent = document.getElementById('totalSpent');
        elements.topCategory = document.getElementById('topCategory');
        elements.barChart = document.getElementById('barChart');
        elements.capAmount = document.getElementById('capAmount');
        elements.updateCap = document.getElementById('updateCap');
        elements.currentSpending = document.getElementById('currentSpending');
        elements.progressPercentage = document.getElementById('progressPercentage');
        elements.progressFill = document.getElementById('progressFill');
        elements.liveMessage = document.getElementById('liveMessage');
        elements.liveIcon = document.getElementById('liveIcon');
        elements.liveStatus = document.getElementById('liveStatus');
        elements.ariaLiveRegion = document.getElementById('ariaLiveRegion');
        
        // Settings
        elements.currencySelect = document.getElementById('currency-select');
        elements.budgetCap = document.getElementById('budget-cap');
        elements.exportJson = document.getElementById('export-json');
        elements.exportCsv = document.getElementById('export-csv');
        elements.importFile = document.getElementById('import-file');
        
        // Modals
        elements.transactionModal = document.getElementById('transaction-modal');
        elements.confirmModal = document.getElementById('confirm-modal');
        elements.transactionForm = document.getElementById('transaction-form');
        elements.modalTitle = document.getElementById('modal-title');
        elements.cancelModal = document.getElementById('cancel-modal');
        elements.confirmNo = document.getElementById('confirm-no');
        elements.confirmYes = document.getElementById('confirm-yes');
        elements.confirmMessage = document.getElementById('confirm-message');
    }

    // ========== TEST CURRENCY FUNCTION ==========
    // Add this function INSIDE your IIFE
    function testCurrencies() {
        console.log('=== TESTING ALL 3 CURRENCIES ===');
        console.log('Current exchange rates:', state.settings.exchangeRates);
        
        // Save current currency
        const originalCurrency = state.settings.currency;
        
        // Test with a sample amount
        const testAmount = 1234.56;
        console.log('Test amount (USD):', testAmount);
        
        // Test USD
        state.settings.currency = 'USD';
        console.log('USD:', utils.formatCurrency(testAmount));
        
        // Test EUR
        state.settings.currency = 'EUR';
        console.log('EUR:', utils.formatCurrency(testAmount));
        
        // Test RWF
        state.settings.currency = 'RWF';
        console.log('RWF:', utils.formatCurrency(testAmount));
        
        // Restore
        state.settings.currency = originalCurrency;
        console.log('=== TEST COMPLETE ===');
    }

    // ========== INIT ==========
    async function init() {
        cacheElements();
        
        // Load data
        const hasData = storage.load();
        if (!hasData || state.transactions.length === 0) {
            await storage.loadSeed();
        }

        // Set cap
        state.cap = state.settings.budgetCap || 1000;
        if (elements.capAmount) elements.capAmount.value = state.cap;

        // Apply theme
        const savedTheme = localStorage.getItem('theme') || state.settings.theme;
        utils.setTheme(savedTheme);
        state.settings.theme = savedTheme;

        // Set date
        const dateEl = document.getElementById('current-date');
        if (dateEl) {
            dateEl.textContent = new Date().toLocaleDateString('en-US', { 
                month: 'long', day: 'numeric', year: 'numeric' 
            });
        }

        // ========== TEST CURRENCY CONVERSION ==========
        // Call the test function here
        testCurrencies();

        // ========== EVENT LISTENERS ==========
        
        // Navigation
        elements.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (item.classList.contains('theme-toggle')) return;
                
                elements.navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                
                const pageId = item.dataset.page;
                elements.pages.forEach(p => p.style.display = 'none');
                
                const page = document.getElementById(`${pageId}-page`);
                if (page) {
                    page.style.display = 'block';
                    document.getElementById('page-title').textContent = 
                        pageId.charAt(0).toUpperCase() + pageId.slice(1);
                    
                    if (pageId === 'dashboard') {
                        dashboard.update();
                        dashboard.renderRecent();
                    } else if (pageId === 'transactions') {
                        transactions.renderAll();
                    } else if (pageId === 'stats') {
                        stats.update();
                    } else if (pageId === 'settings') {
                        if (elements.currencySelect) elements.currencySelect.value = state.settings.currency;
                        if (elements.budgetCap) elements.budgetCap.value = state.settings.budgetCap;
                    }
                }
            });
        });

        // Theme toggle
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', () => {
                state.settings.theme = state.settings.theme === 'light' ? 'dark' : 'light';
                utils.setTheme(state.settings.theme);
                localStorage.setItem('theme', state.settings.theme);
                storage.save();
            });
        }

        // Search
        if (elements.search) {
            elements.search.addEventListener('input', () => dashboard.renderRecent());
        }
        if (elements.searchAll) {
            elements.searchAll.addEventListener('input', () => transactions.renderAll());
        }

        // Category filters
        if (elements.categoryFilter) {
            elements.categoryFilter.addEventListener('change', () => dashboard.renderRecent());
        }
        if (elements.categoryFilterAll) {
            elements.categoryFilterAll.addEventListener('change', () => transactions.renderAll());
        }

        // Add button
        document.getElementById('add-transaction').addEventListener('click', () => {
            elements.modalTitle.textContent = 'Add Transaction';
            elements.transactionForm.reset();
            elements.transactionModal.classList.add('active');
        });

        // Form submit
        elements.transactionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const form = e.target;
            const type = form.type.value;
            const amount = parseFloat(form.amount.value);
            const description = form.description.value.trim().replace(/\s+/g, ' ');
            const category = form.category.value;
            const date = form.date.value;

            // Validate
            const descValid = utils.validateField('description', description);
            const amountValid = utils.validateField('amount', amount);
            const dateValid = utils.validateField('date', date);
            const catValid = utils.validateField('category', category);

            if (descValid.errors.length || amountValid.errors.length || 
                dateValid.errors.length || catValid.errors.length) {
                alert('Please fix validation errors');
                return;
            }

            // Show warnings
            [...descValid.warnings, ...amountValid.warnings].forEach(utils.showNotification);

            const transactionData = {
                description,
                amount: type === 'expense' ? -amount : amount,
                category,
                date
            };

            if (state.editingId) {
                updateTransaction(state.editingId, transactionData);
                state.editingId = null;
            } else {
                addTransaction(transactionData);
            }

            elements.transactionModal.classList.remove('active');
        });

        // Cancel modal
        if (elements.cancelModal) {
            elements.cancelModal.addEventListener('click', () => {
                elements.transactionModal.classList.remove('active');
                state.editingId = null;
            });
        }

        // Cap update
        if (elements.updateCap) {
            elements.updateCap.addEventListener('click', () => {
                const newCap = parseFloat(elements.capAmount.value);
                if (!isNaN(newCap) && newCap > 0) {
                    state.cap = newCap;
                    state.settings.budgetCap = newCap;
                    storage.save();
                    stats.update();
                }
            });
        }

        // Currency change
        if (elements.currencySelect) {
            elements.currencySelect.addEventListener('change', (e) => {
                state.settings.currency = e.target.value;
                storage.save();
                dashboard.update();
                dashboard.renderRecent();
                transactions.renderAll();
                stats.update();
            });
        }

        // Budget cap change
        if (elements.budgetCap) {
            elements.budgetCap.addEventListener('change', (e) => {
                state.settings.budgetCap = parseFloat(e.target.value);
                storage.save();
                dashboard.update();
            });
        }

        // Export
        if (elements.exportJson) elements.exportJson.addEventListener('click', storage.exportJSON);
        if (elements.exportCsv) elements.exportCsv.addEventListener('click', storage.exportCSV);

        // Import
        if (elements.importFile) {
            elements.importFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        if (storage.importJSON(event.target.result)) {
                            refreshAllData();
                            alert('Import successful!');
                        } else {
                            alert('Import failed');
                        }
                    };
                    reader.readAsText(file);
                }
                e.target.value = '';
            });
        }

        // Confirm modal
        if (elements.confirmNo) {
            elements.confirmNo.addEventListener('click', () => {
                elements.confirmModal.classList.remove('active');
            });
        }

        // Initial render
        dashboard.update();
        dashboard.renderRecent();
        transactions.renderAll();
        stats.update();
        
        // Set currency select
        if (elements.currencySelect) elements.currencySelect.value = state.settings.currency;
        if (elements.budgetCap) elements.budgetCap.value = state.settings.budgetCap;

        console.log('App initialized with', state.transactions.length, 'transactions');
    }

    // Start
    init();

    // Expose globally
    window.app = {
        edit: (id) => {
            const t = state.transactions.find(t => t.id === id);
            if (!t) return;

            const form = elements.transactionForm;
            form.type.value = t.amount > 0 ? 'income' : 'expense';
            form.amount.value = Math.abs(t.amount);
            form.description.value = t.description;
            form.category.value = t.category;
            form.date.value = t.date;

            state.editingId = id;
            elements.modalTitle.textContent = 'Edit Transaction';
            elements.transactionModal.classList.add('active');
        },
        
        delete: (id) => {
            const t = state.transactions.find(t => t.id === id);
            if (!t) return;

            elements.confirmMessage.textContent = `Delete "${t.description}"?`;
            elements.confirmModal.classList.add('active');
            
            elements.confirmYes.onclick = () => {
                deleteTransaction(id);
                elements.confirmModal.classList.remove('active');
            };
        }
    };
})();