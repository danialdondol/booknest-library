export const CHART_PALETTE = Object.freeze([
  '#9f3f27',
  '#c59a43',
  '#3d5f4d',
  '#526f78',
  '#7a5a68',
  '#5e6d4f',
  '#a86645',
]);

const INK = '#16251f';
const MUTED = '#56625b';
const BORDER = 'rgba(22, 37, 31, 0.12)';
const FONT = '"Manrope Variable", "Segoe UI", sans-serif';

const baseOptions = (reducedMotion, legendPosition) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: reducedMotion ? false : { duration: 550 },
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      display: Boolean(legendPosition),
      position: legendPosition ?? 'bottom',
      labels: {
        color: MUTED,
        usePointStyle: true,
        pointStyle: 'rect',
        boxWidth: 7,
        boxHeight: 7,
        padding: 18,
        font: { family: FONT, size: 12, weight: '500' },
      },
    },
    tooltip: {
      backgroundColor: INK,
      titleColor: '#fffdf8',
      bodyColor: '#fffdf8',
      padding: 12,
      cornerRadius: 2,
      displayColors: true,
      titleFont: { family: FONT, size: 12, weight: '700' },
      bodyFont: { family: FONT, size: 12 },
    },
  },
});

const axis = (title) => ({
  grid: { color: BORDER, drawTicks: false },
  border: { display: false },
  ticks: { color: MUTED, font: { family: FONT, size: 11 } },
  title: {
    display: Boolean(title),
    text: title,
    color: MUTED,
    font: { family: FONT, size: 11, weight: '600' },
  },
});

export function categoryChartConfig(labels, values, { reducedMotion = false } = {}) {
  return {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: CHART_PALETTE,
          borderColor: '#fbf7ee',
          borderWidth: 2,
          hoverOffset: 4,
          spacing: 0,
        },
      ],
    },
    options: {
      ...baseOptions(reducedMotion, 'bottom'),
      cutout: '66%',
      radius: '88%',
    },
  };
}

export function loansChartConfig(labels, values, { reducedMotion = false } = {}) {
  return {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Books borrowed',
          data: values,
          backgroundColor: '#9f3f27',
          hoverBackgroundColor: '#7e2f1e',
          borderRadius: 0,
          borderSkipped: false,
          maxBarThickness: 38,
        },
      ],
    },
    options: {
      ...baseOptions(reducedMotion, null),
      scales: {
        x: { ...axis(), grid: { display: false } },
        y: { ...axis('Loans'), beginAtZero: true, ticks: { ...axis().ticks, precision: 0 } },
      },
    },
  };
}

export function memberTypeChartConfig(labels, values, { reducedMotion = false } = {}) {
  return {
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: ['#3d5f4d', '#c59a43', '#526f78'],
          borderColor: '#fbf7ee',
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      ...baseOptions(reducedMotion, 'bottom'),
      radius: '88%',
    },
  };
}
