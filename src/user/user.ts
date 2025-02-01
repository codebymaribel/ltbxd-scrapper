import {
  ERROR_MESSAGES,
  LIST_TYPES,
  MAIN_URL,
  QUERY_RESULT_STATUS,
} from "@/config";
import { UserQueryProps } from "@/types";
import { listFilms } from "../lists/functions";

/**
 * @description Returns an array of objects with the user's list data
 * @param {String} username - Letterboxd username
 * @param {String} category - Content category (watchlist, films)
 * @returns {ListMovieMetadataProps[] || ListMovieWithPosterProps[]}  - An array of Objects with movies data
 */

export const getWatchlist = async (params: UserQueryProps) => {
  const posters = params.options?.posters || true;

  if (!params.username) {
    return {
      status: QUERY_RESULT_STATUS.failed,
      data: [],
      errorMessage: ERROR_MESSAGES.missing_parameters,
    };
  }

  const listMovies = await listFilms(
    `${MAIN_URL}/${params.username}/${LIST_TYPES.watchlist}/`,
    posters
  );

  return listMovies;
};
