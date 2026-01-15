
import React from 'react';
import { VideoSubmission } from '../types.ts';

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
              <p className="text-xs text-slate-500 font-mono truncate max-w-xs mt-1">
                {item.studentId} {item.studentName}.mp4
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
             {item.status === 'downloading' && (
               <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                 <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                 <span className="text-xs font-bold">下载中</span>
               </div>
             )}
             {item.status === 'completed' && (
               <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                 <span className="text-xs font-bold">已完成</span>
               </div>
             )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmissionList;
