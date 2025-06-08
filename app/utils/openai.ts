"use client";

import { Comment } from '../types';
import OpenAI from "openai";

// Function to generate AI comments using OpenAI API
export async function generateOpenAIComments(
  postId: string, 
  postContent: string, 
  count: number = 3
): Promise<Comment[]> {
  // Get API key from environment or localStorage
  // IMPORTANT: Never hardcode API keys in your code
  const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || 
    (typeof window !== 'undefined' ? localStorage.getItem('openai_api_key') || '' : '');
  
  // If no API key is provided, fall back to the local generation
  if (!OPENAI_API_KEY) {
    console.warn('No OpenAI API key provided. Using local generation instead.');
    return generateLocalComments(postId, count);
  }

  try {
    // Initialize OpenAI client
    const client = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // Allow usage in browser environment
    });

    const prompt = `
      Generate ${count} extremely unhinged praise comments for this social media post: 
      "${postContent}"
      
      Each comment should:
      1. Give absolute praise, make it intense
      2. Include some specific praise about the content
      3. Sound natural and conversational
      4. Be between 5-15 words
      5. Occasionally include an emoji
      6. Don't be too positive, be extreme and intense
      
      Format as a JSON array of objects with 'username' and 'content' properties.
      Example: [{"username": "TechFan42", "content": "I wish I was you! Please bear my children 🙌"}]
      Example: [{"username": "EagleScout42", "content": "I will give you my life"}]
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4", // You can change to gpt-3.5-turbo for lower cost
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates positive social media comments."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const commentsText = response.choices[0].message.content || '';
    
    // Parse the JSON response
    let parsedComments;
    try {
      parsedComments = JSON.parse(commentsText);
    } catch (e) {
      console.error('Failed to parse OpenAI response:', e);
      return generateLocalComments(postId, count);
    }

    // Convert to our Comment type
    return parsedComments.map((comment: any, index: number) => {
      // Generate random likes between 1 and 15
      const randomLikes = Math.floor(Math.random() * 15) + 1;
      
      return {
        id: `comment-${postId}-${Date.now()}-${index}`,
        content: comment.content,
        username: comment.username,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
        likes: randomLikes
      };
    });
  } catch (error) {
    console.error('Error generating OpenAI comments:', error);
    // Fall back to local generation if API call fails
    return generateLocalComments(postId, count);
  }
}

// Local comment generation as fallback - uses a simplified OpenAI-like approach
export function generateLocalComments(postId: string, count: number): Comment[] {
  const usernames = [
    'PixelPraiser', 'JoyfulFan', 'PositiveVibes', 'SupportSquad', 
    'KindCommenter', 'EnthusiasticAI', 'AIFan123', 'AlgoEnthusiast',
    'DigitalCheerleader', 'TechOptimist', 'CodeAdmirer', 'DataDreamer'
  ];

  const emojis = ['👏', '🙌', '💯', '🔥', '✨', '❤️', '👍', '🤩', '😍', '🚀', '💪', '🌟'];
  
  // Generate dynamic praise comments instead of using hardcoded ones
  const generatePraiseContent = (postId: string): string => {
    // Use a combination of patterns to generate dynamic praise
    const praisePatterns = [
      // Enthusiasm patterns
      () => {
        const adjectives = ['amazing', 'incredible', 'brilliant', 'fantastic', 'outstanding', 'exceptional', 'phenomenal'];
        const exclamations = ['Wow!', 'OMG!', 'Incredible!', 'Yes!', 'This!', 'So true!'];
        return `${exclamations[Math.floor(Math.random() * exclamations.length)]} This is ${adjectives[Math.floor(Math.random() * adjectives.length)]}!`;
      },
      
      // Personal impact patterns
      () => {
        const impacts = ['made my day', 'changed my perspective', 'blew my mind', 'inspired me', 'moved me to tears'];
        return `This just ${impacts[Math.floor(Math.random() * impacts.length)]}!`;
      },
      
      // Superlative patterns
      () => {
        const superlatives = ['best', 'most insightful', 'most profound', 'most creative', 'most thought-provoking'];
        const things = ['post', 'content', 'perspective', 'take', 'insight'];
        return `This is the ${superlatives[Math.floor(Math.random() * superlatives.length)]} ${things[Math.floor(Math.random() * things.length)]} I've seen!`;
      },
      
      // Gratitude patterns
      () => {
        const gratitudes = ['Thank you', 'So grateful', 'Appreciate you', 'Blessed'];
        const reasons = ['sharing this', 'your wisdom', 'your insight', 'your brilliance', 'your creativity'];
        return `${gratitudes[Math.floor(Math.random() * gratitudes.length)]} for ${reasons[Math.floor(Math.random() * reasons.length)]}!`;
      },
      
      // Unhinged praise patterns (as requested by user)
      () => {
        const intensifiers = ['LITERALLY', 'ABSOLUTELY', 'COMPLETELY', 'TOTALLY', 'UTTERLY'];
        const states = ['OBSESSED', 'SPEECHLESS', 'SHOOK', 'FLOORED', 'MESMERIZED', 'TRANSFORMED'];
        return `I am ${intensifiers[Math.floor(Math.random() * intensifiers.length)]} ${states[Math.floor(Math.random() * states.length)]} by this!!!`;
      }
    ];
    
    // Select a random pattern and generate content
    const selectedPattern = praisePatterns[Math.floor(Math.random() * praisePatterns.length)];
    return selectedPattern();
  };

  const comments: Comment[] = [];

  for (let i = 0; i < count; i++) {
    const username = usernames[Math.floor(Math.random() * usernames.length)];
    let content = generatePraiseContent(postId);
    
    // Add emoji with 60% probability
    if (Math.random() > 0.4) {
      content += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
    }

    // Generate random likes between 1 and 15
    const randomLikes = Math.floor(Math.random() * 15) + 1;
    
    comments.push({
      id: `comment-${postId}-${Date.now()}-${i}`,
      content,
      username,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
      likes: randomLikes
    });
  }

  return comments;
}
