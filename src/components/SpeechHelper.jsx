// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast } from '@/components/ui';

// 根据语言代码获取对应的语音
const getVoiceForLanguage = lang => {
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 语言代码映射（扩展以支持更多变体）
  const languageMap = {
    'zh-CN': ['zh-CN', 'zh_chs', 'chi_sim', 'zh', 'zh-Hans-CN'],
    'zh-HK': ['zh-HK', 'yue-Hant-HK', 'zh-Hant-HK', 'yue'],
    'zh-Hant-CN': ['zh-Hant-CN', 'zh-TW', 'zh-Hant', 'chi_tra']
  };

  // 获取该语言对应的候选语言代码
  const candidates = languageMap[lang] || [lang];

  // 首先尝试精确匹配
  for (const candidate of candidates) {
    const voice = voices.find(v => v.lang === candidate);
    if (voice) return voice;
  }

  // 尝试模糊匹配（语言代码的前缀匹配）
  for (const candidate of candidates) {
    const langPrefix = candidate.split('-')[0];
    const voice = voices.find(v => v.lang.startsWith(langPrefix));
    if (voice) return voice;
  }

  // 如果都找不到，返回第一个中文语音
  return voices.find(v => v.lang.startsWith('zh')) || null;
};

/**
 * 语音播放辅助工具
 * 处理浏览器兼容性并提供友好的错误提示
 */
export const useSpeech = () => {
  const {
    toast
  } = useToast();
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  useEffect(() => {
    // 检测浏览器是否支持语音合成
    const supported = 'speechSynthesis' in window;
    setIsSupported(supported);
    if (supported) {
      // 等待语音列表加载
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setVoicesLoaded(true);
          console.log('可用的语音列表:', voices.map(v => `${v.name} (${v.lang})`).join('\n'));
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      console.warn('浏览器不支持语音播放功能');
    }
  }, []);

  /**
   * 播放语音
   * @param {string} text - 要播放的文本
   * @param {object} options - 配置选项
   * @param {number} options.rate - 语速 (默认 0.8)
   * @param {string} options.lang - 语言 (默认 'zh-CN')
   * @param {boolean} options.enabled - 语音是否启用 (默认 true)
   */
  const speak = (text, options = {}) => {
    const {
      rate = 0.8,
      lang = 'zh-CN',
      enabled = true
    } = options;

    // 如果语音功能被禁用，使用降级方案
    if (!enabled) {
      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }
      toast({
        title: '语音播报',
        description: text,
        duration: 2000
      });
      return false;
    }

    // 如果不支持语音，使用振动和文字提示
    if (!isSupported) {
      // 尝试使用振动
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }

      // 显示提示
      toast({
        title: '语音播报',
        description: text,
        duration: 2000
      });
      return false;
    }

    // 支持语音时播放
    try {
      // 取消当前正在播放的语音
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;

      // 根据语言选择对应的语音
      const selectedVoice = getVoiceForLanguage(lang);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`使用语音: ${selectedVoice.name} (${selectedVoice.lang}) 播放: ${text}`);
      } else {
        console.warn(`未找到语言 ${lang} 对应的语音，使用默认语音`);
      }
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = event => {
        setIsSpeaking(false);
        console.error('语音播放错误:', event.error);

        // 失败时使用备选方案
        if ('vibrate' in navigator) {
          navigator.vibrate(100);
        }
        toast({
          title: '语音播报',
          description: text,
          variant: 'default'
        });
      };
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('语音播放异常:', error);

      // 异常时使用备选方案
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
      toast({
        title: '语音播报',
        description: text,
        variant: 'default'
      });
      return false;
    }
  };

  /**
   * 停止播放
   */
  const cancel = () => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };
  return {
    isSupported,
    isSpeaking,
    voicesLoaded,
    speak,
    cancel
  };
};

/**
 * 语音支持状态指示器
 */
export const SpeechIndicator = ({
  isSupported
}) => {
  if (!isSupported) {
    return <div className="bg-orange-100 border-2 border-orange-500 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-orange-800 font-semibold">当前浏览器不支持语音播放，已切换为文字提示模式</span>
        </div>
      </div>;
  }
  return null;
};