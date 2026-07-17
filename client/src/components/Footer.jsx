import React from 'react';
import { Briefcase } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-950/95 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20">
              <Briefcase className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">RecruitPortal</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:gap-6">
            <a href="#" className="transition-colors hover:text-white">About Us</a>
            <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-white">Terms of Service</a>
            <a href="#" className="transition-colors hover:text-white">Support</a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-t border-slate-800 pt-8 text-xs text-slate-500 md:flex-row md:space-y-0">
          <p>© {new Date().getFullYear()} RecruitPortal. All rights reserved. Developed for campus recruiters & students.</p>
          <p>Built with MERN Stack & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
