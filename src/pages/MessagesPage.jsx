import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileAvatar from '../components/common/ProfileAvatar';
import SearchBar from '../components/common/SearchBar';
import { useMessages } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext';
import {
  Send,
  ArrowLeft,
  Info,
  ExternalLink,
  MessageSquare,
  Smile,
  Paperclip,
  CheckCheck,
} from 'lucide-react';

export default function MessagesPage() {
  const { conversations, activeConversationId, setActiveConversationId, sendMessage, markConversationAsRead } =
    useMessages();
  const { currentUser } = useAuth();

  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileChatView, setMobileChatView] = useState(false);
  const messagesEndRef = useRef(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];

  useEffect(() => {
    if (activeConv?.id) {
      markConversationAsRead(activeConv.id);
    }
  }, [activeConv?.id, markConversationAsRead]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.participantName.toLowerCase().includes(q) ||
      c.participantCollege.toLowerCase().includes(q) ||
      c.exchangeTopic.toLowerCase().includes(q)
    );
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConv) return;

    sendMessage(activeConv.id, messageInput, currentUser);
    setMessageInput('');
  };

  const handleSelectConv = (id) => {
    setActiveConversationId(id);
    setMobileChatView(true);
  };

  return (
    <div className="space-y-4 pb-8 h-[calc(100vh-8.5rem)] flex flex-col">
      {/* Demo Notice Banner */}
      <div className="p-2.5 bg-indigo-50/80 border border-indigo-100 rounded-xl flex items-center justify-between text-xs text-indigo-900">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span>
            <strong>Interactive Messaging Demo:</strong> Messages sent update immediately in local state
            and receive simulated partner responses.
          </span>
        </div>
        <span className="hidden sm:inline font-semibold text-[11px] bg-white px-2 py-0.5 rounded border border-indigo-200">
          Demo State
        </span>
      </div>

      {/* Two-Panel Messenger Container */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex min-h-0">
        {/* Left Panel: Conversation List */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col flex-shrink-0 ${
            mobileChatView ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header & Search */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <h2 className="text-base font-black text-slate-900">Conversations</h2>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search chats by name or topic..."
            />
          </div>

          {/* Conversations Scroll */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No conversations match your search.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = conv.id === activeConv?.id;
                const lastMsg = conv.messages[conv.messages.length - 1];

                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConv(conv.id)}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                      isActive ? 'bg-indigo-50/70' : 'hover:bg-slate-50'
                    }`}
                  >
                    <ProfileAvatar
                      src={conv.participantAvatar}
                      name={conv.participantName}
                      size="md"
                      isOnline={conv.isOnline}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {conv.participantName}
                        </h4>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">
                          {lastMsg?.timestamp || ''}
                        </span>
                      </div>
                      <p className="text-[11px] text-indigo-600 font-medium truncate">
                        {conv.exchangeTopic}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {lastMsg ? (
                          <>
                            {lastMsg.senderId === currentUser?.id ? 'You: ' : ''}
                            {lastMsg.text}
                          </>
                        ) : (
                          'No messages yet'
                        )}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 self-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Active Chat Area */}
        {activeConv ? (
          <div
            className={`flex-1 flex flex-col min-w-0 ${
              !mobileChatView ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileChatView(false)}
                  className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <ProfileAvatar
                  src={activeConv.participantAvatar}
                  name={activeConv.participantName}
                  size="md"
                  isOnline={activeConv.isOnline}
                />
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    {activeConv.participantName}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {activeConv.participantCollege} •{' '}
                    <span className="text-emerald-600 font-medium">
                      {activeConv.lastSeen || 'Active now'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                  {activeConv.exchangeTopic}
                </span>
                <Link
                  to={`/students/${activeConv.participantId}`}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
                  title="View Profile"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Chat Messages History */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
              <div className="text-center my-2">
                <span className="text-[10px] font-semibold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-2xs">
                  Exchange partner connected • Mentoring Session
                </span>
              </div>

              {activeConv.messages.map((msg) => {
                const isMe = msg.senderId === currentUser?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-md rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-100 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-slate-400">
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-indigo-500" />}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Message ${activeConv.participantName.split(' ')[0]}...`}
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-slate-400">
            Select a conversation on the left to start messaging.
          </div>
        )}
      </div>
    </div>
  );
}
