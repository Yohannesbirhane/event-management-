import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  Github, 
  Mail as GoogleIcon, 
  AlertCircle, 
  ArrowLeft,
  Key,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Validation schemas using Zod
const loginSchema = (isAmharic) => z.object({
  identifier: z.string()
    .min(1, { message: isAmharic ? 'ኢሜይል ወይም ስልክ ቁጥር ያስፈልጋል' : 'Email or phone number is required' })
    .refine((value) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isPhone = /^\d{8,15}$/.test(value.replace(/\D/g, ''));
      return isEmail || isPhone;
    }, { message: isAmharic ? 'ትክክለኛ ኢሜይል ወይም ስልክ ቁጥር ያስገቡ' : 'Please enter a valid email or phone number' }),
  
  password: z.string()
    .min(1, { message: isAmharic ? 'የይለፍ ቃል ያስፈልጋል' : 'Password is required' })
    .min(6, { message: isAmharic ? 'የይለፍ ቃል ቢያንስ 6 ቁምፊ ሊኖረው ይገባል' : 'Password must be at least 6 characters' }),
  
  role: z.enum(['user', 'admin'], {
    errorMap: () => ({ message: isAmharic ? 'የተጠቃሚ ዓይነት ያስፈልጋል' : 'User type is required' })
  })
});

const forgotPasswordSchema = (isAmharic) => z.object({
  email: z.string()
    .min(1, { message: isAmharic ? 'ኢሜይል ያስፈልጋል' : 'Email is required' })
    .email({ message: isAmharic ? 'ትክክለኛ ኢሜይል ያስገቡ' : 'Please enter a valid email address' })
});

const otpSchema = (isAmharic) => z.object({
  otp: z.string()
    .min(1, { message: isAmharic ? 'OTP ያስፈልጋል' : 'OTP is required' })
    .length(6, { message: isAmharic ? 'OTP 6 ቁጥሮች መሆን አለበት' : 'OTP must be 6 digits' })
    .regex(/^\d+$/, { message: isAmharic ? 'OTP ቁጥሮች ብቻ መሆን አለበት' : 'OTP must contain only numbers' })
});

const resetPasswordSchema = (isAmharic) => z.object({
  newPassword: z.string()
    .min(1, { message: isAmharic ? 'አዲስ የይለፍ ቃል ያስፈልጋል' : 'New password is required' })
    .min(8, { message: isAmharic ? 'የይለፍ ቃል ቢያንስ 8 ቁምፊ ሊኖረው ይገባል' : 'Password must be at least 8 characters' })
    .refine((value) => /[a-z]/.test(value), { 
      message: isAmharic ? 'ቢያንስ አንድ ትንሽ ፊደል ሊኖረው ይገባል' : 'At least one lowercase letter is required' 
    })
    .refine((value) => /[A-Z]/.test(value), { 
      message: isAmharic ? 'ቢያንስ አንድ ትልቅ ፊደል ሊኖረው ይገባል' : 'At least one uppercase letter is required' 
    })
    .refine((value) => /[0-9]/.test(value), { 
      message: isAmharic ? 'ቢያንስ አንድ ቁጥር ሊኖረው ይገባል' : 'At least one number is required' 
    })
    .refine((value) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value), { 
      message: isAmharic ? 'ቢያንስ አንድ ልዩ ቁምፊ ሊኖረው ይገባል' : 'At least one special character is required' 
    }),
  
  confirmPassword: z.string()
    .min(1, { message: isAmharic ? 'የይለፍ ቃል ማረጋገጫ ያስፈልጋል' : 'Password confirmation is required' })
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: isAmharic ? 'የይለፍ ቃሎች አይጣጣሙም' : 'Passwords do not match',
  path: ['confirmPassword']
});

// Forget Password Component
const ForgetPassword = ({ isAmharic, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [mockOtp, setMockOtp] = useState('123456'); // Mock OTP for testing
  
  // Step 1: Email Form
  const { 
    register: registerEmail, 
    handleSubmit: handleSubmitEmail, 
    formState: { errors: emailErrors },
    watch: watchEmail 
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema(isAmharic)),
    defaultValues: { email: '' }
  });

  // Step 2: OTP Form
  const { 
    register: registerOtp, 
    handleSubmit: handleSubmitOtp, 
    formState: { errors: otpErrors },
    setError: setOtpError 
  } = useForm({
    resolver: zodResolver(otpSchema(isAmharic)),
    defaultValues: { otp: '' }
  });

  // Step 3: Reset Password Form
  const { 
    register: registerPassword, 
    handleSubmit: handleSubmitPassword, 
    formState: { errors: passwordErrors },
    watch: watchPassword 
  } = useForm({
    resolver: zodResolver(resetPasswordSchema(isAmharic)),
    defaultValues: { newPassword: '', confirmPassword: '' }
  });

  const userEmail = watchEmail('email');

  // Timer for OTP resend
  const startTimer = () => {
    setTimer(60);
    setCanResend(false);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle email submission
  const onEmailSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock OTP (in real app, this would be sent via email)
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setMockOtp(newOtp);
      
      // For demo purposes, show OTP in alert
      alert(isAmharic 
        ? `የማረጋገጫ ኮድ ወደ ${data.email} ተልኳል።\nለፈተና፡ ${newOtp}`
        : `Verification code sent to ${data.email}\nFor testing: ${newOtp}`
      );
      
      setStep(2);
      startTimer();
    } catch (error) {
      alert(isAmharic ? 'ስህተት ተከስቷል' : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP submission
  const onOtpSubmit = async (data) => {
    if (data.otp !== mockOtp) {
      setOtpError('otp', { 
        message: isAmharic ? 'ልክ ያልሆነ OTP' : 'Invalid OTP code' 
      });
      return;
    }
    
    setStep(3);
  };

  // Handle password reset
  const onPasswordSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, this would update the password in the backend
      alert(isAmharic 
        ? 'የይለፍ ቃልዎ በተሳካ ሁኔታ ተቀይሯል። አሁን በአዲሱ የይለፍ ቃል ይግቡ።'
        : 'Your password has been successfully reset. Please login with your new password.'
      );
      
      onSuccess();
    } catch (error) {
      alert(isAmharic ? 'የይለፍ ቃል ማደስ አልተሳካም' : 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate new OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setMockOtp(newOtp);
      
      alert(isAmharic 
        ? `አዲስ OTP ወደ ${userEmail} ተልኳል።\nለፈተና፡ ${newOtp}`
        : `New OTP sent to ${userEmail}\nFor testing: ${newOtp}`
      );
      
      startTimer();
    } catch (error) {
      alert(isAmharic ? 'OTP መላክ አልተሳካም' : 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const passwordStrength = (password) => {
    if (!password) return { score: 0, strength: 'Empty' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
    
    let strength, color;
    if (score === 5) {
      strength = isAmharic ? 'በጣም ጠንካራ' : 'Very Strong';
      color = 'green';
    } else if (score >= 4) {
      strength = isAmharic ? 'ጠንካራ' : 'Strong';
      color = 'lime';
    } else if (score >= 3) {
      strength = isAmharic ? 'መካከለኛ' : 'Medium';
      color = 'yellow';
    } else if (score >= 2) {
      strength = isAmharic ? 'ደካማ' : 'Weak';
      color = 'orange';
    } else {
      strength = isAmharic ? 'በጣም ደካማ' : 'Very Weak';
      color = 'red';
    }
    
    return { score, strength, color };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl dark:shadow-neutral-900/50 max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Key size={20} className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200">
                {isAmharic ? 'የይለፍ ቃል ያስታውሱ' : 'Reset Password'}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {isAmharic 
                  ? `ደረጃ ${step}/3` 
                  : `Step ${step}/3`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-6">
          <div 
            className="h-2 rounded-full bg-yellow-600 dark:bg-yellow-500 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Enter Email */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form onSubmit={handleSubmitEmail(onEmailSubmit)} className="space-y-4">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-2 text-sm font-medium">
                    {isAmharic ? 'ኢሜይል' : 'Email'} *
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${emailErrors.email ? 'text-red-500 dark:text-red-400' : 'text-neutral-400 dark:text-neutral-500'}`} size={18} />
                    <input
                      type="email"
                      {...registerEmail('email')}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 dark:bg-neutral-700 dark:text-neutral-100 transition-all duration-200 ${
                        emailErrors.email ? 'border-red-500 dark:border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                      }`}
                      placeholder={isAmharic ? 'ኢሜይልዎን ያስገቡ' : 'Enter your email'}
                    />
                  </div>
                  {emailErrors.email && (
                    <div className="flex items-center mt-1">
                      <AlertCircle size={14} className="text-red-500 dark:text-red-400 mr-1" />
                      <p className="text-red-500 dark:text-red-400 text-xs">{emailErrors.email.message}</p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {isAmharic 
                      ? 'ማረጋገጫ ኮድ ወደ ኢሜይልዎ ይላካል። ከዚህ በታች ለፈተና የሚሆን OTP ይታያል።'
                      : 'A verification code will be sent to your email. For testing, the OTP will be shown below.'}
                  </p>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    {isAmharic ? 'ዝጋ' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isAmharic ? 'በመላክ ላይ...' : 'Sending...'}
                      </div>
                    ) : (
                      isAmharic ? 'ቀጥል' : 'Continue'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form onSubmit={handleSubmitOtp(onOtpSubmit)} className="space-y-4">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {isAmharic 
                      ? `6 ቁጥር OTP ወደ ${userEmail} ተልኳል`
                      : `6-digit OTP sent to ${userEmail}`}
                  </p>
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-2 text-sm font-medium">
                    {isAmharic ? 'የማረጋገጫ ኮድ (OTP)' : 'Verification Code (OTP)'} *
                  </label>
                  <input
                    type="text"
                    {...registerOtp('otp')}
                    maxLength={6}
                    className={`w-full px-4 py-2.5 border rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 dark:bg-neutral-700 dark:text-neutral-100 transition-all duration-200 ${
                      otpErrors.otp ? 'border-red-500 dark:border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                    }`}
                    placeholder="000000"
                  />
                  {otpErrors.otp && (
                    <div className="flex items-center mt-1">
                      <AlertCircle size={14} className="text-red-500 dark:text-red-400 mr-1" />
                      <p className="text-red-500 dark:text-red-400 text-xs">{otpErrors.otp.message}</p>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResend || loading}
                    className="text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAmharic ? 'OTP እንደገና ላክ' : 'Resend OTP'} 
                    {!canResend && ` (${timer}s)`}
                  </button>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center justify-center flex-1 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    {isAmharic ? 'ተመለስ' : 'Back'}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isAmharic ? 'በማረጋገጥ ላይ...' : 'Verifying...'}
                      </div>
                    ) : (
                      isAmharic ? 'አረጋግጥ' : 'Verify'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                    <RefreshCw size={32} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {isAmharic 
                      ? 'አዲስ የይለፍ ቃል ያስገቡ'
                      : 'Enter your new password'}
                  </p>
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-2 text-sm font-medium">
                    {isAmharic ? 'አዲስ የይለፍ ቃል' : 'New Password'} *
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${passwordErrors.newPassword ? 'text-red-500 dark:text-red-400' : 'text-neutral-400 dark:text-neutral-500'}`} size={18} />
                    <input
                      type="password"
                      {...registerPassword('newPassword')}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 dark:bg-neutral-700 dark:text-neutral-100 transition-all duration-200 ${
                        passwordErrors.newPassword ? 'border-red-500 dark:border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                      }`}
                      placeholder={isAmharic ? 'አዲስ የይለፍ ቃል' : 'New password'}
                    />
                  </div>
                  {passwordErrors.newPassword && (
                    <div className="flex items-center mt-1">
                      <AlertCircle size={14} className="text-red-500 dark:text-red-400 mr-1" />
                      <p className="text-red-500 dark:text-red-400 text-xs">{passwordErrors.newPassword.message}</p>
                    </div>
                  )}
                  
                  {/* Password Strength Indicator */}
                  {watchPassword('newPassword') && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                          {isAmharic ? 'የይለፍ ቃል ጥንካሬ' : 'Password strength'}:
                        </span>
                        <span className={`text-xs font-bold ${
                          passwordStrength(watchPassword('newPassword')).color === 'red' ? 'text-red-600 dark:text-red-400' :
                          passwordStrength(watchPassword('newPassword')).color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                          passwordStrength(watchPassword('newPassword')).color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                          passwordStrength(watchPassword('newPassword')).color === 'lime' ? 'text-lime-600 dark:text-lime-400' :
                          'text-green-600 dark:text-green-400'
                        }`}>
                          {passwordStrength(watchPassword('newPassword')).strength}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full transition-all duration-300 ${
                            passwordStrength(watchPassword('newPassword')).color === 'red' ? 'bg-red-500 dark:bg-red-400' :
                            passwordStrength(watchPassword('newPassword')).color === 'orange' ? 'bg-orange-500 dark:bg-orange-400' :
                            passwordStrength(watchPassword('newPassword')).color === 'yellow' ? 'bg-yellow-500 dark:bg-yellow-400' :
                            passwordStrength(watchPassword('newPassword')).color === 'lime' ? 'bg-lime-500 dark:bg-lime-400' :
                            'bg-green-500 dark:bg-green-400'
                          }`}
                          style={{ width: `${(passwordStrength(watchPassword('newPassword')).score / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-2 text-sm font-medium">
                    {isAmharic ? 'የይለፍ ቃል አረጋግጥ' : 'Confirm Password'} *
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${passwordErrors.confirmPassword ? 'text-red-500 dark:text-red-400' : 'text-neutral-400 dark:text-neutral-500'}`} size={18} />
                    <input
                      type="password"
                      {...registerPassword('confirmPassword')}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 dark:bg-neutral-700 dark:text-neutral-100 transition-all duration-200 ${
                        passwordErrors.confirmPassword ? 'border-red-500 dark:border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                      }`}
                      placeholder={isAmharic ? 'የይለፍ ቃል እንደገና ያስገቡ' : 'Confirm password'}
                    />
                  </div>
                  {passwordErrors.confirmPassword && (
                    <div className="flex items-center mt-1">
                      <AlertCircle size={14} className="text-red-500 dark:text-red-400 mr-1" />
                      <p className="text-red-500 dark:text-red-400 text-xs">{passwordErrors.confirmPassword.message}</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center justify-center flex-1 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    {isAmharic ? 'ተመለስ' : 'Back'}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isAmharic ? 'በመቀየር ላይ...' : 'Updating...'}
                      </div>
                    ) : (
                      isAmharic ? 'የይለፍ ቃል አደስ' : 'Reset Password'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const Login = () => {
  const { t, i18n } = useTranslation();
  const isAmharic = i18n.language === 'am';
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState({
    google: false,
    github: false
  });
  const [showForgetPassword, setShowForgetPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema(isAmharic)),
    defaultValues: {
      identifier: '',
      password: '',
      role: 'user'
    }
  });

  const formData = watch();
  const from = location.state?.from?.pathname || '/';

  // Handle OAuth Login
  const handleOAuthLogin = async (provider) => {
    setOauthLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockOAuthUser = {
        id: Date.now(),
        firstName: provider === 'google' ? 'Google' : 'GitHub',
        lastName: 'User',
        email: `${provider}.user@example.com`,
        phone: '+1234567890',
        role: formData.role || 'user',
        profileImage: null,
        isVerified: true,
        oauthProvider: provider,
        createdAt: new Date().toISOString()
      };

      const mockAccessToken = `oauth_jwt_${provider}_${Date.now()}`;
      
      const loginResult = await login(mockOAuthUser, mockAccessToken);
      
      if (!loginResult.success) {
        throw new Error(loginResult.error || 'OAuth login failed');
      }
      
      alert(isAmharic 
        ? `ከ${provider === 'google' ? 'ጉግል' : 'ጊትሃብ'} በተሳካ ሁኔታ ገብተዋል!`
        : `Successfully logged in with ${provider === 'google' ? 'Google' : 'GitHub'}!`
      );
      
      navigate(formData.role === 'admin' ? '/admin' : from, { replace: true });
      
    } catch (error) {
      alert(isAmharic 
        ? `${provider === 'google' ? 'ጉግል' : 'ጊትሃብ'} መግባት አልተሳካም`
        : `${provider === 'google' ? 'Google' : 'GitHub'} login failed`
      );
    } finally {
      setOauthLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: Date.now(),
        firstName: data.role === 'admin' ? 'Admin' : 'User',
        lastName: 'Test',
        email: data.identifier.includes('@') ? data.identifier : `${data.identifier}@test.com`,
        phone: data.identifier.includes('@') ? '+251912345678' : data.identifier,
        role: data.role,
        profileImage: null,
        isVerified: true,
        createdAt: new Date().toISOString()
      };

      const mockAccessToken = `mock_jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const loginResult = await login(mockUser, mockAccessToken);
      
      if (!loginResult.success) {
        throw new Error(loginResult.error || 'Failed to store login data');
      }
      
      alert(isAmharic 
        ? `እንኳን ደህና መጡ! ${data.role === 'admin' ? 'ወደ አስተዳዳሪ ሳጥን ይዛወራሉ...' : 'ወደ መገልገያዎ ይዛወራሉ...'}`
        : `Welcome! ${data.role === 'admin' ? 'Redirecting to admin panel...' : 'Redirecting to your dashboard...'}`
      );
      
      navigate(data.role === 'admin' ? '/admin' : from, { replace: true });
      
    } catch (error) {
      alert(isAmharic 
        ? 'የመግቢያ ስህተት ተከስቷል'
        : 'Login error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function for input classes
  const getInputClasses = (fieldName) => {
    const baseClasses = "w-full px-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 dark:bg-neutral-700 dark:text-neutral-100 transition-all duration-200";
    
    if (errors[fieldName]) {
      return `${baseClasses} border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-400`;
    } else {
      return `${baseClasses} border-neutral-300 dark:border-neutral-600`;
    }
  };

  return (
    <>
      {/* Forget Password Modal */}
      <AnimatePresence>
        {showForgetPassword && (
          <ForgetPassword 
            isAmharic={isAmharic}
            onClose={() => setShowForgetPassword(false)}
            onSuccess={() => {
              setShowForgetPassword(false);
              alert(isAmharic 
                ? 'የይለፍ ቃልዎ ተቀይሯል! አሁን ይግቡ።'
                : 'Password reset! Please login now.'
              );
            }}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen py-8 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-4 font-display">
              {isAmharic ? 'ግባ' : 'Sign In'}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-300">
              {isAmharic ? 'ወደ መለያዎ ይግቡ' : 'Sign in to your account'}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg dark:shadow-neutral-900/50 p-6 border border-neutral-200 dark:border-neutral-700"
          >
            {/* OAuth Buttons - Top */}
            <div className="mb-6">
              <p className="text-center text-neutral-600 dark:text-neutral-300 text-sm mb-4">
                {isAmharic ? 'በሌላ መንገድ ይግቡ' : 'Or continue with'}
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Google Login */}
                <motion.button
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  disabled={oauthLoading.google}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center space-x-2 py-3 px-4 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {oauthLoading.google ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  ) : (
                    <>
                      <GoogleIcon size={20} className="text-red-600 dark:text-red-500" />
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">
                        Google
                      </span>
                    </>
                  )}
                </motion.button>

                {/* GitHub Login */}
                <motion.button
                  type="button"
                  onClick={() => handleOAuthLogin('github')}
                  disabled={oauthLoading.github}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center space-x-2 py-3 px-4 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {oauthLoading.github ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800 dark:border-gray-300"></div>
                  ) : (
                    <>
                      <Github size={20} className="text-neutral-800 dark:text-neutral-300" />
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">
                        GitHub
                      </span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300 dark:border-neutral-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                    {isAmharic ? 'ወይም' : 'Or'}
                  </span>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email/Phone Input */}
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-2 text-sm font-medium">
                  {isAmharic ? 'ኢሜይል ወይም ስልክ ቁጥር' : 'Email or Phone Number'} *
                </label>
                <div className="relative">
                  {formData.identifier.includes('@') ? (
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${errors.identifier ? 'text-red-500 dark:text-red-400' : 'text-neutral-400 dark:text-neutral-500'}`} size={18} />
                  ) : (
                    <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${errors.identifier ? 'text-red-500 dark:text-red-400' : 'text-neutral-400 dark:text-neutral-500'}`} size={18} />
                  )}
                  <input
                    type="text"
                    {...register('identifier')}
                    className={getInputClasses('identifier')}
                    placeholder={isAmharic ? 'ኢሜይል ወይም ስልክ ቁጥር' : 'Email or phone number'}
                  />
                </div>
                {errors.identifier && (
                  <div className="flex items-center mt-1">
                    <AlertCircle size={14} className="text-red-500 dark:text-red-400 mr-1" />
                    <p className="text-red-500 dark:text-red-400 text-xs">{errors.identifier.message}</p>
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-2 text-sm font-medium">
                  {isAmharic ? 'የይለፍ ቃል' : 'Password'} *
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${errors.password ? 'text-red-500 dark:text-red-400' : 'text-neutral-400 dark:text-neutral-500'}`} size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className={`${getInputClasses('password')} pr-10`}
                    placeholder={isAmharic ? 'የይለፍ ቃልዎን ያስገቡ' : 'Enter your password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center mt-1">
                    <AlertCircle size={14} className="text-red-500 dark:text-red-400 mr-1" />
                    <p className="text-red-500 dark:text-red-400 text-xs">{errors.password.message}</p>
                  </div>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button 
                  type="button"
                  onClick={() => setShowForgetPassword(true)}
                  className="text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-medium flex items-center justify-end space-x-1"
                >
                  <Key size={14} />
                  <span>{isAmharic ? 'የይለፍ ቃል ረሳኽው?' : 'Forgot your password?'}</span>
                </button>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-2 text-sm font-medium">
                  {isAmharic ? 'የተጠቃሚ ዓይነት' : 'User Type'} *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    onClick={() => setValue('role', 'user')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`py-3 rounded-lg border transition-all flex flex-col items-center justify-center ${
                      formData.role === 'user'
                        ? 'bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-600 dark:text-green-400 shadow-sm'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-600'
                    }`}
                  >
                    <span className="font-medium text-sm">{isAmharic ? 'ተጠቃሚ' : 'User'}</span>
                    <span className="text-xs opacity-75 mt-0.5">{isAmharic ? 'መደበኛ ተጠቃሚ' : 'Regular User'}</span>
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={() => setValue('role', 'admin')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`py-3 rounded-lg border transition-all flex flex-col items-center justify-center ${
                      formData.role === 'admin'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-600 dark:text-blue-400 shadow-sm'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-600'
                    }`}
                  >
                    <span className="font-medium text-sm">{isAmharic ? 'አስተዳዳሪ' : 'Admin'}</span>
                    <span className="text-xs opacity-75 mt-0.5">{isAmharic ? 'የስርዓት አስተዳዳሪ' : 'System Administrator'}</span>
                  </motion.button>
                </div>
                {errors.role && (
                  <div className="flex items-center mt-1">
                    <AlertCircle size={14} className="text-red-500 dark:text-red-400 mr-1" />
                    <p className="text-red-500 dark:text-red-400 text-xs">{errors.role.message}</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading || Object.keys(errors).length > 0}
                whileHover={{ scale: Object.keys(errors).length === 0 ? 1.02 : 1 }}
                whileTap={{ scale: Object.keys(errors).length === 0 ? 0.98 : 1 }}
                className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 dark:from-yellow-700 dark:to-amber-700 dark:hover:from-yellow-600 dark:hover:to-amber-600 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg dark:shadow-neutral-900/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isAmharic ? 'በመግባት ላይ...' : 'Signing in...'}
                  </div>
                ) : (
                  isAmharic ? 'ግባ' : 'Sign In'
                )}
              </motion.button>
            </form>

            {/* Links Section */}
            <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <div className="text-center">
                <p className="text-neutral-600 dark:text-neutral-300 text-sm">
                  {isAmharic ? 'አዲስ ተጠቃሚ?' : 'New user?'}{' '}
                  <Link to="/register" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold">
                    {isAmharic ? 'መለያ ይፍጠሩ' : 'Create account'}
                  </Link>
                </p>
              </div>
            </div>
            
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;