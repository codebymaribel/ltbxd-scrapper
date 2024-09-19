
type QueryOptionsProps = {
 posters: boolean
}

export interface UserQueryProps {
  username: string;
  category: "watchlist" | "films";
  options: QueryOptionsProps
}

export interface PosterProps {
  url: string;
  alt: string;
}

export interface MetadataProps {
  id: string;
  name: string;
  slug: string;
}

export type MergedMovieDataProps = {
  postersArray: PosterProps[];
  moviesMetadataArray: MetadataProps[];
};

export interface MovieObjectProps extends MetadataProps {
moviePoster: PosterProps
}