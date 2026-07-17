import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface LocalUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface StoredUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'token';
  private readonly userKey = 'user';
  private readonly usersKey = 'registered_users';

  constructor(private readonly router: Router) {}

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.token;
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  setSession(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  setUser(user: StoredUser): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): StoredUser | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }

  private getUsers(): LocalUser[] {
    const raw = localStorage.getItem(this.usersKey);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private saveUsers(users: LocalUser[]): void {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  private generateToken(email: string): string {
    const payload = {
      email,
      sub: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000,
    };
    return btoa(JSON.stringify(payload));
  }

  private generateId(): number {
    const users = this.getUsers();
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  }

  register(details: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
  }): { success: boolean; message: string } {
    const users = this.getUsers();
    if (users.find(u => u.email === details.email)) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser: LocalUser = {
      id: this.generateId(),
      email: details.email,
      first_name: details.first_name,
      last_name: details.last_name,
      password: details.password,
    };
    users.push(newUser);
    this.saveUsers(users);
    return { success: true, message: 'Account created successfully.' };
  }

  login(email: string, password: string): { success: boolean; message: string; token?: string; user?: StoredUser } {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
      return { success: false, message: 'No account found with this email.' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Invalid password.' };
    }
    const token = this.generateToken(email);
    return {
      success: true,
      message: 'Login successful.',
      token,
      user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name },
    };
  }

  findUserByEmail(email: string): StoredUser | null {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    if (!user) return null;
    return { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name };
  }

  resetPassword(email: string, newPassword: string): { success: boolean; message: string } {
    const users = this.getUsers();
    const index = users.findIndex(u => u.email === email);
    if (index === -1) {
      return { success: false, message: 'No account found with this email.' };
    }
    users[index].password = newPassword;
    this.saveUsers(users);
    return { success: true, message: 'Password reset successfully.' };
  }

  private getTokenPayload(): { email: string; sub: number; exp: number } | null {
    const token = this.token;
    if (!token) return null;
    try {
      return JSON.parse(atob(token));
    } catch {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.getTokenPayload();
      if (!payload || !payload.exp) return false;
      return Date.now() >= payload.exp;
    } catch {
      return true;
    }
  }
}
