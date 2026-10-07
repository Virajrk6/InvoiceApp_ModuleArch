import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  form = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  error = '';

  login():void{
    this.error = '';

    if(this.form.invalid){
      this.form.markAllAsTouched();
      return
    }

    const { username , password } = this.form.getRawValue();

    if(this.auth.login( username ?? '', password ?? '')){
      this.router.navigate(['/customer']);
    } else {
      this.error = 'Invalid username or password.';
    }
  }
}
