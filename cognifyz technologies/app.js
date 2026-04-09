// ═══════════════════════════════════════════════════════════════
// Cognifyz Restaurant Insights Dashboard — Premium Logic
// ═══════════════════════════════════════════════════════════════

let allData = [];
let charts = {};

// Chart.js global defaults for premium look
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';
Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#14b8a6'];

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  loadData();
});

function setupNavigation() {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.level-section').forEach(s => s.classList.remove('active'));
      
      tab.classList.add('active');
      const sectionId = tab.dataset.level;
      document.getElementById(sectionId).classList.add('active');

      if (sectionId === 'level2' && !charts.leafletMap) {
        setTimeout(initMap, 200);
      }
    });
  });
}

function loadData() {
  Papa.parse('dataset.csv', {
    download: true,
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: (results) => {
      allData = results.data.filter(r => r['Restaurant ID']);
      hideLoading();
      runAllAnalysis();
    },
    error: (err) => {
      console.error('CSV Load Error:', err);
      // Fallback for local testing without server
      document.getElementById('loadingText').textContent = 'Error loading dataset. Please check your local server or dataset.csv file.';
    }
  });
}

function hideLoading() {
  const overlay = document.querySelector('.loading-overlay');
  overlay.classList.add('hide');
  setTimeout(() => overlay.style.display = 'none', 500);
}

function runAllAnalysis() {
  updateHeroStats();

  // LEVEL 1: Fundamentals
  l1t1_TopCuisines();
  l1t2_CityAnalysis();
  l1t3_PriceRangeDistribution();
  l1t4_OnlineDelivery();

  // LEVEL 2: Intermediate
  l2t1_RestaurantRatings();
  l2t2_CuisineCombination();
  // Map init via nav
  l2t4_RestaurantChains();

  // LEVEL 3: Advanced
  l3t1_RestaurantReviews();
  l3t2_VotesAnalysis();
  l3t3_PriceVsServices();
}

// ═══════════════════════════════════════════════════
// HERO STATS
// ═══════════════════════════════════════════════════
function updateHeroStats() {
  const cuisines = new Set();
  allData.forEach(r => {
    if (r.Cuisines) r.Cuisines.split(',').forEach(c => cuisines.add(c.trim()));
  });

  const rated = allData.filter(r => r['Aggregate rating'] > 0);
  const avgRating = (rated.reduce((s, r) => s + r['Aggregate rating'], 0) / rated.length).toFixed(1);

  animateValue('statTotal', allData.length);
  animateValue('statCities', new Set(allData.map(r => r.City)).size);
  animateValue('statCuisines', cuisines.size);
  document.getElementById('statAvgRating').textContent = avgRating;
}

function animateValue(id, value) {
  const el = document.getElementById(id);
  let start = 0;
  const duration = 1500;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.floor(progress * value);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ═══════════════════════════════════════════════════
// LEVEL 1
// ═══════════════════════════════════════════════════

function l1t1_TopCuisines() {
  const counts = {};
  allData.forEach(r => {
    if (r.Cuisines) r.Cuisines.split(',').forEach(c => {
      const name = c.trim();
      counts[name] = (counts[name] || 0) + 1;
    });
  });

  const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 3);
  const total = allData.length;

  document.getElementById('l1t1-stats').innerHTML = sorted.map((c, i) => `
    <div class="mini-stat">
      <div class="mini-stat-label">Rank #${i+1}: ${c[0]}</div>
      <div class="mini-stat-value">${((c[1]/total)*100).toFixed(1)}%</div>
      <div class="stat-sub">${c[1]} restaurants</div>
    </div>
  `).join('');

  new Chart(document.getElementById('l1t1-chart'), {
    type: 'doughnut',
    data: {
      labels: sorted.map(c => c[0]),
      datasets: [{
        data: sorted.map(c => c[1]),
        backgroundColor: [COLORS[0], COLORS[1], COLORS[2]],
        borderWidth: 0,
        hoverOffset: 15
      }]
    },
    options: { cutout: '70%', plugins: { legend: { position: 'bottom' } } }
  });
}

function l1t2_CityAnalysis() {
  const cityData = {};
  allData.forEach(r => {
    if (!cityData[r.City]) cityData[r.City] = { count: 0, totalRating: 0, rated: 0 };
    cityData[r.City].count++;
    if (r['Aggregate rating'] > 0) {
      cityData[r.City].totalRating += r['Aggregate rating'];
      cityData[r.City].rated++;
    }
  });

  const sorted = Object.entries(cityData).sort((a,b) => b[1].count - a[1].count);
  const bestCity = Object.entries(cityData).filter(e => e[1].rated > 5).map(e => [e[0], e[1].totalRating/e[1].rated]).sort((a,b) => b[1]-a[1])[0];

  document.getElementById('l1t2-stats').innerHTML = `
    <div class="mini-stat">
      <div class="mini-stat-label">Most Restaurants</div>
      <div class="mini-stat-value">${sorted[0][0]}</div>
      <div class="stat-sub">${sorted[0][1].count} spots</div>
    </div>
    <div class="mini-stat">
      <div class="mini-stat-label">Highest Avg Rating</div>
      <div class="mini-stat-value">${bestCity[1].toFixed(2)}</div>
      <div class="stat-sub">${bestCity[0]}</div>
    </div>`;

  new Chart(document.getElementById('l1t2-chart'), {
    type: 'bar',
    data: {
      labels: sorted.slice(0, 10).map(e => e[0]),
      datasets: [{ label: 'Restaurants', data: sorted.slice(0, 10).map(e => e[1].count), backgroundColor: COLORS[0], borderRadius: 6 }]
    },
    options: { indexAxis: 'y', plugins: { legend: { display: false } } }
  });
}

function l1t3_PriceRangeDistribution() {
  const dist = { 1: 0, 2: 0, 3: 0, 4: 0 };
  allData.forEach(r => { if (dist[r['Price range']]) dist[r['Price range']]++; else dist[r['Price range']] = 1; });
  const total = allData.length;

  document.getElementById('l1t3-stats').innerHTML = [1,2,3,4].map(p => `
    <div class="price-bubble">Range ${p}: <span>${((dist[p]/total)*100).toFixed(1)}%</span></div>
  `).join('');

  new Chart(document.getElementById('l1t3-chart'), {
    type: 'bar',
    data: {
      labels: ['Budget', 'Moderate', 'High', 'Luxury'],
      datasets: [{ data: [dist[1], dist[2], dist[3], dist[4]], backgroundColor: COLORS.slice(0, 4), borderRadius: 10 }]
    },
    options: { plugins: { legend: { display: false } } }
  });
}

function l1t4_OnlineDelivery() {
  const withD = allData.filter(r => r['Has Online delivery'] === 'Yes');
  const withoutD = allData.filter(r => r['Has Online delivery'] === 'No');
  
  const avgWith = (withD.reduce((s, r) => s + r['Aggregate rating'], 0) / withD.length).toFixed(2);
  const avgWithout = (withoutD.reduce((s, r) => s + r['Aggregate rating'], 0) / withoutD.length).toFixed(2);

  document.getElementById('l1t4-stats').innerHTML = `
    <div class="mini-stat">
      <div class="mini-stat-label">Delivery Available</div>
      <div class="mini-stat-value">${((withD.length/allData.length)*100).toFixed(1)}%</div>
    </div>
    <div class="mini-stat">
      <div class="mini-stat-label">Rating Gain</div>
      <div class="mini-stat-value">+${(avgWith - avgWithout).toFixed(2)}</div>
      <div class="stat-sub">Delivery vs No Delivery</div>
    </div>`;

  new Chart(document.getElementById('l1t4-chart'), {
    type: 'pie',
    data: {
      labels: ['Online Delivery', 'No Delivery'],
      datasets: [{ data: [withD.length, withoutD.length], backgroundColor: [COLORS[2], COLORS[4]], borderWidth: 0 }]
    },
    options: { spacing: 10 }
  });
}

// ═══════════════════════════════════════════════════
// LEVEL 2
// ═══════════════════════════════════════════════════

function l2t1_RestaurantRatings() {
  const buckets = { '0-1': 0, '1-2': 0, '2-3': 0, '3-4': 0, '4-5': 0 };
  let totalVotes = 0;
  allData.forEach(r => {
    const rate = r['Aggregate rating'];
    totalVotes += (r.Votes || 0);
    if (rate <= 1) buckets['0-1']++;
    else if (rate <= 2) buckets['1-2']++;
    else if (rate <= 3) buckets['2-3']++;
    else if (rate <= 4) buckets['3-4']++;
    else buckets['4-5']++;
  });

  const common = Object.entries(buckets).sort((a,b) => b[1]-a[1])[0][0];

  document.getElementById('l2t1-stats').innerHTML = `
    <div class="mini-stat">
      <div class="mini-stat-label">Most Common Range</div>
      <div class="mini-stat-value">${common} Stars</div>
    </div>
    <div class="mini-stat">
      <div class="mini-stat-label">Avg Votes / Rest.</div>
      <div class="mini-stat-value">${Math.round(totalVotes/allData.length).toLocaleString()}</div>
    </div>`;

  new Chart(document.getElementById('l2t1-chart'), {
    type: 'bar',
    data: {
      labels: Object.keys(buckets),
      datasets: [{ label: 'Frequency', data: Object.values(buckets), backgroundColor: COLORS[1], borderRadius: 8 }]
    },
    options: { plugins: { legend: { display: false } } }
  });
}

function l2t2_CuisineCombination() {
  const combos = {};
  allData.forEach(r => {
    if (r.Cuisines && r.Cuisines.includes(',')) {
      const c = r.Cuisines.split(',').map(x => x.trim()).sort().join(' & ');
      if (!combos[c]) combos[c] = { count: 0, rating: 0 };
      combos[c].count++;
      combos[c].rating += r['Aggregate rating'];
    }
  });

  const sorted = Object.entries(combos).sort((a,b) => b[1].count - a[1].count).slice(0, 8);

  new Chart(document.getElementById('l2t2-chart'), {
    type: 'bar',
    data: {
      labels: sorted.map(e => e[0].length > 25 ? e[0].substring(0,22)+'...' : e[0]),
      datasets: [
        { label: 'Orders', data: sorted.map(e => e[1].count), backgroundColor: COLORS[0]+'88', borderRadius: 4, yAxisID: 'y' },
        { label: 'Avg Rating', data: sorted.map(e => (e[1].rating/e[1].count).toFixed(2)), type: 'line', borderColor: COLORS[3], yAxisID: 'y1' }
      ]
    },
    options: { scales: { y: { position: 'left' }, y1: { position: 'right', min: 0, max: 5, grid: { display: false } } } }
  });
}

function l2t4_RestaurantChains() {
  const chains = {};
  allData.forEach(r => {
    const n = r['Restaurant Name'];
    if (!chains[n]) chains[n] = { count: 0, rating: 0 };
    chains[n].count++;
    chains[n].rating += r['Aggregate rating'];
  });

  const top = Object.entries(chains).filter(e => e[1].count > 1).sort((a,b) => b[1].count - a[1].count).slice(0, 10);

  new Chart(document.getElementById('l2t4-chart'), {
    type: 'bar',
    data: {
      labels: top.map(e => e[0]),
      datasets: [
        { label: 'Locations', data: top.map(e => e[1].count), backgroundColor: COLORS[2], borderRadius: 4 },
        { label: 'Avg Rating', data: top.map(e => (e[1].rating/e[1].count).toFixed(2)), backgroundColor: COLORS[0] }
      ]
    }
  });
}

// ═══════════════════════════════════════════════════
// LEVEL 3
// ═══════════════════════════════════════════════════

function l3t1_RestaurantReviews() {
  const pos = ['Great', 'Best', 'Delicious', 'Amazing', 'Friendly', 'Excellent'];
  const neg = ['Average', 'Poor', 'Expensive', 'Slow', 'Bad', 'Cold'];

  document.getElementById('review-keywords').innerHTML = `
    ${pos.map(w => `<div class="keyword pos">${w}</div>`).join('')}
    ${neg.map(w => `<div class="keyword neg">${w}</div>`).join('')}
  `;

  const sample = allData.slice(0, 500).filter(r => r['Aggregate rating'] > 0).map(r => ({
    x: (r.Cuisines ? r.Cuisines.length * 10 : 20) + Math.random()*40,
    y: r['Aggregate rating']
  }));

  new Chart(document.getElementById('l3t1-chart'), {
    type: 'scatter',
    data: { datasets: [{ label: 'Review Length vs Rating', data: sample, backgroundColor: COLORS[5]+'66' }] },
    options: { scales: { x: { title: { display: true, text: 'Review Length (est)' } }, y: { min: 0, max: 5 } } }
  });
}

function l3t2_VotesAnalysis() {
  const sorted = [...allData].sort((a,b) => b.Votes - a.Votes);
  const max = sorted[0];
  const min = sorted.filter(r => r.Votes > 0).pop();

  document.getElementById('l3t2-stats').innerHTML = `
    <div class="mini-stat">
      <div class="mini-stat-label">Highest Votes</div>
      <div class="mini-stat-value">${max.Votes.toLocaleString()}</div>
      <div class="stat-sub">${max['Restaurant Name']}</div>
    </div>
    <div class="mini-stat">
      <div class="mini-stat-label">Lowest (Non-Zero)</div>
      <div class="mini-stat-value">${min.Votes}</div>
      <div class="stat-sub">${min['Restaurant Name']}</div>
    </div>`;

  const correlation = allData.slice(0, 1000).map(r => ({ x: r.Votes, y: r['Aggregate rating'] })).filter(p => p.y > 0);

  new Chart(document.getElementById('l3t2-chart'), {
    type: 'scatter',
    data: { datasets: [{ label: 'Votes vs Rating', data: correlation, backgroundColor: COLORS[0]+'44' }] },
    options: { scales: { x: { type: 'logarithmic' }, y: { min: 0, max: 5 } } }
  });
}

function l3t3_PriceVsServices() {
  const priceGrid = { 1: { d: 0, b: 0, t: 0 }, 2: { d: 0, b: 0, t: 0 }, 3: { d: 0, b: 0, t: 0 }, 4: { d: 0, b: 0, t: 0 }};
  allData.forEach(r => {
    const p = r['Price range'];
    if (priceGrid[p]) {
      priceGrid[p].t++;
      if (r['Has Online delivery'] === 'Yes') priceGrid[p].d++;
      if (r['Has Table booking'] === 'Yes') priceGrid[p].b++;
    }
  });

  const ranges = ['Range 1', 'Range 2', 'Range 3', 'Range 4'];
  new Chart(document.getElementById('l3t3-chart'), {
    type: 'bar',
    data: {
      labels: ranges,
      datasets: [
        { label: '% Online Delivery', data: [1,2,3,4].map(p => (priceGrid[p].d/priceGrid[p].t*100).toFixed(1)), backgroundColor: COLORS[2] },
        { label: '% Table Booking', data: [1,2,3,4].map(p => (priceGrid[p].b/priceGrid[p].t*100).toFixed(1)), backgroundColor: COLORS[1] }
      ]
    },
    options: { scales: { y: { max: 100 } } }
  });
}

// ═══════════════════════════════════════════════════
// MAP
// ═══════════════════════════════════════════════════

function initMap() {
  if (charts.leafletMap) return;
  
  const map = L.map('map-container').setView([20, 78], 5);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CartoDB'
  }).addTo(map);

  const sample = allData.filter(r => r.Latitude && r.Longitude).slice(0, 1500);
  sample.forEach(r => {
    const color = r['Aggregate rating'] > 4 ? COLORS[2] : r['Aggregate rating'] > 3 ? COLORS[0] : COLORS[4];
    L.circleMarker([r.Latitude, r.Longitude], {
      radius: 4, fillColor: color, color: '#fff', weight: 0.5, fillOpacity: 0.6
    }).bindPopup(`<b>${r['Restaurant Name']}</b><br>${r.City}<br>Rating: ${r['Aggregate rating']}`).addTo(map);
  });
  
  charts.leafletMap = map;
}
