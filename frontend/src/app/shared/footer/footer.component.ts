import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="scw-footer mt-auto pt-5 pb-3">
      <div class="container">
        <div class="row g-4 mb-5">
          <!-- Col 1: Brand Info -->
          <div class="col-lg-4 col-md-6">
            <div class="d-flex align-items-center gap-2 mb-3">
              <div class="footer-logo-icon">
                <i class="bi bi-droplet-half"></i>
              </div>
              <span class="brand-text text-white">SMART<span class="text-accent">CARWASH</span></span>
            </div>
            <p class="text-muted pe-lg-4">
              Setting new standards in automotive care. Advanced touchless foam, certified eco-friendly detailing chemicals, and precision care tailored to protect your vehicle's showroom brilliance.
            </p>
            <div class="d-flex gap-2 mt-4">
              <a href="javascript:void(0)" class="social-btn" title="Facebook"><i class="bi bi-facebook"></i></a>
              <a href="javascript:void(0)" class="social-btn" title="Instagram"><i class="bi bi-instagram"></i></a>
              <a href="javascript:void(0)" class="social-btn" title="Twitter"><i class="bi bi-twitter-x"></i></a>
              <a href="javascript:void(0)" class="social-btn" title="YouTube"><i class="bi bi-youtube"></i></a>
            </div>
          </div>

          <!-- Col 2: Quick Links -->
          <div class="col-lg-2 col-md-6 col-6">
            <h6 class="text-white fw-bold mb-3">Quick Links</h6>
            <ul class="list-unstyled footer-links">
              <li><a routerLink="/">Home</a></li>
              <li><a routerLink="/services">Services</a></li>
              <li><a routerLink="/packages">Packages</a></li>
              <li><a routerLink="/booking">Book Appointment</a></li>
              <li><a routerLink="/contact">Contact Support</a></li>
            </ul>
          </div>

          <!-- Col 3: Popular Services -->
          <div class="col-lg-3 col-md-6 col-6">
            <h6 class="text-white fw-bold mb-3">Popular Services</h6>
            <ul class="list-unstyled footer-links">
              <li><a routerLink="/services">Foam Jet Wash</a></li>
              <li><a routerLink="/services">Interior Steam Cleaning</a></li>
              <li><a routerLink="/services">Carnauba Wax Polish</a></li>
              <li><a routerLink="/services">Ceramic 9H Coating</a></li>
              <li><a routerLink="/services">Engine Bay Detailing</a></li>
            </ul>
          </div>

          <!-- Col 4: Contact & Hours -->
          <div class="col-lg-3 col-md-6">
            <h6 class="text-white fw-bold mb-3">Visit & Connect</h6>
            <ul class="list-unstyled footer-contact">
              <li class="d-flex gap-2 mb-2">
                <i class="bi bi-geo-alt text-accent"></i>
                <span class="text-muted">Plot 14, Barakhamba Road, Connaught Place, New Delhi</span>
              </li>
              <li class="d-flex gap-2 mb-2">
                <i class="bi bi-telephone text-accent"></i>
                <span class="text-muted">+91 98765 43210</span>
              </li>
              <li class="d-flex gap-2 mb-2">
                <i class="bi bi-envelope text-accent"></i>
                <span class="text-muted">support&#64;smartcarwash.com</span>
              </li>
              <li class="d-flex gap-2">
                <i class="bi bi-clock text-accent"></i>
                <span class="text-muted">Mon - Sun: 08:00 AM - 08:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <hr class="border-secondary opacity-25">

        <div class="row pt-2 align-items-center">
          <div class="col-md-6 text-center text-md-start text-muted small">
            &copy; 2026 Smart Car Wash. All rights reserved. Designed for automotive perfection.
          </div>
          <div class="col-md-6 text-center text-md-end text-muted small mt-2 mt-md-0">
            <a href="javascript:void(0)" class="text-muted me-3">Privacy Policy</a>
            <a href="javascript:void(0)" class="text-muted me-3">Terms & Conditions</a>
            <a href="javascript:void(0)" class="text-muted">Cancellation Policy</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .scw-footer {
      background: #070D1E;
      color: #94A3B8;
      font-size: 0.95rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .brand-text {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 1.25rem;
    }

    .text-accent {
      color: #00D4FF;
    }

    .footer-logo-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #00D4FF 0%, #0077FF 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0B132B;
      font-size: 1.1rem;
    }

    .footer-links li {
      margin-bottom: 0.6rem;
    }

    .footer-links a {
      color: #94A3B8;
      transition: all 0.2s;
    }

    .footer-links a:hover {
      color: #00D4FF;
      padding-left: 4px;
    }

    .social-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #CBD5E1;
      transition: all 0.2s;
    }

    .social-btn:hover {
      background: #00D4FF;
      color: #0B132B;
      transform: translateY(-2px);
    }
  `]
})
export class FooterComponent {}
