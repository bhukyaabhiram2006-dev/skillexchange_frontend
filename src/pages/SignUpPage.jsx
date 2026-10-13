import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  School,
  BookOpen,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    course: '',
    year: '1st Year (Freshman)',
    password: '',
    confirmPassword: '',
    skillsOffered: 'Python, Git',
    skillsDesired: 'UI/UX Design, Figma',
    bio: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.college.trim()) newErrors.college = 'College or University is required';
    if (!formData.course.trim()) newErrors.course = 'Major or Course of study is required';

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.skillsOffered.trim()) {
      newErrors.skillsOffered = 'Please specify at least one skill you can teach';
    }

    if (!formData.skillsDesired.trim()) {
      newErrors.skillsDesired = 'Please specify at least one skill you want to learn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await signup(formData);
      addToast(
        res?.fromBackend
          ? 'Account registered on Spring Boot backend! Welcome to SkillExchange.'
          : 'Account created! Welcome to the SkillExchange network.',
        'success'
      );
      navigate('/dashboard');
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        email: err.message || 'Registration failed. Email may already be in use.',
      }));
      addToast(err.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Create Your Student Profile
          </h2>
          <p className="text-xs text-slate-500">
            Join the peer exchange community and start discovering mentors.
          </p>
        </div>

        {/* Demo banner */}
        <div className="p-3 bg-indigo-50/80 border border-indigo-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-indigo-900">
          <Info className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold">Spring Boot & MySQL Connected: </span>
            Register a genuine student account with your university, courses, and skills. Your credentials will be securely hashed with BCrypt.
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute inset-y-0 left-3 my-auto pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Maya Lin"
                  className={`w-full pl-9 pr-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                College Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute inset-y-0 left-3 my-auto pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. maya@mit.edu"
                  className={`w-full pl-9 pr-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.email}</p>
              )}
            </div>
          </div>

          {/* College & Course */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                College / University
              </label>
              <div className="relative">
                <School className="w-4 h-4 text-slate-400 absolute inset-y-0 left-3 my-auto pointer-events-none" />
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="e.g. UC Berkeley"
                  className={`w-full pl-9 pr-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.college
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.college && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.college}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Major / Course & Year
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="Major (e.g. CS)"
                  className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.course
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:ring-indigo-500/20'
                  }`}
                />
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-2 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="1st Year (Freshman)">1st Year</option>
                  <option value="2nd Year (Sophomore)">2nd Year</option>
                  <option value="3rd Year (Junior)">3rd Year</option>
                  <option value="4th Year (Senior)">4th Year</option>
                  <option value="Graduate Student">Graduate</option>
                </select>
              </div>
              {errors.course && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.course}</p>
              )}
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute inset-y-0 left-3 my-auto pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className={`w-full pl-9 pr-9 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:ring-indigo-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute inset-y-0 left-3 my-auto pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className={`w-full pl-9 pr-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Skills Offered */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Skills You Can Teach (comma-separated)
            </label>
            <input
              type="text"
              name="skillsOffered"
              value={formData.skillsOffered}
              onChange={handleChange}
              placeholder="e.g., Python, C++, React, Graphic Design"
              className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                errors.skillsOffered
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-200 focus:ring-indigo-500/20'
              }`}
            />
            {errors.skillsOffered && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.skillsOffered}</p>
            )}
          </div>

          {/* Skills Desired */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Skills You Want to Learn (comma-separated)
            </label>
            <input
              type="text"
              name="skillsDesired"
              value={formData.skillsDesired}
              onChange={handleChange}
              placeholder="e.g., UI/UX Design, Figma, Spanish, Public Speaking"
              className={`w-full px-3 py-2 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 ${
                errors.skillsDesired
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-200 focus:ring-indigo-500/20'
              }`}
            />
            {errors.skillsDesired && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.skillsDesired}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all mt-2"
          >
            <span>Complete Registration & Launch Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
