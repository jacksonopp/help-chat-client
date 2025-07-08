import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@helpchat/services';
import { LoginRequest } from '@helpchat/types';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
      }
    `,
  ],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  isLoading = false;

  constructor() {
    // this.loginForm = this.fb.group({
    //   email: ['', [Validators.required, Validators.email]],
    //   password: ['', [Validators.required, Validators.minLength(8)]]
    // });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.getRawValue();

      if (!email || !password) {
        this.messageService.add({
          key: 'login-toast',
          severity: 'warn',
          summary: 'Missing Fields',
          detail: 'Please enter both your email and password.',
        });
        return;
      }

      const credentials: LoginRequest = {
        email,
        password,
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Welcome back, ${response.user.first_name}!`,
          });

          // Navigate to dashboard or home page
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('ERROR:', error);
          this.isLoading = false;
          this.messageService.add({
            key: 'login-toast',
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Login failed. Please try again.',
          });
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onForgotPassword(): void {
    // Navigate to forgot password page
    this.router.navigate(['/forgot-password']);
  }

  onRegister(): void {
    // Navigate to register page
    this.router.navigate(['/register']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
