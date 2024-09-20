import { Page } from "puppeteer";

export interface ListScrapperProps {
  page: Page;
  posters: Boolean;
}

interface ListPosterProps {
  src: string;
  alt: string;
}

export type ListMovieMetadataProps = {
  id: string;
  name: string;
  slug: string;
};

export interface ListMovieWithPosterProps extends ListMovieMetadataProps {
  poster: ListPosterProps;
}
