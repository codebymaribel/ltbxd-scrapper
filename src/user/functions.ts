import {
  ERROR_MESSAGES,
  MAIN_URL,
  QUERY_RESULT_STATUS,
} from '../config/constants';
import {
  ListCardProps,
  PromiseAllSettledProps,
  QueryResponseProps,
} from '../types';

export const listSummary = async ({ page }) => {
  try {
    const listsArray: ListCardProps[] = [];
    const listContainers = await page.$$('.list-set > section.list');

    for (const section of listContainers) {
      const [movieListID, title, movieURLSlug] = (await Promise.allSettled([
        await page.evaluate(
          (el) => el.getAttribute('data-film-list-id'),
          section,
        ),
        await section.$eval('.film-list-summary > h2', (el) => el.textContent),
        await section.$eval('a', (el) => el.getAttribute('href')),
      ])) as PromiseAllSettledProps<string | null>[];

      if (
        movieListID.value === null ||
        title.value === null ||
        movieURLSlug.value === null
      )
        continue;

      const url = `${MAIN_URL + movieURLSlug.value}`;

      listsArray.push({
        id: movieListID.value,
        title: title.value,
        url,
      });
    }
    return {
      status: QUERY_RESULT_STATUS.ok,
      data: listsArray,
    };
  } catch (error) {
    return {
      status: QUERY_RESULT_STATUS.failed,
      data: [],
      errorMessage: `${ERROR_MESSAGES.try_catch_failed} - ${error}`,
    } as QueryResponseProps;
  }
};
