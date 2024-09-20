import { MetadataProps } from "./types";
import { clearNullElementsFromArray } from "./utils/sharedTools";

const listScrapper = async ({ page, posters }) => {
  let moviesData;

  moviesData = await page.$$eval("div.film-poster", (moviesArray) => {
    const moviesMetadataArray: MetadataProps[] = [];

    moviesArray.forEach((movieContainer) => {
      const movieID = movieContainer.getAttribute("data-film-id") || "";
      const movieName = movieContainer.getAttribute("data-film-name");
      const movieSlug = movieContainer.getAttribute("data-film-slug");
      const moviePoster = movieContainer.querySelector("div > img") || null;

      if (!movieID || !movieName || !movieSlug) return;

      moviesMetadataArray.push({
        id: movieID,
        name: movieName,
        slug: movieSlug,
      });
    });

    return moviesMetadataArray;
  });

  if (!posters) return clearNullElementsFromArray(moviesData);

  moviesData = await page.$$eval(
    "div.film-poster > div > img",
    (posters, moviesDataLocal) => {
      const moviesWithPosters = posters.map((posterHTMLElement) => {
        const src = posterHTMLElement.getAttribute("src");
        const alt = posterHTMLElement.getAttribute("alt");

        const movieObj = moviesDataLocal.find(
          ({ slug, name }) =>
            src?.includes(slug) ||
            alt?.includes(slug) ||
            src?.includes(name) ||
            alt?.includes(name)
        );

        if (movieObj !== undefined && "name" in movieObj) {
          return {
            ...movieObj,
            poster: {
              src,
              alt,
            },
          };
        }
      });
      return moviesWithPosters;
    },
    moviesData
  );

  return clearNullElementsFromArray(moviesData);
};

export { listScrapper };
