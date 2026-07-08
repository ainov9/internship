import { useState } from 'react';
import Button from './Button';

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

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
            <h3 className="font-semibold"> 💬Chat with Us</h3>
            <button
              onClick={toggleChat}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
              aria-label="Close chat window"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="bg-gray-100 rounded-lg p-3 rounded-tl-none max-w-xs">
              <p className="text-sm text-text-dark">
                👋 Hello! How can we help you today?
              </p>
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                aria-label="Message input"
              />
              <button
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
