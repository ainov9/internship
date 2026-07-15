import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ============================================================
   Animated typing dots – three pulsing dots in sequence
   ============================================================ */
function TypingDots() {
  return (
    <span className="inline-flex items-center gap-[3px] px-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[7px] h-[7px] rounded-full bg-primary/45"
          animate={{ y: [0, -5, 0], opacity: [0.35, 1, 0.35] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </span>
  );
}

/* ============================================================
   Consistent icon components (rounded stroke‑based SVGs)
   ============================================================ */
var iconClass =
  'w-[18px] h-[18px] stroke-current stroke-2 fill-none stroke-linecap-round stroke-linejoin-round';

function IconSpeaker(active) {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d={active ? 'M19.07 4.93a10 10 0 0 1 0 14.14' : 'M16 8.5a5 5 0 0 1 0 7'} />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" />
    </svg>
  );
}

function IconPaperclip() {
  return (
    <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round" aria-hidden="true">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function IconMic(isRecording) {
  if (isRecording) {
    return (
      <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] fill-red-500" aria-hidden="true">
        <circle cx="12" cy="12" r="6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round" aria-hidden="true">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

/* ============================================================
   Icon button wrapper – circular hover bg, unified style
   ============================================================ */
function IconBtn(props) {
  var onClick = props.onClick;
  var label = props.label;
  var title = props.title;
  var children = props.children;
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={title || label}
      className="flex items-center justify-center w-[34px] h-[34px] rounded-full text-slate-400 transition-all duration-200 ease-out hover:bg-primary/10 hover:text-primary active:scale-90"
    >
      {children}
    </button>
  );
}

/* ============================================================
   Main ChatBubble component
   ============================================================ */
export default function ChatBubble() {
  var _useState = useState(false);
  var isOpen = _useState[0];
  var setIsOpen = _useState[1];
  var _useState2 = useState('');
  var input = _useState2[0];
  var setInput = _useState2[1];
  var _useState3 = useState(false);
  var voicerecording = _useState3[0];
  var setVoiceRecording = _useState3[1];
  var _useState4 = useState(false);
  var isTyping = _useState4[0];
  var setIsTyping = _useState4[1];
  var _useState5 = useState(false);
  var showTyping = _useState5[0];
  var setShowTyping = _useState5[1];
  var _useState6 = useState([
    { id: 'bot-1', from: 'bot', text: '\u{1F44B} Hello! How can we help you today?', seenAt: null },
  ]);
  var messages = _useState6[0];
  var setMessages = _useState6[1];
  var _useState7 = useState({});
  var seenLabels = _useState7[0];
  var setSeenLabels = _useState7[1];
  var messagesRef = useRef(null);
  var mediaRecorderRef = useRef(null);
  var recordedChunksRef = useRef([]);
  var _useState8 = useState(false);
  var isRecording = _useState8[0];
  var setIsRecording = _useState8[1];
  var fileInputRef = useRef(null);

  /* ── Tooltip delayed visibility ── */
  var _useState9 = useState(false);
  var showTooltip = _useState9[0];
  var setShowTooltip = _useState9[1];

  useEffect(function () {
    var t = setTimeout(function () { setShowTooltip(true); }, 3000);
    return function () { clearTimeout(t); };
  }, []);

  /* ---------- helpers ---------- */
  var scrollToBottom = useCallback(function () {
    requestAnimationFrame(function () {
      if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    });
  }, []);

  var arrayBufferToBase64 = function (buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    for (var i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return window.btoa(binary);
  };

  var base64ToBlob = function (base64, mime) {
    if (mime === void 0) { mime = 'audio/wav'; }
    var binary = window.atob(base64);
    var len = binary.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes.buffer], { type: mime });
  };

  /* ---------- seen / timestamp ---------- */
  var updateSeenLabel = useCallback(function (msgId, date) {
    var tick = function () {
      var diff = Date.now() - date.getTime();
      var mins = Math.floor(diff / 60000);
      if (mins < 1) return 'Seen just now';
      if (mins < 60) return 'Seen \u00B7 ' + mins + 'm ago';
      var hrs = Math.floor(mins / 60);
      if (hrs < 24) return 'Seen \u00B7 ' + hrs + 'h ago';
      return 'Seen \u00B7 ' + Math.floor(hrs / 24) + 'd ago';
    };
    setSeenLabels(function (prev) {
      var copy = {};
      for (var k in prev) copy[k] = prev[k];
      copy[msgId] = tick();
      return copy;
    });
    var interval = setInterval(function () {
      setSeenLabels(function (prev) {
        var copy = {};
        for (var k in prev) copy[k] = prev[k];
        copy[msgId] = tick();
        return copy;
      });
    }, 60000);
    return function () { clearInterval(interval); };
  }, []);

  /* ---------- send message ---------- */
  var handleSend = useCallback(function () {
    if (!input.trim() || isTyping) return;
    var userMsg = { id: 'user-' + Date.now(), from: 'user', text: input.trim() };
    setMessages(function (m) { return m.concat([userMsg]); });
    setInput('');
    setIsTyping(true);
    setShowTyping(true);
    scrollToBottom();

    setTimeout(function () {
      scrollToBottom();
    }, 100);

    setTimeout(function () {
      setShowTyping(false);
      var replyDate = new Date();
      var botMsg = {
        id: 'bot-' + Date.now(),
        from: 'bot',
        text: 'You said: ' + userMsg.text,
        seenAt: null,
      };
      setMessages(function (m) { return m.concat([botMsg]); });
      setIsTyping(false);
      scrollToBottom();
      setTimeout(function () {
        setMessages(function (m) {
          return m.map(function (msg) {
            if (msg.id === userMsg.id) return { id: msg.id, from: msg.from, text: msg.text, audioUrl: msg.audioUrl, isTyping: msg.isTyping, seenAt: 'seen' };
            return msg;
          });
        });
        updateSeenLabel(userMsg.id, replyDate);
      }, 800);
    }, 1400);
  }, [input, isTyping, scrollToBottom, updateSeenLabel]);

  var handleInputChange = function (e) { setInput(e.target.value); };

  var toggleRecording = async function () {
    if (isRecording) {
      try { if (mediaRecorderRef.current) mediaRecorderRef.current.stop(); } catch (_e) { }
      setIsRecording(false);
      return;
    }
    try {
      var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunksRef.current = [];
      var mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.addEventListener('dataavailable', function (ev) {
        if (ev.data && ev.data.size) recordedChunksRef.current.push(ev.data);
      });
      mr.addEventListener('stop', function () {
        var blob = new Blob(recordedChunksRef.current, {
          type: (recordedChunksRef.current[0] && recordedChunksRef.current[0].type) || 'audio/webm',
        });
        var file = new File([blob], 'recording-' + Date.now() + '.webm', { type: blob.type });
        handleAudioFile(file);
        try { stream.getTracks().forEach(function (t) { t.stop(); }); } catch (_e2) { }
      });
      mr.start();
      setIsRecording(true);
    } catch (_e3) {
      try { if (fileInputRef.current) fileInputRef.current.click(); } catch (_e4) { }
      alert('Microphone access denied or not available. You can upload an audio file instead.');
    }
  };

  var toggleVoiceRecording = function () { setVoiceRecording(function (p) { return !p; }); };

  var handleAudioFile = async function (file) {
    if (!file) return;
    var arrayBuffer = await file.arrayBuffer();
    var base64 = arrayBufferToBase64(arrayBuffer);
    var id = 'user-audio-' + Date.now();
    localStorage.setItem('audio_' + id, base64);
    var blob = new Blob([arrayBuffer], { type: file.type || 'audio/wav' });
    var url = URL.createObjectURL(blob);
    var audioMsg = { id: id, from: 'user', text: file.name || 'Audio message', audioUrl: url };
    setMessages(function (m) { return m.concat([audioMsg]); });
    scrollToBottom();
  };

  var onFileChange = function (e) {
    var f = e.target.files ? e.target.files[0] : null;
    if (f) handleAudioFile(f);
    e.target.value = '';
  };

  var speakLastBotMessage = function () {
    var lastBot = null;
    for (var i = messages.length - 1; i >= 0; i--) {
      if (messages[i].from === 'bot') { lastBot = messages[i]; break; }
    }
    if (!lastBot) return;
    try {
      var utter = new SpeechSynthesisUtterance(lastBot.text.replace(/^[^\w\d]*/, '').replace(/\s{2,}/g, ' '));
      utter.rate = 1;
      utter.pitch = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch (_e5) { }
  };

  var playMessageAudio = function (msg) {
    if (msg.audioUrl) { new Audio(msg.audioUrl).play(); return; }
    var utter = new SpeechSynthesisUtterance(msg.text.replace(/^[^\w\d]*/, '').replace(/\s{2,}/g, ' '));
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  var downloadMessageAudio = function (msg) {
    var stored = localStorage.getItem('audio_' + msg.id);
    if (!stored) return;
    var blob = base64ToBlob(stored);
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (msg.id || 'message') + '.wav';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  var generateAndStoreAudio = async function (msg) {
    try {
      var res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msg.text }),
      });
      if (!res.ok) throw new Error('TTS endpoint not available');
      var arrayBuffer = await res.arrayBuffer();
      var base64 = arrayBufferToBase64(arrayBuffer);
      localStorage.setItem('audio_' + msg.id, base64);
      var blob = new Blob([arrayBuffer], { type: 'audio/wav' });
      var url = URL.createObjectURL(blob);
      setMessages(function (cur) {
        return cur.map(function (m) {
          if (m.id === msg.id) return { id: m.id, from: m.from, text: m.text, audioUrl: url, isTyping: m.isTyping, seenAt: m.seenAt };
          return m;
        });
      });
    } catch (_e6) {
      var pending = JSON.parse(localStorage.getItem('pending_audio_requests') || '[]');
      if (pending.indexOf(msg.id) === -1) {
        pending.push(msg.id);
        localStorage.setItem('pending_audio_requests', JSON.stringify(pending));
      }
      playMessageAudio(msg);
    }
  };

  var loadStoredAudio = useCallback(function () {
    setMessages(function (prev) {
      return prev.map(function (m) {
        var stored = localStorage.getItem('audio_' + m.id);
        if (stored && !m.audioUrl) {
          var blob = base64ToBlob(stored);
          return { id: m.id, from: m.from, text: m.text, audioUrl: URL.createObjectURL(blob), isTyping: m.isTyping, seenAt: m.seenAt };
        }
        return m;
      });
    });
  }, []);

  var openChat = function () { setIsOpen(true); loadStoredAudio(); };
  var closeChat = function () { setIsOpen(false); };
  var toggleChat = function () { return isOpen ? closeChat() : openChat(); };

  var messageVariants = {
    initial: { opacity: 0, y: 16, scale: 0.94, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -8, scale: 0.94, filter: 'blur(4px)' },
  };

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* ── Floating label / tooltip ── */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            key="tooltip"
            initial={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 8, scale: 0.95, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="glass-strong rounded-full px-4 py-2 text-sm font-medium text-text-dark shadow-glass animate-tooltip-bounce"
          >
            Need help?
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {/* ── Chat Window ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="chat-window"
              initial={{ opacity: 0, y: 20, scale: 0.92, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 20, scale: 0.92, filter: 'blur(8px)' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-20 right-0 w-[380px] h-[520px] bg-white/95 backdrop-blur-xl rounded-[22px] shadow-glass-lg flex flex-col overflow-hidden border border-white/40"
              role="dialog"
              aria-label="Chat window"
              aria-modal="true"
            >
              <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 text-white px-5 py-4 rounded-t-[22px] shadow-[0_4px_24px_rgba(139,92,246,0.35)] flex justify-between items-center shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
                <h3 className="font-semibold text-[15px] flex items-center gap-2 tracking-tight relative z-10">
                  <span className="text-lg">💬</span> Chat with Us
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={speakLastBotMessage}
                    className="flex items-center justify-center w-[34px] h-[34px] rounded-full text-white/80 transition-all duration-200 ease-out hover:bg-white/15 hover:text-white active:scale-90"
                    aria-label="Play last bot message"
                    title="Play last bot message"
                  >
                    <IconSpeaker active={true} />
                  </button>
                  <button
                    onClick={closeChat}
                    className="flex items-center justify-center w-[34px] h-[34px] rounded-full text-white/80 transition-all duration-200 ease-out hover:bg-white/15 hover:text-white active:scale-90"
                    aria-label="Close chat window"
                  >
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-none stroke-current stroke-2 stroke-linecap-round" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              <div
                ref={messagesRef}
                className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scroll-smooth"
                style={{ scrollBehavior: 'smooth' }}
              >
                <AnimatePresence initial={false}>
                  {messages.map(function (m) {
                    return (
                      <motion.div
                        key={m.id}
                        variants={messageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className={'flex ' + (m.from === 'user' ? 'justify-end' : 'justify-start')}
                      >
                        <div
                          className={
                            'max-w-[85%] transition-all duration-300 ease-smooth ' +
                            (m.from === 'user'
                              ? 'bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 text-white rounded-[18px] rounded-tr-[4px] px-4 py-2.5 shadow-[0_4px_16px_rgba(139,92,246,0.25)]'
                              : 'bg-[#F5F5F7] text-gray-800 rounded-[18px] rounded-tl-[4px] px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)]')
                          }
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {m.text}
                          </p>
                          {m.from === 'bot' && !m.isTyping && (
                            <div className="flex items-center justify-end gap-0.5 mt-2 -mr-1">
                              <IconBtn onClick={function () { playMessageAudio(m); }} label="Play audio" title="Play audio">
                                <IconSpeaker active={false} />
                              </IconBtn>
                              <IconBtn onClick={function () { generateAndStoreAudio(m); }} label="Generate audio" title="Generate & store audio">
                                <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
                                  <path d="M11 5v14l-5-4H4a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h2l5-4z" />
                                  <path d="M16.5 8.5a4.5 4.5 0 0 1 0 7" stroke="currentColor" strokeWidth="2" fill="none" />
                                  <circle cx="18.5" cy="5.5" r="2" />
                                </svg>
                              </IconBtn>
                              <IconBtn onClick={function () { downloadMessageAudio(m); }} label="Download audio" title="Download stored audio">
                                <IconDownload />
                              </IconBtn>
                            </div>
                          )}
                          {m.from === 'user' && m.audioUrl && (
                            <div className="flex items-center justify-end gap-0.5 mt-2 -mr-1">
                              <IconBtn onClick={function () { playMessageAudio(m); }} label="Play audio" title="Play audio">
                                <IconSpeaker active={false} />
                              </IconBtn>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                <AnimatePresence>
                  {showTyping && (
                    <motion.div
                      key="typing-indicator"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-start"
                    >
                      <div className="bg-[#F5F5F7] rounded-[16px] rounded-tl-[4px] px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                        <TypingDots />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {messages.map(function (m) {
                  if (m.from !== 'user' || !m.seenAt) return null;
                  return (
                    <motion.div
                      key={'seen-' + m.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="text-right -mt-2 pr-1"
                    >
                      <span className="text-[11px] text-gray-400 font-medium">
                        {seenLabels[m.id] || 'Seen just now'}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 px-4 pt-3 pb-4 bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-[#F0F0F3]/80 rounded-2xl border border-gray-200/50 px-4 py-1.5 transition-all duration-300 ease-smooth focus-within:border-primary/40 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(170,59,255,0.08)]">
                    <input
                      type="text"
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={function (e) { if (e.key === 'Enter') handleSend(); }}
                      placeholder="Type your message..."
                      className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none py-1.5"
                      aria-label="Message input"
                    />
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={onFileChange}
                  />

                  <button
                    onClick={function () { if (fileInputRef.current) fileInputRef.current.click(); }}
                    className="flex items-center justify-center w-[42px] h-[42px] rounded-2xl bg-[#F0F0F3]/80 text-slate-500 transition-all duration-300 ease-smooth hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95 shrink-0"
                    aria-label="Attach audio file"
                    title="Attach audio file"
                  >
                    <IconPaperclip />
                  </button>

                  <button
                    onClick={toggleRecording}
                    className={
                      'flex items-center justify-center w-[42px] h-[42px] rounded-2xl transition-all duration-300 ease-smooth active:scale-95 shrink-0 ' +
                      (isRecording
                        ? 'bg-red-50 text-red-500 hover:bg-red-100 animate-pulse shadow-[0_0_16px_rgba(239,68,68,0.2)]'
                        : 'bg-[#F0F0F3]/80 text-slate-500 hover:bg-primary/10 hover:text-primary hover:scale-105')
                    }
                    aria-label={isRecording ? 'Stop recording' : 'Record voice'}
                    title={isRecording ? 'Stop recording' : 'Record voice'}
                  >
                    <IconMic isRecording={isRecording} />
                  </button>

                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="flex items-center justify-center w-[42px] h-[42px] rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 text-white shadow-[0_4px_16px_rgba(139,92,246,0.3)] transition-all duration-300 ease-smooth hover:shadow-glow hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none disabled:hover:scale-100 shrink-0"
                    aria-label="Send message"
                  >
                    <IconSend />
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100/50">
                  <button
                    className="w-full bg-[#2E2E38] text-white text-sm font-medium px-4 py-2.5 rounded-2xl transition-all duration-300 ease-smooth hover:bg-[#3a3a45] hover:shadow-glass active:scale-[0.98] flex items-center justify-center gap-2 group"
                    aria-label="Contact a human agent"
                  >
                    <span className="text-base group-hover:scale-110 transition-transform duration-300">👤</span> Contact Human assistant
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Floating bubble button with pulse ring ── */}
        <div className="relative flex items-center justify-center">
          {/* Pulse ring behind the button */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full animate-pulse-ring" />
          )}
          <motion.button
            onClick={toggleChat}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            animate={!isOpen ? { y: [0, -6, 0] } : {}}
            transition={!isOpen ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : { type: 'spring', stiffness: 400, damping: 25 }}
            className="relative rounded-full w-[72px] h-[72px] md:w-[80px] md:h-[80px] flex items-center justify-center bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 text-white text-2xl shadow-glass-lg hover:shadow-glow-lg transition-shadow duration-300"
            aria-label={isOpen ? 'Close chat window' : 'Open chat window'}
          >
            {isOpen ? (
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-current stroke-2 stroke-linecap-round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <span>💬</span>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
