import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Code,
  Palette,
  BarChart2,
  Globe,
  Camera,
  MessageSquare,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  BookOpen,
  Zap,
} from 'lucide-react';
import { CATEGORIES, MOCK_STUDENTS, TESTIMONIALS } from '../data/mockData';
import StudentCard from '../components/students/StudentCard';

export default function LandingPage() {
  const featuredStudents = MOCK_STUDENTS.slice(0, 3);
  const featuredCategories = CATEGORIES.filter((c) => c.id !== 'all').slice(0, 8);

  const steps = [
    {
      step: '01',
      title: 'List Your Skills & Goals',
      description: 'Tell the community what you know (e.g. Python, Video Editing) and what you are eager to learn (e.g. UI/UX Design, Public Speaking).',
      icon: BookOpen,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      step: '02',
      title: 'Get Matched with Peers',
      description: 'Our smart matching algorithm identifies students who teach what you want to learn and simultaneously want what you can teach.',
      icon: Users,
      color: 'bg-violet-50 text-violet-600',
    },
    {
      step: '03',
      title: 'Swap Knowledge 1-on-1',
      description: 'Connect, schedule sessions on campus or via video call, work through projects together, and leave reviews for each other.',
      icon: Zap,
      color: 'bg-emerald-50 text-emerald-600',
    },
  ];

  const benefits = [
    {
      title: '100% Free Peer Learning',
      description: 'No expensive bootcamps or subscription fees. College students helping college students succeed.',
      icon: ShieldCheck,
    },
    {
      title: 'Hands-on Project Collaboration',
      description: 'Learn by actually building portfolios, coding apps, and reviewing real design mockups together.',
      icon: Code,
    },
    {
      title: 'Cross-Campus Network',
      description: 'Meet motivated peers outside your major and expand your professional collegiate network.',
      icon: Globe,
    },
    {
      title: 'Learn at Your Own Pace',
      description: 'Schedule flexible sessions that adapt to your midterms, finals, and extracurricular routines.',
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-200/40 via-violet-200/30 to-purple-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>The Collegiate Knowledge Exchange Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Learn Together.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 bg-clip-text text-transparent">
              Grow Together.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Trade your knowledge with fellow college students. Teach what you know best,
            learn new in-demand skills, and build real collaborative projects with zero cost.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/skills"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
            >
              <span>Explore Skills</span>
            </Link>
          </div>

          {/* Quick interactive demo callout */}
          <div className="pt-4 text-xs text-slate-500 flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Demo Mode Active: Explore full dashboard & match algorithm without sign-up</span>
          </div>

          {/* Metrics bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-100 shadow-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">2,400+</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Active Students</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-100 shadow-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">45+</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Partner Campuses</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-100 shadow-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">98%</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Match Satisfaction</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-100 shadow-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600">\$0</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Always Free</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-2">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How Skill Exchange Works
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            No money exchanged. Just students helping students conquer the learning curve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white rounded-2xl border border-slate-100 p-8 shadow-xs hover:shadow-md transition-all relative group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-100 group-hover:text-indigo-100 transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Skill Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Diverse Topics
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Skill Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Find peers across technical, creative, and professional disciplines.
            </p>
          </div>
          <Link
            to="/skills"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Browse All 48+ Skills</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/skills?category=${cat.id}`}
              className="p-5 bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 flex items-center justify-center transition-colors mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {cat.count} student offerings
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Students */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Community Spotlight
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Student Partners
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Connect with experienced peers ready to exchange skills.
            </p>
          </div>
          <Link
            to="/students"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Student Profiles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredStudents.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Why SkillExchange?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Built Specifically for the Modern College Student
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
              Traditional courses move slowly. Bootcamps are expensive. SkillExchange connects
              you with peers who have just conquered what you are trying to learn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{b.title}</h3>
                  <p className="text-xs text-indigo-200/80 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-2">
            Success Stories
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Loved by Students Across Campuses
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Sample experiences from peer exchanges (fictional demonstration).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4 mb-6">
                <span className="inline-block text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  {t.skills}
                </span>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-10 h-10 rounded-full object-cover border border-slate-100"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.author}</h4>
                  <p className="text-[11px] text-slate-500">{t.role}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{t.college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 rounded-3xl p-8 sm:p-14 text-center text-white shadow-xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to exchange skills and level up together?
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-indigo-100 leading-relaxed">
            Join students from Stanford, Berkeley, MIT, and 40+ colleges. It takes less than 2
            minutes to set up your profile.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-indigo-600 hover:bg-slate-50 text-sm font-bold rounded-xl shadow-md transition-colors"
            >
              Join the Platform Free
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-700/60 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl border border-indigo-400/40 transition-colors"
            >
              Launch Demo Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
