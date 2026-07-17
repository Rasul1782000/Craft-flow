import { Component } from '@angular/core';

@Component({
  selector: 'app-properties',
  standalone: false,
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
})
export class PropertiesComponent {
  searchTerm = '';

  properties = [
    { id: 1, title: 'Modern Loft in Downtown', address: '412 Maple St', city: 'Portland', state: 'OR', bedrooms: 2, bathrooms: 2, sqft: 1200, price: 485000, status: 'for_sale', featured: true, type: 'Loft', agent: 'Ava Mitchell' },
    { id: 2, title: 'Beachfront Villa', address: '88 Ocean Dr', city: 'Malibu', state: 'CA', bedrooms: 4, bathrooms: 3, sqft: 3200, price: 2150000, status: 'for_sale', featured: true, type: 'Villa', agent: 'Leo Park' },
    { id: 3, title: 'Cozy Studio Apartment', address: '15 Cedar Ave', city: 'Austin', state: 'TX', bedrooms: 1, bathrooms: 1, sqft: 550, price: 185000, status: 'for_rent', featured: false, type: 'Apartment', agent: 'Maya Reed' },
    { id: 4, title: 'Family Home with Yard', address: '220 Oak Ln', city: 'Denver', state: 'CO', bedrooms: 4, bathrooms: 3, sqft: 2800, price: 625000, status: 'for_sale', featured: false, type: 'House', agent: 'Noah Kim' },
    { id: 5, title: 'Penthouse Suite', address: '1 Skyline Tower', city: 'New York', state: 'NY', bedrooms: 3, bathrooms: 2, sqft: 2100, price: 1890000, status: 'for_sale', featured: true, type: 'Penthouse', agent: 'Isla Chen' },
    { id: 6, title: 'Rustic Cabin Retreat', address: '9 Pine Ridge Rd', city: 'Asheville', state: 'NC', bedrooms: 3, bathrooms: 2, sqft: 1600, price: 320000, status: 'for_rent', featured: false, type: 'Cabin', agent: 'Ethan Webb' },
    { id: 7, title: 'Urban Townhouse', address: '75 Harbor Walk', city: 'Boston', state: 'MA', bedrooms: 3, bathrooms: 3, sqft: 2400, price: 780000, status: 'sold', featured: false, type: 'Townhouse', agent: 'Marcus Bell' },
    { id: 8, title: 'Sunny Garden Flat', address: '33 Blossom St', city: 'San Francisco', state: 'CA', bedrooms: 2, bathrooms: 1, sqft: 980, price: 520000, status: 'for_sale', featured: false, type: 'Flat', agent: 'Sofia Cruz' },
  ];

  get filteredProperties() {
    if (!this.searchTerm) return this.properties;
    const t = this.searchTerm.toLowerCase();
    return this.properties.filter(p =>
      p.title.toLowerCase().includes(t) ||
      p.city.toLowerCase().includes(t) ||
      p.state.toLowerCase().includes(t)
    );
  }

  formatPrice(price: number): string {
    return `AED ${new Intl.NumberFormat('en-AE', { maximumFractionDigits: 0 }).format(price)}`;
  }
}
