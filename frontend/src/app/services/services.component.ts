import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceService } from '../core/services/service.service';
import { Service } from '../core/models/models';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="py-5 bg-light min-vh-100">
      <div class="container py-4">
        <!-- Header -->
        <div class="text-center mb-5">
          <span class="section-tag">Explore Treatments</span>
          <h1 class="section-title">Car Wash & Detailing Services</h1>
          <p class="section-subtitle mx-auto">
            Choose from our specialized individual automotive cleaning treatments, performed by certified master detailers.
          </p>
        </div>

        <!-- Filters & Search Toolbar -->
        <div class="scw-card p-3 mb-4">
          <div class="row g-3 align-items-center">
            <!-- Search bar -->
            <div class="col-md-5">
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0">
                  <i class="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  class="form-control border-start-0 ps-0 scw-input"
                  placeholder="Search services (e.g. foam, interior, wax)..."
                  [(ngModel)]="searchKeyword"
                  (input)="applyFilters()"
                >
              </div>
            </div>

            <!-- Sort By -->
            <div class="col-md-3 ms-auto">
              <select class="form-select scw-input" [(ngModel)]="sortBy" (change)="applyFilters()">
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          <!-- Category Pills -->
          <div class="d-flex flex-wrap gap-2 mt-3 pt-3 border-top">
            <button
              class="btn btn-sm"
              [ngClass]="selectedCategory === cat ? 'btn-scw-primary' : 'btn-outline-secondary'"
              *ngFor="let cat of categories"
              (click)="setCategory(cat)"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Loading Skeletons -->
        <div class="row g-4" *ngIf="isLoading">
          <div class="col-lg-4 col-md-6" *ngFor="let s of [1,2,3,4,5,6]">
            <div class="scw-card p-3">
              <div class="skeleton-box mb-3" style="height: 180px;"></div>
              <div class="skeleton-box mb-2" style="height: 24px; width: 60%;"></div>
              <div class="skeleton-box mb-3" style="height: 16px; width: 90%;"></div>
              <div class="skeleton-box" style="height: 38px;"></div>
            </div>
          </div>
        </div>

        <!-- Services Grid -->
        <div class="row g-4" *ngIf="!isLoading">
          <div class="col-lg-4 col-md-6" *ngFor="let service of filteredServices">
            <div class="scw-card h-100 overflow-hidden d-flex flex-column">
              <div class="position-relative service-img-box">
                <img [src]="service.image" [alt]="service.serviceName" class="w-100 service-img">
                <span class="badge-scw-accent position-absolute top-0 end-0 m-3">
                  {{ service.category }}
                </span>
                <span *ngIf="service.isPopular" class="badge bg-warning text-dark position-absolute top-0 start-0 m-3 fw-bold">
                  <i class="bi bi-fire me-1"></i> Popular
                </span>
              </div>

              <div class="p-4 d-flex flex-column flex-grow-1">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h4 class="h5 fw-bold mb-0 text-primary">{{ service.serviceName }}</h4>
                  <div class="text-warning small d-flex align-items-center">
                    <i class="bi bi-star-fill me-1"></i>
                    <span class="fw-bold">{{ service.rating }}</span>
                  </div>
                </div>

                <p class="text-secondary small mb-3 flex-grow-1">
                  {{ service.description }}
                </p>

                <!-- Features list -->
                <ul class="list-unstyled small mb-3">
                  <li class="d-flex align-items-center gap-2 mb-1 text-muted" *ngFor="let feat of service.features">
                    <i class="bi bi-check2-circle text-accent"></i>
                    <span>{{ feat }}</span>
                  </li>
                </ul>

                <!-- Price and CTA -->
                <div class="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                  <div>
                    <span class="text-muted small d-block">Starting from</span>
                    <span class="h4 fw-bold text-primary mb-0">₹{{ service.price }}</span>
                    <span class="text-muted small ms-1">({{ service.duration }}m)</span>
                  </div>
                  <a [routerLink]="['/booking']" [queryParams]="{serviceId: service._id || service.id}" class="btn btn-sm btn-scw-primary">
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="col-12 text-center py-5" *ngIf="filteredServices.length === 0">
            <div class="py-5">
              <i class="bi bi-search text-muted display-3 mb-3"></i>
              <h4 class="fw-bold">No services found</h4>
              <p class="text-muted">Try adjusting your search query or selecting another category.</p>
              <button class="btn btn-sm btn-scw-outline mt-2" (click)="resetFilters()">
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .service-img-box {
      height: 200px;
      overflow: hidden;
    }

    .service-img {
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .scw-card:hover .service-img {
      transform: scale(1.05);
    }
  `]
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  isLoading = true;
  searchKeyword = '';
  sortBy = 'popular';
  selectedCategory = 'All';

  categories = ['All', 'Exterior', 'Interior', 'Complete', 'Detailing', 'Specialized'];

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;
    this.serviceService.getServices().subscribe({
      next: (res) => {
        this.services = res.services || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  setCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.services];

    // Filter by Category
    if (this.selectedCategory !== 'All') {
      result = result.filter(s => s.category === this.selectedCategory);
    }

    // Filter by Search Keyword
    if (this.searchKeyword.trim()) {
      const q = this.searchKeyword.toLowerCase().trim();
      result = result.filter(s =>
        s.serviceName.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.features.some(f => f.toLowerCase().includes(q))
      );
    }

    // Sort
    if (this.sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Default: Popular first
      result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    this.filteredServices = result;
  }

  resetFilters(): void {
    this.searchKeyword = '';
    this.selectedCategory = 'All';
    this.sortBy = 'popular';
    this.applyFilters();
  }
}
