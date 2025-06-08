"use client";

import React, { useState, useEffect } from 'react';
import { getAllPosts, initializeStore, initializeOpenAISettings, clearAllPosts } from '../utils/store';
import Post from './Post';
import CreatePost from './CreatePost';
import Settings from './Settings';
import { Post as PostType } from '../types';

export default function Feed() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const loadPosts = () => {
    const fetchedPosts = getAllPosts();
    setPosts(fetchedPosts);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    // Clear any existing posts so we only see user-submitted ones
    clearAllPosts();
    // Initialize the store
    initializeStore();
    // Initialize OpenAI settings from localStorage
    initializeOpenAISettings();
    loadPosts();
  }, []);

  const handlePostCreated = () => {
    // Immediately load posts without delay since the CreatePost component
    // already waited for the async operation to complete
    loadPosts();
  };

  const handlePostUpdated = () => {
    loadPosts();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(loadPosts, 500); // Small delay for better UX
  };

  return (
    <div className="max-w-xl mx-auto py-4 px-4 sm:px-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">GlazeHub</h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowSettings(true)}
            className="text-[var(--primary)] hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors"
            title="AI Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button 
            onClick={handleRefresh} 
            className="text-[var(--primary)] hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-colors"
            disabled={refreshing}
            title="Refresh"
          >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        </div>
      </div>
      
      <CreatePost onPostCreated={handlePostCreated} />
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-10 border border-[var(--border)] rounded-xl bg-white dark:bg-[var(--secondary)] shadow-sm">
          <p className="text-[var(--text-secondary)] mb-4">No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <Post key={post.id} post={post} onUpdate={handlePostUpdated} />
          ))}
        </div>
      )}
      
      {/* Settings Modal */}
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
