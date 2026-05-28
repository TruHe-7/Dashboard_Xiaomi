/* ══════════════════════════════════════════════════════════════════════
   Xiaomi CP-Factory SCADA — Lógica principal del dashboard
   ══════════════════════════════════════════════════════════════════════ */

/* ── Constantes de color (sincronizadas con las CSS variables) ──────── */
const CYAN   = '#00d4ff';
const GREEN  = '#00e676';
const RED    = '#ff5252';
const YELLOW = '#ffd740';
const ORANGE = '#ff9100';
const PURPLE = '#ce93d8';

/* ══════════════════════════════════════════════════════════════════════
   RELOJ EN TIEMPO REAL
   ══════════════════════════════════════════════════════════════════════ */
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString('es-CO', { hour12: false });
}

updateClock();
setInterval(updateClock, 1000);

/* ══════════════════════════════════════════════════════════════════════
   CONFIGURACIÓN GLOBAL DE CHART.JS
   ══════════════════════════════════════════════════════════════════════ */
Chart.defaults.color        = '#64748b';
Chart.defaults.borderColor  = '#1e2d44';
Chart.defaults.font.family  = "'Segoe UI', system-ui, sans-serif";
Chart.defaults.font.size    = 11;

/* ══════════════════════════════════════════════════════════════════════
   GRÁFICO 1 — GAUGE OEE (semicírculo)
   ══════════════════════════════════════════════════════════════════════ */
new Chart(document.getElementById('oeeGauge'), {
  type: 'doughnut',
  data: {
    datasets: [{
      data: [53.2, 46.8],
      backgroundColor: [
        'rgba(0, 212, 255, .85)',
        'rgba(30, 45, 68, .6)',
      ],
      borderWidth:   0,
      circumference: 180,
      rotation:      270,
    }],
  },
  options: {
    responsive: false,
    cutout: '72%',
    plugins: {
      legend:  { display: false },
      tooltip: { enabled: false },
    },
    animation: { duration: 1500, easing: 'easeOutQuart' },
  },
});

/* ══════════════════════════════════════════════════════════════════════
   GRÁFICO 2 — COMPARATIVA THROUGHPUT (barras agrupadas)
   ══════════════════════════════════════════════════════════════════════ */
new Chart(document.getElementById('chartComparativa'), {
  type: 'bar',
  data: {
    labels: ['Throughput', 'Cel. Buenos', 'Cel. Defect.', 'WIP Final', 'Prod./hora'],
    datasets: [
      {
        label:           'Sistema Actual',
        data:            [161, 97, 64, 79, 20.1],
        backgroundColor: 'rgba(255, 82, 82, .55)',
        borderColor:     RED,
        borderWidth:     1.5,
        borderRadius:    5,
      },
      {
        label:           'Sistema Mejorado',
        data:            [240, 144, 96, 0, 30],
        backgroundColor: 'rgba(0, 230, 118, .55)',
        borderColor:     GREEN,
        borderWidth:     1.5,
        borderRadius:    5,
      },
    ],
  },
  options: {
    responsive:          true,
    maintainAspectRatio: false,
    plugins: {
      legend:  { labels: { color: '#e2e8f0', boxWidth: 12 } },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { color: 'rgba(30, 45, 68, .6)' } },
      y: { grid: { color: 'rgba(30, 45, 68, .6)' }, beginAtZero: true },
    },
  },
});

/* ══════════════════════════════════════════════════════════════════════
   GRÁFICO 3 — FACTORES OEE COMPARADOS (radar)
   ══════════════════════════════════════════════════════════════════════ */
new Chart(document.getElementById('chartOEEFactors'), {
  type: 'radar',
  data: {
    labels: ['Disponibilidad', 'Rendimiento', 'Calidad', 'OEE Global'],
    datasets: [
      {
        label:              'Sistema Actual',
        data:               [88.28, 67.08, 60.25, 35.68],
        backgroundColor:    'rgba(255, 82, 82, .2)',
        borderColor:        RED,
        borderWidth:        2,
        pointBackgroundColor: RED,
        pointRadius:        4,
      },
      {
        label:              'Sistema Mejorado',
        data:               [88.67, 100, 60.0, 53.20],
        backgroundColor:    'rgba(0, 212, 255, .15)',
        borderColor:        CYAN,
        borderWidth:        2,
        pointBackgroundColor: CYAN,
        pointRadius:        4,
      },
    ],
  },
  options: {
    responsive:          true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#e2e8f0', boxWidth: 12 } },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        grid:        { color: 'rgba(30, 45, 68, .8)' },
        ticks:       { color: '#64748b', stepSize: 20, backdropColor: 'transparent' },
        pointLabels: { color: '#e2e8f0', font: { size: 11 } },
      },
    },
  },
});

/* ══════════════════════════════════════════════════════════════════════
   GRÁFICO 4 — UTILIZACIÓN DE ESTACIONES (donut)
   ══════════════════════════════════════════════════════════════════════ */
new Chart(document.getElementById('chartUtil'), {
  type: 'doughnut',
  data: {
    labels: ['PCBs & Fusibles', 'Robot Kuka', 'Disp. Tapas', 'Prensa', 'Ctrl. Calidad', 'AGV'],
    datasets: [{
      data:            [25.0, 3.34, 0.83, 8.33, 8.33, 72.49],
      backgroundColor: [GREEN, PURPLE, CYAN, RED, YELLOW, ORANGE],
      borderColor:     '#111827',
      borderWidth:     2,
      hoverOffset:     8,
    }],
  },
  options: {
    responsive:          true,
    maintainAspectRatio: false,
    cutout: '55%',
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#e2e8f0', boxWidth: 10, font: { size: 10 }, padding: 10 },
      },
      tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.label}: ${ctx.parsed.toFixed(2)}%`,
        },
      },
    },
  },
});

/* ══════════════════════════════════════════════════════════════════════
   GRÁFICO 5 — CURVA DE PRODUCCIÓN ACUMULADA (líneas)
   ══════════════════════════════════════════════════════════════════════ */
(function buildTimeline() {
  const hours        = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
  const totalPerHour = [0, 30, 60, 90, 120, 150, 180, 210, 240];
  const goodsPerHour = [0, 18, 36, 54,  72,  90, 108, 126, 144];
  const defectsPerHour = totalPerHour.map((t, i) => t - goodsPerHour[i]);

  new Chart(document.getElementById('chartTimeline'), {
    type: 'line',
    data: {
      labels: hours,
      datasets: [
        {
          label:              'Total acumulado',
          data:               totalPerHour,
          borderColor:        CYAN,
          backgroundColor:    'rgba(0, 212, 255, .08)',
          borderWidth:        2,
          tension:            .4,
          fill:               true,
          pointRadius:        4,
          pointBackgroundColor: CYAN,
        },
        {
          label:              'Buenos acumulados',
          data:               goodsPerHour,
          borderColor:        GREEN,
          backgroundColor:    'rgba(0, 230, 118, .06)',
          borderWidth:        2,
          tension:            .4,
          fill:               true,
          pointRadius:        4,
          pointBackgroundColor: GREEN,
        },
        {
          label:              'Defectuosos acumulados',
          data:               defectsPerHour,
          borderColor:        RED,
          backgroundColor:    'rgba(255, 82, 82, .06)',
          borderWidth:        2,
          tension:            .4,
          fill:               true,
          pointRadius:        4,
          pointBackgroundColor: RED,
        },
      ],
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      plugins: {
        legend:  { labels: { color: '#e2e8f0', boxWidth: 12 } },
        tooltip: { mode: 'index', intersect: false },
      },
      scales: {
        x: { grid: { color: 'rgba(30, 45, 68, .6)' } },
        y: {
          grid:        { color: 'rgba(30, 45, 68, .6)' },
          beginAtZero: true,
          max:         260,
          ticks:       { stepSize: 60 },
        },
      },
    },
  });
})();

/* ══════════════════════════════════════════════════════════════════════
   SIMULACIÓN EN VIVO — Rotación de estados de estaciones
   ══════════════════════════════════════════════════════════════════════ */
(function liveStates() {
  const nodeMap = {
    2: { box: document.getElementById('sn-2'), state: document.getElementById('sn2-state') },
    3: { box: document.getElementById('sn-3'), state: document.getElementById('sn3-state') },
    4: { box: document.getElementById('sn-4'), state: document.getElementById('sn4-state') },
  };

  /* Cada array: [ clase-del-box, texto-del-badge, clase-del-badge ] */
  const pressaStates = [
    ['warning', '⚠ Breakdown', 'state-fault'],
    ['active',  'Idle',        'state-idle'],
    ['active',  'Procesando',  'state-running'],
    ['warning', '⚠ Breakdown', 'state-fault'],
    ['active',  'Procesando',  'state-running'],
    ['active',  'Idle',        'state-idle'],
  ];

  const pcbStates = [
    ['active', 'Procesando', 'state-running'],
    ['active', 'Idle',       'state-idle'],
    ['active', 'Collecting', 'state-running'],
    ['active', 'Procesando', 'state-running'],
  ];

  const tapasStates = [
    ['active', 'Idle',       'state-idle'],
    ['active', 'Procesando', 'state-running'],
    ['active', 'Idle',       'state-idle'],
    ['active', 'Idle',       'state-idle'],
  ];

  let pressaIdx = 0;
  let pcbIdx    = 0;
  let tapasIdx  = 0;

  function applyState([boxClass, stateText, stateClass], boxEl, stateEl) {
    boxEl.className   = `station-box ${boxClass}`;
    stateEl.textContent = stateText;
    stateEl.className = `station-state ${stateClass}`;
  }

  setInterval(() => {
    pressaIdx = (pressaIdx + 1) % pressaStates.length;
    pcbIdx    = (pcbIdx    + 1) % pcbStates.length;
    tapasIdx  = (tapasIdx  + 1) % tapasStates.length;

    applyState(pressaStates[pressaIdx], nodeMap[4].box, nodeMap[4].state);
    applyState(pcbStates[pcbIdx],       nodeMap[2].box, nodeMap[2].state);
    applyState(tapasStates[tapasIdx],   nodeMap[3].box, nodeMap[3].state);
  }, 3500);
})();

/* ══════════════════════════════════════════════════════════════════════
   SIMULACIÓN EN VIVO — Contador de KPIs
   ══════════════════════════════════════════════════════════════════════ */
(function liveKPI() {
  let produced = 240;
  let good     = 144;
  let defects  =  96;

  const elThroughput   = document.getElementById('kpi-throughput');
  const elGood         = document.getElementById('kpi-good');
  const elDefect       = document.getElementById('kpi-defect');
  const elHdThroughput = document.getElementById('hd-throughput');

  setInterval(() => {
    const delta = Math.random() < 0.3 ? 1 : 0;

    if (delta && produced < 260) {
      produced += delta;
      const isGood = Math.random() < 0.6;
      if (isGood) good += delta;
      else defects += delta;

      elThroughput.textContent   = produced;
      elGood.textContent         = good;
      elDefect.textContent       = defects;
      elHdThroughput.textContent = produced;
    }
  }, 4000);
})();
