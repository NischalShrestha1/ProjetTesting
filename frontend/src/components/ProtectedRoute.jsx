import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requiresProfile = false }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiresProfile) {
    // Check if required profile fields are filled
    const requiredFields = ['firstname', 'lastname', 'email', 'address', 'phone'];
    const isProfileComplete = requiredFields.every(field => user[field]);
    
    if (!isProfileComplete) {
      return <Navigate to="/profile" replace />;
    }
  }

  return children;
}