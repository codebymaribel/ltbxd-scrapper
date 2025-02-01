import {
  ERROR_MESSAGES,
  LIST_TYPES,
  MAIN_URL,
  QUERY_RESULT_STATUS,
} from "@/config";
import scrapper from "@/scrapper/scrapper";
import {
  ListMoviesProps,
  ListCardProps,
  UserQueryProps,
  QueryResponseProps,
} from "@/types";
import { listSummary } from "../user/functions";
import { listFilms } from "./functions";

/**
 * @description Returns an array of objects with the user's list data
 * @param {String} title - List title in Letterboxd
 * @param {String} url - List URL
 * @param {Object} options - options object
 * @returns {ListMovieMetadataProps[] || ListMovieWithPosterProps[]}  - An array of Objects with movies data
 */

export const getListFilms = async (params: ListMoviesProps) => {
  const posters = params.options?.posters || true;

  const listMovies = await listFilms(params.url, posters);

  return listMovies;
};

export const getPublicLists = async (user: UserQueryProps) => {
  const { username } = user;

  try {
    const { status, page, errorMessage } = await scrapper.getPageInstance(
      `${MAIN_URL}/${username}/${LIST_TYPES.lists}`
    );

    if (status !== QUERY_RESULT_STATUS.ok) {
      if (page) await scrapper.closeBrowser(page);
      return {
        status,
        data: [],
        errorMessage,
      };
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
      };
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
