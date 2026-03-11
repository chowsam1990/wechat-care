// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast } from '@/components/ui';
// @ts-ignore;
import { Phone, Heart, Home, Volume2, Settings, User, Clock } from 'lucide-react';

import { useSpeech, SpeechIndicator } from '@/components/SpeechHelper';
export default function Help(props) {
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
  const [emergencyContacts, setEmergencyContacts] = useState([{
    id: 1,
    name: '医生',
    phone: '120'
  }, {
    id: 2,
    name: '家人',
    phone: ''
  }, {
    id: 3,
    name: '护工',
    phone: ''
  }]);
  const speakAndCall = (text, phone) => {
    // 先语音播报
    speak(text, {
      rate: voiceSettings.voiceSpeed,
      lang: voiceSettings.voiceLanguage,
      enabled: voiceSettings.voiceEnabled
    });
    toast({
      title: '正在呼叫',
      description: `${text} - ${phone || '未设置'}`
    });

    // 如果有电话号码，尝试拨打电话
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      toast({
        title: '未设置电话',
        description: '请在设置中添加紧急联系人',
        variant: 'destructive'
      });
    }
  };
  const handleQuickHelp = message => {
    speak(message, {
      rate: voiceSettings.voiceSpeed,
      lang: voiceSettings.voiceLanguage,
      enabled: voiceSettings.voiceEnabled
    });
    toast({
      title: '求助信息已发送',
      description: message
    });
  };
  return <div className="min-h-screen bg-[#F5F5F5]">
      {/* 顶部标题栏 */}
      <div className="bg-[#1976D2] text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">快来帮我</h1>
        <p className="text-lg mt-2 opacity-90">按一下就能叫人</p>
      </div>

      {/* 主要内容区 */}
      <div className="p-6 space-y-6">
        <SpeechIndicator isSupported={isSupported} />

        {/* 紧急求助按钮 */}
        <button onClick={() => handleQuickHelp('🆘 我需要紧急求助！')} className="w-full bg-red-600 hover:bg-red-700 text-white text-3xl font-bold py-10 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-4">
          <Heart size={48} />
          急！快帮忙
        </button>

        {/* 快捷求助信息 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-[#333333] mb-4">快捷求助</h2>
          <div className="space-y-4">
            {[{
            text: '我很痛苦',
            color: 'bg-red-100',
            icon: '😫'
          }, {
            text: '我需要帮助',
            color: 'bg-yellow-100',
            icon: '🆘'
          }, {
            text: '我想见医生',
            color: 'bg-blue-100',
            icon: '👨‍⚕️'
          }, {
            text: '我想见家人',
            color: 'bg-green-100',
            icon: '👨‍👩‍👧'
          }].map((item, index) => <button key={index} onClick={() => handleQuickHelp(item.text)} className={`w-full ${item.color} hover:opacity-80 text-[#333333] text-xl font-semibold py-6 rounded-xl transition-all active:scale-95 flex items-center gap-4`}>
                <span className="text-4xl">{item.icon}</span>
                <span>{item.text}</span>
              </button>)}
          </div>
        </div>

        {/* 紧急联系人 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-[#333333] mb-4">紧急联系人</h2>
          <div className="space-y-4">
            {emergencyContacts.map(contact => <button key={contact.id} onClick={() => speakAndCall(`正在呼叫${contact.name}`, contact.phone)} className="w-full bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 text-[#333333] text-xl font-semibold py-6 rounded-xl transition-all active:scale-95 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <User size={32} className="text-[#1976D2]" />
                  <span>{contact.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">{contact.phone || '未设置'}</span>
                  <Phone size={28} className="text-[#2E7D32]" />
                </div>
              </button>)}
          </div>
          <button onClick={() => navigateTo({
          pageId: 'settings',
          params: {}
        })} className="w-full mt-4 bg-[#2E7D32] hover:bg-green-700 text-white text-lg font-semibold py-4 rounded-xl transition-all">
            添加/编辑联系人
          </button>
        </div>

        {/* 使用历史 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={24} className="text-[#1976D2]" />
            <h2 className="text-2xl font-bold text-[#333333]">最近求助</h2>
          </div>
          <div className="text-gray-500 text-lg py-4">
            暂无求助记录
          </div>
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
          <button onClick={() => navigateTo({
          pageId: 'expression',
          params: {}
        })} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#2E7D32]">
            <Volume2 size={32} />
            <span className="text-lg font-semibold">表达</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#2E7D32]">
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