import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { User } from '../../core/models/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg fixed-top scw-navbar">
      <div class="container">
        <!-- Brand Logo -->
        <a class="navbar-brand d-flex align-items-center gap-2" routerLink="/">
          <div class="logo-icon">
            <i class="bi bi-droplet-half"></i>
          </div>
          <span class="brand-text">SMART<span class="text-accent">CARWASH</span></span>
        </a>

        <!-- Mobile Toggle Button -->
        <button
          class="navbar-toggler border-0 text-white"
          type="button"
          (click)="isCollapsed = !isCollapsed"
          aria-controls="scwNav"
          [attr.aria-expanded]="!isCollapsed"
          aria-label="Toggle navigation"
        >
          <i class="bi" [ngClass]="isCollapsed ? 'bi-list' : 'bi-x-lg'" style="font-size: 1.6rem; color: #00D4FF;"></i>
        </button>

        <!-- Navbar Links & Actions -->
        <div class="collapse navbar-collapse" [class.show]="!isCollapsed" id="scwNav">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-2">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="isCollapsed = true">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/services" routerLinkActive="active" (click)="isCollapsed = true">Services</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/packages" routerLinkActive="active" (click)="isCollapsed = true">Packages</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/contact" routerLinkActive="active" (click)="isCollapsed = true">Contact</a>
            </li>
          </ul>

          <div class="d-flex align-items-center gap-3">
            <!-- Unauthenticated: Login & Register -->
            <ng-container *ngIf="!(currentUser$ | async); else userMenu">
              <a routerLink="/auth/login" class="nav-link text-white fw-bold px-2" (click)="isCollapsed = true">
                <i class="bi bi-person me-1"></i> Sign In
              </a>
              <a routerLink="/auth/register" class="btn btn-sm btn-scw-outline text-white" (click)="isCollapsed = true">
                Register
              </a>
              <a routerLink="/booking" class="btn btn-sm btn-scw-primary ms-lg-2" (click)="isCollapsed = true">
                <i class="bi bi-calendar-check me-1"></i> Book Now
              </a>
            </ng-container>

            <!-- Authenticated User Menu -->
            <ng-template #userMenu>
              <!-- Notifications Bell -->
              <a routerLink="/dashboard/notifications" class="position-relative notification-btn text-white me-2" title="Notifications" (click)="isCollapsed = true">
                <i class="bi bi-bell fs-5"></i>
                <span *ngIf="(unreadCount$ | async) as count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.65rem;">
                  {{ count > 9 ? '9+' : count }}
                </span>
              </a>

              <!-- Book Now CTA -->
              <a routerLink="/booking" class="btn btn-sm btn-scw-primary d-none d-md-inline-flex" (click)="isCollapsed = true">
                <i class="bi bi-calendar-plus me-1"></i> Book Wash
              </a>

              <!-- Profile Dropdown -->
              <div class="dropdown">
                <button
                  class="btn user-profile-btn dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  id="userDropdown"
                  (click)="isDropdownOpen = !isDropdownOpen"
                  [attr.aria-expanded]="isDropdownOpen"
                >
                  <div class="avatar-circle">
                    {{ (currentUser$ | async)?.fullName?.charAt(0) || 'U' }}
                  </div>
                  <span class="user-name d-none d-sm-inline text-white fw-semibold">
                    {{ (currentUser$ | async)?.fullName?.split(' ')?.at(0) }}
                  </span>
                </button>

                <ul class="dropdown-menu dropdown-menu-end scw-dropdown shadow-lg" [class.show]="isDropdownOpen">
                  <li class="dropdown-header text-muted">
                    Signed in as <strong class="text-white d-block text-truncate">{{ (currentUser$ | async)?.email }}</strong>
                  </li>
                  <li><hr class="dropdown-divider border-secondary opacity-25"></li>

                  <!-- Admin Panel link if Admin -->
                  <li *ngIf="(currentUser$ | async)?.role === 'ADMIN'">
                    <a class="dropdown-item text-accent fw-bold" routerLink="/admin/dashboard" (click)="closeDropdown()">
                      <i class="bi bi-shield-lock me-2"></i> Admin Dashboard
                    </a>
                  </li>
                  <li *ngIf="(currentUser$ | async)?.role === 'ADMIN'"><hr class="dropdown-divider border-secondary opacity-25"></li>

                  <li>
                    <a class="dropdown-item" routerLink="/dashboard" (click)="closeDropdown()">
                      <i class="bi bi-speedometer2 me-2"></i> Dashboard Overview
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" routerLink="/dashboard/my-bookings" (click)="closeDropdown()">
                      <i class="bi bi-card-checklist me-2"></i> My Bookings
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" routerLink="/dashboard/vehicles" (click)="closeDropdown()">
                      <i class="bi bi-car-front me-2"></i> My Vehicles
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" routerLink="/dashboard/reviews" (click)="closeDropdown()">
                      <i class="bi bi-star me-2"></i> My Reviews
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" routerLink="/dashboard/profile" (click)="closeDropdown()">
                      <i class="bi bi-gear me-2"></i> Profile Settings
                    </a>
                  </li>
                  <li><hr class="dropdown-divider border-secondary opacity-25"></li>
                  <li>
                    <button class="dropdown-item text-danger" (click)="logout()">
                      <i class="bi bi-box-arrow-right me-2"></i> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .scw-navbar {
      background: rgba(11, 19, 43, 0.94);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.8rem 0;
      transition: all 0.3s ease;
      z-index: 1050;
    }

    .brand-text {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 1.35rem;
      color: #FFFFFF;
      letter-spacing: -0.01em;
    }

    .text-accent {
      color: #00D4FF;
    }

    .logo-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, #00D4FF 0%, #0077FF 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0B132B;
      font-size: 1.25rem;
      box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
    }

    .nav-link {
      color: #CBD5E1 !important;
      font-weight: 600;
      font-size: 0.95rem;
      padding: 0.5rem 0.9rem !important;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .nav-link:hover, .nav-link.active {
      color: #00D4FF !important;
      background: rgba(0, 212, 255, 0.08);
    }

    .avatar-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #1C2541;
      border: 2px solid #00D4FF;
      color: #00D4FF;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.95rem;
    }

    .user-profile-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 30px;
      padding: 4px 12px 4px 5px;
    }

    .user-profile-btn:hover {
      background: rgba(255, 255, 255, 0.12);
    }

    .scw-dropdown {
      background: #1C2541;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px;
      padding: 0.5rem;
      margin-top: 0.5rem;
    }

    .scw-dropdown .dropdown-item {
      color: #E2E8F0;
      border-radius: 8px;
      padding: 0.55rem 1rem;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.15s ease;
    }

    .scw-dropdown .dropdown-item:hover {
      background: rgba(0, 212, 255, 0.15);
      color: #00D4FF;
    }

    .notification-btn {
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
      transition: all 0.2s;
    }

    .notification-btn:hover {
      background: rgba(0, 212, 255, 0.15);
      color: #00D4FF !important;
    }
  `]
})
export class NavbarComponent implements OnInit {
  isCollapsed = true;
  isDropdownOpen = false;
  currentUser$ = this.authService.currentUser$;
  unreadCount$ = this.notificationService.unreadCount$;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.notificationService.getMyNotifications().subscribe({
        next: () => {},
        error: () => {}
      });
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
    this.isCollapsed = true;
  }

  logout(): void {
    this.closeDropdown();
    this.authService.logout();
  }
}
