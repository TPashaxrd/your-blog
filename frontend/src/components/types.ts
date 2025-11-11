export interface Post {
  _id: string;
  title: string;
  slug: string;
  coverImageUrl?: string;
  category?: string;
  createdAt: string;
  excerpt?: string;
}