import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Facility, FacilityStatus } from '../../models/facility.model';
import { FacilityService } from '../../services/facility.service';

@Component({
  selector: 'app-facility-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="page-shell">
      <header class="page-header">
        <div>
          <p class="eyebrow">Angular Module</p>
          <h1>Facility Management</h1>
        </div>
        <button class="primary-button" type="button" (click)="toggleForm()">{{ editingId ? 'Cancel edit' : 'Add facility' }}</button>
      </header>

      <div class="alert error" *ngIf="error">{{ error }}</div>
      <div class="alert success" *ngIf="success">{{ success }}</div>

      <section class="panel" *ngIf="showForm">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="facility-form">
          <label>
            Facility name
            <input formControlName="name" placeholder="Facility name" />
          </label>
          <label>
            Location
            <input formControlName="location" placeholder="Location" />
          </label>
          <label>
            Category
            <input formControlName="category" placeholder="Category" />
          </label>
          <label>
            Status
            <select formControlName="status">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </label>
          <label class="full-width">
            Description
            <textarea formControlName="description" rows="4" placeholder="Description"></textarea>
          </label>
          <div class="form-actions full-width">
            <button class="primary-button" type="submit" [disabled]="isSubmitting">
              {{ isSubmitting ? 'Saving...' : editingId ? 'Update facility' : 'Save facility' }}
            </button>
            <button class="secondary-button" type="button" (click)="toggleForm()">Cancel</button>
          </div>
        </form>
      </section>

      <section class="panel">
        <div class="filters">
          <input type="text" placeholder="Search by name or location" [(ngModel)]="searchTerm" (ngModelChange)="loadFacilities()" />
          <select [(ngModel)]="statusFilter" (ngModelChange)="loadFacilities()">
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div *ngIf="loading" class="status-info">Loading facilities...</div>
        <div *ngIf="!loading && filteredFacilities.length === 0" class="status-info">No facilities match the current search.</div>

        <div class="table-wrap" *ngIf="filteredFacilities.length > 0">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let facility of filteredFacilities">
                <td>{{ facility.name }}</td>
                <td>{{ facility.location }}</td>
                <td>{{ facility.category }}</td>
                <td>
                  <span class="status-badge" [ngClass]="facility.status.toLowerCase().replace(' ', '-')">
                    {{ facility.status }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="secondary-button" type="button" (click)="editFacility(facility)">Edit</button>
                    <button class="danger-button" type="button" (click)="deleteFacility(facility.id)">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .page-shell { padding: 24px; background: #edf3fb; min-height: 100vh; }
      .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
      .eyebrow { text-transform: uppercase; letter-spacing: 0.12em; font-size: 12px; color: #567095; }
      h1 { margin: 6px 0 0; color: #163355; }
      .panel { background: white; border: 1px solid #dfe8f8; border-radius: 16px; padding: 20px; box-shadow: 0 10px 30px rgba(18, 61, 122, 0.05); margin-top: 18px; }
      .facility-form { display: grid; grid-template-columns: repeat(2, minmax(220px, 1fr)); gap: 16px; }
      label { display: grid; gap: 8px; font-weight: 600; color: #24486f; }
      .full-width { grid-column: 1 / -1; }
      input, select, textarea { width: 100%; border: 1px solid #d7e3f6; border-radius: 10px; padding: 10px 12px; }
      .form-actions { display: flex; gap: 12px; }
      .primary-button, .secondary-button, .danger-button { cursor: pointer; border: none; border-radius: 10px; padding: 10px 14px; font-weight: 700; }
      .primary-button { background: linear-gradient(135deg, #1f5fbf, #2a7be6); color: white; }
      .secondary-button { background: #edf5ff; color: #163355; }
      .danger-button { background: #ffe5e3; color: #a32c2c; }
      .alerts { margin-top: 12px; }
      .alert { padding: 10px 12px; border-radius: 10px; margin-bottom: 12px; } 
      .alert.error { background: #fff1f1; color: #973333; }
      .alert.success { background: #ebfff6; color: #1c7a4a; }
      .filters { display: flex; gap: 12px; margin-bottom: 18px; }
      .table-wrap { overflow-x: auto; }
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: 12px 10px; border-bottom: 1px solid #edf2fb; text-align: left; }
      th { color: #567095; text-transform: uppercase; font-size: 12px; }
      .status-badge { display: inline-flex; padding: 6px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
      .status-badge.active { background: #dff7ee; color: #1f7a53; }
      .status-badge.inactive { background: #edf3ff; color: #3459a7; }
      .status-badge.maintenance { background: #fff4dd; color: #b26a06; }
      .action-buttons { display: flex; gap: 8px; }
      .status-info { color: #6d84a4; }
      @media (max-width: 800px) { .facility-form { grid-template-columns: 1fr; } .page-header, .filters { flex-direction: column; align-items: stretch; } }
    `,
  ],
})
export class FacilityPageComponent implements OnInit {
  facilities: Facility[] = [];
  searchTerm = '';
  statusFilter = '';
  showForm = false;
  editingId: number | null = null;
  loading = false;
  isSubmitting = false;
  error = '';
  success = '';

  form = new FormGroup({
    name: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    location: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    category: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    status: new FormControl<FacilityStatus>('Active', { validators: [Validators.required], nonNullable: true }),
  });

  constructor(private facilityService: FacilityService) {}

  ngOnInit(): void {
    this.loadFacilities();
  }

  get filteredFacilities(): Facility[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.facilities.filter((facility) => {
      const matchesQuery =
        !query ||
        facility.name.toLowerCase().includes(query) ||
        facility.location.toLowerCase().includes(query);
      const matchesStatus = !this.statusFilter || facility.status === this.statusFilter;
      return matchesQuery && matchesStatus;
    });
  }

  loadFacilities(): void {
    this.loading = true;
    this.error = '';
    this.facilityService
      .getFacilities({ search: this.searchTerm, status: this.statusFilter })
      .subscribe({
        next: ({ data }) => {
          this.facilities = data;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || 'Unable to load facilities from the backend.';
        },
      });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.form.reset({ name: '', location: '', category: '', description: '', status: 'Active' });
      this.editingId = null;
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.error = 'Please complete the required facility fields.';
      return;
    }

    this.isSubmitting = true;
    this.error = '';
    const payload = this.form.getRawValue();

    const request$ = this.editingId
      ? this.facilityService.updateFacility(this.editingId, payload)
      : this.facilityService.createFacility(payload);

    request$.subscribe({
      next: () => {
        this.success = this.editingId ? 'Facility updated successfully.' : 'Facility created successfully.';
        this.isSubmitting = false;
        this.toggleForm();
        this.loadFacilities();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = err?.error?.message || 'Something went wrong while saving the facility.';
      },
    });
  }

  editFacility(facility: Facility): void {
    this.editingId = facility.id;
    this.form.patchValue({
      name: facility.name,
      location: facility.location,
      category: facility.category,
      description: facility.description,
      status: facility.status,
    });
    this.showForm = true;
    this.error = '';
    this.success = '';
  }

  deleteFacility(id: number): void {
    const confirmed = window.confirm('Delete this facility and related records?');
    if (!confirmed) {
      return;
    }

    this.facilityService.deleteFacility(id).subscribe({
      next: () => {
        this.success = 'Facility deleted successfully.';
        this.loadFacilities();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Unable to delete facility.';
      },
    });
  }
}
