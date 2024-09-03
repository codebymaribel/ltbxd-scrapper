export interface UserProps {
  username: string;
  category: "watchlist" | "films";
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