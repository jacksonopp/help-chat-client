import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@helpchat/services';
import { RegisterRequest, UserRole } from '@helpchat/types';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    MessageModule,
    ToastModule,
    RouterModule,
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
      }
    `,
  ],
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    first_name: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(100),
    ]),
    last_name: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(100),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  isLoading = false;

  constructor() {
    // Add custom validator for password confirmation
    this.registerForm.addValidators(this.passwordMatchValidator.bind(this));
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const form = control as FormGroup;
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword?.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }

    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { email, first_name, last_name, password } =
        this.registerForm.getRawValue();

      if (!email || !first_name || !last_name || !password) {
        this.messageService.add({
          key: 'register-toast',
          severity: 'warn',
          summary: 'Missing Fields',
          detail: 'Please fill in all required fields.',
        });
        this.isLoading = false;
        return;
      }

      const userData: RegisterRequest = {
        email,
        first_name,
        last_name,
        password,
        role: UserRole.END_USER,
      };

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Welcome, ${response.user.first_name}! Your account has been created successfully.`,
          });

          // Navigate to dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.isLoading = false;
          this.messageService.add({
            key: 'register-toast',
            severity: 'error',
            summary: 'Registration Failed',
            detail:
              error.error?.message || 'Registration failed. Please try again.',
          });
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onLogin(): void {
    // Navigate to login page
    this.router.navigate(['/login']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }
}
