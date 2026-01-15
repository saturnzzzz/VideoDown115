
import React, { useState } from 'react';
import { VideoSubmission } from './types.ts';
import JsonInput from './components/JsonInput.tsx';
import SubmissionList from './components/SubmissionList.tsx';
import Header from './components/Header.tsx';
import { parseSubmissionJson } from './services/parser.ts';
import { downloadFile } from './services/downloader.ts';

const App: React.FC = () => {
  const [submissions, setSubmissions] = useState<VideoSubmission[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadBatchIndex, setDownloadBatchIndex] = useState(0);

  const executeDownloadBatch = async (dataList: VideoSubmission[], batchIdx: number) => {
    if (isProcessing) return;
    
    const batchSize = 5;
    const startIndex = batchIdx * batchSize;
    const currentBatch = dataList.slice(startIndex, startIndex + batchSize);

    if (currentBatch.length === 0) {
      alert("该批次没有更多视频了。");
      return;
    }

    setIsProcessing(true);

    setSubmissions(prev => prev.map((item) => {
      const globalIdx = dataList.indexOf(item);
      if (globalIdx >= startIndex && globalIdx < startIndex + batchSize) {
        return { ...item, status: 'downloading' };
      }
      return item;
    }));

    for (const submission of currentBatch) {
      const fileName = `${submission.studentId} ${submission.studentName}.mp4`;
      try {
        await downloadFile(submission.videoUrl, fileName);
        setSubmissions(prev => prev.map(s => 
          s.id === submission.id ? { ...s, status: 'completed' } : s
        ));
        await new Promise(resolve => setTimeout(resolve, 1200));
      } catch (err) {
        setSubmissions(prev => prev.map(s => 
          s.id === submission.id ? { ...s, status: 'error' } : s
        ));
      }
    }

    setDownloadBatchIndex(batchIdx + 1);
    setIsProcessing(false);
  };

  const handleDataInput = async (parsedData: any) => {
    try {
      const extracted = parseSubmissionJson(parsedData);
      if (extracted.length === 0) {
        alert("未在数据中发现有效的视频提交记录。");
        return;
      }
      setSubmissions(extracted);
      setDownloadBatchIndex(0);
      await executeDownloadBatch(extracted, 0);
    } catch (error) {
      console.error(error);
      alert("数据处理出错。");
    }
  };

  const handleManualBatchDownload = () => {
    executeDownloadBatch(submissions, downloadBatchIndex);
  };

  const clearData = () => {
    setSubmissions([]);
    setDownloadBatchIndex(0);
  };

  const totalBatches = Math.ceil(submissions.length / 5);

  return (
    <div className="min-h-screen pb-12 bg-slate-50 text-slate-900">
      <Header />
      <main className="max-w-5xl mx-auto px-4 mt-8 space-y-6">
        {submissions.length === 0 ? (
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 p-8 md:p-14">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">批量导入与下载</h2>
              <p className="text-slate-500 mt-4 text-lg max-w-lg mx-auto leading-relaxed">
                您可以一次选择多个 JSON 文件，我们将自动为您合并、重命名并开始下载。
              </p>
            </div>
            <JsonInput onProcess={handleDataInput} />
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white/90 backdrop-blur-xl p-6 rounded-[1.5rem] shadow-xl shadow-slate-200/40 border border-slate-200 sticky top-4 z-20 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <span className="text-lg font-bold">{submissions.length}</span>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 leading-none">解析成功</h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium">
                    当前批次: <span className="text-indigo-600 font-bold">{Math.min(downloadBatchIndex, totalBatches)}</span> / {totalBatches}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button onClick={clearData} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all border border-slate-200 active:scale-95 text-sm">重新开始</button>
                <button 
                  onClick={handleManualBatchDownload}
                  disabled={isProcessing || downloadBatchIndex >= totalBatches}
                  className="flex-1 md:flex-none px-10 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all flex items-center justify-center gap-2 active:scale-95 text-sm"
                >
                  {isProcessing ? "处理中..." : (downloadBatchIndex >= totalBatches ? "已完成" : "下载下一批 (5个)")}
                </button>
              </div>
            </div>
            <SubmissionList submissions={submissions} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
