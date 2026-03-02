// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Globe } from 'lucide-react';

const LANGUAGE_OPTIONS = [{
  value: 'zh-CN',
  label: '普通话',
  description: '标准普通话'
}, {
  value: 'zh-HK',
  label: '广东话',
  description: '粤语'
}, {
  value: 'zh-Hant-CN',
  label: '客家话',
  description: '客家方言'
}];
export function LanguageSelector({
  selectedLanguage,
  onChange
}) {
  return <div className="py-4">
      <div className="flex items-center gap-2 mb-4">
        <Globe size={24} className="text-[#2E7D32]" />
        <span className="text-lg font-semibold text-[#333333]">语音语言</span>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {LANGUAGE_OPTIONS.map(option => <button key={option.value} onClick={() => onChange(option.value)} className={`p-4 rounded-xl text-center transition-all ${selectedLanguage === option.value ? 'bg-[#2E7D32] text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <div className={`text-xl font-bold mb-1 ${selectedLanguage === option.value ? 'text-white' : 'text-[#333333]'}`}>
              {option.label}
            </div>
            <div className={`text-sm ${selectedLanguage === option.value ? 'text-white/90' : 'text-gray-500'}`}>
              {option.description}
            </div>
          </button>)}
      </div>
    </div>;
}