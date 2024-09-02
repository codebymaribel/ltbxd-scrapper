export interface UserProps {
  username: string;
  typeOfList: "watchlist" | "films";
}

export interface PosterProps {
  url: string;
  alt: string | undefined;
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
