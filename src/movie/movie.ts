import { MAIN_URL, QUERY_RESULT_STATUS } from "@/config";
import scrapper from "@/scrapper";
import { findingMovieTitle } from "./functions";
import { MovieSearchProps } from "@/types";
import { formatStringToMovieTitle } from "@/helpers";

export const getMovieByTitle = async (params) => {
  const { title } = params;

  const formattedTitle = formatStringToMovieTitle(title);
  try {
    const queryTitle = formattedTitle.replace(/ /g, "+");
    const { status, page } = await scrapper.getPageInstance(
      `${MAIN_URL}/search/films/${queryTitle}`
    );

    if (status !== QUERY_RESULT_STATUS.ok)
      return {
        status,
        data: [],
      };

    const moviesArray = (await findingMovieTitle(
      page,
      formattedTitle
    )) as MovieSearchProps[];

    return {
      status: QUERY_RESULT_STATUS.ok,
      data: moviesArray,
    };
  } catch (err) {
    console.log(err);
    return{
      status: QUERY_RESULT_STATUS.failed,
      data: []
    }
  }
};
