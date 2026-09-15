"use client";
import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPaperPlane,
  FaXmark,
  FaRotate,
  FaWandSparkles,
  FaUtensils,
  FaRobot,
  FaUser,
  FaExpand,
  FaCompress,
  FaCopy,
  FaCheck,
} from "react-icons/fa6";

// Cute Lottie Animation Data for AI Robot
const robotLottieAnimation = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "AI Robot",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Robot Head",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [{ t: 0, s: [0] }, { t: 30, s: [5] }, { t: 60, s: [0] }] },
        p: { a: 1, k: [{ t: 0, s: [50, 50, 0] }, { t: 30, s: [50, 45, 0] }, { t: 60, s: [50, 50, 0] }] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [60, 60] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.96, 0.45, 0.08, 1] }
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 }
            }
          ]
        },
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [14, 14] },
              p: { a: 0, k: [-15, -5] }
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 1, 1, 1] }
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 }
            }
          ]
        },
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [14, 14] },
              p: { a: 0, k: [15, -5] }
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 1, 1, 1] }
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 }
            }
          ]
        }
      ]
    }
  ]
};

const suggestedPrompts = [
  "What is RecipeHub & how does it work?",
  "Tell me about RecipeHub Premium access",
  "Give me a quick 10-minute dinner recipe",
  "What are the best vegan substitutes for eggs?",
];

export default function AIChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [lottieLoaded, setLottieLoaded] = useState(false);
  const [LottieComponent, setLottieComponent] = useState(null);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "👋 Hi there! I'm Chef RecipeHub AI. Ask me anything about recipes, cooking tips, ingredients, or platform membership!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  const handleCopyMessage = (text, idx) => {
    if (!text) return;
    const cleanText = text.trim();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cleanText).then(() => {
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
      }).catch((err) => {
        console.error("Clipboard copy failed:", err);
      });
    } else {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = cleanText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
      } catch (e) {
        console.error("Fallback copy failed:", e);
      }
    }
  };

  // Auto-reset chatbot window when navbar route changes
  useEffect(() => {
    setIsOpen(false);
    setIsMaximized(false);
  }, [pathname]);

  useEffect(() => {
    // Safely load lottie-react dynamically on the client side with graceful fallback
    import("lottie-react")
      .then((mod) => {
        const Component = mod.default || mod.Lottie;
        if (Component) {
          setLottieComponent(() => Component);
          setLottieLoaded(true);
        }
      })
      .catch((err) => {
        console.warn("Lottie React load warning (using icon fallback):", err.message);
        setLottieLoaded(false);
      });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query || !query.trim() || isLoading) return;

    const userMsg = {
      role: "user",
      text: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch(`${SERVER_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query.trim(),
          history: historyPayload,
        }),
      });

      const data = await res.json();

      if (data.success && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "Sorry, I encountered an issue generating a response. Please try asking again!",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (err) {
      console.error("AI Chatbot Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I'm having trouble connecting to the RecipeHub AI server. Please check your network connection!",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChatHistory = () => {
    setMessages([
      {
        role: "assistant",
        text: "👋 Chat history cleared! What culinary questions do you have for me?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`mb-4 bg-base-100/95 dark:bg-base-900/95 backdrop-blur-2xl rounded-3xl border border-base-300 dark:border-base-700 shadow-2xl flex flex-col overflow-hidden text-base-content transition-all duration-300 ${
              isMaximized
                ? "fixed top-20 sm:top-24 bottom-4 left-3 right-3 sm:left-6 sm:right-6 md:left-10 md:right-10 z-40 max-w-6xl mx-auto w-auto h-auto"
                : "w-[90vw] sm:w-[380px] h-[520px]"
            }`}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary via-accent to-secondary text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
                  <FaUtensils className="text-lg" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                    Chef RecipeHub AI
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </h3>
                  <p className="text-[11px] opacity-85 font-medium">Your personal smart cooking & recipe guide</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  title={isMaximized ? "Restore / Minimize" : "Maximize / Fullscreen"}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white text-xs cursor-pointer"
                >
                  {isMaximized ? <FaCompress /> : <FaExpand />}
                </button>
                <button
                  onClick={clearChatHistory}
                  title="Clear Conversation"
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white text-xs cursor-pointer"
                >
                  <FaRotate />
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsMaximized(false);
                  }}
                  title="Close Chatbot"
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white cursor-pointer"
                >
                  <FaXmark className="text-base" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm font-medium">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 items-end ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-white text-xs shadow-xs ${
                      msg.role === "user"
                        ? "bg-primary"
                        : "bg-gradient-to-br from-amber-500 to-orange-600"
                    }`}
                  >
                    {msg.role === "user" ? <FaUser /> : <FaRobot />}
                  </div>

                  <div
                    className={`group relative max-w-[85%] sm:max-w-[78%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-xs ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-base-200 dark:bg-base-800 text-base-content rounded-bl-none border border-base-300/60 dark:border-base-700/60"
                    }`}
                  >
                    <p>{msg.text}</p>

                    <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-black/5 dark:border-white/10">
                      <button
                        onClick={() => handleCopyMessage(msg.text, idx)}
                        title={copiedIdx === idx ? "Copied to clipboard!" : "Copy message"}
                        className={`text-[11px] font-medium flex items-center gap-1 transition-all duration-200 cursor-pointer px-1.5 py-0.5 rounded-md ${
                          msg.role === "user"
                            ? "text-white/80 hover:text-white hover:bg-white/15 active:scale-95"
                            : "text-base-content/60 hover:text-primary hover:bg-base-300/60 dark:hover:bg-base-700/60 active:scale-95"
                        }`}
                      >
                        {copiedIdx === idx ? (
                          <>
                            <FaCheck className="text-emerald-400 text-[11px] animate-pulse" />
                            <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <FaCopy className="text-[10px]" />
                            <span className="text-[10px] opacity-90 font-medium">Copy</span>
                          </>
                        )}
                      </button>

                      <span
                        className={`text-[10px] opacity-60 ${
                          msg.role === "user" ? "text-white/80" : "text-base-content/60"
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 items-end">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs shrink-0 shadow-xs">
                    <FaRobot />
                  </div>
                  <div className="p-3.5 bg-base-200 dark:bg-base-800 rounded-2xl rounded-bl-none border border-base-300/50 dark:border-base-700/50 flex items-center gap-1.5 text-base-content/70">
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-xs ml-1 font-bold">Chef is cooking an answer...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Quick Prompts */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-4 pb-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 mb-1.5 flex items-center gap-1">
                  <FaWandSparkles className="text-amber-500 text-[10px]" />
                  Suggested Questions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedPrompts.map((promptText, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleSendMessage(promptText)}
                      className="text-[11px] px-2.5 py-1.5 rounded-xl bg-base-200/80 dark:bg-base-800/80 hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-white dark:hover:from-primary dark:hover:to-accent border border-base-300/60 dark:border-base-700/60 transition-all duration-200 font-medium cursor-pointer flex items-center gap-1.5 shadow-xs hover:scale-[1.02] active:scale-95"
                    >
                      <span>{promptText}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-base-200/50 dark:bg-base-800/50 border-t border-base-300 dark:border-base-700 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Chef AI anything..."
                disabled={isLoading}
                className="flex-1 bg-base-100 dark:bg-base-900 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border border-base-300 dark:border-base-700 outline-none focus:border-primary transition-all text-base-content"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="w-10 h-10 rounded-2xl bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shrink-0"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Robot Trigger Widget */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Chatbot"
        className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-primary via-accent to-secondary p-1 shadow-2xl hover:shadow-primary/50 flex items-center justify-center cursor-pointer transition-all duration-300 z-50 pointer-events-auto"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-primary text-white flex items-center justify-center overflow-hidden border-2 border-white/30 shadow-inner relative">
          <FaRobot className="text-2xl sm:text-3xl text-white drop-shadow-md transition-transform group-hover:scale-110" />
          <FaWandSparkles className="text-xs text-amber-200 absolute top-2 right-2.5 animate-pulse" />
        </div>

        {/* Glowing Badge Pulse */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white dark:border-base-900"></span>
        </span>

        {/* Hover Tooltip */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 flex items-center gap-1.5 border border-white/10">
          <FaWandSparkles className="text-amber-400" />
          <span>Ask Chef AI</span>
        </div>
      </motion.button>
    </div>
  );
}
