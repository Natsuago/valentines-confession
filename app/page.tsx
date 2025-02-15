"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { TypeAnimation } from "react-type-animation"

// 小纸屑组件
const Confetti = ({ numberOfPieces = 300 }) => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(numberOfPieces)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-5%`,
            backgroundColor: [
              "#ff69b4",
              "#ff1493",
              "#ff0000",
              "#ff69b4",
              "#ffc0cb",
            ][Math.floor(Math.random() * 5)],
            width: `${Math.random() * 15 + 8}px`,
            height: `${Math.random() * 15 + 8}px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 3 + 2}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function ValentinesConfession() {
  // 阶段控制：Phase1（表白） → 渐隐 → Phase2（恶搞）
  const [showPhase1, setShowPhase1] = useState(true)
  const [showPhase2, setShowPhase2] = useState(false)
  // 是否淡出 Phase1
  const [fadeOutPhase1, setFadeOutPhase1] = useState(false)

  // 是否显示彩带
  const [showConfetti, setShowConfetti] = useState(false)
  // 是否已开始播放表白文字
  const [showMessage, setShowMessage] = useState(false)
  // 是否已点击「我愿意」
  const [accepted, setAccepted] = useState(false)

  // 是否显示「我愿意」按钮
  const [showAcceptButton, setShowAcceptButton] = useState(false)
  // 是否显示「再来一次」按钮
  const [showReplayButton, setShowReplayButton] = useState(false)

  // 表白文本
  const messages = [
    "亲爱的，遇见你是我最大的幸运！",
    "你的笑容让我的世界充满阳光",
    "今天，我想对你说...",
    "你愿意成为我的另一半吗？"
  ]

  // 恶搞文本
  const prankMessages = [
    "啊哈哈哈哈...",
    "想啥呢？",
    "我又没对象",
    "一个人过情人节不香吗？",
    "单身狗欢乐多！"
  ]

  // 各文本对应音频映射
  const audioMap: Record<string, string> = {
    [messages[0]]: "/audio/message1.mp3",
    [messages[1]]: "/audio/message2.mp3",
    [messages[2]]: "/audio/message3.mp3",
    [messages[3]]: "/audio/message4.mp3",

    [prankMessages[0]]: "/audio/prank1.mp3",
    [prankMessages[1]]: "/audio/prank2.mp3",
    [prankMessages[2]]: "/audio/prank3.mp3",
    [prankMessages[3]]: "/audio/prank4.mp3",
    [prankMessages[4]]: "/audio/prank5.mp3",

    "我会永远爱你！": "/audio/accept.mp3",
  }

  /**
   * 封装“三步序列”：
   *   1) 启动音频（返回 void）
   *   2) 打字文本（字符串）
   *   3) 等待音频结束（返回 Promise<void>）
   */
  function playAndTypeSequence(
    audioKey: string,
    displayText: string = audioKey
  ): (string | number | (() => void | Promise<void>))[] {
    let audio: HTMLAudioElement

    return [
      () => {
        const path = audioMap[audioKey]
        audio = new Audio(path)
        audio.play().catch(console.error)
      },
      displayText,
      () => {
        return new Promise<void>((resolve) => {
          audio.onended = () => resolve()
        })
      },
    ]
  }

  /**
   * 点击「我愿意」时播放“我会永远爱你”音频，3秒后让Phase1淡出
   */
  const handleAccept = () => {
    setAccepted(true)
    const audio = new Audio(audioMap["我会永远爱你！"])
    audio.play().catch(console.error)

    // 3 秒后开始让 Phase1 渐隐
    setTimeout(() => {
      setFadeOutPhase1(true)
    }, 3000)
  }

  /**
   * Phase1 渐隐动画结束后，彻底隐藏 Phase1，显示 Phase2
   */
  const onPhase1FadeComplete = () => {
    if (fadeOutPhase1) {
      // 隐藏 Phase1
      setShowPhase1(false)
      // 重置
      setShowMessage(false)
      setAccepted(false)
      setShowConfetti(false)
      // 显示恶搞部分
      setShowPhase2(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 flex flex-col items-center justify-center p-4">
      {/* Phase1：表白阶段 */}
      {showPhase1 && (
        <motion.div
          // 如果 fadeOutPhase1 = true，就执行淡出动画
          animate={
            fadeOutPhase1
              ? { opacity: 0, y: -40 }
              : { opacity: 1, y: 0 }
          }
          transition={{ duration: 1.2 }}
          onAnimationComplete={onPhase1FadeComplete}
          className="w-full flex flex-col items-center"
        >
          {/* 顶部标题 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl md:text-8xl font-bold text-white mb-12 text-center -mt-20"
          >
            <div className="leading-relaxed">
              亲爱的 😘
              <br />
              情人节快乐！🎉💖
            </div>
          </motion.div>

          {/* 中间点击图标 */}
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white rounded-full p-8 shadow-2xl cursor-pointer hover:shadow-pink-500/50"
            onClick={() => {
              setShowConfetti(true)
              setShowMessage(true)
            }}
          >
            <Heart className="w-32 h-32 md:w-40 md:h-40 text-red-500 animate-pulse" />
          </motion.div>

          {/* 打字区域 */}
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12 text-center max-w-3xl mx-auto"
            >
              <TypeAnimation
                sequence={[
                  ...playAndTypeSequence(messages[0], messages[0] + " 💝💝💝"),
                  1000,
                  ...playAndTypeSequence(messages[1], messages[1] + " ✨"),
                  1000,
                  ...playAndTypeSequence(messages[2]),
                  1000,
                  ...playAndTypeSequence(messages[3], messages[3] + " 💑"),
                  1000,
                  // 打完最后一条后显示按钮
                  () => setShowAcceptButton(true),
                ]}
                wrapper="h2"
                speed={50}
                className="text-3xl md:text-5xl font-semibold text-white leading-relaxed"
                repeat={0}
              />

              {/* “我愿意”按钮 */}
              {!accepted && showMessage && showAcceptButton && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 space-x-4"
                >
                  <button
                    onClick={handleAccept}
                    className="bg-pink-500 hover:bg-pink-600 text-white text-2xl px-8 py-4 rounded-full shadow-lg transition-all duration-300"
                  >
                    我愿意 💖
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* 接受后显示的短文字 */}
          {accepted && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 text-4xl text-white font-bold"
            >
              我会永远爱你！ 💕
            </motion.div>
          )}

          {/* 五彩纸屑 */}
          {showConfetti && <Confetti />}
        </motion.div>
      )}

      {/* Phase2：恶搞阶段 */}
      {showPhase2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <TypeAnimation
            sequence={[
              ...playAndTypeSequence(prankMessages[0]),
              500,
              ...playAndTypeSequence(prankMessages[1]),
              1000,
              ...playAndTypeSequence(prankMessages[2], prankMessages[2] + "🤪"),
              1000,
              ...playAndTypeSequence(prankMessages[3], prankMessages[3] + " 😎"),
              1000,
              ...playAndTypeSequence(prankMessages[4], prankMessages[4] + " 🐶"),
              1000,
              // 全部结束后，再显示「再来一次」按钮
              () => setShowReplayButton(true),
            ]}
            wrapper="h2"
            speed={50}
            className="text-[4.5rem] md:text-[7.5rem] font-bold text-white leading-relaxed"
            repeat={0}
          />

          {showReplayButton && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8"
            >
              <button
                onClick={() => window.location.reload()}
                className="bg-white text-pink-500 hover:bg-pink-100 text-xl px-6 py-3 rounded-full shadow-lg transition-all duration-300"
              >
                再来一次 🔄
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      <footer className="absolute bottom-4 text-white text-xl">
        Made with 💝 for you
      </footer>
    </div>
  )
}
