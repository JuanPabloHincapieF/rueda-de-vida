// ── CATEGORIES ──
const categories = [
{ name: 'Finanzas',                    icon: '💰', key: 'finanzas' },
{ name: 'Familia',                     icon: '🏡', key: 'familia' },
{ name: 'Pareja',                      icon: '❤️', key: 'pareja' },
{ name: 'Salud',                       icon: '🌿', key: 'salud' },
{ name: 'Diversión',                   icon: '🎉', key: 'diversion' },
{ name: 'Profesional',                 icon: '🚀', key: 'profesional' },
{ name: 'Crecimiento Personal · Esp.', icon: '🔥', key: 'crecimiento' },
{ name: 'Amor Propio',                 icon: '✨', key: 'amor' },
];

// ── BUILD SLIDERS ──
const grid = document.getElementById('sliders-grid');

categories.forEach(cat => {
const card = document.createElement('div');
card.className = 'card';
card.innerHTML = `
    <div class="card-label">
    <span class="cat-name">${cat.name}</span>
    <div style="display:flex;align-items:center;gap:10px;">
        <span class="score-display" id="score-${cat.key}">5</span>
        <span class="cat-icon">${cat.icon}</span>
    </div>
    </div>
    <div class="slider-wrap">
    <div class="slider-track" id="track-${cat.key}" style="width:50%"></div>
    <input type="range" min="0" max="10" value="5" step="1"
            id="range-${cat.key}"
            oninput="updateSlider('${cat.key}', this.value)" />
    </div>
    <div class="scale-labels"><span>0</span><span>5</span><span>10</span></div>
`;
grid.appendChild(card);
});

function updateSlider(key, val) {
document.getElementById('score-' + key).textContent = val;
document.getElementById('track-' + key).style.width = (val * 10) + '%';
}

// ── CHART INSTANCE ──
let radarInstance = null;

function getValues() {
return categories.map(c => parseInt(document.getElementById('range-' + c.key).value));
}

function getLabels() {
return categories.map(c => c.name);
}

function generateChart() {
const section = document.getElementById('chart-section');
section.style.display = 'block';
section.style.animation = 'none';
void section.offsetWidth;
section.style.animation = 'fadeUp 0.7s ease forwards';

// Date
const now = new Date();
const dateStr = now.toLocaleDateString('es-ES', { day:'2-digit', month:'long', year:'numeric' });
document.getElementById('chart-date').textContent = dateStr;

// Scroll
setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

// Destroy old chart
if (radarInstance) { radarInstance.destroy(); radarInstance = null; }

const ctx = document.getElementById('radarChart').getContext('2d');

// Gradient fill
const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 300);
gradient.addColorStop(0,   'rgba(192,57,43,0.55)');
gradient.addColorStop(0.5, 'rgba(230,126,34,0.35)');
gradient.addColorStop(1,   'rgba(243,156,18,0.15)');

radarInstance = new Chart(ctx, {
    type: 'radar',
    data: {
    labels: getLabels(),
    datasets: [{
        label: 'Mi Rueda de la Vida',
        data: getValues(),
        backgroundColor: gradient,
        borderColor: 'rgba(231,76,60,0.9)',
        borderWidth: 2,
        pointBackgroundColor: '#f39c12',
        pointBorderColor: 'rgba(255,255,255,0.3)',
        pointBorderWidth: 1.5,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#f8c471',
    }]
    },
    options: {
    responsive: true,
    animation: { duration: 900, easing: 'easeInOutQuart' },
    scales: {
        r: {
        min: 0, max: 10,
        ticks: {
            stepSize: 2,
            color: 'rgba(240,230,211,0.35)',
            font: { family: 'Raleway', size: 9 },
            backdropColor: 'transparent',
        },
        grid:        { color: 'rgba(192,57,43,0.18)', lineWidth: 1 },
        angleLines:  { color: 'rgba(192,57,43,0.25)', lineWidth: 1 },
        pointLabels: {
            color: '#f0e6d3',
            font: { family: 'Cinzel', size: 11, weight: '700' },
        }
        }
    },
    plugins: {
        legend: { display: false },
        tooltip: {
        backgroundColor: 'rgba(6,6,6,0.92)',
        titleColor: '#f39c12',
        bodyColor: '#f0e6d3',
        borderColor: 'rgba(192,57,43,0.5)',
        borderWidth: 1,
        titleFont: { family: 'Cinzel', size: 12 },
        bodyFont:  { family: 'Raleway', size: 12 },
        callbacks: {
            label: ctx => `  ${ctx.parsed.r} / 10`
        }
        }
    }
    }
});
}

// ── DOWNLOAD ──
function downloadChart() {
const now = new Date();

// Render a fresh hidden chart at large size with extra padding for labels
const W = 1200, H = 1320;
const PADDING = 160; // space around chart for labels

const off = document.createElement('canvas');
off.width = W; off.height = H;
const g = off.getContext('2d');

// Background
g.fillStyle = '#060606';
g.fillRect(0, 0, W, H);

// Top glow
const glow = g.createRadialGradient(W/2, 0, 0, W/2, 0, 550);
glow.addColorStop(0, 'rgba(139,26,26,0.35)');
glow.addColorStop(1, 'transparent');
g.fillStyle = glow;
g.fillRect(0, 0, W, H);

// Title
g.fillStyle = '#c0392b';
g.font = '900 72px Cinzel, serif';
g.textAlign = 'center';
g.fillText('NAKAMA', W/2, 90);

// Subtitle
g.fillStyle = 'rgba(240,230,211,0.45)';
g.font = '300 22px Raleway, sans-serif';
g.fillText('RUEDA DE LA VIDA', W/2, 128);

// Divider
g.strokeStyle = 'rgba(139,26,26,0.6)';
g.lineWidth = 1;
g.beginPath(); g.moveTo(W/2 - 100, 148); g.lineTo(W/2 + 100, 148); g.stroke();

// ── Hidden canvas to render Chart.js at large resolution ──
const chartCanvas = document.createElement('canvas');
const CHART_SIZE = W - PADDING * 2;
chartCanvas.width  = CHART_SIZE;
chartCanvas.height = CHART_SIZE;
document.body.appendChild(chartCanvas); // must be in DOM for Chart.js

const ctx2 = chartCanvas.getContext('2d');
const gradient2 = ctx2.createRadialGradient(0,0,0,0,0,CHART_SIZE/2);
gradient2.addColorStop(0,   'rgba(192,57,43,0.55)');
gradient2.addColorStop(0.5, 'rgba(230,126,34,0.35)');
gradient2.addColorStop(1,   'rgba(243,156,18,0.15)');

const tempChart = new Chart(ctx2, {
    type: 'radar',
    data: {
    labels: getLabels(),
    datasets: [{
        data: getValues(),
        backgroundColor: gradient2,
        borderColor: 'rgba(231,76,60,0.9)',
        borderWidth: 3,
        pointBackgroundColor: '#f39c12',
        pointBorderColor: 'rgba(255,255,255,0.3)',
        pointBorderWidth: 2,
        pointRadius: 7,
    }]
    },
    options: {
    animation: false,
    responsive: false,
    layout: { padding: 80 }, // extra inner padding so labels aren't clipped
    scales: {
        r: {
        min: 0, max: 10,
        ticks: {
            stepSize: 2,
            color: 'rgba(240,230,211,0.35)',
            font: { family: 'Raleway', size: 14 },
            backdropColor: 'transparent',
        },
        grid:       { color: 'rgba(192,57,43,0.2)', lineWidth: 1.5 },
        angleLines: { color: 'rgba(192,57,43,0.3)', lineWidth: 1.5 },
        pointLabels: {
            color: '#f0e6d3',
            font: { family: 'Cinzel', size: 18, weight: '700' },
        }
        }
    },
    plugins: { legend: { display: false }, tooltip: { enabled: false } }
    }
});

// Wait one frame for Chart.js to finish drawing
setTimeout(() => {
    const CHART_Y = 170;
    g.drawImage(chartCanvas, PADDING, CHART_Y, CHART_SIZE, CHART_SIZE);
    tempChart.destroy();
    document.body.removeChild(chartCanvas);

    // Date
    const dateStr = now.toLocaleDateString('es-ES', { day:'2-digit', month:'long', year:'numeric' });
    g.fillStyle = 'rgba(122,106,90,0.7)';
    g.font = '300 16px Raleway, sans-serif';
    g.textAlign = 'center';
    g.fillText(dateStr.toUpperCase(), W/2, H - 44);

    // Average
    const vals = getValues();
    const avg = (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1);
    g.fillStyle = 'rgba(243,156,18,0.85)';
    g.font = '700 16px Cinzel, serif';
    g.fillText(`PROMEDIO GENERAL: ${avg} / 10`, W/2, H - 20);

    // Download
    const link = document.createElement('a');
    link.download = `nakama-rueda-${now.toISOString().slice(0,10)}.png`;
    link.href = off.toDataURL('image/png');
    link.click();
}, 300);
}