import puppeteer, { Page } from "puppeteer";
import { LIST_TYPES, MAIN_URL } from "../config/constants";
import {
  isThereAnotherPage,
  handleLazyLoad,
  listScrapper,
  nextPageURL,
  checkIfListExists,
} from "./scrapper/lists-scrapper";
import { UserQueryProps } from "@/types";

/**
 * @description Returns an array of objects with the user's watchlist data
 * @param {String} username - Letterboxd username
 * @param {String} category - Content category (watchlist, films)
 * @returns {ListMovieMetadataProps[] || ListMovieWithPosterProps[]}  - An array of Objects with movies data
 */

export const getUserList = async (user: UserQueryProps) => {
  const { username, category } = user;
  const posters = user.options?.posters || false;
  const listData: Object[] = [];

  try {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.goto(`${MAIN_URL}/${username}/${LIST_TYPES[category]}/`);

    const [listExistsOnPage, nextPageExists] = await Promise.all([
      await checkIfListExists({ page }),
      await isThereAnotherPage({ page }),
    ]);

    if (!listExistsOnPage) throw Error("No hay peliculas en este enlace");

    //Handle infinite scroll list
    if (!nextPageExists) {
      await handleLazyLoad({ page });
      const moviesArray = await listScrapper({ page, posters });

      console.log("Number of movies in list: ", moviesArray.length);
      await browser.close();

      return moviesArray;
    }

    let allDataCollected = false;

    //Handle multiple page list
    while (!allDataCollected) {
      const [moviesArray, nextPage] = await Promise.all([
        await listScrapper({ page, posters }),
        await nextPageURL({ page }),
      ]);

      listData.push(...moviesArray);

      if (!nextPage) {
        allDataCollected = true;
        break;
      }

      await page.goto(nextPage, {
        waitUntil: "networkidle0",
      });

      await page.waitForSelector(".paginate-nextprev");
    }

    await browser.close();
    console.log("Number of movies in list: ", listData.length);
  } catch (error) {
    console.error(error);
    throw 500;
  }
};
