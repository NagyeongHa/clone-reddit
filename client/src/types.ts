export interface User {
  username: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sub {
  createdAt: string;
  updatedAt: string;
  name: string;
  title: string;
  description: string;
  imageUrn: string;
  bannerUrn: string;
  username: string;
  posts: Post[];
  postCount?: string;

  imageUrl: string;
  bannerUrl: string;
}

export interface Post {
  indentifier: string;
  title: string;
  slug: string;
  body: string;
  username: string;
  subName: string;
  createdAt: string;
  updatedAt: string;
  sub?: Sub;

  url: string;
  userVote?: number;
  voteScore?: number;
  commentCount?: number;
}

export interface Comment {
  identifier: string;
  body: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  post?: Post;

  uservote: string;
  voteScore: string;
}
