import scrapper from "../shared/scrapper";
import { LIST_TYPES, MAIN_URL, QUERY_RESULT_STATUS } from "@/config";
import { ListByTitleProps, UserListProps } from "@/types";

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
  listByTitle,
};

export default getList;
