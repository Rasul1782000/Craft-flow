import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app';
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
import { DashboardShellComponent } from './components/dashboard-shell/dashboard-shell.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { appRoutes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    DashboardComponent,
    RevenueComponent,
    CustomersComponent,
    InvoicesComponent,
    SettingsComponent,
    HelpComponent,
    PropertiesComponent,
    PropertyDetailComponent,
    ExpertiseComponent,
    WorksComponent,
    ContactComponent,
    ProductComponent,
    LibraryComponent,
    PricingComponent,
    DocsComponent,
    PerspectivesComponent,
    DashboardShellComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
