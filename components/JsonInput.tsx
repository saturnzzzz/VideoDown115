
import React, { useState, useRef } from 'react';

interface Props {
  onProcess: (data: any) => void;
}

const JsonInput: React.FC<Props> = ({ onProcess }) => {
  const [jsonString, setJsonString] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextProcess = () => {
    if (!jsonString.trim()) return;
    try {
      const parsed = JSON.parse(jsonString);
      onProcess(parsed);
    } catch (e) {
      alert("JSON 格式错误，请检查输入内容。");
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileResults: any[] = [];
    const readPromises = Array.from(files).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target?.result as string);
            fileResults.push(json);
            resolve(true);
          } catch (err) {
            console.error(`无法解析文件 ${file.name}:`, err);
            resolve(false);
          }
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    });

    await Promise.all(readPromises);
    if (fileResults.length > 0) {
      // Pass the array of parsed objects to onProcess
      onProcess(fileResults);
    } else {
      alert("未能从所选文件中解析出有效的 JSON 数据。");
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-8">
      {/* File Upload Zone */}
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-3 border-dashed rounded-3xl p-10 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50 scale-[1.01]' 
            : 'border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-slate-50'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          multiple 
          accept=".json" 
          className="hidden" 
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-slate-900">点击或拖拽多个 JSON 文件到此处</p>
          <p className="text-slate-500 mt-1">支持批量选择 records_page_1.json, records_page_2.json 等</p>
        </div>
        <div className="mt-2 px-4 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-widest">
          推荐方案
        </div>
      </div>

      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-4 text-slate-400 text-sm font-bold uppercase tracking-widest">或者 粘贴文本</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      {/* Textarea Fallback */}
      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={jsonString}
            onChange={(e) => setJsonString(e.target.value)}
            className="w-full h-48 p-5 font-mono text-xs bg-white border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none shadow-sm"
            placeholder='粘贴导出的 JSON 源码...'
          />
          {jsonString.length > 0 && (
            <button 
              onClick={() => setJsonString('')}
              className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 bg-white/80 rounded-lg shadow-sm border border-slate-100 transition-colors"
            >
              清空
            </button>
          )}
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleTextProcess}
            disabled={!jsonString.trim()}
            className="w-full px-8 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-30 disabled:bg-slate-400 active:scale-[0.99]"
          >
            解析粘贴的内容并开始下载
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonInput;
