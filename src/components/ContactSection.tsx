import React from 'react';
import { motion } from 'framer-motion';

// Official LinkedIn Brand Vector Icon
const LinkedinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

// Official GitHub Brand Vector Icon
const GithubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export const ContactSection: React.FC = () => {
  return (
    <section className="relative z-20 w-full bg-[#0a090d] text-amber-50 flex flex-col items-center justify-center pb-20 pt-8 sm:pb-28 sm:pt-12 px-6 overflow-hidden select-none border-t border-amber-500/10">
      {/* Soft Ambient Radial Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.05)_0%,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center space-y-6 text-center"
      >
        {/* Contact Heading */}
        <h2 className="text-xs sm:text-sm font-cinzel font-semibold tracking-[0.35em] text-amber-400/85 uppercase">
          Contact
        </h2>

        {/* Decorative Minimal Divider Line */}
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

        {/* Social Media Links Container */}
        <div className="flex items-center justify-center gap-5 sm:gap-6 pt-1">
          {/* LinkedIn Link */}
          <a
            href="https://www.linkedin.com/in/snehasish-saha-642772351/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit my LinkedIn profile"
            title="LinkedIn Profile"
            className="group relative p-3.5 sm:p-4 rounded-full border border-amber-500/30 bg-amber-950/30 text-amber-200/80 transition-all duration-300 hover:border-amber-400 hover:text-amber-100 hover:bg-amber-900/40 hover:shadow-[0_0_20px_rgba(251,191,36,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a090d] active:scale-95"
          >
            <LinkedinIcon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110" />
            <span className="sr-only">Visit my LinkedIn profile</span>
          </a>

          {/* GitHub Link */}
          <a
            href="https://github.com/snehasishlabs"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit my GitHub profile"
            title="GitHub Profile"
            className="group relative p-3.5 sm:p-4 rounded-full border border-amber-500/30 bg-amber-950/30 text-amber-200/80 transition-all duration-300 hover:border-amber-400 hover:text-amber-100 hover:bg-amber-900/40 hover:shadow-[0_0_20px_rgba(251,191,36,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a090d] active:scale-95"
          >
            <GithubIcon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110" />
            <span className="sr-only">Visit my GitHub profile</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
};
