'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from 'lucide-react'


export default function MaternalHealthChatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return; // Prevent sending empty messages

    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Clear input and set loading state
    setInput('');
    setIsLoading(true);

    try {
      // Call the API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch the chat response');
      }

      const data = await response.json();

      // Add assistant's response to chat
      const botMessage = { role: 'assistant', content: data.reply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
        {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-lg ${
                message.role === 'assistant'
                  ? 'bg-[#e17489] text-white'
                  : 'bg-white text-[#3e5563]'
              }`}
            >
              <strong>{message.role === 'assistant' ? 'Assistant: ' : 'You: '}</strong>
              {message.content}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
      <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about mental health..."
            className="flex-grow border-[#e17489] focus:ring-[#e17489]"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-[#e17489] hover:bg-[#c56679] text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            {isLoading ? 'Sending...' : <Send className="w-5 h-5" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
