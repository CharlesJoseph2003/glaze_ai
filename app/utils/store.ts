"use client";

import { Post, Comment } from '../types';
import { generateAIComments } from './aiComments';
import { generateOpenAIComments } from './openai';

// In-memory store for posts
let posts: Post[] = [];

// Default username for the real user
const DEFAULT_USERNAME = 'RealUser';

// Flag to use OpenAI API instead of local generation
let useOpenAI = false;

// OpenAI API key storage
let openAIApiKey = '';

// If environment variable is provided, use it and enable OpenAI by default
if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  useOpenAI = true;
}

// Enable or disable OpenAI integration
export const setUseOpenAI = (enabled: boolean): void => {
  useOpenAI = enabled;
};

// Set the OpenAI API key
export const setOpenAIApiKey = (apiKey: string): void => {
  openAIApiKey = apiKey;
  // Store in localStorage for persistence across page reloads
  if (typeof window !== 'undefined') {
    localStorage.setItem('openai_api_key', apiKey);
  }
  // Update environment variable
  process.env.NEXT_PUBLIC_OPENAI_API_KEY = apiKey;
};

// Get the current OpenAI API key
export const getOpenAIApiKey = (): string => {
  return openAIApiKey;
};

// Check if OpenAI is enabled
export const isOpenAIEnabled = (): boolean => {
  return useOpenAI;
};

// Initialize OpenAI settings from localStorage
export const initializeOpenAISettings = (): void => {
  if (typeof window !== 'undefined') {
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      openAIApiKey = storedApiKey;
      process.env.NEXT_PUBLIC_OPENAI_API_KEY = storedApiKey;
      useOpenAI = true;
    }
  }
};

// Get all posts
export const getAllPosts = (): Post[] => {
  return [...posts].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Get a single post by ID
export const getPostById = (id: string): Post | undefined => {
  return posts.find(post => post.id === id);
};

// Create a new post
export const createPost = async (content: string): Promise<Post> => {
  // Generate a random number of likes (between 5 and 30)
  const randomLikes = Math.floor(Math.random() * 26) + 5;
  
  const newPost: Post = {
    id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    content,
    username: DEFAULT_USERNAME,
    timestamp: new Date().toISOString(),
    likes: randomLikes,
    comments: []
  };
  
  // Generate 3-7 AI comments for the new post
  const commentCount = Math.floor(Math.random() * 5) + 3;
  
  if (useOpenAI) {
    try {
      // Use OpenAI to generate comments
      newPost.comments = await generateOpenAIComments(newPost.id, content, commentCount);
    } catch (error) {
      console.error('Error generating OpenAI comments:', error);
      // Fall back to local generation if OpenAI fails
      newPost.comments = generateAIComments(newPost.id, commentCount);
    }
  } else {
    // Use local generation
    newPost.comments = generateAIComments(newPost.id, commentCount);
  }
  
  posts = [newPost, ...posts];
  return newPost;
};

// Add a like to a post
export const likePost = (id: string): Post | undefined => {
  const post = getPostById(id);
  if (post) {
    post.likes += 1;
  }
  return post;
};

// Add a comment to a post
export const addComment = (postId: string, comment: Comment): Post | undefined => {
  const post = getPostById(postId);
  if (post) {
    post.comments = [comment, ...post.comments];
  }
  return post;
};

// Like a comment
export const likeComment = (postId: string, commentId: string): Post | undefined => {
  const post = getPostById(postId);
  if (post) {
    const comment = post.comments.find(c => c.id === commentId);
    if (comment) {
      comment.likes += 1;
    }
  }
  return post;
};

// Delete a post
export const deletePost = (id: string): void => {
  posts = posts.filter(post => post.id !== id);
};

// Initialize the store
export const initializeStore = (): void => {
  // Don't add any sample posts, only show user-submitted posts
  // Just initialize any necessary settings
};

// Clear all posts (for testing)
export const clearAllPosts = (): void => {
  posts = [];
};
