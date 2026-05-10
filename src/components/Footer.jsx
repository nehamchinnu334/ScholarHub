import React from 'react';
import { Globe, HelpCircle, School } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full py-16 px-margin mt-auto bg-surface-container-lowest border-t border-outline-variant/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Brand Section */}
        <div className="md:col-span-6 space-y-6">
          <div className="flex items-center gap-2">
            <School className="text-primary w-8 h-8" />
            <span className="font-display text-2xl font-black text-primary tracking-tighter">ScholarHub</span>
          </div>
          <p className="text-sm text-on-surface-variant font-medium leading-relaxed max-w-sm">
            Elevating academic research through collaborative knowledge sharing and meticulously curated resources for the global student community.
          </p>
        </div>

        {/* Legal Column */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-[11px] font-black text-on-surface uppercase tracking-[0.2em] mb-6">Legal</h4>
          <ul className="flex flex-col gap-3">
            <li>
              <a href="#" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
            </li>
          </ul>
        </div>

        {/* Connect Column */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-[11px] font-black text-on-surface uppercase tracking-[0.2em] mb-6">Connect</h4>
          <ul className="flex flex-col gap-3">
            <li>
              <a href="#" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Institutional Access</a>
            </li>
            <li>
              <a href="#" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Contact Support</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-outline-variant/10 pt-8 mt-16 flex justify-between items-center">
        <p className="text-[10px] font-bold text-outline uppercase tracking-widest">
          © 2026 ScholarHub Academic Systems. All rights reserved.
        </p>
        <div className="flex gap-4">
          <button className="text-on-surface-variant hover:text-primary transition-colors p-2 hover:bg-surface-container-high rounded-full">
            <Globe size={18} />
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors p-2 hover:bg-surface-container-high rounded-full">
            <HelpCircle size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
};