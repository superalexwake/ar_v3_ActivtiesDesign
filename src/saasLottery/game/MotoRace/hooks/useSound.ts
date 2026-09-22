/*
 * @Author: Seven
 * @Date: 2025-03-10 17:19:23
 * @LastEditTime: 2025-03-18 11:01:21
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Description: 
 */
import BgSound from '../assets/video/bg.mp3?url'
import ChangeSound from '../assets/video/change.mp3?url'
import LightSound from '../assets/video/light.mp3?url'
import CarSound from '../assets/video/car_run.mp3'
import WinSound from '../assets/video/win.mp3'
import { Howl } from 'howler'
import { onUnmounted, ref } from 'vue';
import { onMounted } from 'vue'

const sounds: { [key: string]: Howl } = {
  bgSound: new Howl({ src: [BgSound], loop: true, volume: 0.8 }),
  changeSound: new Howl({ src: [ChangeSound] }),
  lightSound: new Howl({ src: [LightSound] }),
  carSound: new Howl({ src: [CarSound] }),
  winSound: new Howl({ src: [WinSound] })
};
// 从localStorage获取声音设置，默认开启（'1'表示开启，'0'表示关闭）
const soundSetting = ref(localStorage.getItem('soundSetting') !== '0');
  
// 初始化时设置静音状态
const isMuted = ref(!soundSetting.value);

export const useSound = () => {
  
  // 初始化时应用静音设置
  Object.values(sounds).forEach(sound => {
    sound.mute(isMuted.value);
  });

  // 将音效分类
  const backgroundSounds = ['bgSound'];
  const effectSounds = ['changeSound', 'lightSound', 'carSound', 'winSound'];
  
  // 播放背景音乐，不影响其他音频
  function playBackgroundSound(soundKey: string) {
    if (backgroundSounds.includes(soundKey)) {
      // 停止其他背景音乐
      backgroundSounds.forEach(key => {
        if (key !== soundKey && sounds[key].playing()) {
          sounds[key].stop();
        }
      });
      
      sounds[soundKey].play();
      console.log(`背景音乐: ${soundKey} 开始播放`);
    } else {
      console.error(`${soundKey} 不是背景音乐`);
    }
  }
  
  // 播放效果音，只停止其他效果音
  function playEffectSound(soundKey: string) {
    if (effectSounds.includes(soundKey)) {
      // 停止其他效果音
      effectSounds.forEach(key => {
        if (key !== soundKey && sounds[key].playing()) {
          sounds[key].stop();
        }
      });
      
      sounds[soundKey].play();
      console.log(`效果音: ${soundKey} 开始播放`);
    } else {
      console.error(`${soundKey} 不是效果音`);
    }
  }
  
  // 设置静音或取消静音
  const handleMute = () => {
    isMuted.value = !isMuted.value;
    soundSetting.value = !isMuted.value;
    
    // 将设置保存到localStorage
    localStorage.setItem('soundSetting', soundSetting.value ? '1' : '0');
    
    // 设置所有声音的静音状态
    Object.values(sounds).forEach(sound => {
      sound.mute(isMuted.value);
    });
    
    console.log(`音频已${isMuted.value ? '静音' : '取消静音'}`);
    return isMuted.value;
  }

  const visibleMute = () => {
	  isMuted.value = !isMuted.value;
	  Object.values(sounds).forEach(sound => {
		  sound.mute(isMuted.value);
	  });
  }

  onMounted(() => {
    // playBackgroundSound('bgSound');
  })

  onUnmounted(() => {
    sounds['bgSound'].stop();
    sounds['lightSound'].stop();
    sounds['carSound'].stop();
    sounds['winSound'].stop();
  })

  return {
    handleMute,
    playBackgroundSound,
    playEffectSound,
    isMuted,
    sounds,
	  soundSetting,
	  visibleMute
  }
}