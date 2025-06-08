export interface Post {
  id: string;
  content: string;
  username: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  username: string;
  timestamp: string;
  likes: number;
}
