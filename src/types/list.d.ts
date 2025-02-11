import { Page } from 'puppeteer';

import { OptionsProps } from './user';

export interface ListScrapperProps {
  page: Page;
  posters: boolean;
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

export interface ListMoviesProps {
  url: string;
  options?: OptionsProps;
}

export interface ListByURLProps {
  listURL: string;
  options?: OptionsProps;
}

export interface ListCardProps {
  id: string;
  title: string;
  url: string;
}
