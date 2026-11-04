import { describe, expect, it } from 'vitest';
import {
  categoryChartConfig,
  CHART_PALETTE,
  loansChartConfig,
  memberTypeChartConfig,
} from '../../src/lib/chart-configs.js';

describe('chart config builders', () => {
  it('builds a category doughnut with the shared palette', () => {
    const config = categoryChartConfig(['Fiction', 'Science'], [3, 2]);
    expect(config.type).toBe('doughnut');
    expect(config.data.labels).toEqual(['Fiction', 'Science']);
    expect(config.data.datasets[0].data).toEqual([3, 2]);
    expect(config.data.datasets[0].backgroundColor).toBe(CHART_PALETTE);
    expect(config.options.cutout).toBe('66%');
    expect(config.options.plugins.legend.position).toBe('bottom');
    expect(config.options.animation).not.toBe(false);
  });

  it('disables animation when reduced motion is requested', () => {
    const config = categoryChartConfig(['Fiction'], [1], { reducedMotion: true });
    expect(config.options.animation).toBe(false);
  });

  it('builds a bar chart with numeric axes', () => {
    const config = loansChartConfig(['May', 'Jun'], [48, 61]);
    expect(config.type).toBe('bar');
    expect(config.data.datasets[0].label).toBe('Books borrowed');
    expect(config.options.scales.y.beginAtZero).toBe(true);
    expect(config.options.plugins.legend.display).toBe(false);
  });

  it('builds a pie chart for member types', () => {
    const config = memberTypeChartConfig(['Student', 'Staff'], [8, 2]);
    expect(config.type).toBe('pie');
    expect(config.data.datasets[0].data).toEqual([8, 2]);
    expect(config.data.datasets[0].backgroundColor).toHaveLength(3);
  });
});
