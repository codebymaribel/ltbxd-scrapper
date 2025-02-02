import scrapper from '../scrapper/scrapper';
import {
  ERROR_MESSAGES,
  MAIN_URL,
  QUERY_RESULT_STATUS,
} from '../config/constants';
import { findingMovieTitle } from './functions';
import { MovieSearchProps, QueryResponseProps } from '../types';
import { formatStringToMovieTitle } from '../tools/tools';


/**
 * @summary searches for films results based on a string
 * @param {string} title - film title
 * @returns {object}  {@link https://github.com/codebymaribel/ltbxd-scrapper?tab=readme-ov-file#film-object | Film Search Object[]} in the data param of the {@link https://github.com/codebymaribel/ltbxd-scrapper?tab=readme-ov-file#options-object | QueryResponseProps}
 */
export const searchFilm = async ( title: string ) => {
  const formattedTitle = formatStringToMovieTitle(title);
  try {
    const queryTitle = formattedTitle.replace(/ /g, '+');
    const { status, page, errorMessage } = await scrapper.getPageInstance(
      `${MAIN_URL}/search/films/${queryTitle}`,
      ['image', 'font', 'media', 'manifest'],
    );

    if (status !== QUERY_RESULT_STATUS.ok || !page)
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
