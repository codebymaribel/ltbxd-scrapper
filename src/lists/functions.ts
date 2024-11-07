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
  }};
