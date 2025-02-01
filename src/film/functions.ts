import scrapper from "../scrapper/scrapper";
import { ERROR_MESSAGES, MAIN_URL, QUERY_RESULT_STATUS } from "../config/constants";
import { MovieSearchProps, PromiseAllSettledProps } from "../types";
import { Page } from "puppeteer";

export const findingMovieTitle = async (page: Page, title: string) => {
  try {
    const moviesArray: MovieSearchProps[] = [];

    const selector = `li > div[data-film-name="${title}"]`;
    const checkIfSelectorExists = await scrapper.checkIfSelectorExists(
      selector,
      page
    );


    if (checkIfSelectorExists.status !== QUERY_RESULT_STATUS.ok)
      return {
        status: checkIfSelectorExists.status,
        data: [],
        errorMessage: checkIfSelectorExists.errorMessage,
      };

    if (!checkIfSelectorExists.response)
      return {
        status: QUERY_RESULT_STATUS.ok,
        data: [],
        errorMessage: null,
      };

    const moviesWithTitle = await page.$$(selector);

    if (moviesWithTitle.length === 0)
      return {
        status: QUERY_RESULT_STATUS.ok,
        data: moviesWithTitle,
        errorMessage: null,
      };

    for (const movieContainer of moviesWithTitle) {
      const [filmLink, filmPoster] = (await Promise.allSettled([
        await page.evaluate(
          (el) => el.getAttribute("data-film-link"),
          movieContainer
        ),
        await movieContainer.$eval("div > img", (result) =>
          result.getAttribute("src")
        ),
      ])) as PromiseAllSettledProps<string | null>[];

      if (filmLink.value === null || filmPoster.value === null) {
        continue;
      }

      moviesArray.push({
        title: title,
        pageURL: MAIN_URL + filmLink.value,
        poster: filmPoster.value,
      });
    }
    return {
      status: QUERY_RESULT_STATUS.ok,
      data: moviesArray,
      errorMessage: null,
    };
  } catch (err) {
    return {
      status: QUERY_RESULT_STATUS.failed,
      data: [],
      errorMessage: ERROR_MESSAGES.try_catch_failed,
    };
  }
};
