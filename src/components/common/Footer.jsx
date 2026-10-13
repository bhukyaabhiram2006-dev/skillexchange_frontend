import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, BookOpen, MessageSquare, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-slate-900">SkillExchange</span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Empowering college students to trade skills, share knowledge, and build
              collaborative projects across campuses.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Campus Verified Community</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/skills" className="hover:text-indigo-600 transition-colors">
                  All Skill Offerings
                </Link>
              </li>
              <li>
                <Link to="/students" className="hover:text-indigo-600 transition-colors">
                  Student Directory
                </Link>
              </li>
              <li>
                <Link to="/skills?category=programming" className="hover:text-indigo-600 transition-colors">
                  Programming & Tech
                </Link>
              </li>
              <li>
                <Link to="/skills?category=ui-ux" className="hover:text-indigo-600 transition-colors">
                  Design & Creative
                </Link>
              </li>
            </ul>
          </div>

          {/* How it Works & Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Community
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">
                  How Skill Exchange Works
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-indigo-600 transition-colors">
                  Student Benefits
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-indigo-600 transition-colors">
                  Exchange Guidelines
                </a>
              </li>
              <li>
                <Link to="/signup" className="hover:text-indigo-600 transition-colors">
                  Join Your College Group
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Notice */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Platform Status
            </h4>
            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-slate-600 leading-relaxed">
              <p className="font-semibold text-indigo-900 mb-1">Frontend Demo Phase</p>
              Interactive frontend prototype powered by browser mock state and local persistence.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SkillExchange Platform. Created for college students.</p>
          <div className="flex items-center gap-1">
            <span>Built with passion for collaborative student learning</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 ml-1 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
