import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceService } from '../core/services/service.service';
import { PackageService } from '../core/services/package.service';
import { ReviewService } from '../core/services/review.service';
import { Service, Package, Review } from '../core/models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- HERO SECTION -->
    <header class="hero-section position-relative d-flex align-items-center">
      <div class="hero-overlay"></div>
      <div class="container position-relative z-1 py-5">
        <div class="row align-items-center min-vh-75 pt-5">
          <div class="col-lg-7 text-white">
            <span class="badge-scw-accent mb-3 d-inline-block">
              <i class="bi bi-shield-check me-1"></i> Certified Automotive Detailing
            </span>
            <h1 class="hero-title display-4 fw-extrabold mb-3">
              Your Car Deserves the <span class="text-accent">Best Care</span>
            </h1>
            <p class="hero-description lead mb-4 text-light pe-lg-5">
              Experience the pinnacle of automotive cleaning. Our eco-friendly snow foam wash, interior deep steam extraction, and certified 9H ceramic treatments restore that coveted showroom finish.
            </p>
            <div class="d-flex flex-wrap gap-3">
              <a routerLink="/booking" class="btn btn-scw-primary btn-lg px-4 py-3">
                <i class="bi bi-calendar2-check-fill me-2"></i> Book Your Wash
              </a>
              <a routerLink="/services" class="btn btn-scw-secondary btn-lg px-4 py-3">
                <i class="bi bi-grid-fill me-2"></i> Explore Services
              </a>
            </div>

            <!-- Hero Feature Badges -->
            <div class="row mt-5 pt-3 g-3 border-top border-secondary border-opacity-25">
              <div class="col-auto d-flex align-items-center gap-2">
                <i class="bi bi-check-circle-fill text-accent"></i>
                <span class="small fw-semibold">100% Scratch-Free</span>
              </div>
              <div class="col-auto d-flex align-items-center gap-2">
                <i class="bi bi-check-circle-fill text-accent"></i>
                <span class="small fw-semibold">Certified Techs</span>
              </div>
              <div class="col-auto d-flex align-items-center gap-2">
                <i class="bi bi-check-circle-fill text-accent"></i>
                <span class="small fw-semibold">On-Time Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- STATISTICS SECTION -->
    <section class="py-5 bg-white shadow-sm border-bottom">
      <div class="container">
        <div class="row g-4 text-center">
          <div class="col-md-3 col-6">
            <div class="stat-card p-3">
              <h2 class="display-5 fw-bold text-primary mb-1">15,000+</h2>
              <p class="text-muted mb-0 fw-semibold">Happy Customers</p>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="stat-card p-3">
              <h2 class="display-5 fw-bold text-accent mb-1">28,500+</h2>
              <p class="text-muted mb-0 fw-semibold">Cars Washed</p>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="stat-card p-3">
              <h2 class="display-5 fw-bold text-primary mb-1">45+</h2>
              <p class="text-muted mb-0 fw-semibold">Professional Staff</p>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="stat-card p-3">
              <h2 class="display-5 fw-bold text-success mb-1">99.4%</h2>
              <p class="text-muted mb-0 fw-semibold">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- POPULAR SERVICES SECTION -->
    <section class="py-5 bg-light">
      <div class="container py-4">
        <div class="text-center mb-5">
          <span class="section-tag">Premium Solutions</span>
          <h2 class="section-title">Popular Car Wash Services</h2>
          <p class="section-subtitle mx-auto">
            From quick exterior touch-ups to comprehensive multi-stage detailing, select from our most requested vehicle treatments.
          </p>
        </div>

        <div class="row g-4">
          <div class="col-lg-4 col-md-6" *ngFor="let service of popularServices">
            <div class="scw-card h-100 overflow-hidden d-flex flex-column">
              <div class="position-relative service-img-wrap">
                <img [src]="service.image" [alt]="service.serviceName" class="w-100 service-img">
                <span class="badge-scw-accent position-absolute top-0 end-0 m-3">
                  {{ service.category }}
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
                <p class="text-muted small mb-3 flex-grow-1">
                  {{ service.description }}
                </p>
                <div class="d-flex flex-wrap gap-1 mb-3">
                  <span class="badge bg-light text-secondary border small" *ngFor="let feat of service.features | slice:0:3">
                    <i class="bi bi-check2 text-accent me-1"></i>{{ feat }}
                  </span>
                </div>
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
        </div>

        <div class="text-center mt-5">
          <a routerLink="/services" class="btn btn-scw-outline">
            View All 10 Services <i class="bi bi-arrow-right ms-1"></i>
          </a>
        </div>
      </div>
    </section>

    <!-- FEATURED PACKAGES SECTION -->
    <section class="py-5 bg-white">
      <div class="container py-4">
        <div class="text-center mb-5">
          <span class="section-tag">Value Bundles</span>
          <h2 class="section-title">Featured Car Wash Packages</h2>
          <p class="section-subtitle mx-auto">
            Save more with bundled car care plans engineered for complete interior and exterior protection.
          </p>
        </div>

        <div class="row g-4 justify-content-center">
          <div class="col-lg-3 col-md-6" *ngFor="let pkg of packages">
            <div class="scw-card h-100 p-4 d-flex flex-column position-relative" [class.border-accent]="pkg.popular">
              <div *ngIf="pkg.badge" class="popular-ribbon">
                {{ pkg.badge }}
              </div>
              <h4 class="h5 fw-bold mb-2">{{ pkg.packageName }}</h4>
              <p class="text-muted small mb-3">{{ pkg.description }}</p>
              <div class="my-3">
                <span class="h2 fw-bold text-primary">₹{{ pkg.price }}</span>
                <span class="text-muted small"> / session</span>
              </div>
              <div class="small text-muted mb-3">
                <i class="bi bi-stopwatch text-accent me-1"></i> Est. Duration: {{ pkg.duration }} mins
              </div>
              <hr class="my-2 border-secondary border-opacity-10">
              <ul class="list-unstyled my-3 small flex-grow-1">
                <li class="d-flex align-items-start gap-2 mb-2" *ngFor="let feat of pkg.features">
                  <i class="bi bi-check-circle-fill text-accent flex-shrink-0 mt-1"></i>
                  <span>{{ feat }}</span>
                </li>
              </ul>
              <a [routerLink]="['/booking']" [queryParams]="{packageId: pkg._id || pkg.id}" class="btn w-100 mt-auto" [ngClass]="pkg.popular ? 'btn-scw-primary' : 'btn-scw-outline'">
                Select Package
              </a>
            </div>
          </div>
        </div>

        <div class="text-center mt-5">
          <a routerLink="/packages" class="btn btn-scw-secondary">
            <i class="bi bi-table me-1"></i> Compare All Packages Matrix
          </a>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="py-5 bg-light">
      <div class="container py-4">
        <div class="text-center mb-5">
          <span class="section-tag">Seamless Process</span>
          <h2 class="section-title">How It Works</h2>
          <p class="section-subtitle mx-auto">
            Book your professional car wash in under 60 seconds with our hassle-free appointment workflow.
          </p>
        </div>

        <div class="row g-4">
          <div class="col-lg-3 col-md-6 text-center">
            <div class="scw-card p-4 h-100">
              <div class="step-badge mb-3">1</div>
              <h5 class="fw-bold mb-2">Select Vehicle</h5>
              <p class="text-muted small mb-0">
                Choose from your saved cars or quickly add a new car model and license number.
              </p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 text-center">
            <div class="scw-card p-4 h-100">
              <div class="step-badge mb-3">2</div>
              <h5 class="fw-bold mb-2">Choose Service & Center</h5>
              <p class="text-muted small mb-0">
                Pick a wash package or individual services, and choose your preferred car wash center.
              </p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 text-center">
            <div class="scw-card p-4 h-100">
              <div class="step-badge mb-3">3</div>
              <h5 class="fw-bold mb-2">Pick Slot & Confirm</h5>
              <p class="text-muted small mb-0">
                Check real-time slot availability, apply coupon codes, and pay cash or online.
              </p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 text-center">
            <div class="scw-card p-4 h-100">
              <div class="step-badge mb-3">4</div>
              <h5 class="fw-bold mb-2">Enjoy Clean Car</h5>
              <p class="text-muted small mb-0">
                Arrive at your appointment time and drive away in a sparkling clean, protected vehicle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY CHOOSE US -->
    <section class="py-5 bg-primary text-white position-relative">
      <div class="container py-4">
        <div class="text-center mb-5">
          <span class="badge-scw-accent mb-2">Superior Standards</span>
          <h2 class="text-white display-6 fw-bold">Why Choose Smart Car Wash</h2>
          <p class="text-light opacity-75 mx-auto" style="max-width: 600px;">
            We combine high-performance German pressure technology with pH-neutral care.
          </p>
        </div>

        <div class="row g-4">
          <div class="col-lg-4 col-md-6">
            <div class="feature-item p-4 rounded-4 bg-secondary bg-opacity-50 border border-secondary">
              <div class="feature-icon mb-3">
                <i class="bi bi-people-fill text-accent fs-3"></i>
              </div>
              <h5 class="text-white fw-bold mb-2">Experienced Professionals</h5>
              <p class="text-light opacity-75 small mb-0">
                Our team undergoes rigorous detailing certification. Every vehicle is treated with individual care.
              </p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="feature-item p-4 rounded-4 bg-secondary bg-opacity-50 border border-secondary">
              <div class="feature-icon mb-3">
                <i class="bi bi-flower1 text-accent fs-3"></i>
              </div>
              <h5 class="text-white fw-bold mb-2">Eco-Friendly Chemistry</h5>
              <p class="text-light opacity-75 small mb-0">
                100% biodegradable shampoos and water-recycling filtration systems protect the environment.
              </p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="feature-item p-4 rounded-4 bg-secondary bg-opacity-50 border border-secondary">
              <div class="feature-icon mb-3">
                <i class="bi bi-tag-fill text-accent fs-3"></i>
              </div>
              <h5 class="text-white fw-bold mb-2">Affordable & Transparent</h5>
              <p class="text-light opacity-75 small mb-0">
                Honest pricing starting from just ₹199. No hidden charges or unexpected surprise costs.
              </p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="feature-item p-4 rounded-4 bg-secondary bg-opacity-50 border border-secondary">
              <div class="feature-icon mb-3">
                <i class="bi bi-tools text-accent fs-3"></i>
              </div>
              <h5 class="text-white fw-bold mb-2">Premium Equipment</h5>
              <p class="text-light opacity-75 small mb-0">
                Touchless dual-foam canons, variable-pressure wands, and high-suction upholstery extractors.
              </p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="feature-item p-4 rounded-4 bg-secondary bg-opacity-50 border border-secondary">
              <div class="feature-icon mb-3">
                <i class="bi bi-clock-history text-accent fs-3"></i>
              </div>
              <h5 class="text-white fw-bold mb-2">On-Time Service</h5>
              <p class="text-light opacity-75 small mb-0">
                Our strict slot capacity system guarantees your appointment begins immediately without waiting.
              </p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="feature-item p-4 rounded-4 bg-secondary bg-opacity-50 border border-secondary">
              <div class="feature-icon mb-3">
                <i class="bi bi-shield-check text-accent fs-3"></i>
              </div>
              <h5 class="text-white fw-bold mb-2">100% Satisfaction Guarantee</h5>
              <p class="text-light opacity-75 small mb-0">
                If you aren't completely delighted with your wash, our supervisors will re-wash your car for free.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS SECTION -->
    <section class="py-5 bg-white">
      <div class="container py-4">
        <div class="text-center mb-5">
          <span class="section-tag">Client Reviews</span>
          <h2 class="section-title">What Our Customers Say</h2>
          <p class="section-subtitle mx-auto">
            Read authentic feedback from car owners who rely on Smart Car Wash for their automotive maintenance.
          </p>
        </div>

        <div class="row g-4">
          <div class="col-lg-4 col-md-6" *ngFor="let review of reviews">
            <div class="scw-card p-4 h-100 d-flex flex-column">
              <div class="d-flex text-warning mb-3">
                <i class="bi bi-star-fill me-1" *ngFor="let star of [1,2,3,4,5]"></i>
              </div>
              <p class="text-secondary small fst-italic flex-grow-1">
                "{{ review.comment }}"
              </p>
              <div class="d-flex align-items-center gap-3 pt-3 border-top mt-auto">
                <div class="avatar-circle">
                  {{ review.user?.fullName?.charAt(0) || 'U' }}
                </div>
                <div>
                  <h6 class="fw-bold mb-0 text-primary">{{ review.user?.fullName }}</h6>
                  <span class="text-muted small">Verified Customer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ SECTION -->
    <section class="py-5 bg-light">
      <div class="container py-4">
        <div class="text-center mb-5">
          <span class="section-tag">Frequently Asked Questions</span>
          <h2 class="section-title">Got Questions? We Have Answers</h2>
          <p class="section-subtitle mx-auto">
            Everything you need to know about our car wash centers, slot bookings, and cancellation policies.
          </p>
        </div>

        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="accordion scw-accordion" id="faqAccordion">
              <div class="accordion-item scw-card mb-3 overflow-hidden border-0" *ngFor="let faq of faqs; let i = index">
                <h2 class="accordion-header" [id]="'heading' + i">
                  <button
                    class="accordion-button fw-bold"
                    [class.collapsed]="i !== 0"
                    type="button"
                    (click)="faq.isOpen = !faq.isOpen"
                    [attr.aria-expanded]="faq.isOpen"
                  >
                    {{ faq.question }}
                  </button>
                </h2>
                <div class="accordion-collapse collapse" [class.show]="faq.isOpen">
                  <div class="accordion-body text-secondary small pt-0 pb-3">
                    {{ faq.answer }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BOTTOM CTA BANNER -->
    <section class="py-5 position-relative overflow-hidden" style="background: linear-gradient(135deg, #0B132B 0%, #1C2541 100%);">
      <div class="container py-4 text-center text-white position-relative z-1">
        <h2 class="display-6 fw-bold text-white mb-3">Ready to Give Your Car the Care It Deserves?</h2>
        <p class="lead text-light opacity-75 mb-4 mx-auto" style="max-width: 600px;">
          Choose your favorite wash center, pick a convenient slot, and experience the best detailing in town.
        </p>
        <a routerLink="/booking" class="btn btn-scw-primary btn-lg px-5 py-3 shadow-lg">
          <i class="bi bi-calendar2-check-fill me-2"></i> Book Appointment Now
        </a>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      background: url('https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat;
      min-height: 85vh;
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, rgba(11, 19, 43, 0.95) 0%, rgba(11, 19, 43, 0.85) 60%, rgba(11, 19, 43, 0.5) 100%);
    }

    .min-vh-75 {
      min-height: 75vh;
    }

    .service-img-wrap {
      height: 200px;
    }

    .service-img {
      height: 100%;
      object-fit: cover;
    }

    .border-accent {
      border: 2px solid #00D4FF !important;
      box-shadow: 0 10px 30px rgba(0, 212, 255, 0.15);
    }

    .popular-ribbon {
      position: absolute;
      top: -12px;
      right: 20px;
      background: #00D4FF;
      color: #0B132B;
      font-weight: 800;
      font-size: 0.75rem;
      padding: 3px 12px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      box-shadow: 0 4px 10px rgba(0, 212, 255, 0.4);
    }

    .step-badge {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00D4FF 0%, #0077FF 100%);
      color: #0B132B;
      font-weight: 900;
      font-size: 1.25rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(0, 212, 255, 0.35);
    }

    .avatar-circle {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: #0B132B;
      color: #00D4FF;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .accordion-button:not(.collapsed) {
      background-color: transparent;
      color: #0088CC;
      box-shadow: none;
    }

    .accordion-button:focus {
      box-shadow: none;
      border-color: rgba(0,0,0,.125);
    }
  `]
})
export class HomeComponent implements OnInit {
  popularServices: Service[] = [];
  packages: Package[] = [];
  reviews: Review[] = [];

  faqs = [
    {
      question: 'How long does a standard car wash session take?',
      answer: 'Our Basic Wash takes approximately 30 minutes, while Standard and Premium Washes range from 60 to 90 minutes. For Ultimate Detailing or Ceramic Coating, sessions can take between 2 to 4 hours.',
      isOpen: true
    },
    {
      question: 'Can I cancel or reschedule my appointment?',
      answer: 'Yes! You can reschedule or cancel any upcoming appointment directly from your "My Bookings" dashboard up to 1 hour before the scheduled time slot without any penalty.',
      isOpen: false
    },
    {
      question: 'Do you use scratch-free washing techniques?',
      answer: 'Absolutely. We exclusively employ two-bucket dirt-trap wash methods, ultra-soft plush microfiber mitts, pH-neutral active snow foam, and filtered spotless de-ionized water rinses.',
      isOpen: false
    },
    {
      question: 'What payment options are supported?',
      answer: 'We accept Cash on Service at the wash center, UPI, all major Credit/Debit Cards, and instant Online Payment with promo coupons.',
      isOpen: false
    }
  ];

  constructor(
    private serviceService: ServiceService,
    private packageService: PackageService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.serviceService.getServices().subscribe({
      next: (res) => {
        if (res.services && res.services.length > 0) {
          this.popularServices = res.services.slice(0, 6);
        }
      },
      error: () => {}
    });

    this.packageService.getPackages().subscribe({
      next: (res) => {
        if (res.packages && res.packages.length > 0) {
          this.packages = res.packages;
        }
      },
      error: () => {}
    });

    this.reviewService.getReviews({ limit: 3 }).subscribe({
      next: (res) => {
        if (res.reviews && res.reviews.length > 0) {
          this.reviews = res.reviews;
        } else {
          // Fallback realistic reviews
          this.reviews = [
            {
              rating: 5,
              comment: 'Exceptional service! My BMW 3 Series looks better than the day I bought it. The foam wash and tire polish are top tier.',
              user: { fullName: 'John Anderson', email: '', phone: '', role: 'CUSTOMER', status: 'ACTIVE' },
              booking: '',
              isApproved: true
            },
            {
              rating: 5,
              comment: 'The interior deep clean removed coffee stains that had been there for a year! Super impressed with the punctuality and courteous staff.',
              user: { fullName: 'Priya Sharma', email: '', phone: '', role: 'CUSTOMER', status: 'ACTIVE' },
              booking: '',
              isApproved: true
            },
            {
              rating: 5,
              comment: 'Very professional center. The online booking and slot confirmation saved me so much time. Will definitely be a regular customer!',
              user: { fullName: 'Rahul Kapoor', email: '', phone: '', role: 'CUSTOMER', status: 'ACTIVE' },
              booking: '',
              isApproved: true
            }
          ];
        }
      },
      error: () => {}
    });
  }
}
