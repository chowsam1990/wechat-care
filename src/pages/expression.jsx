// @ts-ignore;
import React, { useEffect, useState } from 'react';
// @ts-ignore;
import { useToast } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, Volume2, Home, Phone, Settings } from 'lucide-react';

import { useSpeech, SpeechIndicator } from '@/components/SpeechHelper';
export default function Expression(props) {
  const {
    toast
  } = useToast();
  const categoryParam = props.$w.page.dataset.params.category || 'basic';
  const navigateTo = props.$w.utils.navigateTo;
  const navigateBack = props.$w.utils.navigateBack;
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
  const [currentCategory, setCurrentCategory] = useState(null);
  const categories = [{
    id: 'basic',
    name: '基本需求',
    color: 'bg-green-500',
    items: [{
      text: '我渴了',
      icon: '💧'
    }, {
      text: '我饿了',
      icon: '🍚'
    }, {
      text: '想上厕所',
      icon: '🚻'
    }, {
      text: '我要休息',
      icon: '😴'
    }, {
      text: '我想睡觉',
      icon: '🛏️'
    }, {
      text: '想喝热水',
      icon: '🫖'
    }, {
      text: '想吃饭',
      icon: '🥣'
    }, {
      text: '想吃药',
      icon: '💊'
    }]
  }, {
    id: 'feelings',
    name: '情感表达',
    color: 'bg-red-500',
    items: [{
      text: '我开心',
      icon: '😊'
    }, {
      text: '我很难过',
      icon: '😢'
    }, {
      text: '我很痛苦',
      icon: '😫'
    }, {
      text: '我害怕',
      icon: '😨'
    }, {
      text: '我生气了',
      icon: '😠'
    }, {
      text: '我很担心',
      icon: '😟'
    }, {
      text: '我累了',
      icon: '😩'
    }, {
      text: '我很舒服',
      icon: '😌'
    }]
  }, {
    id: 'communication',
    name: '交流求助',
    color: 'bg-blue-500',
    items: [{
      text: '我想说话',
      icon: '🗣️'
    }, {
      text: '我想写字',
      icon: '✍️'
    }, {
      text: '紧急求助',
      icon: '🆘'
    }, {
      text: '联系医生',
      icon: '👨‍⚕️'
    }, {
      text: '联系家人',
      icon: '👨‍👩‍👧'
    }, {
      text: '我想问问题',
      icon: '❓'
    }, {
      text: '我需要解释',
      icon: '📝'
    }, {
      text: '请等等',
      icon: '⏳'
    }]
  }, {
    id: 'needs',
    name: '其他需求',
    color: 'bg-yellow-500',
    items: [{
      text: '需要帮助',
      icon: '🆘'
    }, {
      text: '想看窗外',
      icon: '🪟'
    }, {
      text: '想听音乐',
      icon: '🎵'
    }, {
      text: '想看电视',
      icon: '📺'
    }, {
      text: '想翻身',
      icon: '🔄'
    }, {
      text: '想散步',
      icon: '🚶'
    }, {
      text: '想躺下',
      icon: '🛏️'
    }, {
      text: '想坐起来',
      icon: '🪑'
    }]
  }];
  useEffect(() => {
    const category = categories.find(c => c.id === categoryParam);
    setCurrentCategory(category || categories[0]);
  }, [categoryParam]);
  const speakText = text => {
    speak(text, {
      rate: voiceSettings.voiceSpeed,
      lang: voiceSettings.voiceLanguage,
      enabled: voiceSettings.voiceEnabled
    });
  };
  if (!currentCategory) {
    return <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-2xl text-[#333333]">加载中...</div>
      </div>;
  }
  return <div className="min-h-screen bg-[#F5F5F5]">
      {/* 顶部标题栏 */}
      <div className={`${currentCategory.color} text-white p-6 shadow-lg`}>
        <div className="flex items-center gap-4 mb-2">
          <button onClick={navigateBack} className="p-2 hover:bg-white/20 rounded-full transition-all">
            <ArrowLeft size={32} />
          </button>
          <h1 className="text-3xl font-bold">{currentCategory.name}</h1>
        </div>
        <p className="text-lg opacity-90">点击按钮表达您的需求</p>
      </div>

      {/* 主要内容区 - 表达按钮网格 */}
      <div className="p-6">
        <SpeechIndicator isSupported={isSupported} />
        <div className="grid grid-cols-2 gap-6">
          {currentCategory.items.map((item, index) => <button key={index} onClick={() => speakText(item.text)} className="bg-white hover:shadow-2xl text-[#333333] p-8 rounded-2xl shadow-lg transition-all active:scale-95 flex flex-col items-center gap-4">
              <span className="text-6xl">{item.icon}</span>
              <span className="text-2xl font-bold text-center">{item.text}</span>
            </button>)}
        </div>
      </div>

      {/* 底部导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#2E7D32] p-4">
        <div className="flex justify-around gap-4">
          <button onClick={() => navigateTo({
          pageId: 'home',
          params: {}
        })} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#2E7D32]">
            <Home size={32} />
            <span className="text-lg font-semibold">首页</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#2E7D32]">
            <Volume2 size={32} />
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

      {/* 底部留白 */}
      <div className="h-24"></div>
    </div>;
}