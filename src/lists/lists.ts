import puppeteer, { Page } from "puppeteer";
import { LIST_TYPES, MAIN_URL } from "../config/constants";
import {
  isThereAnotherPage,
  handleLazyLoad,
  listScrapper,
  nextPageURL,
} from "./scrapper/lists-scrapper";
import {
  ListMovieWithPosterProps,
  ListScrapperProps,
  UserQueryProps,
} from "@/types";
import { wait } from "../utils/sharedTools";

/**
 * @description Returns an array of objects with the user's watchlist data
 * @param {String} username - Letterboxd username
 * @param {String} category - Content category (watchlist, films)
 * @returns {ListMovieMetadataProps[] || ListMovieWithPosterProps[]}  - An array of Objects with movies data
 */

export const getUserList = async (user: UserQueryProps) => {
  const { username, category, options } = user;
  const { posters = false } = options;
  const listData: Object[] = [];

  //TODO validar si tienes acceso a la pagina XD: if private, receive share URL

  try {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.goto(`${MAIN_URL}/${username}/${LIST_TYPES[category]}/`);

    let allDataCollected = false;

    //Handle multiple page list
    while (!allDataCollected) {
      const moviesArray = await listScrapper({ page, posters });

      listData.push(...moviesArray);

      const nextPage = await nextPageURL({ page });

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
