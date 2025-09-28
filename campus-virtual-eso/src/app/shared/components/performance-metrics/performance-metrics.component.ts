import {
  Component,
  signal,
  computed,
  effect,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  tti: number; // Time to Interactive
  renderCount: number;
  memoryUsage: number;
  bundleSize: number;
}

@Component({
  selector: 'app-performance-metrics',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="performance-metrics">
      <h3>📊 Métricas de Rendimiento</h3>

      <div class="metrics-grid">
        <div class="metric-card" [class.good]="isGoodFCP()" [class.poor]="isPoorFCP()">
          <div class="metric-label">FCP</div>
          <div class="metric-value">{{ metrics().fcp.toFixed(2) }}s</div>
          <div class="metric-description">First Contentful Paint</div>
        </div>

        <div class="metric-card" [class.good]="isGoodLCP()" [class.poor]="isPoorLCP()">
          <div class="metric-label">LCP</div>
          <div class="metric-value">{{ metrics().lcp.toFixed(2) }}s</div>
          <div class="metric-description">Largest Contentful Paint</div>
        </div>

        <div class="metric-card" [class.good]="isGoodCLS()" [class.poor]="isPoorCLS()">
          <div class="metric-label">CLS</div>
          <div class="metric-value">{{ metrics().cls.toFixed(3) }}</div>
          <div class="metric-description">Cumulative Layout Shift</div>
        </div>

        <div class="metric-card" [class.good]="isGoodTTI()" [class.poor]="isPoorTTI()">
          <div class="metric-label">TTI</div>
          <div class="metric-value">{{ metrics().tti.toFixed(2) }}s</div>
          <div class="metric-description">Time to Interactive</div>
        </div>

        <div class="metric-card">
          <div class="metric-label">Renders</div>
          <div class="metric-value">{{ metrics().renderCount }}</div>
          <div class="metric-description">Change Detection Cycles</div>
        </div>

        <div class="metric-card" [class.good]="isGoodMemory()" [class.poor]="isPoorMemory()">
          <div class="metric-label">Memory</div>
          <div class="metric-value">{{ (metrics().memoryUsage / 1024 / 1024).toFixed(1) }}MB</div>
          <div class="metric-description">Heap Usage</div>
        </div>
      </div>

      <div class="performance-score">
        <div class="score-circle" [class]="getScoreClass()">
          <span class="score-value">{{ overallScore() }}</span>
          <span class="score-label">Score</span>
        </div>
        <div class="score-details">
          <p>{{ getScoreDescription() }}</p>
          <small>{{ getOptimizationTip() }}</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .performance-metrics {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }

    .performance-metrics h3 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 1.1rem;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }

    .metric-card {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      transition: all 0.2s ease;
    }

    .metric-card.good {
      background: #d4f6d4;
      border-color: #28a745;
    }

    .metric-card.poor {
      background: #fdd8d8;
      border-color: #dc3545;
    }

    .metric-label {
      font-weight: 600;
      color: #666;
      font-size: 0.85rem;
      margin-bottom: 4px;
    }

    .metric-value {
      font-size: 1.2rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 4px;
    }

    .metric-description {
      font-size: 0.75rem;
      color: #666;
      line-height: 1.2;
    }

    .performance-score {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .score-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 4px solid;
      flex-shrink: 0;
    }

    .score-circle.excellent {
      border-color: #28a745;
      background: #d4f6d4;
    }

    .score-circle.good {
      border-color: #17a2b8;
      background: #d1ecf1;
    }

    .score-circle.needs-improvement {
      border-color: #ffc107;
      background: #fff3cd;
    }

    .score-circle.poor {
      border-color: #dc3545;
      background: #fdd8d8;
    }

    .score-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #333;
    }

    .score-label {
      font-size: 0.7rem;
      color: #666;
      text-transform: uppercase;
    }

    .score-details {
      flex-grow: 1;
    }

    .score-details p {
      margin: 0 0 8px 0;
      font-weight: 500;
      color: #333;
    }

    .score-details small {
      color: #666;
      line-height: 1.3;
    }

    @media (max-width: 768px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .performance-score {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class PerformanceMetricsComponent implements OnInit {
  private readonly _metrics = signal<PerformanceMetrics>({
    fcp: 0,
    lcp: 0,
    cls: 0,
    tti: 0,
    renderCount: 0,
    memoryUsage: 0,
    bundleSize: 0
  });

  readonly metrics = this._metrics.asReadonly();

  // Computed para determinar calidad de métricas
  readonly isGoodFCP = computed(() => this.metrics().fcp < 1.5);
  readonly isPoorFCP = computed(() => this.metrics().fcp > 2.5);

  readonly isGoodLCP = computed(() => this.metrics().lcp < 2.5);
  readonly isPoorLCP = computed(() => this.metrics().lcp > 4.0);

  readonly isGoodCLS = computed(() => this.metrics().cls < 0.1);
  readonly isPoorCLS = computed(() => this.metrics().cls > 0.25);

  readonly isGoodTTI = computed(() => this.metrics().tti < 3.0);
  readonly isPoorTTI = computed(() => this.metrics().tti > 5.0);

  readonly isGoodMemory = computed(() => this.metrics().memoryUsage < 50 * 1024 * 1024); // 50MB
  readonly isPoorMemory = computed(() => this.metrics().memoryUsage > 100 * 1024 * 1024); // 100MB

  readonly overallScore = computed(() => {
    const metrics = this.metrics();
    let score = 100;

    // FCP scoring
    if (metrics.fcp > 2.5) score -= 20;
    else if (metrics.fcp > 1.5) score -= 10;

    // LCP scoring
    if (metrics.lcp > 4.0) score -= 20;
    else if (metrics.lcp > 2.5) score -= 10;

    // CLS scoring
    if (metrics.cls > 0.25) score -= 15;
    else if (metrics.cls > 0.1) score -= 8;

    // TTI scoring
    if (metrics.tti > 5.0) score -= 15;
    else if (metrics.tti > 3.0) score -= 8;

    // Memory scoring
    if (metrics.memoryUsage > 100 * 1024 * 1024) score -= 10;
    else if (metrics.memoryUsage > 50 * 1024 * 1024) score -= 5;

    return Math.max(0, Math.min(100, score));
  });

  ngOnInit(): void {
    this.measurePerformance();
    this.startPerformanceMonitoring();
  }

  getScoreClass(): string {
    const score = this.overallScore();
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 50) return 'needs-improvement';
    return 'poor';
  }

  getScoreDescription(): string {
    const score = this.overallScore();
    if (score >= 90) return 'Excelente rendimiento! 🚀';
    if (score >= 75) return 'Buen rendimiento 👍';
    if (score >= 50) return 'Necesita mejoras ⚠️';
    return 'Rendimiento pobre 🐌';
  }

  getOptimizationTip(): string {
    const metrics = this.metrics();

    if (metrics.fcp > 2.5) {
      return 'Tip: Optimiza el First Contentful Paint usando lazy loading y compresión de assets.';
    }

    if (metrics.lcp > 4.0) {
      return 'Tip: Mejora el Largest Contentful Paint optimizando imágenes y recursos críticos.';
    }

    if (metrics.cls > 0.25) {
      return 'Tip: Reduce el Cumulative Layout Shift reservando espacio para elementos dinámicos.';
    }

    if (metrics.memoryUsage > 100 * 1024 * 1024) {
      return 'Tip: Optimiza el uso de memoria implementando virtual scrolling y OnPush strategy.';
    }

    return 'Tip: Mantén el buen rendimiento monitoreando métricas regularmente.';
  }

  private measurePerformance(): void {
    // Simular medición de performance en desarrollo
    // En producción, esto se conectaría con APIs reales de performance

    const mockMetrics: PerformanceMetrics = {
      fcp: 1.2 + Math.random() * 0.8, // 1.2 - 2.0s
      lcp: 1.8 + Math.random() * 1.2, // 1.8 - 3.0s
      cls: Math.random() * 0.15, // 0 - 0.15
      tti: 2.0 + Math.random() * 1.5, // 2.0 - 3.5s
      renderCount: Math.floor(Math.random() * 50) + 10, // 10-60 renders
      memoryUsage: (30 + Math.random() * 40) * 1024 * 1024, // 30-70MB
      bundleSize: 450 + Math.random() * 100 // 450-550KB
    };

    this._metrics.set(mockMetrics);
  }

  private startPerformanceMonitoring(): void {
    // Actualizar métricas cada 10 segundos
    setInterval(() => {
      this._metrics.update(current => ({
        ...current,
        renderCount: current.renderCount + Math.floor(Math.random() * 3),
        memoryUsage: Math.max(
          20 * 1024 * 1024, // Mínimo 20MB
          current.memoryUsage + (Math.random() - 0.5) * 5 * 1024 * 1024
        )
      }));
    }, 10000);

    // Effect para tracking de cambios
    effect(() => {
      const metrics = this.metrics();
      if (metrics.memoryUsage > 80 * 1024 * 1024) {
        console.warn('⚠️ Alto uso de memoria detectado:', (metrics.memoryUsage / 1024 / 1024).toFixed(1), 'MB');
      }
    });
  }
}