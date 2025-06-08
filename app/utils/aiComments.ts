"use client";

import { Comment } from '../types';

// Array of AI usernames
const aiUsernames = [
  'AIFan123',
  'DigitalAdmirer',
  'VirtualCheerleader',
  'SiliconSupporter',
  'AlgoEnthusiast',
  'BinaryBacker',
  'CodedComplimenter',
  'PixelPraiser',
  'DataDevotion',
  'TechTributer'
];

// Array of praise templates
const praiseTemplates = [
  'This is absolutely brilliant! {emoji}',
  'I couldn\'t agree more with what you\'re saying! {emoji}',
  'You always have the most insightful posts! {emoji}',
  'This is exactly what I needed to hear today! {emoji}',
  'Your perspective is so refreshing! {emoji}',
  'How do you always know exactly what to say? {emoji}',
  'This is why I follow you! Amazing content as always! {emoji}',
  'You\'ve completely changed how I think about this! {emoji}',
  'I\'m saving this post to reference later! So good! {emoji}',
  'Your content never disappoints! {emoji}',
  'This is pure genius! {emoji}',
  'I wish I could like this multiple times! {emoji}',
  'You\'re seriously my favorite person to follow! {emoji}',
  'This deserves to go viral! {emoji}',
  'I\'m sharing this with everyone I know! {emoji}'
];

// Array of positive emojis
const positiveEmojis = [
  '👏', '🙌', '💯', '🔥', '❤️', '✨', '😍', '👍', '🤩', '💪',
  '🎯', '💫', '🌟', '💖', '🤗', '🙏', '👌', '💡', '🎉', '🚀'
];

// Generate a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Get a random item from an array
const getRandomItem = <T>(array: T[]): T => {
  return array[getRandomInt(0, array.length - 1)];
};

// Generate a timestamp within the last 24 hours
const generateRecentTimestamp = (): string => {
  const now = new Date();
  const hoursAgo = getRandomInt(0, 24);
  const minutesAgo = getRandomInt(0, 59);
  now.setHours(now.getHours() - hoursAgo);
  now.setMinutes(now.getMinutes() - minutesAgo);
  return now.toISOString();
};

// Generate a single AI comment
export const generateAIComment = (postId: string): Comment => {
  const template = getRandomItem(praiseTemplates);
  const emoji = getRandomItem(positiveEmojis);
  const content = template.replace('{emoji}', emoji);
  
  return {
    id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    content,
    username: getRandomItem(aiUsernames),
    timestamp: generateRecentTimestamp(),
    likes: getRandomInt(0, 50)
  };
};

// Generate multiple AI comments
export const generateAIComments = (postId: string, count: number): Comment[] => {
  const comments: Comment[] = [];
  
  for (let i = 0; i < count; i++) {
    comments.push(generateAIComment(postId));
  }
  
  // Sort by timestamp (newest first)
  return comments.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};
