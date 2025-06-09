"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Post as PostType, Comment } from '../types';
import { likePost } from '../utils/store';
import CommentList from '../components/CommentList';
import { generateLocalComments } from '../utils/openai';

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

interface PostProps {
  post: PostType;
  onUpdate: () => void;
}

export default function Post({ post, onUpdate }: PostProps) {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [displayLikes, setDisplayLikes] = useState(post.likes);
  // Ensure all initial comments have valid usernames
  const [displayComments, setDisplayComments] = useState<Comment[]>(
    post.comments.map(comment => ({
      ...comment,
      username: comment.username || 'GlazeUser' + Math.floor(Math.random() * 1000)
    }))
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const targetLikes = useRef(Math.max(200, post.likes));
  const targetComments = useRef(Math.max(15, post.comments.length));
  const likeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const commentIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleLike = () => {
    likePost(post.id);
    setLiked(true);
    onUpdate();
  };
  
  const toggleComments = () => {
    setShowComments(!showComments);
  };
  
  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    
    // Simulate likes increasing over time
    likeIntervalRef.current = setInterval(() => {
      setDisplayLikes(prev => {
        if (prev >= targetLikes.current) {
          if (likeIntervalRef.current) {
            clearInterval(likeIntervalRef.current);
            likeIntervalRef.current = null;
          }
          return prev;
        }
        // Add 1-3 likes each time
        return prev + Math.floor(Math.random() * 3) + 1;
      });
    }, 1000); // Update every second
    
    // Simulate comments appearing over time
    const remainingComments = targetComments.current - displayComments.length;
    if (remainingComments > 0) {
      // Make sure we have valid comments with usernames
      const newComments = generateLocalComments(post.id, remainingComments).map(comment => ({
        ...comment,
        username: comment.username || 'GlazeUser' + Math.floor(Math.random() * 1000)
      }));
      
      let commentIndex = 0;
      
      commentIntervalRef.current = setInterval(() => {
        if (commentIndex >= newComments.length) {
          if (commentIntervalRef.current) {
            clearInterval(commentIntervalRef.current);
            commentIntervalRef.current = null;
          }
          return;
        }
        
        // Make sure we have a valid comment with all required fields
        const nextComment = newComments[commentIndex];
        if (!nextComment || typeof nextComment !== 'object') {
          commentIndex++;
          return;
        }
        
        // Add the comment to the display list with all required fields
        setDisplayComments(prev => [
          ...prev,
          {
            id: nextComment.id || `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            content: nextComment.content || 'Great post!',
            username: nextComment.username || `GlazeUser${Math.floor(Math.random() * 1000)}`,
            timestamp: nextComment.timestamp || new Date().toISOString(),
            likes: nextComment.likes || Math.floor(Math.random() * 15) + 1
          }
        ]);
        commentIndex++;
      }, 2000); // Add a new comment every 2 seconds
    }
  };
  
  useEffect(() => {
    // Start simulation when component mounts
    startSimulation();
    
    // Clean up intervals when component unmounts
    return () => {
      if (likeIntervalRef.current) clearInterval(likeIntervalRef.current);
      if (commentIntervalRef.current) clearInterval(commentIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tweet-card bg-white dark:bg-[var(--secondary)] border border-[var(--border)] rounded-xl p-4 mb-4 shadow-sm">
      <div className="flex items-start space-x-3">
        <div className="avatar w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm">
          <span className="font-bold">{post.username.charAt(0)}</span>
        </div>
        <div className="flex-grow">
          <div className="flex items-center">
            <span className="font-bold mr-2 text-[var(--text-primary)]">{post.username}</span>
            <span className="text-[var(--text-tertiary)] text-sm">
              · {formatDistanceToNow(new Date(post.timestamp))}
            </span>
          </div>
          <div className="mt-2 mb-3 text-[15px] leading-normal text-[var(--text-primary)]">
            {post.content}
          </div>
          <div className="flex items-center justify-start space-x-10 mt-3">
            <button 
              onClick={toggleComments}
              className="flex items-center space-x-1.5 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors group"
            >
              <div className="p-1.5 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-sm">{displayComments.length}</span>
            </button>
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-1.5 ${liked ? 'text-red-500' : 'text-[var(--text-secondary)] hover:text-red-500'} transition-colors group`}
            >
              <div className="p-1.5 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={liked ? 0 : 1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-sm">{displayLikes}</span>
            </button>
          </div>
        </div>
      </div>
      
      {showComments && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <CommentList comments={displayComments} postId={post.id} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}
