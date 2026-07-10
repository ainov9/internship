import { useRef, useState } from 'react';
import Button from './Button';

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [voicerecording, setVoiceRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { id: 'bot-1', from: 'bot', text: '👋 Hello! How can we help you today?' },
  ]);
  const messagesRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);

const handleInputChange = (e) => {
    setInput(e.target.value);
    
  }


  const toggleRecording = async () => {
    if (isRecording) {
      try { mediaRecorderRef.current?.stop(); } catch (e) { /* ignore */ }
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.addEventListener('dataavailable', (ev) => {
        if (ev.data && ev.data.size) recordedChunksRef.current.push(ev.data);
      });

      mr.addEventListener('stop', () => {
        const blob = new Blob(recordedChunksRef.current, { type: recordedChunksRef.current[0]?.type || 'audio/webm' });
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: blob.type });
        handleAudioFile(file);
        try { stream.getTracks().forEach((t) => t.stop()); } catch (e) { /* noop */ }
      });

      mr.start();
      setIsRecording(true);
    } catch (err) {
      try { fileInputRef.current?.click(); } catch (e) { /* noop */ }
      // eslint-disable-next-line no-alert
      alert('Microphone access denied or not available. You can upload an audio file instead.');
    }
  };

  const fileInputRef = useRef(null);

  const openChat = () => {
    setIsOpen(true);
    // load any stored audio blobs for messages
    loadStoredAudio();
  };
const toggleVoiceRecording = () => setVoiceRecording((prev) => !prev);

  const closeChat = () => setIsOpen(false);

  const toggleChat = () => {
    if (!isOpen) openChat(); else closeChat();
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    });
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const userMsg = { id: `user-${Date.now()}`, from: 'user', text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setIsTyping(true);
    scrollToBottom();

    // simulate bot typing indicator before reply
    setTimeout(() => {
      const typingMessage = { id: `typing-${Date.now()}`, from: 'bot', text: 'Typing...', isTyping: true };
      setMessages((m) => [...m, typingMessage]);
      scrollToBottom();

      setTimeout(() => {
        setMessages((m) => m.filter((msg) => !msg.isTyping));
        const botReply = { id: `bot-${Date.now()}`, from: 'bot', text: `You said: ${userMsg.text}` };
        setMessages((m) => [...m, botReply]);
        setIsTyping(false);
        scrollToBottom();
      }, 900);
    }, 200);
  };

  const handleAudioFile = async (file) => {
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    const base64 = arrayBufferToBase64(arrayBuffer);
    const id = `user-audio-${Date.now()}`;
    localStorage.setItem(`audio_${id}`, base64);
    const blob = new Blob([arrayBuffer], { type: file.type || 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const audioMsg = { id, from: 'user', text: file.name || 'Audio message', audioUrl: url };
    setMessages((m) => [...m, audioMsg]);
    scrollToBottom();
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) handleAudioFile(f);
    // reset value to allow re-uploading same file
    e.target.value = '';
  };

  const speakLastBotMessage = () => {
    const lastBot = [...messages].reverse().find((m) => m.from === 'bot');
    if (!lastBot) return;
    try {
      const utter = new SpeechSynthesisUtterance(lastBot.text.replace(/^[^\w\d]*/,'').replace(/\s{2,}/g,' '));
      utter.rate = 1;
      utter.pitch = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch (e) {
      // Speech API not available
      // noop
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return window.btoa(binary);
  };

  const base64ToBlob = (base64, mime = 'audio/wav') => {
    const binary = window.atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes.buffer], { type: mime });
  };

  const playMessageAudio = (msg) => {
    if (msg.audioUrl) {
      const audio = new Audio(msg.audioUrl);
      audio.play();
      return;
    }

    // fallback to SpeechSynthesis
    const utter = new SpeechSynthesisUtterance(msg.text.replace(/^[^\w\d]*/,'').replace(/\s{2,}/g,' '));
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const downloadMessageAudio = (msg) => {
    const stored = localStorage.getItem(`audio_${msg.id}`);
    if (!stored) return;
    const blob = base64ToBlob(stored);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${msg.id || 'message'}.wav`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const generateAndStoreAudio = async (msg) => {
    // Try to call backend TTS endpoint `/api/tts` which should return audio/wav
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msg.text }),
      });
      if (!res.ok) throw new Error('TTS endpoint not available');
      const arrayBuffer = await res.arrayBuffer();
      const base64 = arrayBufferToBase64(arrayBuffer);
      localStorage.setItem(`audio_${msg.id}`, base64);
      const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setMessages((cur) => cur.map((m) => (m.id === msg.id ? { ...m, audioUrl: url } : m)));
    } catch (err) {
      // fallback: store a request placeholder so admin can generate server-side later
      const pending = JSON.parse(localStorage.getItem('pending_audio_requests') || '[]');
      if (!pending.includes(msg.id)) {
        pending.push(msg.id);
        localStorage.setItem('pending_audio_requests', JSON.stringify(pending));
      }
      // and speak immediately
      playMessageAudio(msg);
    }
  };

  // load any stored audio for messages on open
  const loadStoredAudio = () => {
    const updated = messages.map((m) => {
      const stored = localStorage.getItem(`audio_${m.id}`);
      if (stored && !m.audioUrl) {
        const blob = base64ToBlob(stored);
        return { ...m, audioUrl: URL.createObjectURL(blob) };
      }
      return m;
    });
    setMessages(updated);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      <div className="rounded-full border border-gray-200 bg-white/90 px-3 py-2 text-sm font-medium text-text-dark shadow-md backdrop-blur">
        Need help?
      </div>

      <div className="relative">
      {/* Chat Window */}
      {isOpen && (
        <div
          className="absolute bottom-20 right-0 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col animate-slide-up"
          role="dialog"
          aria-label="Chat window"
          aria-modal="true"
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold flex items-center gap-2"> 💬Chat with Us</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={speakLastBotMessage}
                className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
                aria-label="Play last bot message"
                title="Play last bot message"
              >
                🔊
              </button>
              <button
                onClick={toggleChat}
                className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
                aria-label="Close chat window"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`${m.from === 'bot' ? 'rounded-lg p-3 rounded-tl-none max-w-xs' : 'bg-sky-50 rounded-lg p-3 ml-auto max-w-xs'} ${m.isTyping ? 'bg-slate-100/80 border border-dashed border-slate-300' : m.from === 'bot' ? 'bg-gray-100' : ''}`}
              >
                <div className="flex items-start gap-2">
                  <p className="text-sm text-text-dark">
                    {m.isTyping ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-sky-500" />
                        Typing...
                      </span>
                    ) : (
                      m.text
                    )}
                  </p>
                  {m.from === 'bot' && !m.isTyping && (
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => playMessageAudio(m)}
                        className="text-sm text-slate-600 hover:text-slate-800"
                        title="Play audio"
                        aria-label="Play audio"
                      >
                        🔊
                      </button>
                      <button
                        onClick={() => generateAndStoreAudio(m)}
                        className="text-sm text-slate-600 hover:text-slate-800 flex items-center justify-center"
                        title="Generate & store audio (requires /api/tts)"
                        aria-label="Generate audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M11 5v14l-5-4H4a1 1 0 01-1-1V10a1 1 0 011-1h2l5-4z" />
                          <path d="M16.5 8.5a4.5 4.5 0 010 7" stroke="currentColor" strokeWidth="1" fill="none" />
                          <circle cx="18.5" cy="5.5" r="2" />
                        </svg>
                      </button>
                      <button
                        onClick={() => downloadMessageAudio(m)}
                        className="text-sm text-slate-600 hover:text-slate-800"
                        title="Download stored audio"
                        aria-label="Download audio"
                      >
                        ⬇️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                aria-label="Message input"
              />
              <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={onFileChange} />
              <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            console.log("Selected file:", file);
          }
        }}
      />
              <button 
              onclick={() => fileInputRef.current?.click()}
                className="bg-slate-200 text-slate-800 px-3 py-2 rounded-lg hover:bg-slate-300 transition-colors"
                aria-label="Attach audio file"
                title="Attach audio file"

              >

                📎
              </button>
                <button
                onClick={toggleRecording}
                className={`bg-slate-200 text-slate-800 px-3 py-2 rounded-lg hover:bg-slate-300 transition-colors flex items-center justify-center ${isRecording ? 'bg-red-100' : ''}`}
                aria-label="Record or attach audio"
                title="Record or attach audio"
              >
                {isRecording ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <circle cx="12" cy="12" r="5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M9 2a1 1 0 00-1 1v6a1 1 0 102 0V3a1 1 0 00-1-1z" />
                    <path d="M5 10a5 5 0 0010 0h-1a4 4 0 01-8 0H5z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleSend}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                aria-label="Send message"
              >
                Send
              </button>
            </div>
            <button
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2"
              aria-label="Contact a human agent"
            >
              👤 Contact Human assistant
            </button>
          </div>
        </div>
      )}

      {/* Chat Bubble Button */}
      <Button
        isBubble
        variant="primary"
        onClick={toggleChat}
        className="animate-pulse-glow"
        ariaLabel="Open chat window"
      >
        💬
      </Button>
      </div>
    </div>
  );
}
