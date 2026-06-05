import React, { useState } from 'react';
import { DocSettings, DEFAULT_SETTINGS } from './types';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';

export default function App() {
  const [settings, setSettings] = useState<DocSettings>(DEFAULT_SETTINGS);
  const [previewMode, setPreviewMode] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [activeTool, setActiveTool] = useState<'text' | 'drag'>('text');

  const handleSettingsChange = (updates: Partial<DocSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const handleContentChange = (content: string) => {
    setSettings((prev) => ({ ...prev, content }));
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#F2F2ED] text-[#1A1A1A] font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-3 border-b border-[#D1D1CB] bg-white z-10 shadow-sm shrink-0">
        <div className="flex items-center space-x-6">
          <div className="font-bold text-xl tracking-tighter">TYPE<span className="italic font-serif">FRAME</span></div>
          <div className="h-4 w-px bg-[#D1D1CB]"></div>
          <div className="flex space-x-3 text-sm font-medium">
            <button 
              onClick={() => setActiveTool('text')}
              className={`px-3 py-1.5 rounded transition hover:bg-[#F2F2ED] ${activeTool === 'text' ? 'bg-[#F2F2ED] font-bold text-[#1A1A1A]' : 'text-gray-500'}`}
            >
              文本排版
            </button>
            <button 
              onClick={() => setActiveTool('drag')}
              className={`px-3 py-1.5 rounded transition hover:bg-[#F2F2ED] ${activeTool === 'drag' ? 'bg-[#F2F2ED] font-bold text-[#1A1A1A]' : 'text-gray-500'}`}
            >
              拖拽移动
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${previewMode ? 'bg-[#F27D26] text-white' : 'bg-[#1A1A1A] text-white'}`}
          >
            {previewMode ? '退出预览' : '效果预览'}
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <Canvas settings={settings} setContent={handleContentChange} previewMode={previewMode} zoom={zoom} activeTool={activeTool} onUpdateSettings={handleSettingsChange} />
        {!previewMode && <Sidebar settings={settings} onChange={handleSettingsChange} />}
      </div>

      {/* Bottom Status Bar */}
      <footer className="px-4 py-1.5 border-t border-[#D1D1CB] bg-white flex justify-between items-center text-[10px] font-mono opacity-60 shrink-0 min-h-8">
        <div>宽度: {settings.pageWidth}px 高度: {settings.pageHeight}px | 第 1 页，共 1 页</div>
        <div className="flex space-x-6 items-center">
          <span>字数: {settings.content.trim() ? settings.content.trim().split(/\s+/).length : 0}</span>
          <span>字符数: {settings.content.length}</span>
          <div className="flex items-center space-x-2">
            <span>缩放级别: {zoom}%</span>
            <input 
              type="range" min="20" max="200" step="5"
              value={zoom} 
              onChange={e => setZoom(Number(e.target.value))} 
              className="w-24 h-1 bg-[#D1D1CB] appearance-none rounded-lg cursor-pointer accent-[#1A1A1A]" 
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
