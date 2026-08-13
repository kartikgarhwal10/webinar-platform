export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-border pb-8 mb-8">
          
          {/* Logo block */}
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm shadow-xs shadow-primary">
              W
            </span>
            <span className="font-extrabold text-base tracking-tight text-foreground">
              WeMeet<span className="text-primary font-black">.</span>
            </span>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm font-semibold text-muted">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="mailto:support@wemeet.host" className="hover:text-foreground transition-colors">Contact Support</a>
          </div>

        </div>

        {/* Disclaimer / Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-semibold text-muted/80">
          <div>
            &copy; {currentYear} WeMeet Inc. All rights reserved.
          </div>
          <div className="text-center sm:text-right max-w-md leading-relaxed">
            Disclaimer: This webinar is for educational and training purposes. All trademarks belong to their respective owners.
          </div>
        </div>

      </div>
    </footer>
  );
}
