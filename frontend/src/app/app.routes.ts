import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RevenueComponent } from './pages/revenue/revenue.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { HelpComponent } from './pages/help/help.component';
import { PropertiesComponent } from './pages/properties/properties.component';
import { PropertyDetailComponent } from './pages/properties/property-detail/property-detail.component';
import { ExpertiseComponent } from './pages/expertise/expertise.component';
import { WorksComponent } from './pages/works/works.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProductComponent } from './pages/product/product.component';
import { LibraryComponent } from './pages/library/library.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { DocsComponent } from './pages/docs/docs.component';
import { PerspectivesComponent } from './pages/perspectives/perspectives.component';
import { AuthGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'product', component: ProductComponent },
  { path: 'library', component: LibraryComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'docs', component: DocsComponent },
  { path: 'perspectives', component: PerspectivesComponent },
  { path: 'expertise', component: ExpertiseComponent },
  { path: 'works', component: WorksComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/revenue', component: RevenueComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/customers', component: CustomersComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/invoices', component: InvoicesComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/properties', component: PropertiesComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/properties/:id', component: PropertyDetailComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/help', component: HelpComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' },
];
