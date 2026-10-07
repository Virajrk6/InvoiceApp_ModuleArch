import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Router } from '@angular/router';

interface Credentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private readonly credentialsKey = 'loginCredentials';
  private readonly sessionKey = 'isLoggedIn';

  constructor(
    private storage: StorageService,
    private router: Router
  ) {
    if (!localStorage.getItem(this.credentialsKey)) {
      const credentials: Credentials = {
        username: 'admin',
        password: 'admin123'
      };
      this.storage.set(this.credentialsKey, credentials);
    }
  }

  login(username: string, password: string): boolean {
    const credentials = this.storage.get<Credentials | null>(
      this.credentialsKey,
      null
    );

    if (
      credentials &&
      credentials.username === username &&
      credentials.password === password
    ) {
      localStorage.setItem(this.sessionKey, 'true');
      return true;
    }

    return false;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.sessionKey) === 'true';
  }

  logout(): void {
    localStorage.removeItem(this.sessionKey);
    this.router.navigate(['/login']);
  }
}
