import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],  // Fixed the email validation
        password: ['', [Validators.required, Validators.minLength(6)]],  // Updated password length validation
        confirm: ['', [Validators.required]],  // Add the confirm password field validation
      },
      {
        // Custom validator to check if password and confirm password match
        validator: this.passwordMatchValidator
      }
    );
  }

  // Custom password match validator
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirm')?.value;
    return password && confirm && password !== confirm
      ? { mismatch: true }
      : null;
  }

  // onsubmit event handler
  registerSubmit() {
    if (this.registerForm.valid) {
      // it will return true when all validations are verified.
      console.log('Form Submitted:', this.registerForm.value);
      this.authService.registerUser(this.registerForm.value).subscribe(
        (res) => {
          console.log(res);
          if (res.token) {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/dashboard']);
            alert('Registration Successful!');
          } else {
            console.error('Error: No token received in response');
          }
        },
        (error) => {
          console.error('Registration failed:', error);
        }
      );
    } else {
      this.printErrors();  // Print form errors
    }
  }

  printErrors() {
    const controls = this.registerForm.controls;
    // Loop through form controls and log errors if invalid
    for (const controlName in controls) {
      const control = controls[controlName];
      if (control.invalid && control.touched) {
        const errors = control.errors;
        if (errors) {
          console.log(`${controlName} has the following errors:`);
          for (const error in errors) {
            console.log(`- ${error}: ${JSON.stringify(errors[error])}`);
          }
        }
      }
    }
  }
}
