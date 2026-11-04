export const CHART_PALETTE = Object.freeze([
  '#2f6b54',
  '#d6a756',
  '#b85c3b',
  '#4d7f8f',
  '#8b6d9c',
  '#6f7d4e',
  '#c47f59',
]);

const INK = '#1c302a';
const MUTED = '#5f6b63';
const BORDER = 'rgba(28, 48, 42, 0.09)';
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
        pointStyle: 'circle',
        boxWidth: 8,
        boxHeight: 8,
        padding: 18,
        font: { family: FONT, size: 12, weight: '500' },
      },
    },
    tooltip: {
      backgroundColor: INK,
      titleColor: '#fffdf8',
      bodyColor: '#fffdf8',
      padding: 12,
      cornerRadius: 10,
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
          borderColor: '#fffdf8',
          borderWidth: 3,
          hoverOffset: 6,
          spacing: 1,
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
          backgroundColor: '#2f6b54',
          hoverBackgroundColor: '#245643',
          borderRadius: 7,
          borderSkipped: false,
          maxBarThickness: 48,
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
          backgroundColor: ['#2f6b54', '#d6a756', '#4d7f8f'],
          borderColor: '#fffdf8',
          borderWidth: 3,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      ...baseOptions(reducedMotion, 'bottom'),
      radius: '88%',
    },
  };
}
