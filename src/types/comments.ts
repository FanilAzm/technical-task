export type CommentsType = {
  pagination: {
    page: number;
    size: number;
    total_pages: number;
  };
  data: CommentType;
};

export type CommentType = {
  id: number;
  name: string;
  avatar: string;
  created: string;
  text: string;
  author: number;
  parent: null;
  likes: number;
};
