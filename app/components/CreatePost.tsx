"use client";

import React, { useState } from 'react';
import { createPost } from '../utils/store';

interface CreatePostProps {
  onPostCreated: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create the post (now async with OpenAI)
      await createPost(content);
      
      // Reset form and state
      setContent('');
      
      // Notify parent component
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[var(--secondary)] border border-[var(--border)] rounded-xl p-4 mb-4 shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-3">
          <div className="avatar w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm">
            <span className="font-bold">R</span>
          </div>
          <div className="flex-grow">
            <textarea
              className="w-full border-0 focus:ring-0 text-lg placeholder-[var(--text-secondary)] tracking-wide min-h-[80px] bg-transparent resize-none focus:outline-none"
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={280}
            />
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-[var(--border)]">
              <div className="flex items-center">
                <div className="text-sm text-[var(--text-secondary)] font-medium">
                  {content.length}/280
                </div>
              </div>
              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="btn-primary font-bold py-2 px-6 rounded-full disabled:opacity-50 text-sm"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
