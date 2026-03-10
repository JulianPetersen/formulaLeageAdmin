export interface BlogModel {
  _id?: string;
  title: string;
  slug?: string;
  summary: string;
  coverImage:string;
  content: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}