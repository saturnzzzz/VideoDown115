
import React from 'react';
import { VideoSubmission } from '../types';

interface Props {
  submissions: VideoSubmission[];
}

const SubmissionList: React.FC<Props> = ({ submissions }) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      {submissions.map((item, index) => (
        <div 
          key={item.id} 
          className={`flex items-center justify-between p-5 bg-white rounded-xl border transition-all shadow-sm ${
            item.status === 'downloading' ? 'border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50/30' : 
            item.status === 'completed' ? 'border-green-200 bg-green-50/20' : 
            'border-slate-200 hover:shadow-md'
          }`}
        >
          <div className="flex items-center gap-5 overflow-hidden">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
            }`}>
              {index + 1}
            </div>
            <div className="overflow-hidden">
              <div className="flex items-baseline gap-3">
                <h3 className="font-bold text-slate-900 text-lg leading-tight truncate">{item.studentName}</h3>
                <span className="text-sm px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md font-mono font-semibold">
                  {item.studentId}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400 font-medium">文件名:</span>
                <span className="text-xs text-slate-500 font-mono truncate max-w-xs">
                  {item.studentId} {item.studentName}.mp4
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
             {item.status === 'pending' && (
               <div className="text-right">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Waiting</span>
                 <span className="text-xs font-medium text-slate-300">等待下载</span>
               </div>
             )}
             {item.status === 'downloading' && (
               <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                 <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                 <span className="text-xs font-bold">正在下载...</span>
               </div>
             )}
             {item.status === 'completed' && (
               <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                 </svg>
                 <span className="text-xs font-bold">已完成</span>
               </div>
             )}
             {item.status === 'error' && (
               <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                 <span className="text-xs font-bold">失败</span>
               </div>
             )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmissionList;
