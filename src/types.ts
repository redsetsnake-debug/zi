export interface DocSettings {
  content: string;
  columns: number;
  columnGap: number;
  fontFamily: string;
  customFontUrl: string;
  customFontFormat: 'css' | 'font-file';
  customFontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  pageWidth: number;
  pageHeight: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  backgroundColor: string;
  textColor: string;
  columnFill?: 'balance' | 'auto';
  polygonBox?: { x: number; y: number }[];
  textPosX?: number;
  textPosY?: number;
}

export const PRESET_FONTS = [
  { name: '系统默认', value: 'ui-sans-serif, system-ui, sans-serif' },
  { name: '思源黑体 (Noto Sans SC)', value: '"Noto Sans SC", sans-serif' },
  { name: '思源宋体 (Noto Serif SC)', value: '"Noto Serif SC", serif' },
  { name: '马善政毛笔楷书', value: '"Ma Shan Zheng", cursive' },
  { name: '站酷快乐体', value: '"ZCOOL KuaiLe", sans-serif' },
  { name: '自定义字体链接...', value: 'CUSTOM' }
];

export const DEFAULT_SETTINGS: DocSettings = {
  content: "在这里输入或粘贴您的文本。\n\nTypography Studio 支持在一页内给文本分栏，并对字体、字号、间距进行像素级的调整。在右侧的侧边栏中您可以找到相关的排版设置选项。\n\n本应用还支持自定义字体链接注入！您可以选择内置的免费字体（例如思源黑体、思源宋体），或者直接粘贴提供字体的 CSS 链接（如 Google Fonts 或其他在线字体网站的链接）。一旦应用，字体会立即生效并支持实时预览。\n\n尝试调整右侧的“栏数”滑块，查看多栏排版效果。",
  columns: 2,
  columnGap: 40,
  fontFamily: '"Noto Sans SC", sans-serif',
  customFontUrl: '',
  customFontFormat: 'css',
  customFontFamily: '',
  fontSize: 14,
  lineHeight: 1.6,
  letterSpacing: 0,
  textAlign: 'justify',
  pageWidth: 794,
  pageHeight: 1123,
  paddingTop: 80,
  paddingRight: 80,
  paddingBottom: 80,
  paddingLeft: 80,
  backgroundColor: '#FFFFFF',
  textColor: '#1A1A1A',
  columnFill: 'auto',
};
