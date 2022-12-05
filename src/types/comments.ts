export interface IComments {
  pagination: {
    page: number;
    size: number;
    total_pages: number;
  };
  data: IComment;
}

export interface IComment {
  id: number;
  name: string;
  avatar: string;
  created: string;
  text: string;
  author: number;
  parent: null;
  likes: number;
}
