import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Phone, Mail, MapPin, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Medi<span className="text-sky-400">Care</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Advanced healthcare appointment booking platform connecting patients with top-tier
              board-certified specialists. Seamless scheduling, verified doctors, and 24/7 health coordination.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs text-teal-300">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Full-Stack Cloud Healthcare Demonstration</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-sky-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-sky-400 transition">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-sky-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-sky-400 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-sky-400 transition">
                  FAQ & Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Clinical Specialties */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Specialties
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/doctors?specialty=Cardiology" className="hover:text-sky-400 transition">
                  Cardiology
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialty=Neurology" className="hover:text-sky-400 transition">
                  Neurology
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialty=Dermatology" className="hover:text-sky-400 transition">
                  Dermatology
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialty=Orthopedics" className="hover:text-sky-400 transition">
                  Orthopedics
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialty=Pediatrics" className="hover:text-sky-400 transition">
                  Pediatrics
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Support & Hours
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>+1 (800) 555-0199 (Toll Free)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>support@medicare.demo</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Mon - Sun: 24/7 Booking Portal</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>100 Health Sciences Plaza, Suite 400</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; 2026 MediCare Appointment System. Built for academic review, demonstration, and portfolio purposes.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Non-diagnostic appointment portal</span>
            <span>&bull;</span>
            <span>Role-Based Access Control</span>
            <span>&bull;</span>
            <span>Simulated & Live Cloud Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
