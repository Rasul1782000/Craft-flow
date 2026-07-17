import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: false,
})
export class ForgotPasswordComponent {
  step: 'email' | 'reset' | 'done' = 'email';
  forgotForm: FormGroup;
  resetForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  verifiedEmail = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private readonly auth: AuthService,
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  get email() { return this.forgotForm.get('email'); }
  get password() { return this.resetForm.get('password'); }
  get confirmPassword() { return this.resetForm.get('confirmPassword'); }

  onSubmitEmail(): void {
    if (!this.forgotForm.valid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email } = this.forgotForm.value;
    const user = this.auth.findUserByEmail(email);

    if (user) {
      this.verifiedEmail = email;
      this.step = 'reset';
    } else {
      this.errorMessage = 'No account found with this email address.';
    }

    this.isLoading = false;
  }

  onSubmitReset(): void {
    if (!this.resetForm.valid || this.password?.value !== this.confirmPassword?.value) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const result = this.auth.resetPassword(this.verifiedEmail, this.password?.value);

    if (result.success) {
      this.step = 'done';
    } else {
      this.errorMessage = result.message;
    }

    this.isLoading = false;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
