import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [ RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {

constructor(public auth: AuthService) {}
}
