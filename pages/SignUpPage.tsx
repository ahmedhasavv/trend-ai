import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { AuthContextType } from '../types';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({
    passwordMatch: '',
    passwordStrength: ''
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signUp } = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    // Real-time password matching validation
    if (confirmPassword && password !== confirmPassword) {
      setValidationErrors(prev => ({ ...prev, passwordMatch: "Passwords do not match." }));
    } else {
      setValidationErrors(prev => ({ ...prev, passwordMatch: "" }));
    }

    // Real-time password strength validation
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    if (password && (password.length < 8 || !hasNumber || !hasLetter)) {
      setValidationErrors(prev => ({ ...prev, passwordStrength: "Password must be at least 8 characters long and include a number and a letter." }));
    } else {
      setValidationErrors(prev => ({ ...prev, passwordStrength: "" }));
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Final check before submission
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (validationErrors.passwordStrength) {
      setError(validationErrors.passwordStrength);
      return;
    }
    
    setError(null);
    setLoading(true);
    try {
      await signUp(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || 'Failed to sign up.');
    } finally {
      setLoading(false);
    }
  };
  
  const isFormInvalid = !!validationErrors.passwordMatch || !!validationErrors.passwordStrength;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create a new account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-neon-purple focus:border-neon-purple sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-neon-purple focus:border-neon-purple sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {validationErrors.passwordStrength && <p className="text-xs text-red-500 mt-1">{validationErrors.passwordStrength}</p>}
            </div>
            <div>
              <input
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-neon-purple focus:border-neon-purple sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {validationErrors.passwordMatch && <p className="text-xs text-red-500 mt-1">{validationErrors.passwordMatch}</p>}
            </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading || isFormInvalid}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-neon-purple to-neon-blue hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-blue disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-neon-blue hover:text-neon-purple">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;