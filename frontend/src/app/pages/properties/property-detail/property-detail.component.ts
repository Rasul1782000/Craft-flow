import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Property } from '../../../services/api.types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-property-detail',
  standalone: false,
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss'],
})
export class PropertyDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLoading = true;
  isSaving = false;
  property: Property | null = null;
  isEditing = false;
  successMessage = '';
  errorMessage = '';

  editData = {
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    square_feet: 0,
    property_type: '',
    status: 'for_sale',
    featured: false,
    image_url: '',
    agent_name: '',
    agent_email: '',
    agent_phone: '',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadProperty(id);
    } else {
      this.isEditing = true;
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProperty(id: number): void {
    this.api.getProperty(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.property = res;
        this.editData = {
          title: res.title,
          description: res.description,
          address: res.address,
          city: res.city || '',
          state: res.state || '',
          zip_code: res.zip_code || '',
          price: res.price,
          bedrooms: res.bedrooms,
          bathrooms: res.bathrooms,
          square_feet: res.square_feet,
          property_type: res.property_type || '',
          status: res.status || 'for_sale',
          featured: res.featured,
          image_url: res.image_url || '',
          agent_name: res.agent_name || '',
          agent_email: res.agent_email || '',
          agent_phone: res.agent_phone || '',
        };
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.property) {
      this.editData = {
        title: this.property.title,
        description: this.property.description,
        address: this.property.address,
        city: this.property.city || '',
        state: this.property.state || '',
        zip_code: this.property.zip_code || '',
        price: this.property.price,
        bedrooms: this.property.bedrooms,
        bathrooms: this.property.bathrooms,
        square_feet: this.property.square_feet,
        property_type: this.property.property_type || '',
        status: this.property.status || 'for_sale',
        featured: this.property.featured,
        image_url: this.property.image_url || '',
        agent_name: this.property.agent_name || '',
        agent_email: this.property.agent_email || '',
        agent_phone: this.property.agent_phone || '',
      };
    }
  }

  save(): void {
    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.property) {
      this.api.updateProperty(this.property.id, this.editData).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.isSaving = false;
          this.isEditing = false;
          this.successMessage = 'Property updated successfully';
          this.loadProperty(this.property!.id);
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage = err.message || 'Failed to update property';
          setTimeout(() => this.errorMessage = '', 3000);
        },
      });
    } else {
      this.api.createProperty(this.editData).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          this.isSaving = false;
          this.successMessage = 'Property created successfully';
          setTimeout(() => {
            this.router.navigate(['/dashboard/properties', res.property.id]);
          }, 1000);
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage = err.message || 'Failed to create property';
          setTimeout(() => this.errorMessage = '', 3000);
        },
      });
    }
  }

  delete(): void {
    if (!this.property || !confirm('Are you sure you want to delete this property?')) return;

    this.api.deleteProperty(this.property.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/properties']);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to delete property';
        setTimeout(() => this.errorMessage = '', 3000);
      },
    });
  }

  formatPrice(price: number): string {
    return `AED ${new Intl.NumberFormat('en-AE', { maximumFractionDigits: 0 }).format(price)}`;
  }

  back(): void {
    this.router.navigate(['/dashboard/properties']);
  }
}
