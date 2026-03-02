// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast } from '@/components/ui';
// @ts-ignore;
import { Home, Volume2, Settings, Play, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

import { useSpeech } from '@/components/SpeechHelper';
export default function VoiceTestPage(props) {
  const {
    toast
  } = useToast();
  const navigateTo = props.$w.utils.navigateTo;
  const {
    isSupported,
    speak
  } = useSpeech();
  const [voices, setVoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const loadVoices = () => {
    setIsLoading(true);
    const allVoices = window.speechSynthesis.getVoices();
    const chineseVoices = allVoices.filter(v => v.lang.toLowerCase().startsWith('zh')).map(v => ({
      name: v.name,
      lang: v.lang,
      localService: v.localService,
      default: v.default
    }));
    setVoices(chineseVoices);
    setIsLoading(false);
    if (chineseVoices.length > 0) {
      console.log('找到的中文语音:', chineseVoices);
    } else {
      console.warn('未找到中文语音');
    }
  };
  useEffect(() => {
    if (isSupported) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, [isSupported]);
  const testVoice = voice => {
    const utterance = new SpeechSynthesisUtterance('您好，这是语音测试');
    utterance.voice = window.speechSynthesis.getVoices().find(v => v.name === voice.name && v.lang === voice.lang);
    utterance.lang = voice.lang;
    utterance.onstart = () => {
      setSelectedVoice(voice.name);
    };
    utterance.onend = () => {
      setSelectedVoice(null);
      toast({
        title: '播放完成',
        description: `语音: ${voice.name} (${voice.lang})`
      });
    };
    utterance.onerror = event => {
      setSelectedVoice(null);
      toast({
        title: '播放失败',
        description: `语音: ${voice.name} - ${event.error}`,
        variant: 'destructive'
      });
    };
    window.speechSynthesis.speak(utterance);
  };
  const getLanguageLabel = lang => {
    if (lang.includes('zh-CN') || lang.includes('zh-Hans')) return '普通话';
    if (lang.includes('zh-HK') || lang.includes('yue')) return '广东话';
    if (lang.includes('zh-TW') || lang.includes('zh-Hant')) return '台湾话/客家话';
    return lang;
  };
  return <div className="min-h-screen bg-[#F5F5F5]">
      <div className="bg-[#2E7D32] text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">语音测试</h1>
            <p className="text-lg mt-2 opacity-90">检查浏览器支持的语音</p>
          </div>
          <button onClick={loadVoices} className="p-2 hover:bg-white/10 rounded-lg transition-all" title="刷新语音列表">
            <RefreshCw size={24} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {!isSupported && <div className="bg-red-100 border-2 border-red-500 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <XCircle size={32} className="text-red-500" />
              <div>
                <h3 className="text-xl font-bold text-red-800">浏览器不支持语音</h3>
                <p className="text-red-700">您的浏览器不支持 Web Speech API</p>
              </div>
            </div>
          </div>}

        {isSupported && isLoading && <div className="bg-blue-100 border-2 border-blue-500 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <RefreshCw size={32} className="text-blue-500 animate-spin" />
              <div>
                <h3 className="text-xl font-bold text-blue-800">加载中...</h3>
                <p className="text-blue-700">正在获取语音列表</p>
              </div>
            </div>
          </div>}

        {isSupported && !isLoading && <>
            <div className={`rounded-xl p-6 mb-6 ${voices.length > 0 ? 'bg-green-100 border-2 border-green-500' : 'bg-orange-100 border-2 border-orange-500'}`}>
              <div className="flex items-center gap-3">
                {voices.length > 0 ? <CheckCircle size={32} className="text-green-500" /> : <XCircle size={32} className="text-orange-500" />}
                <div>
                  <h3 className={`text-xl font-bold ${voices.length > 0 ? 'text-green-800' : 'text-orange-800'}`}>
                    找到 {voices.length} 个中文语音
                  </h3>
                  <p className={`${voices.length > 0 ? 'text-green-700' : 'text-orange-700'}`}>
                    {voices.length > 0 ? '浏览器支持中文语音播报' : '未找到中文语音，某些方言可能无法正常播放'}
                  </p>
                </div>
              </div>
            </div>

            {voices.length > 0 && <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b-2 border-gray-200">
                  <h2 className="text-2xl font-bold text-[#333333]">可用语音列表</h2>
                  <p className="text-gray-600 mt-1">点击播放按钮测试每个语音</p>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {voices.map((voice, index) => <div key={index} className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-all ${selectedVoice === voice.name ? 'bg-blue-50' : ''}`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-[#333333]">{voice.name}</span>
                          {voice.default && <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                              默认
                            </span>}
                          {voice.localService && <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                              本地
                            </span>}
                        </div>
                        <div className="mt-2 text-gray-600">
                          <span className="font-semibold">语言代码：</span>
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">{voice.lang}</span>
                          <span className="ml-2 font-semibold">类型：</span>
                          <span className="bg-[#2E7D32] text-white px-2 py-1 rounded text-sm font-semibold">
                            {getLanguageLabel(voice.lang)}
                          </span>
                        </div>
                      </div>
                      
                      <button onClick={() => testVoice(voice)} className="ml-4 bg-[#1976D2] hover:bg-blue-700 text-white p-3 rounded-xl transition-all flex items-center gap-2 font-bold" disabled={selectedVoice === voice.name}>
                        {selectedVoice === voice.name ? <RefreshCw size={20} className="animate-spin" /> : <Play size={20} />}
                        播放
                      </button>
                    </div>)}
                </div>
              </div>}

            <div className="mt-6 bg-gray-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#333333] mb-3">注意事项</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#2E7D32] font-bold">•</span>
                  <span>广东话和客家话需要浏览器安装对应的语音引擎</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E7D32] font-bold">•</span>
                  <span>如果语音列表中没有对应方言，会自动使用普通话</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E7D32] font-bold">•</span>
                  <span>不同浏览器和设备支持的语音不同</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E7D32] font-bold">•</span>
                  <span>建议在目标环境中测试语音效果</span>
                </li>
              </ul>
            </div>
          </>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#2E7D32] p-4">
        <div className="flex justify-around gap-4">
          <button onClick={() => navigateTo({
          pageId: 'home',
          params: {}
        })} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#2E7D32] transition-all">
            <Home size={32} />
            <span className="text-lg font-semibold">首页</span>
          </button>
          <button onClick={() => navigateTo({
          pageId: 'expression',
          params: {}
        })} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#2E7D32] transition-all">
            <Volume2 size={32} />
            <span className="text-lg font-semibold">表达</span>
          </button>
          <button onClick={() => navigateTo({
          pageId: 'settings',
          params: {}
        })} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#2E7D32] transition-all">
            <Settings size={32} />
            <span className="text-lg font-semibold">设置</span>
          </button>
        </div>
      </div>

      <div className="h-24"></div>
    </div>;
}