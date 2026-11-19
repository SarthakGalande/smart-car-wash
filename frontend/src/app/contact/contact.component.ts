import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../core/services/contact.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="py-5 bg-light min-vh-100">
      <div class="container py-4">
        <!-- Header -->
        <div class="text-center mb-5">
          <span class="section-tag">Get In Touch</span>
          <h1 class="section-title">Contact & Customer Support</h1>
          <p class="section-subtitle mx-auto">
            Have a question about our wash services, detailing treatments, or corporate packages? We are here to help.
          </p>
        </div>

        <div class="row g-4 justify-content-center">
          <!-- Col 1: Contact Information Cards -->
          <div class="col-lg-5">
            <div class="scw-card p-4 mb-4">
              <h4 class="fw-bold text-primary mb-3">Our Main Detailing Hub</h4>
              <div class="d-flex align-items-start gap-3 mb-3">
                <div class="contact-icon-box">
                  <i class="bi bi-geo-alt-fill text-accent"></i>
                </div>
                <div>
                  <h6 class="fw-bold mb-1">Central Facility</h6>
                  <p class="text-muted small mb-0">Plot 14, Barakhamba Road, Connaught Place, New Delhi - 110001</p>
                </div>
              </div>

              <div class="d-flex align-items-start gap-3 mb-3">
                <div class="contact-icon-box">
                  <i class="bi bi-telephone-fill text-accent"></i>
                </div>
                <div>
                  <h6 class="fw-bold mb-1">Phone & WhatsApp</h6>
                  <p class="text-muted small mb-0">+91 98765 43210 / +91 98765 43211</p>
                </div>
              </div>

              <div class="d-flex align-items-start gap-3 mb-3">
                <div class="contact-icon-box">
                  <i class="bi bi-envelope-fill text-accent"></i>
                </div>
                <div>
                  <h6 class="fw-bold mb-1">Email Support</h6>
                  <p class="text-muted small mb-0">support&#64;smartcarwash.com</p>
                </div>
              </div>

              <div class="d-flex align-items-start gap-3">
                <div class="contact-icon-box">
                  <i class="bi bi-clock-fill text-accent"></i>
                </div>
                <div>
                  <h6 class="fw-bold mb-1">Operating Hours</h6>
                  <p class="text-muted small mb-0">Monday – Sunday: 08:00 AM – 08:00 PM (All 7 Days)</p>
                </div>
              </div>
            </div>

            <!-- Google Map Visual Card -->
            <div class="scw-card p-4 overflow-hidden">
              <h5 class="fw-bold text-primary mb-3">Locate Our Service Centers</h5>
              <div class="map-placeholder rounded-3 p-4 text-center text-white d-flex flex-column align-items-center justify-content-center">
                <i class="bi bi-pin-map-fill text-accent display-4 mb-2"></i>
                <h6 class="fw-bold mb-1">Connaught Place Hub</h6>
                <p class="small text-light opacity-75 mb-0">3 Centers Active across New Delhi & NCR</p>
              </div>
            </div>
          </div>

          <!-- Col 2: Interactive Contact Form -->
          <div class="col-lg-7">
            <div class="scw-card p-4 p-md-5">
              <h4 class="fw-bold text-primary mb-2">Send Us a Message</h4>
              <p class="text-muted small mb-4">Fill out the form below and our operations manager will respond within 2 business hours.</p>

              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold small">Your Full Name *</label>
                    <input
                      type="text"
                      class="form-control scw-input"
                      formControlName="name"
                      placeholder="e.g. John Doe"
                      [class.is-invalid]="f['name'].touched && f['name'].invalid"
                    >
                    <div class="invalid-feedback small" *ngIf="f['name'].touched && f['name'].invalid">
                      Please enter your name.
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label fw-semibold small">Email Address *</label>
                    <input
                      type="email"
                      class="form-control scw-input"
                      formControlName="email"
                      placeholder="e.g. john@example.com"
                      [class.is-invalid]="f['email'].touched && f['email'].invalid"
                    >
                    <div class="invalid-feedback small" *ngIf="f['email'].touched && f['email'].invalid">
                      Please enter a valid email.
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label fw-semibold small">Phone Number</label>
                    <input
                      type="tel"
                      class="form-control scw-input"
                      formControlName="phone"
                      placeholder="e.g. +91 98765 43210"
                    >
                  </div>

                  <div class="col-md-6">
                    <label class="form-label fw-semibold small">Subject *</label>
                    <input
                      type="text"
                      class="form-control scw-input"
                      formControlName="subject"
                      placeholder="e.g. Question about Ceramic Coating"
                      [class.is-invalid]="f['subject'].touched && f['subject'].invalid"
                    >
                    <div class="invalid-feedback small" *ngIf="f['subject'].touched && f['subject'].invalid">
                      Subject is required.
                    </div>
                  </div>

                  <div class="col-12">
                    <label class="form-label fw-semibold small">Your Message *</label>
                    <textarea
                      class="form-control scw-input"
                      rows="5"
                      formControlName="message"
                      placeholder="How can we assist you with your car detailing needs?"
                      [class.is-invalid]="f['message'].touched && f['message'].invalid"
                    ></textarea>
                    <div class="invalid-feedback small" *ngIf="f['message'].touched && f['message'].invalid">
                      Please enter your message.
                    </div>
                  </div>

                  <div class="col-12 mt-4">
                    <button
                      type="submit"
                      class="btn btn-scw-primary w-100 py-3"
                      [disabled]="isSubmitting || contactForm.invalid"
                    >
                      <span *ngIf="!isSubmitting">
                        <i class="bi bi-send-fill me-2"></i> Submit Inquiry
                      </span>
                      <span *ngIf="isSubmitting">
                        <span class="spinner-border spinner-border-sm me-2"></span> Transmitting Message...
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-icon-box {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: rgba(0, 212, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .map-placeholder {
      background: linear-gradient(135deg, #0B132B 0%, #1C2541 100%);
      min-height: 160px;
      border: 1px dashed rgba(0, 212, 255, 0.3);
    }
  `]
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private toastService: ToastService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    if (this.contactForm.invalid) return;

    this.isSubmitting = true;
    this.contactService.submitMessage(this.contactForm.value).subscribe({
      next: (res) => {
        this.toastService.success(res.message || 'Inquiry submitted successfully!');
        this.contactForm.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to submit inquiry. Please try again.');
        this.isSubmitting = false;
      }
    });
  }
}
