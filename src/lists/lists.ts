import puppeteer from "puppeteer";
import { LIST_TYPES, MAIN_URL } from "../config/constants";
import { listScrapper } from "./scrapper/lists-scrapper";
import { ListMovieWithPosterProps, UserQueryProps } from "@/types";

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

  try {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.goto(`${MAIN_URL}/${username}/${LIST_TYPES[category]}/`);

    let allDataCollected = false;

    while (!allDataCollected) {
      
      await page.waitForSelector(".paginate-nextprev");

      const moviesArray = await listScrapper({ page, posters });

      listData.push(...moviesArray);

      const isLastPage = await page.evaluate(() => {
        return !!document.querySelector(
          ".paginate-nextprev.paginate-disabled > span.next"
        ); // !! converts anything to boolean
      });

      if (isLastPage) {
        allDataCollected = true;
        break;
      }

      const nextPageLink = await page.evaluate(() => {
        const element = document.querySelector(".next");
        const href = (element as HTMLAnchorElement).href;
        return href;
      });

      await page.goto(nextPageLink, {
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
