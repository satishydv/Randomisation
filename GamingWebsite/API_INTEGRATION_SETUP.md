# API Integration Setup Guide

## Backend API Integration with Frontend

This guide explains how to integrate your CodeIgniter backend authentication API with the React frontend.

## 1. Environment Configuration

### Create `.env` file in GamingWebsite root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost/game

# JWT Configuration (if needed for frontend)
VITE_JWT_SECRET=your_jwt_secret_key_here

# App Configuration
VITE_APP_NAME=BDG Gaming Platform
VITE_APP_VERSION=1.0.0
```

### Base URL Explanation:
- **Development**: `http://localhost/game` (your XAMPP setup)
- **Production**: `https://yourdomain.com/game` (when deployed)

## 2. Backend API Endpoints

Your CodeIgniter backend provides these authentication endpoints:

### Registration
- **URL**: `POST /auth/register`
- **Body**: 
  ```json
  {
    "phone_number": "+911234567890",
    "email": "user@example.com", // optional
    "password": "userpassword"
  }
  ```

### Login
- **URL**: `POST /auth/login`
- **Body**:
  ```json
  {
    "phone_number": "+911234567890", // or "email": "user@example.com"
    "password": "userpassword"
  }
  ```

### Token Refresh
- **URL**: `POST /auth/refresh`
- **Body**:
  ```json
  {
    "refresh_token": "your_refresh_token"
  }
  ```

### Logout
- **URL**: `POST /auth/logout`
- **Body**:
  ```json
  {
    "refresh_token": "your_refresh_token"
  }
  ```

### Token Verification
- **URL**: `POST /auth/verify`
- **Headers**: `Authorization: Bearer your_access_token`

## 3. Frontend Integration Features

### ✅ Implemented Features:

1. **Form Validation**:
   - Phone number validation (10 digits)
   - Email format validation
   - Password confirmation matching
   - Required field validation

2. **API Integration**:
   - Login with phone/email
   - User registration
   - Token management (access + refresh tokens)
   - Automatic token refresh
   - Error handling with user-friendly messages

3. **User Experience**:
   - Loading states with spinners
   - Success/error message display
   - Form state management
   - Auto-redirect after successful login
   - Disabled states during API calls

4. **Security**:
   - JWT token storage in localStorage
   - Automatic token verification
   - Secure logout with token revocation

## 4. File Structure

```
GamingWebsite/src/
├── Components/Login/
│   ├── AuthPage.jsx          # Main login/register component
│   ├── PhoneInputWithCountry.jsx
│   └── Countriesdata.jsx
├── contexts/
│   └── AuthContext.jsx       # Authentication context
├── components/
│   └── ProtectedRoute.jsx    # Route protection
└── utils/
    └── api.js                # API utility functions
```

## 5. Usage Examples

### Using Authentication Context:

```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (isAuthenticated) {
    return <div>Welcome, {user.username}!</div>;
  }
  
  return <div>Please log in</div>;
}
```

### Protecting Routes:

```jsx
import ProtectedRoute from '../components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Homepage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
```

## 6. Testing the Integration

### 1. Start your XAMPP server
### 2. Ensure your CodeIgniter backend is running at `http://localhost/game`
### 3. Start the React frontend:
   ```bash
   cd GamingWebsite
   npm run dev
   ```

### 4. Test Registration:
   - Go to `/login`
   - Click "Register"
   - Fill in phone number and password
   - Submit form

### 5. Test Login:
   - Use registered credentials
   - Try both phone and email login methods
   - Verify successful redirect to homepage

## 7. Error Handling

The integration includes comprehensive error handling:

- **Network Errors**: "Network error. Please check your connection."
- **Validation Errors**: Backend validation messages
- **Authentication Errors**: "Invalid phone number or password"
- **Server Errors**: Generic fallback messages

## 8. Token Management

- **Access Token**: 15 minutes expiry (as per your backend)
- **Refresh Token**: Stored securely for automatic renewal
- **Auto-refresh**: Tokens are automatically refreshed when needed
- **Logout**: All tokens are cleared and revoked

## 9. Security Considerations

- Tokens are stored in localStorage (consider httpOnly cookies for production)
- All API requests include proper headers
- CORS should be configured on your backend
- HTTPS should be used in production

## 10. Next Steps

1. **Add Protected Routes**: Wrap sensitive pages with `ProtectedRoute`
2. **User Profile**: Display user information from stored user data
3. **Logout Functionality**: Add logout button to navigation
4. **Remember Me**: Implement persistent login option
5. **Password Reset**: Add forgot password functionality

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Configure CORS in your CodeIgniter backend
2. **404 Errors**: Check your API routes in `routes.php`
3. **Token Errors**: Verify JWT library configuration
4. **Network Errors**: Ensure XAMPP is running and accessible

### Debug Mode:
Add this to your `.env` for debugging:
```env
VITE_DEBUG=true
```

This will log all API requests and responses to the console.
