import nameToImdb from 'name-to-imdb';

import {
  ERROR_MESSAGES,
  MAIN_URL,
  QUERY_RESULT_STATUS,
} from '../config/constants';
import scrapper from '../scrapper/scrapper';
import {
  IMDBID,
  ListScrapperProps,
  MovieObjectProps,
  MoviePoster,
  PromiseAllSettledProps,
  QueryResponseProps,
} from '../types';

export const listFilms = async (url: string, posters: boolean) => {
  let allDataCollected = false;
  const listData: object[] = [];

  try {
    const { status, page, errorMessage } = await scrapper.getPageInstance(url, [
      'script',
      'image',
      'font',
      'media',
      'manifest',
    ]);

    if (status !== QUERY_RESULT_STATUS.ok || !page) {
      if (page) await scrapper.closeBrowser(page);
      return {
        status,
        data: [],
        errorMessage,
      } as QueryResponseProps;
    }

    let nextPageLink = await scrapper.getNextPageURL(page);

    if (nextPageLink.status !== QUERY_RESULT_STATUS.ok)
      return {
        status: nextPageLink.status,
        data: [],
        errorMessage: nextPageLink.errorMessage,
      } as QueryResponseProps;

    if (!nextPageLink.response) {
      const filmsArray = await getFilmsArray({ page, posters });
      await scrapper.closeBrowser(page);

      if (filmsArray.status !== QUERY_RESULT_STATUS.ok) {
        return {
          status: QUERY_RESULT_STATUS.failed,
          data: [],
          errorMessage: ERROR_MESSAGES.try_catch_failed,
        } as QueryResponseProps;
      }

      return {
        status: QUERY_RESULT_STATUS.ok,
        data: filmsArray.data,
        errorMessage: null,
      } as QueryResponseProps;
    }

    while (!allDataCollected) {
      const currentPageFilms = await getFilmsArray({ page, posters });

      if (nextPageLink.status !== QUERY_RESULT_STATUS.ok)
        return {
          status: nextPageLink.status,
          data: [],
          errorMessage: nextPageLink.errorMessage,
        } as QueryResponseProps;

      if (currentPageFilms?.status !== QUERY_RESULT_STATUS.ok)
        return {
          status: currentPageFilms.status,
          data: [],
          errorMessage: null,
        } as QueryResponseProps;

      listData.push(...currentPageFilms.data);

      nextPageLink = await scrapper.getNextPageURL(page);

      if (!nextPageLink.response) {
        allDataCollected = true;
        break;
      }

      await scrapper.gotoNextPage(page, `${MAIN_URL + nextPageLink.response}`);

      const checkIfSelectorExists = await scrapper.checkIfSelectorExists(
        '.paginate-nextprev',
        page,
      );

      if (checkIfSelectorExists.status !== QUERY_RESULT_STATUS.ok) {
        allDataCollected = true;
        await scrapper.closeBrowser(page);
        break;
      }
    }

    await scrapper.closeBrowser(page);

    return {
      status: QUERY_RESULT_STATUS.ok,
      data: listData,
      errorMessage: null,
    } as QueryResponseProps;
  } catch (error) {
    return {
      status: QUERY_RESULT_STATUS.failed,
      data: [],
      errorMessage: `${ERROR_MESSAGES.try_catch_failed} - ${error}`,
    } as QueryResponseProps;
  }
};

const getFilmsArray = async ({ page, posters = true }: ListScrapperProps) => {
  try {
    const listExistsOnPage = await scrapper.checkIfContainerHasChildren(page);
    const moviesData: MovieObjectProps[] = [];

    if (listExistsOnPage.status !== QUERY_RESULT_STATUS.ok)
      return {
        status: listExistsOnPage.status,
        data: [],
      };
    if (!listExistsOnPage.response)
      return {
        status: QUERY_RESULT_STATUS.ok,
        data: [],
      };

    const moviesContainers = await page.$$('div.film-poster');

    for (const movie of moviesContainers) {
      let poster: MoviePoster = null;

      const [id, title, slug] = (await Promise.allSettled([
        await page.evaluate((el) => el.getAttribute('data-film-id'), movie),
        await movie.$eval('div > img', (result) => result.getAttribute('alt')),
        await page.evaluate((el) => el.getAttribute('data-film-slug'), movie),
      ])) as PromiseAllSettledProps<string | null>[];

      if (posters)
        poster = await movie.$eval(' div > img', (result) =>
          result.getAttribute('src'),
        );

      if (id.value === null || title.value === null || slug.value === null) {
        continue;
      }

      const imdbID: IMDBID = (await searchIMDB(title.value)) as IMDBID;

      moviesData.push({
        id: id.value,
        imdbID: imdbID,
        title: title.value,
        slug: slug.value,
        poster,
      });
    }

    return {
      status: QUERY_RESULT_STATUS.ok,
      data: moviesData,
    };
  } catch (error) {
    return {
      status: QUERY_RESULT_STATUS.failed,
      data: [],
      errorMessage: `${ERROR_MESSAGES.try_catch_failed} - ${error}`,
    } as QueryResponseProps;
  }
};

const searchIMDB = (title: string) => {
  return new Promise((resolve, reject) =>
    nameToImdb(title, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    }),
  )
    .then((imdbID) => imdbID)
    .catch(() => null);
};
