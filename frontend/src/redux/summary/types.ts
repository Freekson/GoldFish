import { Status } from "../../types";

export type TArticleSummary = {
  totalViews: number;
  totalLikes: number;
  totalDislikes: number;
  totalArticles: number;
  dailyArticles: TAuthorInfo[];
  tags: TTags[];
};
export type TCommentsSummary = {
  totalComments: number;
  totalReplies: number;
  commentsSummary: TComments[];
  repliesSummary: TRetplies[];
};

type TAuthorInfo = {
  _id: string;
  articles: number;
};

type TComments = {
  _id: string;
  comments: number;
};

type TRetplies = {
  _id: string;
  replies: number;
};

type TTags = {
  _id: string;
  count: number;
};

export type summaryState = {
  articleSummary: TArticleSummary | null;
  commentsSummary: TCommentsSummary | null;
  status: Status;
};
