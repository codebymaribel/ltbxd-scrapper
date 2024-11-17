import scrapper from "@/scrapper";
import { ERROR_MESSAGES, MAIN_URL, QUERY_RESULT_STATUS } from "@/config";
import { findingMovieTitle } from "./functions";
import { MovieSearchProps, QueryResponseProps } from "@/types";
import { formatStringToMovieTitle } from "@/helpers";

export const searchFilm = async (params) => {
  const { title } = params;

  const formattedTitle = formatStringToMovieTitle(title);
  try {
    const queryTitle = formattedTitle.replace(/ /g, "+");
    const { status, page, errorMessage } = await scrapper.getPageInstance(
      `${MAIN_URL}/search/films/${queryTitle}`,
      ["image", "font", "media", "manifest"]
    );

    if (status !== QUERY_RESULT_STATUS.ok)
      return {
        status,
        data: [],
        errorMessage,
      } as QueryResponseProps;

    const findMovies = await findingMovieTitle(page, formattedTitle);

    if (findMovies.status !== QUERY_RESULT_STATUS.ok)
      return {
        status: QUERY_RESULT_STATUS.failed,
        data: [],
        errorMessage: null,
      } as QueryResponseProps;

    const moviesArray = findMovies.data as MovieSearchProps[];

    return {
      status: QUERY_RESULT_STATUS.ok,
      data: moviesArray,
      errorMessage: null,
    } as QueryResponseProps;
  } catch (err) {
    return {
      status: QUERY_RESULT_STATUS.failed,
      data: [],
      errorMessage: ERROR_MESSAGES.try_catch_failed,
    } as QueryResponseProps;
  }
};
