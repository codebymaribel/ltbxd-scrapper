import puppeteer, { Page } from 'puppeteer';

import { ERROR_MESSAGES, QUERY_RESULT_STATUS } from '../config/constants';
import { checkIfValidURL } from '../tools/tools';

const getPageInstance = async (
  url: string,
  unwantedElements: string[] = [],
) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });

  const page = await browser.newPage();
  if (unwantedElements && unwantedElements.length > 0)
    await preventElementLoad(page, unwantedElements);

  if (!url) {
    return {
      status: QUERY_RESULT_STATUS.failed,
      data: [],
      errorMessage: ERROR_MESSAGES.missing_parameters,
    };
  }

  const isTheURLValid = checkIfValidURL(url);

  if (!isTheURLValid) {
    return {
      status: QUERY_RESULT_STATUS.failed,
      data: [],
      errorMessage: ERROR_MESSAGES.not_valid_url,
    };
  }

  try {
    const urlResponse = await page.goto(url, { waitUntil: 'domcontentloaded' });

    if (urlResponse?.status() === 404) {
      return {
        status: QUERY_RESULT_STATUS.not_found,
        page: null,
        errorMessage: ERROR_MESSAGES.page_not_found,
      };
    }

    return {
      status: QUERY_RESULT_STATUS.ok,
      page: page,
      errorMessage: null,
    };
  } catch (error) {
    await browser.close();
    return {
      status: QUERY_RESULT_STATUS.error,
      page: null,
      errorMessage: `${ERROR_MESSAGES.scrapper_method_failed} - ${error}`,
    };
  }
};

const closeBrowser = async (page: Page) => {
  await page.browser().close();
};

const gotoNextPage = async (page: Page, url: string) =>
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
  });

const preventElementLoad = async (page: Page, elements: string[]) => {
  await page.setRequestInterception(true);

  page.on('request', (request) => {
    if (elements.indexOf(request.resourceType()) !== -1) {
      return request.abort();
    }
    request.continue();
  });
};

const checkIfSelectorExists = async (selectorString: string, page: Page) => {
  try {
    const doesSelectorExists = await page
      .waitForSelector(selectorString, { timeout: 1000 })
      .then(() => true)
      .catch(() => false);

    return {
      status: QUERY_RESULT_STATUS.ok,
      response: doesSelectorExists,
      errorMessage: null,
    };
  } catch (error) {
    return {
      status: QUERY_RESULT_STATUS.failed,
      response: null,
      errorMessage: `${ERROR_MESSAGES.scrapper_method_failed} - ${error}`,
    };
  }
};

const checkIfContainerHasChildren = async (page: Page) => {
  try {
    const filmElementExists: boolean = await page
      .$$eval('div.film-poster', (elementsArray) => elementsArray.length > 0)
      .catch(() => false);
    return {
      status: QUERY_RESULT_STATUS.ok,
      response: filmElementExists,
      errorMessage: null,
    };
  } catch (error) {
    return {
      status: QUERY_RESULT_STATUS.failed,
      response: null,
      errorMessage: `${ERROR_MESSAGES.scrapper_method_failed} - ${error}`,
    };
  }
};

const getNextPageURL = async (page: Page) => {
  try {
    const nextPageContainer = await page.$('a.next');
    const nextPageLink = nextPageContainer
      ? await page.evaluate((el) => el.getAttribute('href'), nextPageContainer)
      : null;

    return {
      status: QUERY_RESULT_STATUS.ok,
      response: nextPageLink,
      errorMessage: null,
    };
  } catch (error) {
    return {
      status: QUERY_RESULT_STATUS.failed,
      response: null,
      errorMessage: `${ERROR_MESSAGES.scrapper_method_failed} - ${error}`,
    };
  }
};

const scrapper = {
  getPageInstance,
  checkIfSelectorExists,
  closeBrowser,
  getNextPageURL,
  checkIfContainerHasChildren,
  gotoNextPage,
};

export default scrapper;
