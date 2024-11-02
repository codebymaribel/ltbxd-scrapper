export type MovieID = string;
export type MovieTitle = string;
export type MovieSlug = string;
export type MoviePoster = string | null;

export interface MovieObjectProps {
  id: MovieID;
  title: MovieTitle;
  slug: MovieSlug;
  poster: MoviePoster;
}
