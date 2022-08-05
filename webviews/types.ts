export interface Post {
  data: {
    subreddit_name_prefixed: string;
    created: number;
    ups: number;
    num_comments: number;
    title: string;
    permalink: string;
    selftext_html: string;
    url: string;
    thumbnail: string;
    id: string;
  };
};