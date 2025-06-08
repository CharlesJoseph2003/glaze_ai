"use client";

import React, { useState } from 'react';
import { Comment as CommentType } from '../types';
import { likeComment } from '../utils/store';

// Format a date to show how long ago it was (e.g., "5m", "2h")
function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d`;
}

interface CommentListProps {
  comments: CommentType[];
  postId: string;
  onUpdate: () => void;
}

export default function CommentList({ comments, postId, onUpdate }: CommentListProps) {
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});

  const handleLike = (commentId: string) => {
    likeComment(postId, commentId);
    setLikedComments(prev => ({ ...prev, [commentId]: true }));
    onUpdate();
  };
  
  // Make sure comments is an array to prevent mapping errors
  const safeComments = Array.isArray(comments) ? comments : [];

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg mb-3 text-[var(--text-primary)]">Comments</h3>
      {safeComments.map((comment) => {
        // Skip invalid comments
        if (!comment || typeof comment !== 'object') return null;
        
        // Ensure all required properties exist
        const safeComment = {
          id: comment.id || `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          content: comment.content || 'Great post!',
          username: comment.username || `GlazeUser${Math.floor(Math.random() * 1000)}`,
          timestamp: comment.timestamp || new Date().toISOString(),
          likes: comment.likes || Math.floor(Math.random() * 15) + 1
        };
        
        return (
        <div key={safeComment.id} className="flex items-start space-x-3 mb-4 last:mb-0">
          <div className="comment-avatar w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm">
            <span className="font-bold text-sm">{safeComment.username.charAt(0)}</span>
          </div>
          <div className="flex-grow">
            <div className="flex items-center">
              <span className="font-bold mr-2 text-[var(--text-primary)]">{safeComment.username}</span>
              <span className="text-[var(--text-tertiary)] text-xs">
                · {formatDistanceToNow(new Date(safeComment.timestamp))}
              </span>
            </div>
            <div className="mt-1 text-sm text-[var(--text-primary)]">
              {safeComment.content}
            </div>
            <div className="mt-2 flex items-center space-x-4">
              <button 
                onClick={() => handleLike(safeComment.id)}
                className={`flex items-center space-x-1 ${likedComments[safeComment.id] ? 'text-red-500' : 'text-[var(--text-secondary)] hover:text-red-500'} transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={likedComments[safeComment.id] ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={likedComments[safeComment.id] ? 0 : 1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-xs">{safeComment.likes}</span>
              </button>
            </div>
          </div>
        </div>
      )})}
      {safeComments.length === 0 && (
        <div className="text-center py-4 text-[var(--text-secondary)]">
          <p>No comments yet.</p>
        </div>
      )}
    </div>
  );
}
