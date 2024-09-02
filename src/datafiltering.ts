import { Page } from "puppeteer";
import { MergedMovieDataProps, MetadataProps, PosterProps } from "./types";

export const moviesMetadataArray = async (page: Page) =>
  await page.$$eval("div.film-poster", (filmsContainers) => {
    const htmlContent: MetadataProps[] = [];

    filmsContainers.forEach((movieContainer: HTMLDivElement) => {
      const movieID = movieContainer.getAttribute("data-film-id");
      const movieName = movieContainer.getAttribute("data-film-name");
      const movieSlug = movieContainer.getAttribute("data-film-slug");

      if (!movieID || !movieName || !movieSlug) return;

      htmlContent.push({
        id: movieID,
        name: movieName,
        slug: movieSlug,
      });
    });
    return htmlContent;
  });

export const postersArray = async (page: Page) =>
  await page.$$eval("div.film-poster > div > img", (posters) => {
    const postersarray: PosterProps[] = [];
    posters.forEach((poster) => {
      postersarray.push({ url: poster.src, alt: poster.alt });
    });

    return postersarray;
  });

export const moviesDataArray = ({
  postersArray,
  moviesMetadataArray,
}: MergedMovieDataProps) =>
  moviesMetadataArray.map((movieMetaObj: MetadataProps) => {
    const { slug, name } = movieMetaObj;

    const moviePoster = postersArray.find(
      ({ url, alt }) => url.includes(slug) || alt?.includes(name)
    );

    const watchlistMovieObj = { ...movieMetaObj, moviePoster };

    return watchlistMovieObj;
  });
