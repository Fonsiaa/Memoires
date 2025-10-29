    import React from 'react';
    import { NavLink } from 'react-router-dom';
    import '../styles/main.scss';

function Navbar() {
    return (
        <div className="flex w-full justify-between rounded-[18px] border p-2 pl-6 backdrop-blur-sm transition-all duration-200 ease-in border-transparent">
        {/* Logo and Preview */}
            <div className="flex items-center">
            <Link to="/" className="flex items-center gap-4">
            <span className="flex items-center gap-[7px]">
            
            {/* SVG Logo */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 20 24" fill="none">
            <path d="M3.80081 18.5661C1.32306 24.0572 6.59904 25.434 10.4904 22.2205C11.6339 25.8242 15.926 23.1361 17.4652 20.3445C20.8578 14.1915 19.4877 7.91459 19.1361 6.61988C16.7244 -2.20972 4.67055 -2.21852 2.59581 6.6649C2.11136 8.21946 2.10284 9.98752 1.82846 11.8233C1.69011 12.749 1.59258 13.3398 1.23436 14.3135C1.02841 14.8733 0.745043 15.3704 0.299833 16.2082C-0.391594 17.5095 -0.0998802 20.021 3.46397 18.7186V18.7195L3.80081 18.5661Z" fill="white" />
              <path d="M10.9614 10.4413C9.97202 10.4413 9.82422 9.25893 9.82422 8.55407C9.82422 7.91791 9.93824 7.4124 10.1542 7.09197C10.3441 6.81003 10.6158 6.66699 10.9614 6.66699C11.3071 6.66699 11.6036 6.81228 11.8128 7.09892C12.0511 7.42554 12.177 7.92861 12.177 8.55407C12.177 9.73591 11.7226 10.4413 10.9616 10.4413H10.9614Z" fill="black" />
              <path d="M15.0318 10.4413C14.0423 10.4413 13.8945 9.25893 13.8945 8.55407C13.8945 7.91791 14.0086 7.4124 14.2245 7.09197C14.4144 6.81003 14.6861 6.66699 15.0318 6.66699C15.3774 6.66699 15.6739 6.81228 15.8831 7.09892C16.1214 7.42554 16.2474 7.92861 16.2474 8.55407C16.2474 9.73591 15.793 10.4413 15.0319 10.4413H15.0318Z" fill="black" />
            </svg>
            {/* Wordmark */}
            <img src="https://kiro.dev/images/kiro-wordmark.png?h=0ad65a93" alt="Kiro" width="57" height="18" className="transition-opacity duration-300 opacity-100" />
          </span>
          <div className="flex items-center gap-1">
            <span className="font-display text-purple-500 text-[18px] leading-[16px]">{'{'}</span>
            <span className="font-sans text-[12px] leading-[16px] tracking-[0.24px] mt-[1px]">PREVIEW</span>
            <span className="font-display text-purple-500 text-[18px] leading-[16px]">{'}'}</span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-4 p-2 pl-6">
        <ul className="flex gap-8 text-[14px] font-medium uppercase">
          <li><Link to="/changelog">Changelog</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><Link to="/docs">Docs</Link></li>
          <li><button type="button" className="flex items-center gap-1">Resources</button></li>
        </ul>

        {/* Search Button */}
        <button type="button" className="DocSearch DocSearch-Button" aria-label="Search across all Kiro content (Ctrl+K)">
          <span className="DocSearch-Button-Container">
            <svg width="20" height="20" className="DocSearch-Search-Icon" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="DocSearch-Button-Keys">
            <kbd className="DocSearch-Button-Key">Ctrl</kbd>
            <kbd className="DocSearch-Button-Key">K</kbd>
          </span>
        </button>

        {/* Downloads Button */}
        <Link to="/downloads" className="group relative overflow-hidden py-3 px-4 font-medium rounded-[10px] text-[14px] bg-white text-black hover:text-white flex items-center justify-center gap-2">
          <span className="relative z-20">DOWNLOADS</span>
          <span className="absolute inset-0 z-10 translate-y-[50%] scale-0 rounded-full transition-transform group-hover:scale-x-[150%] group-hover:scale-y-[220%] bg-purple-500"></span>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;