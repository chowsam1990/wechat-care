// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast } from '@/components/ui';

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
  useEffect(() => {
    // 检测浏览器是否支持语音合成
    const supported = 'speechSynthesis' in window;
    setIsSupported(supported);
    if (!supported) {
      console.warn('浏览器不支持语音播放功能');
    }
  }, []);

  /**
   * 播放语音
   * @param {string} text - 要播放的文本
   * @param {object} options - 配置选项
   * @param {number} options.rate - 语速 (默认 0.8)
  * @param {string} options.lang - 语言 (默认 'zh-CN')
   */
  const speak = (text, options = {}) => {
    const {
      rate = 0.8,
      lang = 'zh-CN'
    } = options;

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
  const stop = () => {
    if (isSupported) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };
  return {
    isSupported,
    isSpeaking,
    speak,
    stop
  };
};

/**
 * 语音支持状态指示器组件
 */
export const SpeechIndicator = ({
  isSupported
}) => {
  if (isSupported) {
    return null; // 支持时不显示
  }
  return <div className="bg-amber-100 border-l-4 border-amber-500 p-3 mb-4 rounded">
      <div className="flex items-center">
        <div className="text-amber-700 text-sm font-medium">
          当前浏览器不支持语音播放，已切换为文字提示模式
        </div>
      </div>
    </div>;
};