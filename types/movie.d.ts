export type MovieID = string;
export type MovieTitle = string;
export type MovieSlug = string;
export type MoviePoster = string | null;
export type MoviePageURL = string;

export interface MovieObjectProps {
  id: MovieID;
  title: MovieTitle;
  slug: MovieSlug;
  poster: MoviePoster;
}

export interface MovieSearchProps {
  title: MovieTitle;
  page: MoviePageURL;
  poster: MoviePoster;
}
