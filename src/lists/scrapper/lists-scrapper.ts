import { ListScrapperProps, ListMovieMetadataProps } from "@/types";
import { clearNullElementsFromArray, wait } from "../../utils/sharedTools";

export const checkIfListExists = async ({ page }) => {
  try {
    const filmElementExists: boolean = await page
      .$$eval("div.film-poster", (elementsArray) => elementsArray.length > 0)
      .catch(() => false);
    return filmElementExists;
  } catch (error) {
    //TODO como validar el error del catch apropiadamente
    return false;
  }
};

export const isThereAnotherPage = async ({ page }) => {
  try {
    const isThereAnotherPage = await page
      .$eval(".paginate-nextprev", () => true)
      .catch(() => false);

    return isThereAnotherPage;
  } catch (error) {
    //TODO como validar el error del catch apropiadamente
    return false;
  }
};

export const nextPageURL = async ({ page }) => {
  try {
    const nextPageLink = await page.evaluate(() => {
      try {
        const element = document.querySelector(".next");
        const href = (element as HTMLAnchorElement).href;
        return href;
      } catch (error) {
        return null;
      }
    });

    return nextPageLink;
  } catch (error) {
    //TODO como validar el error del catch apropiadamente
    return null;
  }
};

export const handleLazyLoad = async ({ page }) => {
  // Get body final height
  const totalHeight: number = await page.evaluate(
    () => document.querySelector("body")?.scrollHeight || 0
  );

  let currentHeight: number = 0;

  // get current viewportHeight
  const viewportHeight: number = page.viewport()?.height || 0;

  if (viewportHeight === currentHeight) return;

  while (currentHeight + viewportHeight < totalHeight) {
    await page.evaluate(
      (_currentHeight: number, _viewportHeight: number) => {
        window.scrollBy(_currentHeight, _viewportHeight);
      },
      currentHeight,
      viewportHeight
    );
    await wait(2000);

    currentHeight = currentHeight + viewportHeight;
  }
};

export const listScrapper = async ({ page, posters }: ListScrapperProps) => {
  const listMetadataArray: ListMovieMetadataProps[] = await page.$$eval(
    "div.film-poster",
    (moviesArray: HTMLDivElement[]) => {
      const moviesMetadataArray: ListMovieMetadataProps[] = [];

      moviesArray.forEach((movieContainer) => {
        const movieID = movieContainer.getAttribute("data-film-id") || "";
        const movieName = movieContainer.getAttribute("data-film-name");
        const movieSlug = movieContainer.getAttribute("data-film-slug");

        if (!movieID || !movieName || !movieSlug) return;

        moviesMetadataArray.push({
          id: movieID,
          name: movieName,
          slug: movieSlug,
        });
      });

      return moviesMetadataArray;
    }
  );

  if (!posters) return clearNullElementsFromArray(listMetadataArray);

  const listWithPostersArray = await page.$$eval(
    "div.film-poster > div > img",
    (
      posters: HTMLImageElement[],
      moviesDataLocal: ListMovieMetadataProps[]
    ) => {
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
    listMetadataArray
  );

  return clearNullElementsFromArray(listWithPostersArray);
};
