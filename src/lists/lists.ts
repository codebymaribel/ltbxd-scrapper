import {
  ERROR_MESSAGES,
  LIST_TYPES,
  MAIN_URL,
  QUERY_RESULT_STATUS,
} from "../config/constants";
import scrapper from "../scrapper/scrapper";
import {
  ListMoviesProps,
  ListCardProps,
  UserQueryProps,
  QueryResponseProps,
} from "../types";
import { listSummary } from "../user/functions";
import { listFilms } from "./functions";

/**
 * @summary Returns an array of objects with the user's list data
 * @param {string} url - List URL
 * @param {object} options - Query {@link https://github.com/codebymaribel/ltbxd-scrapper?tab=readme-ov-file#options-object| Options Object}
 * @returns {object}  {@link https://google.com | List Film Object[]} in the data param of the {@link https://github.com/codebymaribel/ltbxd-scrapper?tab=readme-ov-file#options-object | QueryResponseProps}
 */

export const getListFilms = async ({url, options}: ListMoviesProps) => {
  const posters = options?.posters || true;

  const listMovies = await listFilms(url, posters);

  return listMovies;
};

/**
 * @summary Returns an array of user public lists names and IDs
 * @param {string} username - letterboxd username
 * @returns {object}  {@link https://google.com | ListsSearchObject[]} in the data param of the {@link https://github.com/codebymaribel/ltbxd-scrapper?tab=readme-ov-file#options-object | QueryResponseProps}
 */
export const getUserLists = async ({username}: UserQueryProps) => {

  try {
    const { status, page, errorMessage } = await scrapper.getPageInstance(
      `${MAIN_URL}/${username}/${LIST_TYPES.lists}`
    );

    if (status !== QUERY_RESULT_STATUS.ok || !page) {
      if (page) await scrapper.closeBrowser(page);
      return {
        status,
        data: [],
        errorMessage,
      } as QueryResponseProps;
    }

    const areThereAnyLists = await scrapper.checkIfSelectorExists(
      ".list-set",
      page
    );

    if (!areThereAnyLists) {
      await scrapper.closeBrowser(page);
      return {
        status: QUERY_RESULT_STATUS.ok,
        data: [],
        errorMessage: null,
      } as QueryResponseProps;
    }

    const getLists = await listSummary({ page });

    if (getLists.status !== QUERY_RESULT_STATUS.ok) {
      return {
        status: QUERY_RESULT_STATUS.failed,
        data: [],
        errorMessage: ERROR_MESSAGES.try_catch_failed,
      } as QueryResponseProps;
    }

    const listsArray: ListCardProps[] = getLists.data;

    await scrapper.closeBrowser(page);

    return {
      status: QUERY_RESULT_STATUS.ok,
      data: listsArray,
      errorMessage: null,
    } as QueryResponseProps;
  } catch (error) {
    return {
      status: QUERY_RESULT_STATUS.failed,
      data: [],
      errorMessage: ERROR_MESSAGES.try_catch_failed,
    } as QueryResponseProps;
  }
};
