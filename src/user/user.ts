import { LIST_TYPES, MAIN_URL, QUERY_RESULT_STATUS } from "@/config";
import { ListCardProps, UserQueryProps } from "@/types";
import { listSummary } from "./functions";
import scrapper from "../shared/scrapper";
import { getListMovies } from "../lists/functions";

/**
 * @description Returns an array of objects with the user's list data
 * @param {String} username - Letterboxd username
 * @param {String} category - Content category (watchlist, films)
 * @returns {ListMovieMetadataProps[] || ListMovieWithPosterProps[]}  - An array of Objects with movies data
 */

const getWatchlist = async (user: UserQueryProps) => {
  const { username } = user;
  const posters = user.options?.posters || true;
  let allDataCollected = false;
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

    const nextPageExists = await scrapper.getNextPageURL(page);

    if (!nextPageExists) {
      await scrapper.handleLazyLoad(page);
      const moviesArray = await getListMovies({ page, posters });

      await scrapper.closeBrowser(page);

      return moviesArray;
    }
    while (!allDataCollected) {
      const [moviesFromCurrentPage, nextPage] = await Promise.all([
        await getListMovies({ page, posters }),
        await scrapper.getNextPageURL(page),
      ]);

      if (status !== QUERY_RESULT_STATUS.ok)
        return {
          status: moviesFromCurrentPage.status,
          data: [],
        };

      listData.push(...moviesFromCurrentPage.data);

      if (!nextPage) {
        allDataCollected = true;
        break;
      }

      await page.goto(`${MAIN_URL + nextPage}`, {
        waitUntil: "networkidle0",
      });

      await page.waitForSelector(".paginate-nextprev");
    }
    await scrapper.closeBrowser(page);
    return {
      status: QUERY_RESULT_STATUS.ok,
      data: listData,
    };
  } catch (error) {
    console.error(error);
    throw 500;
  }
};

const getPublicLists = async (user: UserQueryProps) => {
  const { username } = user;

  try {
    const { status, page } = await scrapper.getPageInstance(
      `${MAIN_URL}/${username}/${LIST_TYPES.lists}`
    );

    if (status !== QUERY_RESULT_STATUS.ok) {
      if (page) await scrapper.closeBrowser(page);
      return {
        status,
        data: [],
      };
    }

    const areThereAnyLists = await scrapper.checkIfSelectorExists(
      ".list-set",
      page
    );

    if (!areThereAnyLists) {
      return {
        status: QUERY_RESULT_STATUS.ok,
        data: [],
      };
    }

    const listsArray: ListCardProps[] = await listSummary({ page });

    await scrapper.closeBrowser(page);

    return {
      status: QUERY_RESULT_STATUS.ok,
      data: listsArray,
    };
  } catch (error) {
    console.log(error);
  }
};

const user = {
  getWatchlist,
  getPublicLists,
};

export default user;
