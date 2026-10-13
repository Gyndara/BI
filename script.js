/**
 * RETAIL BUSINESS INTELLIGENCE DASHBOARD
 * Based on MDPI Sustainability 2022 research:
 * "360° Retail Business Analytics by Adopting Hybrid Machine Learning and a Business Intelligence Approach"
 * Authors: Abdulmajeed Alqhatani, Muhammad Shoaib Ashraf, Javed Ferzund, Ahmad Shaf, et al.
 * DOI: 10.3390/su141911942
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. DEMONSTRATION MULTI-DIMENSIONAL DATASET ENGINE
     Mathematically consistent data modeled from UCI Online Retail transactions
     ========================================================================== */

  // Master product catalog with StockCode and Category inspired by UCI & paper Figures 4, 16, 17
  const PRODUCT_CATALOG = [
    { stockCode: '22423', name: 'REGENCY CAKESTAND 3 TIER', category: 'Ceramics & Tableware', unitPrice: 10.95 },
    { stockCode: '85123A', name: 'WHITE HANGING HEART T-LIGHT HOLDER', category: 'Home & Living', unitPrice: 2.55 },
    { stockCode: '85099B', name: 'JUMBO BAG RED RETROSPOT', category: 'Bags & Accessories', unitPrice: 1.95 },
    { stockCode: '47566', name: 'PARTY BUNTING', category: 'Party & Decor', unitPrice: 4.65 },
    { stockCode: '84879', name: 'ASSORTED COLOUR BIRD ORNAMENT', category: 'Giftware & Novelty', unitPrice: 1.69 },
    { stockCode: 'POST', name: 'POSTAGE SERVICE', category: 'Giftware & Novelty', unitPrice: 18.00 },
    { stockCode: '22720', name: 'SET OF 3 CAKE TINS PANTRY DESIGN', category: 'Ceramics & Tableware', unitPrice: 4.95 },
    { stockCode: '20725', name: 'LUNCH BAG BLACK SKULL', category: 'Bags & Accessories', unitPrice: 1.65 },
    { stockCode: '22086', name: 'PAPER CHAIN KIT 50\'S CHRISTMAS', category: 'Party & Decor', unitPrice: 2.55 },
    { stockCode: '20727', name: 'LUNCH BAG RED RETROSPOT', category: 'Bags & Accessories', unitPrice: 1.65 },
    { stockCode: '22960', name: 'HEART OF WICKER SMALL', category: 'Home & Living', unitPrice: 1.45 },
    { stockCode: '22910', name: 'NATURAL SLATE HEART CHALKBOARD', category: 'Home & Living', unitPrice: 2.95 }
  ];

  // Country shares aligned with paper Section 2.2 percentages
  const COUNTRY_SHARES = [
    { country: 'United Kingdom', weight: 0.889 },
    { country: 'Netherlands', weight: 0.028 },
    { country: 'EIRE', weight: 0.024 },
    { country: 'Germany', weight: 0.023 },
    { country: 'France', weight: 0.021 },
    { country: 'Australia', weight: 0.012 },
    { country: 'Spain', weight: 0.006 },
    { country: 'Switzerland', weight: 0.005 },
    { country: 'Belgium', weight: 0.005 },
    { country: 'Portugal', weight: 0.004 }
  ];

  // Customer profiles directly inspired by RFM Table in paper Figure 9
  const CUSTOMER_PROFILES = [
    { id: '18102', segment: 'High Value', baseOrders: 145, recency: 0, baselineSpend: 580987.04 },
    { id: '17450', segment: 'High Value', baseOrders: 51, recency: 8, baselineSpend: 244784.25 },
    { id: '13694', segment: 'High Value', baseOrders: 143, recency: 3, baselineSpend: 195640.69 },
    { id: '17511', segment: 'High Value', baseOrders: 60, recency: 2, baselineSpend: 172132.87 },
    { id: '16684', segment: 'Loyal', baseOrders: 55, recency: 4, baselineSpend: 147142.77 },
    { id: '15061', segment: 'Loyal', baseOrders: 127, recency: 3, baselineSpend: 126389.02 },
    { id: '17949', segment: 'Loyal', baseOrders: 118, recency: 1, baselineSpend: 117314.08 },
    { id: '15311', segment: 'Loyal', baseOrders: 208, recency: 0, baselineSpend: 114966.42 },
    { id: '13089', segment: 'Loyal', baseOrders: 203, recency: 2, baselineSpend: 113416.91 },
    { id: '12931', segment: 'Potential', baseOrders: 57, recency: 21, baselineSpend: 92347.34 },
    { id: '14911', segment: 'Potential', baseOrders: 48, recency: 35, baselineSpend: 82150.00 },
    { id: '14156', segment: 'At Risk', baseOrders: 32, recency: 85, baselineSpend: 71200.00 }
  ];

  // 12 Months timeline (Dec 2010 - Dec 2011) with seasonal multipliers
  const MONTHS_DATA = [
    { key: '2010-12', label: 'Dec 2010', quarter: 'q4', seasonal: 1.25 },
    { key: '2011-01', label: 'Jan 2011', quarter: 'q1', seasonal: 0.72 },
    { key: '2011-02', label: 'Feb 2011', quarter: 'q1', seasonal: 0.68 },
    { key: '2011-03', label: 'Mar 2011', quarter: 'q1', seasonal: 0.85 },
    { key: '2011-04', label: 'Apr 2011', quarter: 'q2', seasonal: 0.80 },
    { key: '2011-05', label: 'May 2011', quarter: 'q2', seasonal: 0.95 },
    { key: '2011-06', label: 'Jun 2011', quarter: 'q2', seasonal: 0.92 },
    { key: '2011-07', label: 'Jul 2011', quarter: 'q3', seasonal: 0.90 },
    { key: '2011-08', label: 'Aug 2011', quarter: 'q3', seasonal: 0.94 },
    { key: '2011-09', label: 'Sep 2011', quarter: 'q3', seasonal: 1.15 },
    { key: '2011-10', label: 'Oct 2011', quarter: 'q4', seasonal: 1.35 },
    { key: '2011-11', label: 'Nov 2011', quarter: 'q4', seasonal: 1.65 },
    { key: '2011-12', label: 'Dec 2011', quarter: 'q4', seasonal: 1.40 }
  ];

  // Days of week distribution (retail store non-operational on Saturdays)
  const DAY_FACTORS = [
    { day: 'Monday', factor: 0.17 },
    { day: 'Tuesday', factor: 0.19 },
    { day: 'Wednesday', factor: 0.20 },
    { day: 'Thursday', factor: 0.23 }, // peak shopping day
    { day: 'Friday', factor: 0.14 },
    { day: 'Sunday', factor: 0.07 }
  ];

  /**
   * Generates a fine-grained, mathematically consistent demonstrative dataset
   */
  function generateDemonstrativeDataset() {
    const records = [];

    MONTHS_DATA.forEach(month => {
      COUNTRY_SHARES.forEach(c => {
        PRODUCT_CATALOG.forEach((prod, pIdx) => {
          // Determine realistic baseline quantities (scaled to 541k records)
          let baseQty = 0;
          if (prod.stockCode === '85123A') baseQty = 26000; // White heart t-light holder
          else if (prod.stockCode === '22423') baseQty = 13000; // Regency cakestand
          else if (prod.stockCode === '85099B') baseQty = 22000; // Jumbo bag
          else if (prod.stockCode === '47566') baseQty = 14500; // Party bunting
          else if (prod.stockCode === '84879') baseQty = 18000; // Bird ornament
          else if (prod.stockCode === 'POST') baseQty = 7500; // Postage
          else baseQty = 11000;

          // Apply country weight and seasonal multiplier
          const qty = Math.round(baseQty * c.weight * month.seasonal);
          if (qty <= 0) return;

          const revenue = +(qty * prod.unitPrice).toFixed(2);
          const orders = Math.max(1, Math.round(qty / (prod.unitPrice > 8 ? 85 : 185)));

          // Associate with customer pool
          const cust = CUSTOMER_PROFILES[(pIdx + month.key.length) % CUSTOMER_PROFILES.length];

          // Distribute across days of week
          DAY_FACTORS.forEach(df => {
            const dayQty = Math.round(qty * df.factor);
            if (dayQty > 0) {
              const dayRev = +(dayQty * prod.unitPrice).toFixed(2);
              const dayOrders = Math.max(1, Math.round(orders * df.factor));

              records.push({
                monthKey: month.key,
                monthLabel: month.label,
                quarter: month.quarter,
                country: c.country,
                category: prod.category,
                productName: prod.name,
                stockCode: prod.stockCode,
                unitPrice: prod.unitPrice,
                dayOfWeek: df.day,
                customerId: cust.id,
                customerSegment: cust.segment,
                customerRecency: cust.recency,
                quantity: dayQty,
                orders: dayOrders,
                revenue: dayRev
              });
            }
          });
        });
      });
    });

    return records;
  }

  const RAW_DATA = generateDemonstrativeDataset();

  /* ==========================================================================
     2. MACHINE LEARNING OFFICIAL BENCHMARK DATA
     Faithfully transcribed from Table 1 of Sustainability 2022, 14, 11942
     ========================================================================== */
  const ML_REPORTED_MODELS = [
    { name: 'Gradient Boosting', accuracy: 95.39, rank: 1, type: 'Ensemble (Boosting)', isBest: true },
    { name: 'Voting Classifier', accuracy: 95.30, rank: 2, type: 'Hybrid Ensemble', isBest: false },
    { name: 'Logistic Regression', accuracy: 94.93, rank: 3, type: 'Linear Classifier', isBest: false },
    { name: 'Random Forest', accuracy: 94.56, rank: 4, type: 'Ensemble (Bagging)', isBest: false },
    { name: 'Decision Tree (DT)', accuracy: 89.76, rank: 5, type: 'Tree-Based', isBest: false },
    { name: 'KNN', accuracy: 84.23, rank: 6, type: 'Instance-Based', isBest: false },
    { name: 'SVC', accuracy: 75.92, rank: 7, type: 'Kernel Margin', isBest: false },
    { name: 'AdaBoost', accuracy: 59.59, rank: 8, type: 'Adaptive Boosting', isBest: false }
  ];

  /* ==========================================================================
     3. CHART.JS INSTANCES MANAGER
     Prevents canvas re-use memory leaks by tracking active chart objects
     ========================================================================== */
  const chartInstances = {};

  function destroyChart(id) {
    if (chartInstances[id]) {
      chartInstances[id].destroy();
      delete chartInstances[id];
    }
  }

  // Currency & number formatting helpers
  const formatGBP = val => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(val);
  const formatNum = val => new Intl.NumberFormat('en-GB').format(Math.round(val));
  const formatPct = val => (val).toFixed(1) + '%';

  /* ==========================================================================
     4. DATA FILTERING & AGGREGATION ENGINE
     ========================================================================== */
  function getFilteredData() {
    const dateRange = document.getElementById('filterDateRange').value;
    const country = document.getElementById('filterCountry').value;
    const category = document.getElementById('filterCategory').value;

    return RAW_DATA.filter(item => {
      // Date filter
      if (dateRange !== 'all') {
        if (item.quarter !== dateRange) return false;
      }
      // Country filter
      if (country !== 'all') {
        if (item.country !== country) return false;
      }
      // Category filter
      if (category !== 'all') {
        if (item.category !== category) return false;
      }
      return true;
    });
  }

  function computeAggregates(dataset) {
    if (!dataset || dataset.length === 0) {
      return null;
    }

    let totalRevenue = 0;
    let totalQuantity = 0;
    let totalOrders = 0;

    const customersSet = new Set();
    const productsSet = new Set();

    // Map accumulators
    const monthlyMap = {};
    const dayMap = {};
    const productMap = {};
    const customerMap = {};
    const countryMap = {};

    dataset.forEach(r => {
      totalRevenue += r.revenue;
      totalQuantity += r.quantity;
      totalOrders += r.orders;

      customersSet.add(r.customerId);
      productsSet.add(r.stockCode);

      // Monthly
      if (!monthlyMap[r.monthKey]) {
        monthlyMap[r.monthKey] = { label: r.monthLabel, revenue: 0, orders: 0 };
      }
      monthlyMap[r.monthKey].revenue += r.revenue;
      monthlyMap[r.monthKey].orders += r.orders;

      // Day of week
      if (!dayMap[r.dayOfWeek]) {
        dayMap[r.dayOfWeek] = { day: r.dayOfWeek, revenue: 0, orders: 0 };
      }
      dayMap[r.dayOfWeek].revenue += r.revenue;
      dayMap[r.dayOfWeek].orders += r.orders;

      // Product
      if (!productMap[r.stockCode]) {
        productMap[r.stockCode] = {
          stockCode: r.stockCode,
          name: r.productName,
          category: r.category,
          quantity: 0,
          revenue: 0
        };
      }
      productMap[r.stockCode].quantity += r.quantity;
      productMap[r.stockCode].revenue += r.revenue;

      // Customer
      if (!customerMap[r.customerId]) {
        customerMap[r.customerId] = {
          id: r.customerId,
          segment: r.customerSegment,
          recency: r.customerRecency,
          orders: 0,
          quantity: 0,
          revenue: 0
        };
      }
      customerMap[r.customerId].orders += r.orders;
      customerMap[r.customerId].quantity += r.quantity;
      customerMap[r.customerId].revenue += r.revenue;

      // Country
      if (!countryMap[r.country]) {
        countryMap[r.country] = {
          country: r.country,
          orders: 0,
          customers: new Set(),
          units: 0,
          revenue: 0
        };
      }
      countryMap[r.country].orders += r.orders;
      countryMap[r.country].customers.add(r.customerId);
      countryMap[r.country].units += r.quantity;
      countryMap[r.country].revenue += r.revenue;
    });

    const aov = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

    // Calibrated unique dimension entities scaled to UCI 541k dataset footprint
    const FULL_REV_BENCHMARK = 8995090;
    const sliceRatio = Math.min(1, Math.max(0.005, totalRevenue / FULL_REV_BENCHMARK));
    const estUniqueCustomers = Math.max(12, Math.round(4372 * Math.pow(sliceRatio, 0.35)));
    const estUniqueProducts = Math.max(12, Math.round(3684 * Math.pow(sliceRatio, 0.25)));

    // Scale customer sample records for table display aligned with Figure 9
    const scaledCustomers = CUSTOMER_PROFILES.map(c => {
      const custSpend = Math.round(c.baselineSpend * sliceRatio * 100) / 100;
      const custOrders = Math.max(1, Math.round(c.baseOrders * sliceRatio));
      const custQty = Math.max(1, Math.round(c.baseOrders * 32 * sliceRatio));
      return {
        id: c.id,
        segment: c.segment,
        recency: c.recency,
        orders: custOrders,
        quantity: custQty,
        revenue: custSpend
      };
    });

    return {
      totalRevenue,
      totalQuantity,
      totalOrders,
      uniqueCustomers: estUniqueCustomers,
      uniqueProducts: estUniqueProducts,
      aov,
      monthly: Object.values(monthlyMap),
      days: Object.values(dayMap),
      products: Object.values(productMap),
      customers: scaledCustomers,
      countries: Object.values(countryMap).map(c => ({
        ...c,
        customerCount: Math.max(1, Math.round(c.customers.size * Math.pow(c.revenue / (totalRevenue || 1), 0.35) * estUniqueCustomers / 12))
      }))
    };
  }

  /* ==========================================================================
     5. DOM UPDATE & DASHBOARD RENDERING
     ========================================================================== */

  // State storage for active table data & sorting
  const tableState = {
    product: { data: [], sortCol: 'revenue', sortAsc: false, filter: '' },
    customer: { data: [], sortCol: 'revenue', sortAsc: false, filter: '' },
    country: { data: [], sortCol: 'revenue', sortAsc: false }
  };

  function updateDashboard() {
    const filtered = getFilteredData();
    const emptyState = document.getElementById('emptyStateCard');
    const content = document.getElementById('dashboardContent');
    const filterBadge = document.getElementById('filteredCountBadge');

    const totalRaw = RAW_DATA.length;
    const currentPct = totalRaw > 0 ? ((filtered.length / totalRaw) * 100).toFixed(0) : 0;
    filterBadge.textContent = `Showing: ${currentPct}% of demonstrative records`;

    if (filtered.length === 0) {
      emptyState.style.display = 'flex';
      content.style.display = 'none';
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    emptyState.style.display = 'none';
    content.style.display = 'flex';

    const aggs = computeAggregates(filtered);

    // 1. Update KPI Cards
    renderKPICards(aggs);

    // 2. Render Sales Trend & Charts
    renderSalesCharts(aggs);

    // 3. Render Product Analytics
    renderProductAnalytics(aggs);

    // 4. Render Customer Analytics & RFM
    renderCustomerAnalytics(aggs);

    // 5. Render Geographic Analytics
    renderGeographicAnalytics(aggs);

    // 6. Dynamic Business Interpretation
    renderBusinessInsights(aggs);

    // Refresh icons for dynamically added elements
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /* --- Render KPI Cards --- */
  function renderKPICards(aggs) {
    document.getElementById('kpiRevenue').textContent = formatGBP(aggs.totalRevenue);
    document.getElementById('kpiOrders').textContent = formatNum(aggs.totalOrders);
    document.getElementById('kpiUnits').textContent = formatNum(aggs.totalQuantity);
    document.getElementById('kpiCustomers').textContent = formatNum(aggs.uniqueCustomers);
    document.getElementById('kpiProducts').textContent = formatNum(aggs.uniqueProducts);
    document.getElementById('kpiAOV').textContent = formatGBP(aggs.aov);

    // Sales summary strip
    document.getElementById('stripRevenue').textContent = formatGBP(aggs.totalRevenue);
    document.getElementById('stripOrders').textContent = formatNum(aggs.totalOrders);
    document.getElementById('stripAOV').textContent = formatGBP(aggs.aov);
  }

  /* --- Render Sales Analytics Charts --- */
  function renderSalesCharts(aggs) {
    // 1. Monthly Revenue Trend (Line Chart)
    destroyChart('monthlyRevenueChart');
    const ctxMonthly = document.getElementById('monthlyRevenueChart').getContext('2d');

    const monthLabels = aggs.monthly.map(m => m.label);
    const monthRevenues = aggs.monthly.map(m => m.revenue);

    chartInstances['monthlyRevenueChart'] = new Chart(ctxMonthly, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{
          label: 'Monthly Revenue (£)',
          data: monthRevenues,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointBackgroundColor: '#2563eb',
          pointHoverRadius: 6,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: ctx => ` Revenue: ${formatGBP(ctx.raw)}`
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } },
          y: {
            border: { dash: [4, 4] },
            grid: { color: '#e2e8f0' },
            ticks: {
              font: { family: 'Inter', size: 11 },
              callback: val => '£' + (val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val)
            }
          }
        }
      }
    });

    // 2. Monthly Orders (Bar Chart)
    destroyChart('monthlyOrdersChart');
    const ctxOrders = document.getElementById('monthlyOrdersChart').getContext('2d');
    const monthOrders = aggs.monthly.map(m => m.orders);

    chartInstances['monthlyOrdersChart'] = new Chart(ctxOrders, {
      type: 'bar',
      data: {
        labels: monthLabels,
        datasets: [{
          label: 'Completed Orders',
          data: monthOrders,
          backgroundColor: '#0d9488',
          hoverBackgroundColor: '#0f766e',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: ctx => ` Orders: ${formatNum(ctx.raw)}`
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } },
          y: {
            border: { dash: [4, 4] },
            grid: { color: '#e2e8f0' },
            ticks: { font: { family: 'Inter', size: 11 } }
          }
        }
      }
    });

    // 3. Sales by Day of Week (Bar Chart)
    destroyChart('dayOfWeekChart');
    const ctxDay = document.getElementById('dayOfWeekChart').getContext('2d');

    // Sort days in natural calendar order
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday'];
    const sortedDays = dayOrder
      .map(d => aggs.days.find(item => item.day === d))
      .filter(Boolean);

    chartInstances['dayOfWeekChart'] = new Chart(ctxDay, {
      type: 'bar',
      data: {
        labels: sortedDays.map(d => d.day),
        datasets: [{
          label: 'Day Revenue (£)',
          data: sortedDays.map(d => d.revenue),
          backgroundColor: sortedDays.map(d => d.day === 'Thursday' ? '#2563eb' : '#94a3b8'),
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: ctx => ` Sales: ${formatGBP(ctx.raw)}`
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } },
          y: {
            border: { dash: [4, 4] },
            grid: { color: '#e2e8f0' },
            ticks: {
              font: { family: 'Inter', size: 11 },
              callback: val => '£' + (val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val)
            }
          }
        }
      }
    });
  }

  /* --- Render Dynamic Rule-Based Business Insights --- */
  function renderBusinessInsights(aggs) {
    const container = document.getElementById('salesInsightPanel');
    if (!container) return;

    // Detect highest month
    let topMonth = { label: 'N/A', revenue: 0 };
    aggs.monthly.forEach(m => {
      if (m.revenue > topMonth.revenue) topMonth = m;
    });

    // Detect highest day
    let topDay = { day: 'N/A', revenue: 0 };
    aggs.days.forEach(d => {
      if (d.revenue > topDay.revenue) topDay = d;
    });

    // Thursday peak insight
    const thursInsight = topDay.day === 'Thursday'
      ? 'Thursday represents the historic weekly peak in order booking volume, making it the optimal weekday for targeted marketing campaigns.'
      : `${topDay.day} currently registers the strongest transactional velocity in the selected filter window.`;

    container.innerHTML = `
      <div class="insight-item highlight-insight">
        <div class="insight-icon"><i data-lucide="trending-up"></i></div>
        <div class="insight-body">
          <strong>Peak Revenue Velocity (${topMonth.label})</strong>
          <p>
            The selected dataset slice indicates peak revenue in <strong>${topMonth.label}</strong> with ${formatGBP(topMonth.revenue)},
            reflecting strong seasonal surge during fourth-quarter holiday retailing.
          </p>
        </div>
      </div>

      <div class="insight-item">
        <div class="insight-icon"><i data-lucide="calendar"></i></div>
        <div class="insight-body">
          <strong>Weekly Buying Patterns (${topDay.day})</strong>
          <p>${thursInsight} Note that the internet retailer recorded zero transactions on Saturdays as observed in the UCI dataset.</p>
        </div>
      </div>

      <div class="insight-item">
        <div class="insight-icon"><i data-lucide="package"></i></div>
        <div class="insight-body">
          <strong>Average Basket Realization</strong>
          <p>
            Current Average Order Value (AOV) stands at <strong>${formatGBP(aggs.aov)}</strong> across ${formatNum(aggs.totalOrders)} orders.
            Promotional cross-selling on top items could further expand basket value.
          </p>
        </div>
      </div>
    `;
  }

  /* --- Render Product Analytics --- */
  function renderProductAnalytics(aggs) {
    // Sort products by revenue & quantity
    const sortedByRevenue = [...aggs.products].sort((a, b) => b.revenue - a.revenue);
    const sortedByQuantity = [...aggs.products].sort((a, b) => b.quantity - a.quantity);

    // Highlights
    if (sortedByRevenue.length > 0) {
      const topRev = sortedByRevenue[0];
      document.getElementById('topProductRevenueName').textContent = topRev.name;
      document.getElementById('topProductRevenueVal').textContent = `${formatGBP(topRev.revenue)} • StockCode: ${topRev.stockCode}`;
    }

    if (sortedByQuantity.length > 0) {
      const topQty = sortedByQuantity[0];
      document.getElementById('topProductQuantityName').textContent = topQty.name;
      document.getElementById('topProductQuantityVal').textContent = `${formatNum(topQty.quantity)} Units • StockCode: ${topQty.stockCode}`;
    }

    // Top 10 Revenue Horizontal Bar Chart
    destroyChart('topProductsRevenueChart');
    const ctxProdRev = document.getElementById('topProductsRevenueChart').getContext('2d');
    const top10Rev = sortedByRevenue.slice(0, 8);

    chartInstances['topProductsRevenueChart'] = new Chart(ctxProdRev, {
      type: 'bar',
      data: {
        labels: top10Rev.map(p => p.name.length > 22 ? p.name.substring(0, 20) + '...' : p.name),
        datasets: [{
          label: 'Revenue (£)',
          data: top10Rev.map(p => p.revenue),
          backgroundColor: '#2563eb',
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            callbacks: {
              title: items => top10Rev[items[0].dataIndex].name,
              label: ctx => ` Revenue: ${formatGBP(ctx.raw)}`
            }
          }
        },
        scales: {
          x: {
            ticks: { callback: v => '£' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v) }
          },
          y: { ticks: { font: { size: 10 } } }
        }
      }
    });

    // Top 10 Quantity Horizontal Bar Chart
    destroyChart('topProductsQuantityChart');
    const ctxProdQty = document.getElementById('topProductsQuantityChart').getContext('2d');
    const top10Qty = sortedByQuantity.slice(0, 8);

    chartInstances['topProductsQuantityChart'] = new Chart(ctxProdQty, {
      type: 'bar',
      data: {
        labels: top10Qty.map(p => p.name.length > 22 ? p.name.substring(0, 20) + '...' : p.name),
        datasets: [{
          label: 'Units Sold',
          data: top10Qty.map(p => p.quantity),
          backgroundColor: '#0d9488',
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            callbacks: {
              title: items => top10Qty[items[0].dataIndex].name,
              label: ctx => ` Units Sold: ${formatNum(ctx.raw)}`
            }
          }
        },
        scales: {
          x: { ticks: { callback: v => formatNum(v) } },
          y: { ticks: { font: { size: 10 } } }
        }
      }
    });

    // Populate Product Table
    tableState.product.data = aggs.products.map(p => ({
      ...p,
      share: aggs.totalRevenue > 0 ? (p.revenue / aggs.totalRevenue) * 100 : 0
    }));
    renderProductTable();
  }

  function renderProductTable() {
    const tbody = document.getElementById('productTableBody');
    if (!tbody) return;

    let rows = [...tableState.product.data];
    const query = tableState.product.filter.toLowerCase().trim();

    if (query) {
      rows = rows.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.stockCode.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query)
      );
    }

    // Sort
    const col = tableState.product.sortCol;
    const asc = tableState.product.sortAsc;
    rows.sort((a, b) => {
      let valA = a[col];
      let valB = b[col];
      if (typeof valA === 'string') return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      return asc ? valA - valB : valB - valA;
    });

    if (rows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">No matching products found.</td></tr>`;
      return;
    }

    tbody.innerHTML = rows.map(r => `
      <tr>
        <td><strong>${r.name}</strong></td>
        <td><code>${r.stockCode}</code></td>
        <td><span class="badge badge-subtle">${r.category}</span></td>
        <td class="text-right">${formatNum(r.quantity)}</td>
        <td class="text-right font-bold">${formatGBP(r.revenue)}</td>
        <td class="text-right">${formatPct(r.share)}</td>
      </tr>
    `).join('');
  }

  /* --- Render Customer Analytics & RFM --- */
  function renderCustomerAnalytics(aggs) {
    const sortedCust = [...aggs.customers].sort((a, b) => b.revenue - a.revenue);

    // Segment stats calculation
    const segMap = { 'High Value': 0, 'Loyal': 0, 'Potential': 0, 'At Risk': 0 };
    const segCustCount = { 'High Value': 0, 'Loyal': 0, 'Potential': 0, 'At Risk': 0 };

    aggs.customers.forEach(c => {
      if (segMap[c.segment] !== undefined) {
        segMap[c.segment] += c.revenue;
        segCustCount[c.segment] += 1;
      }
    });

    const totRev = aggs.totalRevenue || 1;
    const totCust = aggs.customers.length || 1;

    document.getElementById('segChampCount').textContent = formatPct((segCustCount['High Value'] / totCust) * 100);
    document.getElementById('segChampRev').textContent = formatPct((segMap['High Value'] / totRev) * 100);

    document.getElementById('segLoyalCount').textContent = formatPct((segCustCount['Loyal'] / totCust) * 100);
    document.getElementById('segLoyalRev').textContent = formatPct((segMap['Loyal'] / totRev) * 100);

    document.getElementById('segPotCount').textContent = formatPct((segCustCount['Potential'] / totCust) * 100);
    document.getElementById('segPotRev').textContent = formatPct((segMap['Potential'] / totRev) * 100);

    document.getElementById('segRiskCount').textContent = formatPct((segCustCount['At Risk'] / totCust) * 100);
    document.getElementById('segRiskRev').textContent = formatPct((segMap['At Risk'] / totRev) * 100);

    // Customer Segment Doughnut Chart
    destroyChart('customerSegmentChart');
    const ctxSeg = document.getElementById('customerSegmentChart').getContext('2d');

    chartInstances['customerSegmentChart'] = new Chart(ctxSeg, {
      type: 'doughnut',
      data: {
        labels: ['High Value (Champions)', 'Loyal Customers', 'Potential Growth', 'At Risk / Dormant'],
        datasets: [{
          data: [segMap['High Value'], segMap['Loyal'], segMap['Potential'], segMap['At Risk']],
          backgroundColor: ['#059669', '#2563eb', '#d97706', '#e11d48'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Inter', size: 11 } } },
          tooltip: {
            callbacks: {
              label: ctx => ` Revenue: ${formatGBP(ctx.raw)} (${((ctx.raw / totRev) * 100).toFixed(1)}%)`
            }
          }
        },
        cutout: '65%'
      }
    });

    // Top Customers Horizontal Bar Chart
    destroyChart('topCustomersChart');
    const ctxCust = document.getElementById('topCustomersChart').getContext('2d');
    const top10Cust = sortedCust.slice(0, 8);

    chartInstances['topCustomersChart'] = new Chart(ctxCust, {
      type: 'bar',
      data: {
        labels: top10Cust.map(c => `Customer #${c.id}`),
        datasets: [{
          label: 'Customer Spend (£)',
          data: top10Cust.map(c => c.revenue),
          backgroundColor: '#7c3aed',
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` Lifetime Spend: ${formatGBP(ctx.raw)}`
            }
          }
        },
        scales: {
          x: { ticks: { callback: v => '£' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v) } },
          y: { ticks: { font: { size: 11 } } }
        }
      }
    });

    // Populate Customer Table
    tableState.customer.data = [...aggs.customers];
    renderCustomerTable();
  }

  function renderCustomerTable() {
    const tbody = document.getElementById('customerTableBody');
    if (!tbody) return;

    let rows = [...tableState.customer.data];
    const query = tableState.customer.filter.toLowerCase().trim();

    if (query) {
      rows = rows.filter(r =>
        r.id.toLowerCase().includes(query) ||
        r.segment.toLowerCase().includes(query)
      );
    }

    const col = tableState.customer.sortCol;
    const asc = tableState.customer.sortAsc;
    rows.sort((a, b) => {
      let valA = a[col];
      let valB = b[col];
      if (typeof valA === 'string') return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      return asc ? valA - valB : valB - valA;
    });

    if (rows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding: 2rem;">No matching customers found.</td></tr>`;
      return;
    }

    const segBadge = seg => {
      if (seg === 'High Value') return '<span class="seg-tag seg-champion">High Value</span>';
      if (seg === 'Loyal') return '<span class="seg-tag seg-loyal">Loyal</span>';
      if (seg === 'Potential') return '<span class="seg-tag seg-potential">Potential</span>';
      return '<span class="seg-tag seg-atrisk">At Risk</span>';
    };

    tbody.innerHTML = rows.map(r => `
      <tr>
        <td><strong>#${r.id}</strong></td>
        <td class="text-right">${formatNum(r.orders)}</td>
        <td class="text-right">${formatNum(r.quantity)}</td>
        <td class="text-right font-bold">${formatGBP(r.revenue)}</td>
        <td class="text-right">${r.recency} days</td>
        <td>${segBadge(r.segment)}</td>
      </tr>
    `).join('');
  }

  /* --- Render Geographic Analysis --- */
  function renderGeographicAnalytics(aggs) {
    const sortedCountries = [...aggs.countries].sort((a, b) => b.revenue - a.revenue);

    // Top 10 Countries Bar Chart
    destroyChart('countryRevenueChart');
    const ctxCountry = document.getElementById('countryRevenueChart').getContext('2d');
    const top10C = sortedCountries.slice(0, 8);

    chartInstances['countryRevenueChart'] = new Chart(ctxCountry, {
      type: 'bar',
      data: {
        labels: top10C.map(c => c.country),
        datasets: [{
          label: 'Total Spend (£)',
          data: top10C.map(c => c.revenue),
          backgroundColor: top10C.map(c => c.country === 'United Kingdom' ? '#2563eb' : '#0d9488'),
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` Revenue: ${formatGBP(ctx.raw)}`
            }
          }
        },
        scales: {
          x: { ticks: { callback: v => '£' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v) } },
          y: { ticks: { font: { size: 11 } } }
        }
      }
    });

    // Domestic vs International Doughnut
    destroyChart('countryShareChart');
    const ctxShare = document.getElementById('countryShareChart').getContext('2d');

    const ukItem = sortedCountries.find(c => c.country === 'United Kingdom');
    const ukRev = ukItem ? ukItem.revenue : 0;
    const intlRev = Math.max(0, aggs.totalRevenue - ukRev);

    chartInstances['countryShareChart'] = new Chart(ctxShare, {
      type: 'doughnut',
      data: {
        labels: ['United Kingdom (Domestic)', 'International Export (EU & Global)'],
        datasets: [{
          data: [ukRev, intlRev],
          backgroundColor: ['#2563eb', '#14b8a6'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Inter', size: 11 } } },
          tooltip: {
            callbacks: {
              label: ctx => ` Spend: ${formatGBP(ctx.raw)} (${((ctx.raw / (aggs.totalRevenue || 1)) * 100).toFixed(1)}%)`
            }
          }
        },
        cutout: '65%'
      }
    });

    // Populate Country Table
    tableState.country.data = sortedCountries.map(c => ({
      ...c,
      share: aggs.totalRevenue > 0 ? (c.revenue / aggs.totalRevenue) * 100 : 0
    }));
    renderCountryTable();
  }

  function renderCountryTable() {
    const tbody = document.getElementById('countryTableBody');
    if (!tbody) return;

    let rows = [...tableState.country.data];
    const col = tableState.country.sortCol;
    const asc = tableState.country.sortAsc;

    rows.sort((a, b) => {
      let valA = a[col];
      let valB = b[col];
      if (typeof valA === 'string') return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      return asc ? valA - valB : valB - valA;
    });

    tbody.innerHTML = rows.map(r => `
      <tr>
        <td><strong>${r.country}</strong></td>
        <td class="text-right">${formatNum(r.orders)}</td>
        <td class="text-right">${formatNum(r.customerCount)}</td>
        <td class="text-right">${formatNum(r.units)}</td>
        <td class="text-right font-bold">${formatGBP(r.revenue)}</td>
        <td class="text-right">${formatPct(r.share)}</td>
      </tr>
    `).join('');
  }

  /* ==========================================================================
     6. INITIALIZE MACHINE LEARNING CHART (TABLE 1)
     Static official research benchmark chart
     ========================================================================== */
  function initMLAccuracyChart() {
    const ctx = document.getElementById('mlAccuracyChart').getContext('2d');

    // Sorted descending by accuracy
    const sorted = [...ML_REPORTED_MODELS].sort((a, b) => b.accuracy - a.accuracy);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sorted.map(m => m.name),
        datasets: [{
          label: 'Reported Accuracy (%)',
          data: sorted.map(m => m.accuracy),
          backgroundColor: sorted.map(m => m.isBest ? '#059669' : '#3b82f6'),
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              title: items => `${sorted[items[0].dataIndex].name} (${sorted[items[0].dataIndex].type})`,
              label: ctx => ` Reported Accuracy: ${ctx.raw}%`
            }
          }
        },
        scales: {
          x: {
            min: 50,
            max: 100,
            ticks: { callback: v => v + '%' }
          },
          y: { ticks: { font: { size: 11, weight: '500' } } }
        }
      }
    });
  }

  /* ==========================================================================
     7. EVENT LISTENERS & INTERACTION CONTROLS
     ========================================================================== */
  function setupEventListeners() {
    // Filter Change listeners
    ['filterDateRange', 'filterCountry', 'filterCategory'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', () => {
          updateDashboard();
        });
      }
    });

    // Reset button listeners
    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetFilters);
    }

    const emptyResetBtn = document.getElementById('emptyStateResetBtn');
    if (emptyResetBtn) {
      emptyResetBtn.addEventListener('click', resetFilters);
    }

    function resetFilters() {
      document.getElementById('filterDateRange').value = 'all';
      document.getElementById('filterCountry').value = 'all';
      document.getElementById('filterCategory').value = 'all';
      tableState.product.filter = '';
      tableState.customer.filter = '';
      const prodSearch = document.getElementById('productTableSearch');
      if (prodSearch) prodSearch.value = '';
      const custSearch = document.getElementById('customerTableSearch');
      if (custSearch) custSearch.value = '';
      updateDashboard();
    }

    // Product Table Search
    const prodSearch = document.getElementById('productTableSearch');
    if (prodSearch) {
      prodSearch.addEventListener('input', e => {
        tableState.product.filter = e.target.value;
        renderProductTable();
      });
    }

    // Customer Table Search
    const custSearch = document.getElementById('customerTableSearch');
    if (custSearch) {
      custSearch.addEventListener('input', e => {
        tableState.customer.filter = e.target.value;
        renderCustomerTable();
      });
    }

    // Sortable Table Headers
    setupTableSorting('productTable', 'product', renderProductTable);
    setupTableSorting('customerTable', 'customer', renderCustomerTable);
    setupTableSorting('countryTable', 'country', renderCountryTable);

    // Mobile Sidebar Drawer
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    function openSidebar() {
      sidebar.classList.add('open');
      overlay.classList.add('active');
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openSidebar);
    if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // Sidebar navigation smooth scrolling & active indicator
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSec = document.querySelector(targetId);
        if (targetSec) {
          targetSec.scrollIntoView({ behavior: 'smooth' });
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          closeSidebar();
        }
      });
    });

    // ScrollSpy with IntersectionObserver
    const sections = document.querySelectorAll('.dashboard-section');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    sections.forEach(sec => observer.observe(sec));

    // Back to top button
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  function setupTableSorting(tableId, stateKey, renderFn) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const headers = table.querySelectorAll('th.sortable');
    headers.forEach(th => {
      th.addEventListener('click', () => {
        const col = th.getAttribute('data-sort');
        if (tableState[stateKey].sortCol === col) {
          tableState[stateKey].sortAsc = !tableState[stateKey].sortAsc;
        } else {
          tableState[stateKey].sortCol = col;
          tableState[stateKey].sortAsc = false; // default descending for metrics
        }

        // Update header indicator
        headers.forEach(h => {
          const icon = h.querySelector('.sort-icon');
          if (icon) icon.textContent = '↕';
        });
        const activeIcon = th.querySelector('.sort-icon');
        if (activeIcon) {
          activeIcon.textContent = tableState[stateKey].sortAsc ? '▲' : '▼';
        }

        renderFn();
      });
    });
  }

  /* ==========================================================================
     8. INITIALIZATION ENTRY POINT
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup events
    setupEventListeners();

    // 2. Render ML Table 1 Chart
    initMLAccuracyChart();

    // 3. Initial Dashboard Render
    updateDashboard();

    // 4. Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

})();
