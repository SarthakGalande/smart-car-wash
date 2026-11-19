import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VehicleService } from '../core/services/vehicle.service';
import { ToastService } from '../core/services/toast.service';
import { Vehicle } from '../core/models/models';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="py-5 bg-light min-vh-100">
      <div class="container py-4">
        <!-- Header -->
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <span class="section-tag">My Garage</span>
            <h1 class="h3 fw-bold text-primary mb-1">Vehicle Management</h1>
            <p class="text-muted small mb-0">Register and manage your cars for instant one-click wash bookings.</p>
          </div>
          <button class="btn btn-scw-primary" (click)="openAddModal()">
            <i class="bi bi-plus-lg me-1"></i> Add New Vehicle
          </button>
        </div>

        <!-- Vehicles List Grid -->
        <div class="row g-4" *ngIf="!isLoading">
          <div class="col-lg-4 col-md-6" *ngFor="let car of vehicles">
            <div class="scw-card p-4 h-100 position-relative d-flex flex-column" [class.border-accent]="car.isDefault">
              <!-- Default Badge -->
              <span *ngIf="car.isDefault" class="badge-scw-accent position-absolute top-0 end-0 m-3">
                <i class="bi bi-star-fill me-1"></i> Primary Car
              </span>

              <div class="d-flex align-items-center gap-3 mb-3">
                <div class="vehicle-icon-circle">
                  <i class="bi bi-car-front-fill text-accent fs-3"></i>
                </div>
                <div>
                  <h5 class="fw-bold text-primary mb-0">{{ car.brand }} {{ car.model }}</h5>
                  <span class="badge bg-light text-secondary border small">{{ car.vehicleType }}</span>
                  <span class="badge bg-light text-secondary border small ms-1" *ngIf="car.fuelType">{{ car.fuelType }}</span>
                </div>
              </div>

              <!-- License Plate Badge -->
              <div class="my-3 py-2 bg-light rounded-3 text-center border">
                <span class="license-plate fs-6">{{ car.registrationNumber }}</span>
                <div class="small text-muted mt-1">
                  Color: <strong class="text-dark">{{ car.color || 'Standard' }}</strong>
                </div>
              </div>

              <!-- Card Actions -->
              <div class="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                <a [routerLink]="['/booking']" [queryParams]="{vehicleId: car._id || car.id}" class="btn btn-sm btn-scw-outline py-1 px-3">
                  <i class="bi bi-droplet-half me-1"></i> Wash This Car
                </a>
                <div class="dropdown">
                  <button class="btn btn-sm btn-light border-0" type="button" (click)="car.menuOpen = !car.menuOpen">
                    <i class="bi bi-three-dots-vertical"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end shadow-sm" [class.show]="car.menuOpen">
                    <li>
                      <button class="dropdown-item" (click)="openEditModal(car); car.menuOpen = false">
                        <i class="bi bi-pencil me-2 text-primary"></i> Edit Details
                      </button>
                    </li>
                    <li>
                      <button class="dropdown-item text-danger" (click)="deleteVehicle(car); car.menuOpen = false">
                        <i class="bi bi-trash me-2"></i> Remove Vehicle
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="col-12 text-center py-5" *ngIf="vehicles.length === 0">
            <div class="scw-card p-5 mx-auto" style="max-width: 500px;">
              <i class="bi bi-car-front display-1 text-muted opacity-50 mb-3 d-block"></i>
              <h4 class="fw-bold text-primary mb-2">No Vehicles Registered</h4>
              <p class="text-muted small mb-4">Add your car once and enjoy swift, automated slot bookings whenever you need a wash.</p>
              <button class="btn btn-scw-primary" (click)="openAddModal()">
                <i class="bi bi-plus-lg me-1"></i> Add Your First Vehicle
              </button>
            </div>
          </div>
        </div>

        <!-- Skeletons -->
        <div class="row g-4" *ngIf="isLoading">
          <div class="col-lg-4 col-md-6" *ngFor="let i of [1,2,3]">
            <div class="scw-card p-4">
              <div class="skeleton-box mb-3" style="height: 48px;"></div>
              <div class="skeleton-box mb-2" style="height: 32px;"></div>
              <div class="skeleton-box" style="height: 40px;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ADD / EDIT MODAL -->
    <div class="modal fade show d-block" *ngIf="showModal" style="background: rgba(11, 19, 43, 0.7); backdrop-filter: blur(4px);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content scw-card border-0 shadow-lg">
          <div class="modal-header border-bottom">
            <h5 class="modal-title fw-bold text-primary">
              {{ isEditing ? 'Edit Vehicle Details' : 'Register New Vehicle' }}
            </h5>
            <button type="button" class="btn-close" (click)="showModal = false"></button>
          </div>

          <form [formGroup]="vehicleForm" (ngSubmit)="saveVehicle()">
            <div class="modal-body p-4">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold small">Car Brand *</label>
                  <input
                    type="text"
                    class="form-control scw-input"
                    formControlName="brand"
                    placeholder="e.g. BMW, Hyundai, Honda"
                    [class.is-invalid]="vf['brand'].touched && vf['brand'].invalid"
                  >
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold small">Car Model *</label>
                  <input
                    type="text"
                    class="form-control scw-input"
                    formControlName="model"
                    placeholder="e.g. 330i, Creta, City"
                    [class.is-invalid]="vf['model'].touched && vf['model'].invalid"
                  >
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold small">Registration Number *</label>
                  <input
                    type="text"
                    class="form-control scw-input font-monospace text-uppercase"
                    formControlName="registrationNumber"
                    placeholder="e.g. DL 01 AB 1234"
                    [class.is-invalid]="vf['registrationNumber'].touched && vf['registrationNumber'].invalid"
                  >
                  <div class="form-text small">Enter state code and license number.</div>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold small">Vehicle Category *</label>
                  <select class="form-select scw-input" formControlName="vehicleType">
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Pickup / Other">Pickup / Other</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold small">Fuel Type</label>
                  <select class="form-select scw-input" formControlName="fuelType">
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric (EV)</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold small">Vehicle Color</label>
                  <input
                    type="text"
                    class="form-control scw-input"
                    formControlName="color"
                    placeholder="e.g. Metallic Black, Polar White"
                  >
                </div>

                <div class="col-12">
                  <div class="form-check form-switch mt-2">
                    <input class="form-check-input" type="checkbox" id="defaultCheck" formControlName="isDefault">
                    <label class="form-check-label small fw-semibold" for="defaultCheck">
                      Set as Primary Default Vehicle
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer border-top bg-light">
              <button type="button" class="btn btn-outline-secondary btn-sm" (click)="showModal = false">Cancel</button>
              <button type="submit" class="btn btn-scw-primary btn-sm px-4" [disabled]="vehicleForm.invalid || isSaving">
                <span *ngIf="!isSaving">{{ isEditing ? 'Update Vehicle' : 'Save Vehicle' }}</span>
                <span *ngIf="isSaving"><span class="spinner-border spinner-border-sm me-1"></span> Saving...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .vehicle-icon-circle {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      background: rgba(0, 212, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .border-accent {
      border: 2px solid #00D4FF !important;
    }
  `]
})
export class VehiclesComponent implements OnInit {
  vehicles: (Vehicle & { menuOpen?: boolean })[] = [];
  isLoading = true;
  showModal = false;
  isEditing = false;
  isSaving = false;
  editingId: string | null = null;

  vehicleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private toastService: ToastService
  ) {
    this.vehicleForm = this.fb.group({
      brand: ['', [Validators.required, Validators.minLength(2)]],
      model: ['', [Validators.required, Validators.minLength(1)]],
      registrationNumber: ['', [Validators.required, Validators.minLength(4)]],
      vehicleType: ['Sedan', [Validators.required]],
      fuelType: ['Petrol'],
      color: ['White'],
      isDefault: [false]
    });
  }

  ngOnInit(): void {
    this.loadVehicles();
  }

  get vf() {
    return this.vehicleForm.controls;
  }

  loadVehicles(): void {
    this.isLoading = true;
    this.vehicleService.getVehicles().subscribe({
      next: (res) => {
        this.vehicles = res.vehicles || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openAddModal(): void {
    this.isEditing = false;
    this.editingId = null;
    this.vehicleForm.reset({
      brand: '',
      model: '',
      registrationNumber: '',
      vehicleType: 'Sedan',
      fuelType: 'Petrol',
      color: 'White',
      isDefault: this.vehicles.length === 0
    });
    this.showModal = true;
  }

  openEditModal(car: Vehicle): void {
    this.isEditing = true;
    this.editingId = car._id || car.id || null;
    this.vehicleForm.patchValue({
      brand: car.brand,
      model: car.model,
      registrationNumber: car.registrationNumber,
      vehicleType: car.vehicleType,
      fuelType: car.fuelType || 'Petrol',
      color: car.color || 'White',
      isDefault: !!car.isDefault
    });
    this.showModal = true;
  }

  saveVehicle(): void {
    if (this.vehicleForm.invalid) return;

    this.isSaving = true;
    const data = this.vehicleForm.value;

    if (this.isEditing && this.editingId) {
      this.vehicleService.updateVehicle(this.editingId, data).subscribe({
        next: (res) => {
          this.toastService.success(res.message || 'Vehicle updated successfully!');
          this.isSaving = false;
          this.showModal = false;
          this.loadVehicles();
        },
        error: (err) => {
          this.toastService.error(err.error?.message || 'Failed to update vehicle.');
          this.isSaving = false;
        }
      });
    } else {
      this.vehicleService.addVehicle(data).subscribe({
        next: (res) => {
          this.toastService.success(res.message || 'Vehicle added to garage!');
          this.isSaving = false;
          this.showModal = false;
          this.loadVehicles();
        },
        error: (err) => {
          this.toastService.error(err.error?.message || 'Failed to add vehicle.');
          this.isSaving = false;
        }
      });
    }
  }

  deleteVehicle(car: Vehicle): void {
    const id = car._id || car.id;
    if (!id) return;

    if (confirm(`Are you sure you want to remove ${car.brand} ${car.model} (${car.registrationNumber})?`)) {
      this.vehicleService.deleteVehicle(id).subscribe({
        next: (res) => {
          this.toastService.success(res.message || 'Vehicle removed.');
          this.loadVehicles();
        },
        error: (err) => {
          this.toastService.error(err.error?.message || 'Failed to delete vehicle.');
        }
      });
    }
  }
}
