import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import './AuthRoute.css';
import { session } from '../consts';
import { toast } from 'react-toastify';

const SetNewPasswordRoute = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authCode = searchParams.get('auth_code');

  useEffect(() => {
    if (authCode == null) {
        navigate('/auth');
    } else {
        session.post('auth/retrieve', {auth_code: authCode}).then((res) => {
            toast.success("Account verified Successfully.")
            localStorage.setItem('user', JSON.stringify(res.data['user']))
        }).catch(() => {
            toast.error("Login expired, please try again later.")
            navigate('/auth');
        })
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    session.post('auth/reset_password', {'new_password': newPassword}).then((res) => {
        setIsLoading(false);
        toast.success(res.data.detail);
        window.location.href = 'https://localhost:5173/dashboard'
    }).catch((err) => {
        // Handle error appropriately (e.g., show a toast message)
        toast.error(err.response.data.detail)
    })
    setIsLoading(true);
  };

  return (
    <div className="auth-container">
      <form 
        className="auth-form" 
        onSubmit={handleSubmit} 
        autoComplete="off"
      >
        <div className="form-inner">
          {/* Header */}
          <div className="auth-header">
            <h2>Set New Password</h2>
          </div>

          {/* Info Section - Left side on desktop */}
          <div className="slack-section">
            {/* Information notice */}
            <div className="auth-notice">
              <div className="notice-content">
                <p className="notice-text">
                  <strong>Almost there!</strong> Create a strong password to secure your account.
                </p>
              </div>
            </div>

            {/* Password requirements */}
            <div className="password-requirements">
              <h4 className="requirements-title">Password Requirements:</h4>
              <ul className="requirements-list">
                <li className={newPassword.length >= 8 ? 'requirement-met' : 'requirement-pending'}>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(newPassword) ? 'requirement-met' : 'requirement-pending'}>
                  One uppercase letter
                </li>
                <li className={/[a-z]/.test(newPassword) ? 'requirement-met' : 'requirement-pending'}>
                  One lowercase letter
                </li>
                <li className={/\d/.test(newPassword) ? 'requirement-met' : 'requirement-pending'}>
                  One number
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="auth-divider">
            <span className="divider-text">secure password</span>
          </div>

          {/* Password Form Section - Right side on desktop */}
          <div className="email-section">
            <div className="email-form-content">
              {error && (
                <div className="error-message">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17A1.5,1.5 0 0,1 10.5,15.5A1.5,1.5 0 0,1 12,14A1.5,1.5 0 0,1 13.5,15.5A1.5,1.5 0 0,1 12,17M12,10A1,1 0 0,1 13,11V14A1,1 0 0,1 11,14V11A1,1 0 0,1 12,10Z"/>
                  </svg>
                  {error}
                </div>
              )}

              <div className="input-wrapper">
                <label htmlFor="new-password" className="auth-label">
                  New Password
                </label>
                <div className="input-group">
                  <span className="auth-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    id="new-password"
                    className="auth-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="input-wrapper">
                <label htmlFor="confirm-password" className="auth-label">
                  Confirm Password
                </label>
                <div className="input-group">
                  <span className="auth-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22H9M10,16V19.08L13.08,16H20V4H4V16H10M8.5,7A0.5,0.5 0 0,1 9,7.5A0.5,0.5 0 0,1 8.5,8A0.5,0.5 0 0,1 8,7.5A0.5,0.5 0 0,1 8.5,7M12.5,7A0.5,0.5 0 0,1 13,7.5A0.5,0.5 0 0,1 12.5,8A0.5,0.5 0 0,1 12,7.5A0.5,0.5 0 0,1 12.5,7M16.5,7A0.5,0.5 0 0,1 17,7.5A0.5,0.5 0 0,1 16.5,8A0.5,0.5 0 0,1 16,7.5A0.5,0.5 0 0,1 16.5,7Z" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    id="confirm-password"
                    className="auth-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="btn-group">
                <button 
                  type="submit" 
                  className="auth-btn btn--primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="loading-spinner" width="16" height="16" viewBox="0 0 24 24">
                        <path d="M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6Z" />
                      </svg>
                      Setting Password...
                    </>
                  ) : (
                    'Set New Password'
                  )}
                </button>
                <a href="/auth" className="auth-btn btn--text">
                  Back to Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SetNewPasswordRoute;