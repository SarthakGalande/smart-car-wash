import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PackageService } from '../core/services/package.service';
import { Package } from '../core/models/models';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="py-5 bg-light min-vh-100">
      <div class="container py-4">
        <!-- Header -->
        <div class="text-center mb-5">
          <span class="section-tag">Value Bundles</span>
          <h1 class="section-title">Car Wash & Detailing Packages</h1>
          <p class="section-subtitle mx-auto">
            Choose the ideal care package for your vehicle. Save up to 35% compared to booking individual treatments.
          </p>
        </div>

        <!-- Packages Cards Grid -->
        <div class="row g-4 mb-5 justify-content-center">
          <div class="col-lg-3 col-md-6" *ngFor="let pkg of packages">
            <div class="scw-card h-100 p-4 d-flex flex-column position-relative" [class.border-accent]="pkg.popular">
              <div *ngIf="pkg.badge" class="package-badge">
                {{ pkg.badge }}
              </div>

              <h3 class="h5 fw-bold mb-1 text-primary">{{ pkg.packageName }}</h3>
              <p class="text-muted small mb-3">{{ pkg.description }}</p>

              <div class="my-3 py-2 border-top border-bottom border-secondary border-opacity-10">
                <span class="h1 fw-bold text-primary">₹{{ pkg.price }}</span>
                <span class="text-muted small"> / session</span>
                <div class="small text-muted mt-1">
                  <i class="bi bi-clock text-accent me-1"></i> {{ pkg.duration }} mins duration
                </div>
              </div>

              <ul class="list-unstyled my-3 small flex-grow-1">
                <li class="d-flex align-items-start gap-2 mb-2" *ngFor="let feat of pkg.features">
                  <i class="bi bi-check-circle-fill text-accent flex-shrink-0 mt-1"></i>
                  <span>{{ feat }}</span>
                </li>
              </ul>

              <a [routerLink]="['/booking']" [queryParams]="{packageId: pkg._id || pkg.id}" class="btn w-100 mt-auto" [ngClass]="pkg.popular ? 'btn-scw-primary' : 'btn-scw-outline'">
                Book {{ pkg.packageName }}
              </a>
            </div>
          </div>
        </div>

        <!-- COMPREHENSIVE COMPARISON MATRIX -->
        <div class="scw-card p-4 mt-5">
          <h3 class="h4 fw-bold text-primary mb-4 text-center">Package Comparison Matrix</h3>
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0 comparison-table">
              <thead class="table-light">
                <tr>
                  <th style="width: 32%;">Feature / Treatment</th>
                  <th class="text-center" style="width: 17%;">Basic Wash<br><span class="fw-normal text-muted small">₹199</span></th>
                  <th class="text-center" style="width: 17%;">Standard Wash<br><span class="fw-normal text-muted small">₹399</span></th>
                  <th class="text-center text-accent" style="width: 17%;">Premium Wash<br><span class="fw-normal text-muted small">₹699</span></th>
                  <th class="text-center" style="width: 17%;">Ultimate Detailing<br><span class="fw-normal text-muted small">₹1499</span></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of comparisonRows">
                  <td class="fw-semibold text-secondary">
                    <i class="bi bi-gear-wide-connected text-accent me-2"></i>{{ row.feature }}
                  </td>
                  <td class="text-center">
                    <i class="bi bi-check-circle-fill text-success" *ngIf="row.basic"></i>
                    <i class="bi bi-dash text-muted opacity-50" *ngIf="!row.basic"></i>
                  </td>
                  <td class="text-center">
                    <i class="bi bi-check-circle-fill text-success" *ngIf="row.standard"></i>
                    <i class="bi bi-dash text-muted opacity-50" *ngIf="!row.standard"></i>
                  </td>
                  <td class="text-center bg-light">
                    <i class="bi bi-check-circle-fill text-success" *ngIf="row.premium"></i>
                    <i class="bi bi-dash text-muted opacity-50" *ngIf="!row.premium"></i>
                  </td>
                  <td class="text-center">
                    <i class="bi bi-check-circle-fill text-success" *ngIf="row.ultimate"></i>
                    <i class="bi bi-dash text-muted opacity-50" *ngIf="!row.ultimate"></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .border-accent {
      border: 2px solid #00D4FF !important;
      box-shadow: 0 10px 30px rgba(0, 212, 255, 0.2);
    }

    .package-badge {
      position: absolute;
      top: -12px;
      right: 20px;
      background: #00D4FF;
      color: #0B132B;
      font-weight: 800;
      font-size: 0.75rem;
      padding: 3px 14px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      box-shadow: 0 4px 10px rgba(0, 212, 255, 0.4);
    }

    .comparison-table th, .comparison-table td {
      padding: 1rem 0.8rem;
    }
  `]
})
export class PackagesComponent implements OnInit {
  packages: Package[] = [];

  comparisonRows = [
    { feature: 'High-Pressure Exterior Snow Foam', basic: true, standard: true, premium: true, ultimate: true },
    { feature: 'Tire Cleaning & Dressing', basic: true, standard: true, premium: true, ultimate: true },
    { feature: 'Microfiber Scratch-Free Hand Drying', basic: true, standard: true, premium: true, ultimate: true },
    { feature: 'Interior Cabin Deep Vacuuming', basic: false, standard: true, premium: true, ultimate: true },
    { feature: 'Dashboard & Console Conditioning', basic: false, standard: true, premium: true, ultimate: true },
    { feature: 'Streak-Free Glass & Window Cleaning', basic: false, standard: true, premium: true, ultimate: true },
    { feature: 'Door Jambs & Trunk Cleaned', basic: false, standard: false, premium: true, ultimate: true },
    { feature: 'AC Vent Sanitization & Fresh Scent', basic: false, standard: false, premium: true, ultimate: true },
    { feature: 'Brazilian Carnauba Wax Buffing', basic: false, standard: false, premium: false, ultimate: true },
    { feature: 'Engine Bay Steam Degreasing', basic: false, standard: false, premium: false, ultimate: true },
    { feature: 'Paint Decontamination & Machine Polish', basic: false, standard: false, premium: false, ultimate: true },
    { feature: 'Rain-Repellent Windshield Coating', basic: false, standard: false, premium: true, ultimate: true }
  ];

  constructor(private packageService: PackageService) {}

  ngOnInit(): void {
    this.packageService.getPackages().subscribe({
      next: (res) => {
        if (res.packages && res.packages.length > 0) {
          this.packages = res.packages;
        } else {
          // Fallback packages
          this.packages = [
            {
              packageName: 'Basic Wash',
              slug: 'basic-wash',
              description: 'Exterior wash and basic tire shine.',
              price: 199,
              duration: 30,
              features: ['Exterior foam wash', 'High-pressure rinse', 'Tire cleaning & shine', 'Microfiber hand dry'],
              status: 'ACTIVE'
            },
            {
              packageName: 'Standard Wash',
              slug: 'standard-wash',
              description: 'Exterior wash and complete interior vacuum.',
              price: 399,
              duration: 60,
              features: ['Everything in Basic Wash', 'Interior cabin vacuum', 'Dashboard wipe & shine', 'Window glass cleaning'],
              status: 'ACTIVE'
            },
            {
              packageName: 'Premium Wash',
              slug: 'premium-wash',
              description: 'Exterior foam, deep interior clean, tyre and dashboard polishing.',
              price: 699,
              duration: 90,
              popular: true,
              badge: 'Most Popular',
              features: ['Exterior foam bath', 'Interior deep extraction', 'Tyre & rim polishing', 'Dashboard UV protectant', 'Air freshener'],
              status: 'ACTIVE'
            },
            {
              packageName: 'Ultimate Detailing',
              slug: 'ultimate-detailing',
              description: 'Complete interior shampoo, wax polishing, and engine bay detailing.',
              price: 1499,
              duration: 180,
              badge: 'Best Value',
              features: ['Full interior steam shampoo', 'Exterior detailing & polish', 'Brazilian wax coat', 'Engine bay clean', 'Leather conditioner'],
              status: 'ACTIVE'
            }
          ];
        }
      },
      error: () => {}
    });
  }
}
