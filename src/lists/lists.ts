import scrapper from "../shared/scrapper";
import { LIST_TYPES, MAIN_URL, QUERY_RESULT_STATUS } from "@/config";
import { ListByTitleProps, UserListProps } from "@/types";
import { checkIfListExists, listScrapper } from "./scrapper/list/functions";
import {
  handleLazyLoad,
  isThereAnotherPage,
  nextPageURL,
} from "./scrapper/routes/functions";

/**
 * @description Returns an array of objects with the user's list data
 * @param {String} username - Letterboxd username
 * @param {String} category - Content category (watchlist, films)
 * @returns {ListMovieMetadataProps[] || ListMovieWithPosterProps[]}  - An array of Objects with movies data
 */

const watchlist = async (user: UserListProps) => {
  const { username } = user;
  const posters = user.options?.posters || true;
  const listData: Object[] = [];

  try {
    const { status, page } = await scrapper.getPageInstance(
     ` ${MAIN_URL}/${username}/${LIST_TYPES.watchlist}/`
    );

    if (status !== QUERY_RESULT_STATUS.ok)
      return {
        status,
        data: [],
      };

    const [listExistsOnPage, nextPageExists] = await Promise.all([
      await checkIfListExists({ page }),
      await isThereAnotherPage({ page }),
    ]);

    if (!listExistsOnPage) throw Error("No hay peliculas en este enlace");

    //Handle infinite scroll list
    if (!nextPageExists) {
      await handleLazyLoad({ page });
      const moviesArray = await listScrapper({ page, posters });

      await scrapper.closeBrowser(page)

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

    await scrapper.closeBrowser(page)
    return {
      status: QUERY_RESULT_STATUS.ok,
      data: listData,
    };
  } catch (error) {
    
    console.error(error);
    throw 500;
  }
};

/**
 * @description Returns an array of objects with the user's list data
 * @param {String} username - Letterboxd username
 * @param {String} category - Content category (watchlist, films)
 * @returns {ListMovieMetadataProps[] || ListMovieWithPosterProps[]}  - An array of Objects with movies data
 */

const listByTitle = async (query: ListByTitleProps) => {
  const { listTitle = false, username = false } = query;
  const posters = query.options?.posters || true;

  return {
    status: QUERY_RESULT_STATUS.ok,
    data: ["OK"]

  };
};

const getList = {
  watchlist,
  listByTitle,
};

export default getList;
