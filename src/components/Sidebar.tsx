import React from 'react';
import { DocSettings, PRESET_FONTS } from '../types';
import { Columns, AlignLeft, AlignCenter, AlignRight, AlignJustify, Type, LayoutTemplate } from 'lucide-react';

interface SidebarProps {
  settings: DocSettings;
  onChange: (updates: Partial<DocSettings>) => void;
}

const SliderInput = ({ 
  label, value, min, max, step, onChange, unit = "" 
}: { 
  label: React.ReactNode, value: number, min: number, max: number, step: number, onChange: (v: number) => void, unit?: string 
}) => (
  <div>
    <label className="flex justify-between items-center text-[#1A1A1A] mb-1 text-xs">
      <span className={typeof label === 'string' ? "font-semibold" : "opacity-80"}>{label}</span>
      <div className="flex items-center gap-1">
        <input 
          type="number" 
          value={value} 
          onChange={e => onChange(Number(e.target.value))} 
          className="w-12 bg-[#F9F9F7] border border-[#D1D1CB] rounded p-0.5 text-right font-mono text-[10px] focus:outline-none focus:border-[#1A1A1A]" 
        />
        {unit && <span className="text-[10px] opacity-60 font-mono">{unit}</span>}
      </div>
    </label>
    <input 
      type="range" min={min} max={max} step={step}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full h-1 bg-[#D1D1CB] appearance-none rounded-lg cursor-pointer accent-[#1A1A1A]"
    />
  </div>
);

export function Sidebar({ settings, onChange }: SidebarProps) {
  const update = (key: keyof DocSettings, value: any) => {
    onChange({ [key]: value });
  };

  return (
    <aside className="w-80 border-l border-[#D1D1CB] bg-white flex flex-col p-5 space-y-8 overflow-y-auto shrink-0 z-10 shadow-sm relative">
      <div className="pb-5 border-b border-[#D1D1CB]">
        <h2 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2 tracking-tight">
          <LayoutTemplate className="w-5 h-5" />
          排版设置
        </h2>
        <p className="text-[10px] uppercase font-mono opacity-60 mt-2">文档参数配置</p>
      </div>

      <div className="flex-1 space-y-8">
        
        {/* === Colors Section === */}
        <section className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 block">颜色设置 (Colors)</label>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="flex justify-between text-[#1A1A1A] mb-1 text-xs">
                <span className="font-semibold">文本颜色</span>
                <span className="font-mono text-[10px] opacity-60">{settings.textColor}</span>
              </label>
              <div className="flex bg-[#F9F9F7] border border-[#D1D1CB] rounded p-1 items-center gap-2">
                <input 
                  type="color" 
                  value={settings.textColor} 
                  onChange={e => update('textColor', e.target.value)} 
                  className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent shrink-0"
                />
                <input
                  type="text"
                  value={settings.textColor}
                  onChange={e => update('textColor', e.target.value)}
                  className="flex-1 min-w-0 bg-transparent border-none outline-none text-xs text-[#1A1A1A] uppercase font-mono"
                />
              </div>
            </div>
            <div>
              <label className="flex justify-between text-[#1A1A1A] mb-1 text-xs">
                <span className="font-semibold">背景颜色</span>
                <span className="font-mono text-[10px] opacity-60">{settings.backgroundColor}</span>
              </label>
              <div className="flex bg-[#F9F9F7] border border-[#D1D1CB] rounded p-1 items-center gap-2">
                <input 
                  type="color" 
                  value={settings.backgroundColor} 
                  onChange={e => update('backgroundColor', e.target.value)} 
                  className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent shrink-0"
                />
                <input
                  type="text"
                  value={settings.backgroundColor}
                  onChange={e => update('backgroundColor', e.target.value)}
                  className="flex-1 min-w-0 bg-transparent border-none outline-none text-xs text-[#1A1A1A] uppercase font-mono"
                />
              </div>
            </div>
          </div>
        </section>

        {/* === Typography Section === */}
        <section>
          <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-3 block">字体库</label>
          <div className="space-y-4 text-sm">
            <div>
              <select 
                value={settings.fontFamily}
                onChange={e => update('fontFamily', e.target.value)}
                className="w-full bg-[#F2F2ED] border border-[#1A1A1A] rounded p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] font-semibold"
              >
                {PRESET_FONTS.map(f => (
                  <option key={f.value} value={f.value}>{f.name}</option>
                ))}
              </select>
            </div>

            {settings.fontFamily === 'CUSTOM' && (
              <div className="space-y-4 bg-[#F9F9F7] p-3 rounded-lg border border-[#D1D1CB]">
                <div>
                  <label className="block text-[10px] font-bold text-[#1A1A1A] uppercase mb-1">自定义字体链接</label>
                  <input 
                    type="text" 
                    placeholder="如 https://fonts.googleapis.com/..."
                    value={settings.customFontUrl}
                    onChange={e => {
                      const url = e.target.value;
                      let format = settings.customFontFormat;
                      let familyName = settings.customFontFamily;
                      
                      if (url.includes('fonts.googleapis.com/css')) {
                        format = 'css';
                        try {
                          const urlObj = new URL(url);
                          const familyParam = urlObj.searchParams.get('family');
                          if (familyParam) {
                            familyName = `'${familyParam.split(':')[0].replace(/\+/g, ' ')}', sans-serif`;
                          }
                        } catch (err) {}
                      } else if (url.endsWith('.ttf') || url.endsWith('.otf') || url.endsWith('.woff') || url.endsWith('.woff2')) {
                        format = 'font-file';
                      }

                      onChange({ 
                        customFontUrl: url, 
                        customFontFormat: format,
                        customFontFamily: familyName
                      });
                    }}
                    className="w-full border border-[#D1D1CB] bg-white rounded p-2 text-xs focus:outline-none focus:border-[#1A1A1A] transition-colors"
                  />
                </div>
                
                {settings.customFontUrl && settings.customFontFormat === 'css' && (
                  <div>
                    <label className="block text-[10px] font-bold text-[#1A1A1A] uppercase mb-1">CSS Font-Family 名称</label>
                    <input 
                      type="text" 
                      placeholder="例如: 'Roboto', sans-serif"
                      value={settings.customFontFamily}
                      onChange={e => update('customFontFamily', e.target.value)}
                      className="w-full border border-[#D1D1CB] bg-white rounded p-2 text-xs focus:outline-none focus:border-[#1A1A1A] transition-colors font-mono"
                    />
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs mt-2 text-[#1A1A1A]">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" checked={settings.customFontFormat === 'css'} onChange={() => update('customFontFormat', 'css')} name="fontfmt" className="accent-[#1A1A1A]"/> 
                    CSS 引入
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" checked={settings.customFontFormat === 'font-file'} onChange={() => update('customFontFormat', 'font-file')} name="fontfmt" className="accent-[#1A1A1A]"/> 
                    直链 (.ttf)
                  </label>
                </div>
                <p className="text-[10px] opacity-60 leading-tight">
                  在此粘贴 CSS 链接（如 Google Fonts）或字体文件 URL。输入 Google Fonts 会自动解析字体名称。
                </p>

                {settings.customFontUrl && (
                  <div className="bg-white border text-center border-[#D1D1CB] rounded p-4 mt-2">
                    <div className="text-[10px] uppercase font-bold opacity-50 mb-2">实时字体预览</div>
                    <div 
                      className="text-lg"
                      style={{ 
                        fontFamily: settings.customFontFormat === 'font-file' ? "'InjectedCustomFont', sans-serif" : (settings.customFontFamily || 'inherit'),
                      }}
                    >
                      Typography 字体展示<br/>
                      The quick brown fox
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
               <label className="text-[10px] uppercase font-bold opacity-50 mb-2 block tracking-widest mt-6">对齐方式</label>
               <div className="flex rounded overflow-hidden border border-[#D1D1CB]">
                  {[
                    { val: 'left', icon: <AlignLeft className="w-4 h-4"/> },
                    { val: 'center', icon: <AlignCenter className="w-4 h-4"/> },
                    { val: 'right', icon: <AlignRight className="w-4 h-4"/> },
                    { val: 'justify', icon: <AlignJustify className="w-4 h-4"/> },
                  ].map(a => (
                    <button
                      key={a.val}
                      onClick={() => update('textAlign', a.val)}
                      title={a.val}
                      className={`flex-1 py-1.5 flex justify-center items-center hover:bg-[#F2F2ED] transition-colors ${settings.textAlign === a.val ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A]'}`}
                    >
                      {a.icon}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#D1D1CB]">
              <SliderInput label="字号" value={settings.fontSize} min={8} max={72} step={1} onChange={v => update('fontSize', v)} unit="px" />
              <SliderInput label="行高" value={settings.lineHeight} min={1} max={3} step={0.1} onChange={v => update('lineHeight', v)} unit="x" />
              <SliderInput label="字间距" value={settings.letterSpacing} min={-2} max={10} step={0.5} onChange={v => update('letterSpacing', v)} unit="px" />
            </div>
            
          </div>
        </section>

        {/* === Layout & Margins Section === */}
        <section className="pt-8 border-t border-[#D1D1CB]">
          <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-3 block">排版与拉距设置 (Layout & Margins)</label>
          
          <div className="space-y-6 text-sm">
            {/* Columns Group */}
            <div>
              <span className="block text-xs font-semibold text-[#1A1A1A] mb-2">分栏数量 (Columns)</span>
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map(col => (
                  <button
                    key={col}
                    onClick={() => update('columns', col)}
                    className={`flex-1 py-1.5 border rounded text-xs font-bold transition-colors ${settings.columns === col ? 'border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white' : 'border-[#D1D1CB] hover:border-[#1A1A1A] text-[#1A1A1A]'}`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Column Fill Style */}
            {settings.columns > 1 && (
              <div>
                <span className="block text-xs font-semibold text-[#1A1A1A] mb-2">分栏排布方式 (Column Distribution)</span>
                <div className="flex rounded overflow-hidden border border-[#D1D1CB] text-[11px] font-semibold">
                  <button
                    onClick={() => update('columnFill', 'auto')}
                    className={`flex-1 py-2 font-bold transition-colors ${settings.columnFill !== 'balance' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A] bg-white hover:bg-[#F2F2ED]'}`}
                  >
                    自然排布 (不强制对齐)
                  </button>
                  <button
                    onClick={() => update('columnFill', 'balance')}
                    className={`flex-1 py-2 font-bold transition-colors ${settings.columnFill === 'balance' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A] bg-white hover:bg-[#F2F2ED]'}`}
                  >
                    高度对齐 (两栏平衡)
                  </button>
                </div>
              </div>
            )}

            {/* Column Gaps */}
            <div>
              <SliderInput label="栏间距 (Column Gap)" value={settings.columnGap} min={0} max={100} step={4} onChange={v => update('columnGap', v)} unit="px" />
            </div>

            {/* Margins */}
            <div className="pt-4 border-t border-[#D1D1CB] border-dashed">
              <span className="block text-xs font-semibold text-[#1A1A1A] mb-3">页边距调整 (Margins)</span>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <SliderInput label={<span>上 (Top)</span>} value={settings.paddingTop} min={0} max={250} step={5} onChange={v => update('paddingTop', v)} unit="px" />
                <SliderInput label={<span>下 (Bottom)</span>} value={settings.paddingBottom} min={0} max={250} step={5} onChange={v => update('paddingBottom', v)} unit="px" />
                <SliderInput label={<span>左 (Left)</span>} value={settings.paddingLeft} min={0} max={250} step={5} onChange={v => update('paddingLeft', v)} unit="px" />
                <SliderInput label={<span>右 (Right)</span>} value={settings.paddingRight} min={0} max={250} step={5} onChange={v => update('paddingRight', v)} unit="px" />
              </div>
            </div>
          </div>
        </section>

        {/* === Page Configuration Section === */}
        <section className="pt-8 border-t border-[#D1D1CB]">
          <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-3 block">页面尺寸 (Page Size)</label>
          
          <div className="space-y-6 text-sm">
            {/* Page Size Presets */}
            <div>
              <span className="block text-xs font-semibold text-[#1A1A1A] mb-2">常用设计书籍纸张 (Presets)</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'A4 (210×297)', w: 794, h: 1123 },
                  { name: 'A5 (148×210)', w: 559, h: 794 },
                  { name: 'B5 (176×250)', w: 665, h: 945 },
                  { name: 'Letter (8.5×11")', w: 816, h: 1056 },
                  { name: '文库本 (105×148)', w: 396, h: 559 },
                  { name: '新书判 (103×182)', w: 389, h: 687 }
                ].map(size => (
                  <button
                    key={size.name}
                    onClick={() => {
                      update('pageWidth', size.w);
                      update('pageHeight', size.h);
                    }}
                    className={`py-1.5 border rounded text-[10px] font-bold transition-colors shadow-sm ${settings.pageWidth === size.w && settings.pageHeight === size.h ? 'border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white' : 'border-[#D1D1CB] hover:border-[#1A1A1A] text-[#1A1A1A]'}`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Dimensions */}
            <div className="flex gap-4">
               <div className="flex-1">
                  <label className="text-xs font-semibold text-[#1A1A1A] mb-1 flex justify-between"><span>宽度 (W)</span><span className="text-[10px] opacity-50">px</span></label>
                  <input type="number" value={settings.pageWidth} onChange={e => update('pageWidth', Number(e.target.value))} className="w-full bg-[#F9F9F7] border border-[#D1D1CB] rounded p-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"/>
               </div>
               <div className="flex-1">
                  <label className="text-xs font-semibold text-[#1A1A1A] mb-1 flex justify-between"><span>高度 (H)</span><span className="text-[10px] opacity-50">px</span></label>
                  <input type="number" value={settings.pageHeight} onChange={e => update('pageHeight', Number(e.target.value))} className="w-full bg-[#F9F9F7] border border-[#D1D1CB] rounded p-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"/>
               </div>
            </div>
          </div>
        </section>
      </div>

    </aside>
  );
}
