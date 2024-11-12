import scrapper from "@/scrapper";
import {
  ListScrapperProps,
  MovieObjectProps,
  MoviePoster,
  PromiseAllSettledProps,
} from "@/types";
import { ERROR_MESSAGES, MAIN_URL, QUERY_RESULT_STATUS } from "@/config";

export const listFilms = async (url: string, posters: boolean) => {
  let allDataCollected = false;
  const listData: Object[] = [];

  try {
    const { status, page, errorMessage } = await scrapper.getPageInstance(url, [
      "script",
      "image",
      "font",
      "media",
      "manifest",
    ]);

    if (status !== QUERY_RESULT_STATUS.ok) {
      if (page) await scrapper.closeBrowser(page);
      return {
        status,
        data: [],
        errorMessage,
      };
    }

    const nextPageLink = await scrapper.getNextPageURL(page);

    if (!nextPageLink) {
      const filmsArray = await getFilmsArray({ page, posters });

      await scrapper.closeBrowser(page);

      return filmsArray;
    }

    while (!allDataCollected) {
      const [currentPageFilms, nextPageURL] = await Promise.all([
        await getFilmsArray({ page, posters }),
        await scrapper.getNextPageURL(page),
      ]);

      if (currentPageFilms.status !== QUERY_RESULT_STATUS.ok)
        return {
          status: currentPageFilms.status,
          data: [],
          errorMessage: null,
        };

      listData.push(...currentPageFilms.data);

      if (!nextPageURL) {
        allDataCollected = true;
        await scrapper.closeBrowser(page);
        break;
      }

      await scrapper.gotoNextPage(page, `${MAIN_URL + nextPageURL}`);

      await scrapper.checkIfSelectorExists(".paginate-nextprev", page);
    }

    return {
      status: QUERY_RESULT_STATUS.ok,
      data: listData,
      errorMessage: null,
    };
  } catch (error) {
    return {
      status: QUERY_RESULT_STATUS.failed,
      data: [],
      errorMessage: ERROR_MESSAGES.try_catch_failed,
    };
  }
};

export const getFilmsArray = async ({
  page,
  posters = true,
}: ListScrapperProps) => {
  const listExistsOnPage = await scrapper.checkIfContainerHasChildren(page);
  const moviesData: MovieObjectProps[] = [];

  if (!listExistsOnPage) {
    return {
      status: QUERY_RESULT_STATUS.ok,
      data: [],
    };
  }

  const moviesContainers = await page.$$("div.film-poster");

  for (const movie of moviesContainers) {
    let poster: MoviePoster = null;
    const [id, title, slug] = (await Promise.allSettled([
      await page.evaluate((el) => el.getAttribute("data-film-id"), movie),
      await page.evaluate((el) => el.getAttribute("data-film-name"), movie),
      await page.evaluate((el) => el.getAttribute("data-film-slug"), movie),
    ])) as PromiseAllSettledProps<string | null>[];

    if (posters)
      poster = await movie.$eval(" div > img", (result) =>
        result.getAttribute("src")
      );

    if (
      id.status !== "fulfilled" ||
      title.status !== "fulfilled" ||
      slug.status !== "fulfilled" ||
      id.value !== "null" ||
      title.value !== "null" ||
      slug.value !== "null"
    )
      continue;

    moviesData.push({
      id: id.value,
      title: title.value,
      slug: slug.value,
      poster,
    });
  }

  return {
    status: QUERY_RESULT_STATUS.ok,
    data: moviesData,
  };
};
