import scrapper from "@/scrapper";
import { ListScrapperProps, MovieObjectProps, MoviePoster } from "@/types";
import { QUERY_RESULT_STATUS } from "@/config";

export const getListMovies = async ({
  page,
  posters = true,
}: ListScrapperProps) => {
  const listExistsOnPage = await scrapper.checkIfContainerHasChildren(page);
  const moviesData: MovieObjectProps[] = [];

  if (!listExistsOnPage) {
    return {
      status: QUERY_RESULT_STATUS.ok,
      data: [],
    };
  }

  const moviesContainers = await page.$$("div.film-poster");

  for (const movie of moviesContainers) {
    let poster: MoviePoster = null;
    const id =
      (await page.evaluate((el) => el.getAttribute("data-film-id"), movie)) ||
      "";
    const title =
      (await page.evaluate((el) => el.getAttribute("data-film-name"), movie)) ||
      "";
    const slug =
      (await page.evaluate((el) => el.getAttribute("data-film-slug"), movie)) ||
      "";

    if (posters)
      poster = await movie.$eval(" div > img", (result) =>
        result.getAttribute("src")
      );

    moviesData.push({
      id,
      title,
      slug,
      poster,
    });
  }

  return {
    status: QUERY_RESULT_STATUS.ok,
    data: moviesData,
  };
  // const listMetadataArray: ListMovieMetadataProps[] = await page.$$eval(
  //   "div.film-poster",
  //   (moviesArray: HTMLDivElement[]) => {
  //     const moviesMetadataArray: ListMovieMetadataProps[] = [];

  //     moviesArray.forEach((movieContainer) => {
  //       if (!movieID || !movieName || !movieSlug) return;

  //       moviesMetadataArray.push({
  //         id: movieID,
  //         name: movieName,
  //         slug: movieSlug,
  //       });
  //     });

  //     return moviesMetadataArray;
  //   }
  // );

  // if (!posters) return clearNullElementsFromArray(listMetadataArray);

  // const listWithPostersArray = await page.$$eval(
  //   "div.film-poster > div > img",
  //   (
  //     posters: HTMLImageElement[],
  //     moviesDataLocal: ListMovieMetadataProps[]
  //   ) => {
  //     const moviesWithPosters = posters.map((posterHTMLElement) => {
  //       const src = posterHTMLElement.getAttribute("src");
  //       const alt = posterHTMLElement.getAttribute("alt");

  //       const movieObj = moviesDataLocal.find(
  //         ({ slug, name }) =>
  //           src?.includes(slug) ||
  //           alt?.includes(slug) ||
  //           src?.includes(name) ||
  //           alt?.includes(name)
  //       );

  //       if (movieObj !== undefined && "name" in movieObj) {
  //         return {
  //           ...movieObj,
  //           poster: {
  //             src,
  //             alt,
  //           },
  //         };
  //       }
  //     });
  //     return moviesWithPosters;
  //   },
  //   listMetadataArray
  // );

  // return clearNullElementsFromArray(listWithPostersArray);
};
