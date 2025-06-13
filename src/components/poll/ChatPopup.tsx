import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePoll } from "@/context/PollContext";
import { MessageCircle, X, Send, User, GraduationCap } from "lucide-react";

interface ChatPopupProps {
  userType: "teacher" | "student";
  userName: string;
}

export function ChatPopup({ userType, userName }: ChatPopupProps) {
  const { state, sendChatMessage } = usePoll();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSeenMessageCount = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatMessages]);

  useEffect(() => {
    const chatMessages = state.chatMessages || [];
    if (!isOpen && chatMessages.length > lastSeenMessageCount.current) {
      setUnreadCount(chatMessages.length - lastSeenMessageCount.current);
    }
  }, [state.chatMessages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const chatMessages = state.chatMessages || [];
      lastSeenMessageCount.current = chatMessages.length;
      setUnreadCount(0);
    }
  }, [isOpen, state.chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendChatMessage(message.trim(), userType, userName);
      setMessage("");
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          className="relative w-14 h-14 rounded-full shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-96 shadow-2xl">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Chat
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {!state.chatMessages || state.chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm mt-8">
                    No messages yet. Start a conversation!
                  </div>
                ) : (
                  state.chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.senderType === userType
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg p-2 ${
                          msg.senderType === userType
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          {msg.senderType === "teacher" ? (
                            <GraduationCap className="h-3 w-3" />
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                          <span className="text-xs opacity-75">
                            {msg.senderName}
                          </span>
                        </div>
                        <p className="text-sm">{msg.message}</p>
                        <div className="text-xs opacity-75 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    maxLength={500}
                  />
                  <Button type="submit" size="icon" disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
