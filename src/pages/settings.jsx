// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { useToast } from '@/components/ui';
// @ts-ignore;
import { Home, Volume2, Phone as PhoneIcon, Settings as SettingsIcon, VolumeUp, VolumeX, User, Plus, Trash2 } from 'lucide-react';

import { useSpeech, SpeechIndicator, VOICE_LANGUAGES } from '@/components/SpeechHelper';
export default function SettingsPage(props) {
  const {
    toast
  } = useToast();
  const navigateTo = props.$w.utils.navigateTo;
  const {
    isSupported,
    speak,
    selectedLanguage,
    setLanguage
  } = useSpeech();
  const [settings, setSettings] = useState({
    voiceEnabled: true,
    voiceSpeed: 0.8,
    fontSize: 'large'
  });
  const [contacts, setContacts] = useState([{
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
  const [newContact, setNewContact] = useState({
    name: '',
    phone: ''
  });
  const testVoice = () => {
    if (!settings.voiceEnabled) {
      toast({
        title: '语音已关闭',
        description: '请先开启语音功能',
        variant: 'destructive'
      });
      return;
    }
    if (!isSupported) {
      toast({
        title: '不支持语音',
        description: '当前浏览器不支持语音播放功能',
        variant: 'destructive'
      });
      return;
    }
    const currentLang = VOICE_LANGUAGES[selectedLanguage];
    speak('您好，这是测试语音', {
      rate: settings.voiceSpeed,
      lang: currentLang.code
    });
    toast({
      title: '语音测试',
      description: `正在用${currentLang.name}播放测试语音...`
    });
  };
  const handleLanguageChange = langKey => {
    setLanguage(langKey);
    const langInfo = VOICE_LANGUAGES[langKey];
    toast({
      title: '语言切换',
      description: `已切换到${langInfo.name}`
    });
  };
  const addContact = () => {
    if (!newContact.name.trim()) {
      toast({
        title: '请输入姓名',
        variant: 'destructive'
      });
      return;
    }
    const contact = {
      id: Date.now(),
      name: newContact.name,
      phone: newContact.phone
    };
    setContacts([...contacts, contact]);
    setNewContact({
      name: '',
      phone: ''
    });
    toast({
      title: '添加成功',
      description: `已添加 ${newContact.name}`
    });
  };
  const deleteContact = id => {
    setContacts(contacts.filter(c => c.id !== id));
    toast({
      title: '删除成功'
    });
  };
  return <div className="min-h-screen bg-[#F5F5F5]">
      {/* 顶部标题栏 */}
      <div className="bg-[#2E7D32] text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">设置</h1>
        <p className="text-lg mt-2 opacity-90">个性化您的体验</p>
      </div>

      {/* 主要内容区 */}
      <div className="p-6 space-y-6">
        <SpeechIndicator isSupported={isSupported} />

        {/* 语音设置 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <VolumeUp size={24} className="text-[#2E7D32]" />
            <h2 className="text-2xl font-bold text-[#333333]">语音设置</h2>
          </div>
          
          {/* 语音开关 */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {settings.voiceEnabled ? <VolumeUp size={28} className="text-[#2E7D32]" /> : <VolumeX size={28} className="text-gray-400" />}
              <span className="text-xl font-semibold text-[#333333]">语音播报</span>
            </div>
            <button onClick={() => {
            setSettings({
              ...settings,
              voiceEnabled: !settings.voiceEnabled
            });
            toast({
              title: settings.voiceEnabled ? '语音已关闭' : '语音已开启'
            });
          }} className={`w-20 h-12 rounded-full transition-all ${settings.voiceEnabled ? 'bg-[#2E7D32]' : 'bg-gray-300'}`}>
              <div className={`w-8 h-8 bg-white rounded-full shadow transition-all ${settings.voiceEnabled ? 'translate-x-12' : 'translate-x-2'}`} />
            </button>
          </div>

          {/* 语音速度 */}
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-[#333333]">语音速度</span>
              <span className="text-lg text-[#2E7D32]">{settings.voiceSpeed}x</span>
            </div>
            <div className="flex gap-4">
              {[0.6, 0.8, 1.0, 1.2].map(speed => <button key={speed} onClick={() => setSettings({
              ...settings,
              voiceSpeed: speed
            })} className={`flex-1 py-3 rounded-xl text-lg font-semibold transition-all ${settings.voiceSpeed === speed ? 'bg-[#2E7D32] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {speed}x
                </button>)}
            </div>
          </div>

          {/* 语言选择 */}
          <div className="py-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-[#333333]">语音语言</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(VOICE_LANGUAGES).map(([key, lang]) => <button key={key} onClick={() => handleLanguageChange(key)} className={`p-4 rounded-xl text-left transition-all ${selectedLanguage === key ? 'bg-[#2E7D32] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Volume2 size={24} />
                      <div>
                        <div className="text-lg font-semibold">{lang.name}</div>
                        <div className={`text-sm ${selectedLanguage === key ? 'text-white/80' : 'text-gray-500'}`}>
                          {lang.description}
                        </div>
                      </div>
                    </div>
                    {selectedLanguage === key && <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-[#2E7D32] rounded-full" />
                      </div>}
                  </div>
                </button>)}
            </div>
          </div>

          {/* 测试语音 */}
          <button onClick={testVoice} className="w-full mt-4 bg-[#1976D2] hover:bg-blue-700 text-white text-xl font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
            <VolumeUp size={24} />
            测试语音
          </button>
        </div>

        {/* 联系人管理 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <PhoneIcon size={24} className="text-[#1976D2]" />
            <h2 className="text-2xl font-bold text-[#333333]">紧急联系人</h2>
          </div>

          {/* 添加联系人表单 */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="space-y-4">
              <input type="text" placeholder="姓名" value={newContact.name} onChange={e => setNewContact({
              ...newContact,
              name: e.target.value
            })} className="w-full text-lg p-4 border-2 border-gray-300 rounded-xl focus:border-[#2E7D32] focus:outline-none" />
              <input type="tel" placeholder="电话号码" value={newContact.phone} onChange={e => setNewContact({
              ...newContact,
              phone: e.target.value
            })} className="w-full text-lg p-4 border-2 border-gray-300 rounded-xl focus:border-[#2E7D32] focus:outline-none" />
              <button onClick={addContact} className="w-full bg-[#2E7D32] hover:bg-green-700 text-white text-lg font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                <Plus size={24} />
                添加联系人
              </button>
            </div>
          </div>

          {/* 联系人列表 */}
          <div className="space-y-4">
            {contacts.map(contact => <div key={contact.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <User size={32} className="text-[#1976D2]" />
                  <div>
                    <div className="text-xl font-bold text-[#333333]">{contact.name}</div>
                    <div className="text-lg text-gray-500">{contact.phone || '未设置电话'}</div>
                  </div>
                </div>
                <button onClick={() => deleteContact(contact.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 size={24} />
                </button>
              </div>)}
          </div>
        </div>

        {/* 关于 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-[#333333] mb-4">关于</h2>
          <div className="space-y-3 text-lg text-gray-600">
            <p>辅助表达 v1.0</p>
            <p>为中风病人提供帮助</p>
            <p>简单易用，贴心关怀</p>
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
          <button onClick={() => navigateTo({
          pageId: 'help',
          params: {}
        })} className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#2E7D32]">
            <PhoneIcon size={32} />
            <span className="text-lg font-semibold">求助</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#2E7D32]">
            <SettingsIcon size={32} />
            <span className="text-lg font-semibold">设置</span>
          </button>
        </div>
      </div>

      {/* 底部留白 */}
      <div className="h-24"></div>
    </div>;
}