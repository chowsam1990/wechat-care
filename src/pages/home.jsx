// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, useNavigate } from '@/components/ui';
// @ts-ignore;
import { Heart, Utensils, Droplet, Phone, Lightbulb, Settings, Navigation } from 'lucide-react';

import { useSpeech, SpeechIndicator } from '@/components/SpeechHelper';

// Home 组件图标
function HomeIcon({
  size
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>;
}
export default function Home(props) {
  const {
    toast
  } = useToast();
  const navigateTo = props.$w.utils.navigateTo;
  const {
    isSupported,
    speak
  } = useSpeech();

  // 从 localStorage 加载语音设置
  const [voiceSettings, setVoiceSettings] = useState({
    voiceEnabled: true,
    voiceSpeed: 0.8,
    voiceLanguage: 'zh-CN'
  });
  useEffect(() => {
    const saved = localStorage.getItem('speechSettings');
    if (saved) {
      setVoiceSettings(JSON.parse(saved));
    }
  }, []);
  const categories = [{
    id: 'basic',
    name: '基本需求',
    icon: Utensils,
    color: 'bg-green-500',
    items: ['我渴了', '我饿了', '想上厕所', '我要休息', '我想睡觉']
  }, {
    id: 'feelings',
    name: '情感表达',
    icon: Heart,
    color: 'bg-red-500',
    items: ['我开心', '我很难过', '我很痛苦', '我害怕', '我生气了']
  }, {
    id: 'communication',
    name: '交流求助',
    icon: Phone,
    color: 'bg-blue-500',
    items: ['我想说话', '我想写字', '紧急求助', '联系医生', '联系家人']
  }, {
    id: 'needs',
    name: '其他需求',
    icon: Lightbulb,
    color: 'bg-yellow-500',
    items: ['需要帮助', '想看窗外', '想听音乐', '想看电视', '想翻身']
  }];
  const speakText = text => {
    speak(text, {
      rate: voiceSettings.voiceSpeed,
      lang: voiceSettings.voiceLanguage,
      enabled: voiceSettings.voiceEnabled
    });
  };
  const handleEmergency = () => {
    toast({
      title: '⚠️ 紧急求助',
      description: '正在发送求助信息...',
      variant: 'destructive'
    });
    // 这里可以集成紧急求助逻辑
  };
  return <div className="min-h-screen bg-[#F5F5F5]">
      {/* 顶部标题栏 */}
      <div className="bg-[#2E7D32] text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">辅助表达</h1>
        <p className="text-lg mt-2 opacity-90">帮助您表达需求</p>
      </div>

      {/* 主要内容区 */}
      <div className="p-6 space-y-6">
        <SpeechIndicator isSupported={isSupported} />

        {/* 紧急求助按钮 - 大尺寸且醒目 */}
        <button onClick={handleEmergency} className="w-full bg-red-600 hover:bg-red-700 text-white text-2xl font-bold py-8 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3">
          <Heart size={40} />
          紧急求助
        </button>

        {/* 分类导航 */}
        <div className="grid grid-cols-2 gap-6">
          {categories.map(category => {
          const Icon = category.icon;
          return <button key={category.id} onClick={() => navigateTo({
            pageId: 'expression',
            params: {
              category: category.id
            }
          })} className={`${category.color} hover:opacity-90 text-white p-8 rounded-2xl shadow-lg transition-all active:scale-95 flex flex-col items-center gap-4`}>
                <Icon size={48} />
                <span className="text-2xl font-bold">{category.name}</span>
              </button>;
        })}
        </div>

        {/* 快捷常用语 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-[#333333] mb-4">快捷常用语</h2>
          <div className="grid grid-cols-2 gap-4">
            {[{
            text: '我渴了',
            color: 'bg-blue-100'
          }, {
            text: '我饿了',
            color: 'bg-green-100'
          }, {
            text: '很痛苦',
            color: 'bg-red-100'
          }, {
            text: '需要帮助',
            color: 'bg-yellow-100'
          }].map((item, index) => <button key={index} onClick={() => speakText(item.text)} className={`${item.color} hover:opacity-80 text-[#333333] text-xl font-semibold py-6 rounded-xl transition-all active:scale-95`}>
                {item.text}
              </button>)}
          </div>
        </div>
      </div>

      {/* 底部导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#2E7D32] p-4">
        <div className="flex justify-around gap-4">
          <button className="flex flex-col items-center gap-1 text-[#2E7D32]">
            <HomeIcon size={32} />
            <span className="text-lg font-semibold">首页</span>
          </button>
          <button onClick={() => navigateTo({
          pageId: 'expression',
          params: {}
        })} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#2E7D32]">
            <Navigation size={32} />
            <span className="text-lg font-semibold">表达</span>
          </button>
          <button onClick={() => navigateTo({
          pageId: 'help',
          params: {}
        })} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#2E7D32]">
            <Phone size={32} />
            <span className="text-lg font-semibold">求助</span>
          </button>
          <button onClick={() => navigateTo({
          pageId: 'settings',
          params: {}
        })} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#2E7D32]">
            <Settings size={32} />
            <span className="text-lg font-semibold">设置</span>
          </button>
        </div>
      </div>

      {/* 底部留白，避免内容被导航栏遮挡 */}
      <div className="h-24"></div>
    </div>;
}