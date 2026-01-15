
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">VideoBatch <span className="text-indigo-600">Pro</span></h1>
      </div>
      <div className="hidden sm:flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Ready to batch
        </div>
      </div>
    </header>
  );
};

export default Header;
