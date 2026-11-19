import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-wrapper min-vh-100 d-flex align-items-center py-5">
      <div class="container py-4">
        <div class="row justify-content-center">
          <div class="col-lg-6 col-md-8 col-sm-10">
            <div class="scw-card p-4 p-md-5 auth-card position-relative overflow-hidden">
              <!-- Top Glow Bar -->
              <div class="auth-glow-bar"></div>

              <!-- Brand Header -->
              <div class="text-center mb-4">
                <a routerLink="/" class="d-inline-flex align-items-center gap-2 mb-2 text-decoration-none">
                  <div class="logo-icon">
                    <i class="bi bi-droplet-half"></i>
                  </div>
                  <span class="brand-text">SMART<span class="text-accent">CARWASH</span></span>
                </a>
                <p class="text-muted small">
                  {{ isLoginMode ? 'Access your dashboard and booking appointments' : 'Create your account to unlock premium car care' }}
                </p>
              </div>

              <!-- Mode Switcher Tabs -->
              <div class="auth-tabs d-flex p-1 mb-4 rounded-3 bg-light">
                <button
                  type="button"
                  class="btn flex-fill auth-tab-btn"
                  [class.active]="isLoginMode"
                  (click)="setMode(true)"
                >
                  <i class="bi bi-box-arrow-in-right me-1"></i> Sign In
                </button>
                <button
                  type="button"
                  class="btn flex-fill auth-tab-btn"
                  [class.active]="!isLoginMode"
                  (click)="setMode(false)"
                >
                  <i class="bi bi-person-plus me-1"></i> Register
                </button>
              </div>

              <!-- LOGIN FORM -->
              <form *ngIf="isLoginMode && !isForgotPassword" [formGroup]="loginForm" (ngSubmit)="onLogin()">
                <div class="mb-3">
                  <label class="form-label fw-semibold small">Email Address</label>
                  <div class="input-group">
                    <span class="input-group-text bg-white"><i class="bi bi-envelope text-muted"></i></span>
                    <input
                      type="email"
                      class="form-control scw-input"
                      formControlName="email"
                      placeholder="e.g. john@example.com"
                      [class.is-invalid]="lf['email'].touched && lf['email'].invalid"
                    >
                  </div>
                  <div class="invalid-feedback small d-block" *ngIf="lf['email'].touched && lf['email'].invalid">
                    Please provide a valid email.
                  </div>
                </div>

                <div class="mb-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <label class="form-label fw-semibold small">Password</label>
                    <a href="javascript:void(0)" class="small text-accent fw-semibold" (click)="isForgotPassword = true">
                      Forgot Password?
                    </a>
                  </div>
                  <div class="input-group">
                    <span class="input-group-text bg-white"><i class="bi bi-lock text-muted"></i></span>
                    <input
                      [type]="showPassword ? 'text' : 'password'"
                      class="form-control scw-input"
                      formControlName="password"
                      placeholder="••••••••"
                      [class.is-invalid]="lf['password'].touched && lf['password'].invalid"
                    >
                    <button type="button" class="btn btn-outline-secondary border-start-0" (click)="showPassword = !showPassword">
                      <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </button>
                  </div>
                  <div class="invalid-feedback small d-block" *ngIf="lf['password'].touched && lf['password'].invalid">
                    Password is required.
                  </div>
                </div>

                <button type="submit" class="btn btn-scw-primary w-100 py-3 mt-3" [disabled]="isSubmitting">
                  <span *ngIf="!isSubmitting">Sign In to Account</span>
                  <span *ngIf="isSubmitting"><span class="spinner-border spinner-border-sm me-2"></span> Authenticating...</span>
                </button>

                <!-- Quick Demo Login Helpers -->
                <div class="mt-4 pt-3 border-top text-center">
                  <span class="text-muted small d-block mb-2">Quick Demo Access:</span>
                  <div class="d-flex gap-2 justify-content-center">
                    <button type="button" class="btn btn-xs btn-outline-primary small" (click)="fillDemo('CUSTOMER')">
                      <i class="bi bi-person me-1"></i> Demo Customer
                    </button>
                    <button type="button" class="btn btn-xs btn-outline-dark small" (click)="fillDemo('ADMIN')">
                      <i class="bi bi-shield-lock me-1"></i> Admin Login
                    </button>
                  </div>
                </div>
              </form>

              <!-- REGISTRATION FORM -->
              <form *ngIf="!isLoginMode" [formGroup]="registerForm" (ngSubmit)="onRegister()">
                <div class="mb-3">
                  <label class="form-label fw-semibold small">Full Name *</label>
                  <input
                    type="text"
                    class="form-control scw-input"
                    formControlName="fullName"
                    placeholder="e.g. John Doe"
                    [class.is-invalid]="rf['fullName'].touched && rf['fullName'].invalid"
                  >
                  <div class="invalid-feedback small" *ngIf="rf['fullName'].touched && rf['fullName'].invalid">
                    Name must be at least 2 characters.
                  </div>
                </div>

                <div class="row g-2 mb-3">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold small">Email Address *</label>
                    <input
                      type="email"
                      class="form-control scw-input"
                      formControlName="email"
                      placeholder="john@example.com"
                      [class.is-invalid]="rf['email'].touched && rf['email'].invalid"
                    >
                    <div class="invalid-feedback small" *ngIf="rf['email'].touched && rf['email'].invalid">
                      Valid email is required.
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold small">Mobile Number *</label>
                    <input
                      type="tel"
                      class="form-control scw-input"
                      formControlName="phone"
                      placeholder="+91 98765 43210"
                      [class.is-invalid]="rf['phone'].touched && rf['phone'].invalid"
                    >
                    <div class="invalid-feedback small" *ngIf="rf['phone'].touched && rf['phone'].invalid">
                      10 digit phone number required.
                    </div>
                  </div>
                </div>

                <div class="row g-2 mb-3">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold small">Password *</label>
                    <input
                      type="password"
                      class="form-control scw-input"
                      formControlName="password"
                      placeholder="Min. 6 chars"
                      [class.is-invalid]="rf['password'].touched && rf['password'].invalid"
                    >
                    <div class="invalid-feedback small" *ngIf="rf['password'].touched && rf['password'].invalid">
                      At least 6 characters required.
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold small">Confirm Password *</label>
                    <input
                      type="password"
                      class="form-control scw-input"
                      formControlName="confirmPassword"
                      placeholder="Repeat password"
                      [class.is-invalid]="registerForm.errors?.['mismatch'] && rf['confirmPassword'].touched"
                    >
                    <div class="invalid-feedback small d-block" *ngIf="registerForm.errors?.['mismatch'] && rf['confirmPassword'].touched">
                      Passwords do not match.
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold small">City / Area</label>
                  <input
                    type="text"
                    class="form-control scw-input"
                    formControlName="city"
                    placeholder="e.g. New Delhi"
                  >
                </div>

                <button type="submit" class="btn btn-scw-primary w-100 py-3 mt-3" [disabled]="isSubmitting || registerForm.invalid">
                  <span *ngIf="!isSubmitting">Create Smart Car Wash Account</span>
                  <span *ngIf="isSubmitting"><span class="spinner-border spinner-border-sm me-2"></span> Registering...</span>
                </button>
              </form>

              <!-- FORGOT PASSWORD FORM -->
              <div *ngIf="isForgotPassword">
                <h5 class="fw-bold text-primary mb-2">Reset Password</h5>
                <p class="text-muted small mb-4">Enter your registered email address to receive password reset instructions.</p>

                <div class="mb-3">
                  <label class="form-label fw-semibold small">Email Address</label>
                  <input type="email" class="form-control scw-input" [(ngModel)]="forgotEmail" placeholder="Enter your email">
                </div>

                <button type="button" class="btn btn-scw-primary w-100 py-2 mb-2" (click)="onForgotPassword()" [disabled]="isSubmitting || !forgotEmail">
                  Send Reset Link
                </button>
                <button type="button" class="btn btn-link w-100 small text-secondary" (click)="isForgotPassword = false">
                  <i class="bi bi-arrow-left me-1"></i> Back to Sign In
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      background: radial-gradient(circle at 50% 20%, #1C2541 0%, #0B132B 100%);
    }

    .auth-card {
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
      border-radius: 18px;
    }

    .auth-glow-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #00D4FF, #0077FF, #22C55E);
    }

    .brand-text {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 1.4rem;
      color: #0B132B;
    }

    .text-accent {
      color: #0088CC;
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      border-radius: 9px;
      background: linear-gradient(135deg, #00D4FF 0%, #0077FF 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0B132B;
      font-size: 1.2rem;
    }

    .auth-tab-btn {
      font-weight: 600;
      font-size: 0.9rem;
      border-radius: 6px;
      color: #64748B;
      padding: 0.45rem;
      transition: all 0.2s;
    }

    .auth-tab-btn.active {
      background: #FFFFFF;
      color: #0B132B;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
      font-weight: 700;
    }

    .btn-xs {
      font-size: 0.78rem;
      padding: 0.25rem 0.6rem;
      border-radius: 20px;
    }
  `]
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isForgotPassword = false;
  showPassword = false;
  isSubmitting = false;
  forgotEmail = '';
  returnUrl = '/dashboard';

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    this.registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.minLength(10)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        city: ['New Delhi']
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.route.url.subscribe((segments) => {
      if (segments.length > 0 && segments[0].path === 'register') {
        this.isLoginMode = false;
      }
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  setMode(login: boolean): void {
    this.isLoginMode = login;
    this.isForgotPassword = false;
  }

  get lf() {
    return this.loginForm.controls;
  }

  get rf() {
    return this.registerForm.controls;
  }

  fillDemo(role: 'CUSTOMER' | 'ADMIN'): void {
    if (role === 'ADMIN') {
      this.loginForm.patchValue({
        email: 'admin@smartcarwash.com',
        password: 'Admin@123'
      });
    } else {
      this.loginForm.patchValue({
        email: 'john@example.com',
        password: 'Customer@123'
      });
    }
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    this.isSubmitting = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.toastService.success(`Welcome back, ${res.user?.fullName}!`);
        this.isSubmitting = false;
        if (res.user?.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Login failed. Please check your credentials.');
        this.isSubmitting = false;
      }
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) return;

    this.isSubmitting = true;
    const { fullName, email, phone, password, city } = this.registerForm.value;
    const payload = {
      fullName,
      email,
      phone,
      password,
      address: { city }
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.toastService.success('Registration successful! Welcome to Smart Car Wash.');
        this.isSubmitting = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Registration failed.');
        this.isSubmitting = false;
      }
    });
  }

  onForgotPassword(): void {
    if (!this.forgotEmail) return;

    this.isSubmitting = true;
    this.authService.forgotPassword(this.forgotEmail).subscribe({
      next: (res) => {
        this.toastService.info(res.message || 'Password reset link dispatched.');
        this.isForgotPassword = false;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to process password request.');
        this.isSubmitting = false;
      }
    });
  }
}
