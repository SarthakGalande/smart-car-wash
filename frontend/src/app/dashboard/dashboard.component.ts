import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { BookingService } from '../core/services/booking.service';
import { VehicleService } from '../core/services/vehicle.service';
import { User, Booking, Vehicle } from '../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="py-5 bg-light min-vh-100">
      <div class="container py-4">
        <!-- WELCOME BANNER -->
        <div class="dashboard-banner scw-card p-4 p-md-5 mb-4 text-white position-relative overflow-hidden">
          <div class="row align-items-center position-relative z-1">
            <div class="col-lg-8">
              <span class="badge-scw-accent mb-2 d-inline-block">Customer Portal</span>
              <h1 class="h2 fw-bold text-white mb-2">
                Welcome back, {{ (currentUser$ | async)?.fullName }}! 👋
              </h1>
              <p class="text-light opacity-75 mb-4">
                Manage your garage, schedule high-gloss washes, view upcoming appointments, and access digital invoices.
              </p>
              <div class="d-flex flex-wrap gap-2">
                <a routerLink="/booking" class="btn btn-scw-primary">
                  <i class="bi bi-calendar-plus me-1"></i> Book New Wash
                </a>
                <a routerLink="/dashboard/vehicles" class="btn btn-scw-secondary">
                  <i class="bi bi-car-front me-1"></i> Add / Manage Vehicles
                </a>
              </div>
            </div>
            <div class="col-lg-4 text-center d-none d-lg-block">
              <i class="bi bi-speedometer2 text-accent opacity-50 display-1"></i>
            </div>
          </div>
        </div>

        <!-- STATS COUNTERS -->
        <div class="row g-3 mb-4">
          <div class="col-xl-2 col-md-4 col-6">
            <div class="scw-card p-3 h-100 text-center">
              <span class="text-muted small fw-semibold d-block mb-1">Total Bookings</span>
              <h3 class="fw-bold text-primary mb-0">{{ totalBookings }}</h3>
            </div>
          </div>
          <div class="col-xl-2 col-md-4 col-6">
            <div class="scw-card p-3 h-100 text-center border-start border-4 border-accent">
              <span class="text-muted small fw-semibold d-block mb-1">Upcoming</span>
              <h3 class="fw-bold text-accent mb-0">{{ upcomingBookings }}</h3>
            </div>
          </div>
          <div class="col-xl-2 col-md-4 col-6">
            <div class="scw-card p-3 h-100 text-center border-start border-4 border-success">
              <span class="text-muted small fw-semibold d-block mb-1">Completed</span>
              <h3 class="fw-bold text-success mb-0">{{ completedBookings }}</h3>
            </div>
          </div>
          <div class="col-xl-2 col-md-4 col-6">
            <div class="scw-card p-3 h-100 text-center border-start border-4 border-danger">
              <span class="text-muted small fw-semibold d-block mb-1">Cancelled</span>
              <h3 class="fw-bold text-danger mb-0">{{ cancelledBookings }}</h3>
            </div>
          </div>
          <div class="col-xl-4 col-md-8 col-12">
            <div class="scw-card p-3 h-100 d-flex align-items-center justify-content-between px-4">
              <div>
                <span class="text-muted small fw-semibold d-block mb-1">Total Money Invested</span>
                <h3 class="fw-bold text-primary mb-0">₹{{ totalSpent | number:'1.2-2' }}</h3>
              </div>
              <div class="stat-icon-circle bg-primary bg-opacity-10 text-primary">
                <i class="bi bi-wallet2 fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <!-- RECENT BOOKINGS -->
          <div class="col-lg-8">
            <div class="scw-card p-4 h-100">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 class="h5 fw-bold text-primary mb-0">Recent Appointments</h4>
                <a routerLink="/dashboard/my-bookings" class="small text-accent fw-bold">
                  View All <i class="bi bi-arrow-right"></i>
                </a>
              </div>

              <!-- Empty state -->
              <div *ngIf="recentBookings.length === 0" class="text-center py-5 text-muted">
                <i class="bi bi-calendar-x display-4 mb-2 d-block"></i>
                <p>No bookings found yet. Book your first wash today!</p>
                <a routerLink="/booking" class="btn btn-sm btn-scw-primary mt-2">Book Now</a>
              </div>

              <!-- Bookings List -->
              <div class="d-flex flex-column gap-3" *ngIf="recentBookings.length > 0">
                <div class="scw-card p-3 border bg-white" *ngFor="let booking of recentBookings">
                  <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                    <div>
                      <span class="fw-bold text-primary me-2">#{{ booking.bookingReference }}</span>
                      <span class="badge" [ngClass]="getStatusBadgeClass(booking.bookingStatus)">
                        {{ booking.bookingStatus }}
                      </span>
                    </div>
                    <span class="h6 fw-bold text-primary mb-0">₹{{ booking.finalAmount }}</span>
                  </div>

                  <div class="row g-2 text-muted small">
                    <div class="col-sm-6">
                      <i class="bi bi-car-front text-accent me-1"></i>
                      <strong>{{ booking.vehicleSnapshot?.brand || booking.vehicle?.brand }} {{ booking.vehicleSnapshot?.model || booking.vehicle?.model }}</strong>
                      <span class="license-plate ms-1 small">{{ booking.vehicleSnapshot?.registrationNumber || booking.vehicle?.registrationNumber }}</span>
                    </div>
                    <div class="col-sm-6">
                      <i class="bi bi-calendar-event text-accent me-1"></i>
                      {{ booking.bookingDate }} ({{ booking.timeSlot }})
                    </div>
                    <div class="col-12">
                      <i class="bi bi-geo-alt text-accent me-1"></i>
                      {{ booking.center?.centerName }}
                    </div>
                  </div>

                  <div class="d-flex justify-content-end gap-2 mt-3 pt-2 border-top">
                    <a [routerLink]="['/dashboard/my-bookings']" class="btn btn-sm btn-scw-outline py-1 px-3">
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SAVED VEHICLES PREVIEW -->
          <div class="col-lg-4">
            <div class="scw-card p-4 h-100">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 class="h5 fw-bold text-primary mb-0">Registered Cars</h4>
                <a routerLink="/dashboard/vehicles" class="small text-accent fw-bold">
                  Manage <i class="bi bi-arrow-right"></i>
                </a>
              </div>

              <!-- Empty state -->
              <div *ngIf="vehicles.length === 0" class="text-center py-4 text-muted">
                <i class="bi bi-car-front display-4 mb-2 d-block"></i>
                <p class="small">No vehicles added yet.</p>
                <a routerLink="/dashboard/vehicles" class="btn btn-sm btn-scw-outline mt-1">Add Vehicle</a>
              </div>

              <div class="d-flex flex-column gap-3" *ngIf="vehicles.length > 0">
                <div class="p-3 rounded-3 border bg-light" *ngFor="let car of vehicles">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <h6 class="fw-bold mb-0 text-primary">{{ car.brand }} {{ car.model }}</h6>
                    <span class="badge bg-secondary small">{{ car.vehicleType }}</span>
                  </div>
                  <div class="mt-2 d-flex justify-content-between align-items-center">
                    <span class="license-plate">{{ car.registrationNumber }}</span>
                    <span class="small text-muted">{{ car.color }}</span>
                  </div>
                </div>

                <a routerLink="/dashboard/vehicles" class="btn btn-sm btn-outline-secondary w-100 mt-2">
                  <i class="bi bi-plus-circle me-1"></i> Add Another Car
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-banner {
      background: linear-gradient(135deg, #0B132B 0%, #1C2541 100%);
      border-radius: 18px;
    }

    .stat-icon-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser$ = this.authService.currentUser$;
  recentBookings: Booking[] = [];
  vehicles: Vehicle[] = [];

  totalBookings = 0;
  upcomingBookings = 0;
  completedBookings = 0;
  cancelledBookings = 0;
  totalSpent = 0;

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load Bookings
    this.bookingService.getMyBookings().subscribe({
      next: (res) => {
        if (res.bookings) {
          this.recentBookings = res.bookings.slice(0, 5);
          this.totalBookings = res.total || res.bookings.length;

          const todayStr = new Date().toISOString().split('T')[0];
          this.upcomingBookings = res.bookings.filter(b => b.bookingDate >= todayStr && b.bookingStatus !== 'CANCELLED').length;
          this.completedBookings = res.bookings.filter(b => b.bookingStatus === 'COMPLETED').length;
          this.cancelledBookings = res.bookings.filter(b => b.bookingStatus === 'CANCELLED').length;

          this.totalSpent = res.bookings
            .filter(b => b.bookingStatus !== 'CANCELLED')
            .reduce((sum, b) => sum + (b.finalAmount || 0), 0);
        }
      },
      error: () => {}
    });

    // Load Vehicles
    this.vehicleService.getVehicles().subscribe({
      next: (res) => {
        this.vehicles = res.vehicles || [];
      },
      error: () => {}
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'bg-primary';
      case 'IN_PROGRESS': return 'bg-info text-dark';
      case 'COMPLETED': return 'bg-success';
      case 'CANCELLED': return 'bg-danger';
      default: return 'bg-warning text-dark';
    }
  }
}
