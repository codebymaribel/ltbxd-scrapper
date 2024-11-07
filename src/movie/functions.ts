import scrapper from "@/scrapper";
import { MAIN_URL } from "@/config";
import { takeScreenshot } from "@/helpers";
import { MovieSearchProps } from "@/types";
import { Page } from "puppeteer";

export const findingMovieTitle = async (page: Page, title: string) => {
  try {
    const moviesArray: MovieSearchProps[] = [];

    const selector = `li > div[data-film-name="${title}"]`;
    const checkIfSelectorExists = await scrapper.checkIfSelectorExists(
      selector,
      page
    );

    if (!checkIfSelectorExists) return [];

    const moviesWithTitle = await page.$$(selector);

    if (moviesWithTitle.length === 0) return moviesWithTitle;

    for (const movieContainer of moviesWithTitle) {
      const filmLink = await page.evaluate(
        (el) => el.getAttribute("data-film-link"),
        movieContainer
      );
      const filmPoster = await movieContainer.$eval("div > img", (result) =>
        result.getAttribute("src")
      );

      moviesArray.push({
        title: title,
        page: MAIN_URL + filmLink,
        poster: filmPoster,
      });
    }
    return moviesArray;
  } catch (err) {
    console.log(err);
    return [];
  }
};
