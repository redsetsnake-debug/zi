import React, { useRef, useEffect, useState } from 'react';
import { DocSettings } from '../types';

interface CanvasProps {
  settings: DocSettings;
  setContent: (content: string) => void;
  previewMode?: boolean;
  zoom?: number;
  activeTool?: 'text' | 'drag';
  onUpdateSettings?: (updates: Partial<DocSettings>) => void;
}

export function Canvas({ settings, setContent, previewMode = false, zoom = 100, activeTool = 'text', onUpdateSettings }: CanvasProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({x: 0, y: 0});
  const [dragOffset, setDragOffset] = useState({x: 0, y: 0});

  const {
    content,
    columns,
    columnGap,
    fontFamily,
    customFontUrl,
    customFontFormat,
    fontSize,
    lineHeight,
    letterSpacing,
    textAlign,
    pageWidth,
    pageHeight,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    backgroundColor,
    textColor,
    textPosX = 0,
    textPosY = 0,
  } = settings;

  const scale = zoom / 100;
  const finalScale = previewMode ? scale * 0.85 : scale;
  const currentWidth = previewMode ? pageWidth * 2 : pageWidth;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'drag' && !previewMode) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && activeTool === 'drag') {
      const dx = (e.clientX - dragStart.x) / finalScale;
      const dy = (e.clientY - dragStart.y) / finalScale;
      setDragOffset({ x: dx, y: dy });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      if (onUpdateSettings) {
        onUpdateSettings({
          textPosX: textPosX + dragOffset.x,
          textPosY: textPosY + dragOffset.y
        });
      }
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Sync content initially if empty
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerText !== content) {
      editorRef.current.innerText = content;
    }
  }, []);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setContent(e.currentTarget.innerText);
  };

  const renderCustomFont = () => {
    if (fontFamily !== 'CUSTOM' || !settings.customFontUrl) return null;
    if (customFontFormat === 'css') {
      return (
        <style>
          {`@import url('${customFontUrl}');`}
        </style>
      );
    } else if (customFontFormat === 'font-file') {
      return (
        <style>
          {`
            @font-face {
              font-family: 'InjectedCustomFont';
              src: url('${customFontUrl}');
            }
          `}
        </style>
      );
    }
    return null;
  };

  const activeFontFamily = fontFamily === 'CUSTOM' ? 
    (settings.customFontUrl ? 
      (settings.customFontFormat === 'font-file' ? "'InjectedCustomFont', sans-serif" : (settings.customFontFamily || 'inherit')) 
      : 'inherit') 
    : fontFamily;

  return (
    <main className="flex-1 bg-[#E5E5E1] overflow-auto relative">
      <div className="fixed top-20 left-6 text-[10px] opacity-50 font-mono z-20 bg-white/80 px-2 py-1 rounded shadow-sm">
        页面尺寸: {pageWidth} x {pageHeight} px {previewMode && ' (对开本)'} • 缩放: {Math.round(finalScale * 100)}%
      </div>
      {renderCustomFont()}
      
      {/* Scrollable Container Padding.
          Using min-w-max prevents flex from clipping the zoomed element on small screens!
      */}
      <div className="p-12 min-w-max flex justify-center items-start">
        
        {/* Scaling Wrapper: Explicitly reserves space in the DOM for scrollbars */}
        <div 
          style={{
            width: `${currentWidth * finalScale}px`,
            minHeight: `${pageHeight * finalScale}px`,
          }}
          className="relative origin-top-left transition-all duration-300"
        >
          {/* The Digital Page */}
          <div 
            className={`bg-white transition-all duration-500 relative flex flex-col ${previewMode ? 'shadow-[0_25px_65px_-12px_rgba(0,0,0,0.35)] rounded-sm' : 'shadow-xl ring-1 ring-black/5'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              width: `${currentWidth}px`,
              height: `${pageHeight}px`,
              padding: `${paddingTop}px ${previewMode ? paddingRight * 1.5 : paddingRight}px ${paddingBottom}px ${previewMode ? paddingLeft * 1.5 : paddingLeft}px`,
              backgroundColor,
              transform: `scale(${finalScale})`,
              transformOrigin: 'top left',
              backgroundImage: previewMode ? `linear-gradient(to right, transparent, rgba(0,0,0,0.01) 48%, rgba(0,0,0,0.15) 50%, rgba(255,255,255,0.8) 51%, rgba(0,0,0,0.05) 53%, transparent)` : 'none',
              backgroundSize: '100% 100%',
              cursor: activeTool === 'drag' ? (isDragging ? 'grabbing' : 'grab') : 'text',
            }}
          >
            <div
              ref={editorRef}
              contentEditable={!previewMode && activeTool === 'text'}
              onInput={handleInput}
              className={`w-full h-full outline-none whitespace-pre-wrap break-words overflow-visible ${activeTool !== 'text' ? 'pointer-events-none' : ''}`}
              style={{
                columnCount: previewMode ? columns * 2 : columns,
                columnGap: `${columnGap}px`,
                columnFill: settings.columnFill || 'auto',
                fontFamily: activeFontFamily,
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                letterSpacing: `${letterSpacing}px`,
                textAlign: textAlign,
                color: textColor,
                transform: `translate(${textPosX + dragOffset.x}px, ${textPosY + dragOffset.y}px)`,
              }}
              suppressContentEditableWarning={true}
            />
          </div>
        </div>
      </div>
    </main>
  );
}