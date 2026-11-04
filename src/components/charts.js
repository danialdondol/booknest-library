import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  DoughnutController,
  Legend,
  LinearScale,
  PieController,
  Tooltip,
} from 'chart.js';

Chart.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  DoughnutController,
  Legend,
  LinearScale,
  PieController,
  Tooltip,
);

Chart.defaults.font.family = '"Manrope Variable", "Segoe UI", sans-serif';
Chart.defaults.color = '#5f6b63';

export function mountChart(canvas, config) {
  if (!canvas) return null;
  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();

  const chart = new Chart(canvas, config);
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => chart.update('none')).catch(() => {});
  }
  return chart;
}

export function renderChartTable(tbody, rows, columns) {
  if (!tbody) return;
  tbody.replaceChildren();

  for (const row of rows) {
    const tr = document.createElement('tr');
    for (const column of columns) {
      const cell = document.createElement(column.header ? 'th' : 'td');
      if (column.header) cell.scope = 'row';
      cell.textContent = row[column.key];
      tr.append(cell);
    }
    tbody.append(tr);
  }
}

export function setChartLabel(canvas, label) {
  if (!canvas) return;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', label);
}

export function prefersReducedMotion() {
  return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}
