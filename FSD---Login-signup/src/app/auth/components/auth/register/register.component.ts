import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,

  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email]],
      password: ['', [Validators.minLength(3)]],
      confirm: ['', [Validators.required]],
    });
  }

  // onsubmit event handler
  registerSubmit() {
    if (this.registerForm.valid) {
      // it will return true when all validations are verified .
      console.log('success' + JSON.stringify(this.registerForm.value));
      this.authService.registerUser(this.registerForm.value).subscribe(
        (res) => {
          console.log(res);
          if (res.token) {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/dashboard']);
            alert('Registration done');
          } else {
            console.error('Error: No token received in response');
          }
        },
        (error) => {
          console.error('Registration failed:', error);
        }
      );
    }
  }

  printErrors() {
    const controls = this.registerForm.controls;
    // am I accessing / trying to get controlelrs array

    for (const controllerName in controls) {
      const control = controls[controllerName];
      if (control.invalid && control.touched) {
        const errors = control.errors;
        if (errors) {
          console.log(`${controllerName} has the following errors:`);
          for (const error in errors) {
            console.log(`- ${error}: ${JSON.stringify(errors[error])}`);
          }
        }
      }
    }
  }
}