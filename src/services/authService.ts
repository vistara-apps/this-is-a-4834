import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  interests?: string[];
}

// Mock authentication service - in a real app, this would connect to a backend
class AuthService {
  private currentUser: User | null = null;
  private users: User[] = [
    {
      userId: 'user-1',
      username: 'alexchen',
      email: 'alex@example.com',
      joinedCommunities: ['comm-1', 'comm-2', 'comm-3'],
      createdCommunities: ['comm-1'],
      subscriptionTier: 'free',
      avatar: 'AC'
    }
  ];

  async login(credentials: LoginCredentials): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication - in real app, validate against backend
    const user = this.users.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // In a real app, you'd verify the password hash
    if (credentials.password.length < 6) {
      throw new Error('Invalid email or password');
    }

    this.currentUser = user;
    localStorage.setItem('auth_token', 'mock_token_' + user.userId);
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  }

  async signup(credentials: SignupCredentials): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if user already exists
    const existingUser = this.users.find(u => u.email === credentials.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser: User = {
      userId: `user-${Date.now()}`,
      username: credentials.username,
      email: credentials.email,
      joinedCommunities: [],
      createdCommunities: [],
      subscriptionTier: 'free',
      avatar: credentials.username.substring(0, 2).toUpperCase()
    };

    this.users.push(newUser);
    this.currentUser = newUser;
    
    localStorage.setItem('auth_token', 'mock_token_' + newUser.userId);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return newUser;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to restore from localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');
    
    if (storedUser && token) {
      this.currentUser = JSON.parse(storedUser);
      return this.currentUser;
    }

    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  async refreshToken(): Promise<string | null> {
    // In a real app, this would refresh the JWT token
    const token = localStorage.getItem('auth_token');
    return token;
  }
}

export const authService = new AuthService();
