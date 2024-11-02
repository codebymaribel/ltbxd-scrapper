import puppeteer, { Page } from "puppeteer";
import { QUERY_RESULT_STATUS } from "@/config";
import { wait } from "@/helpers";

const getPageInstance = async (url: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const urlResponse = await page.goto(url);

    if (urlResponse?.status() === 404) {
      return {
        status: QUERY_RESULT_STATUS.not_found,
        page: null,
      };
    }

    return {
      status: QUERY_RESULT_STATUS.ok,
      page: page,
    };
  } catch (error) {
    await browser.close();
    return {
      status: QUERY_RESULT_STATUS.error,
      page: null,
    };
  }
};

const closeBrowser = async (page: Page) => {
  await page.browser().close();
};

const checkIfSelectorExists = async (selectorString: string, page: Page) => {
  const doesSelectorExists = page
    .waitForSelector(selectorString, { timeout: 3000 })
    .then(() => true)
    .catch(() => false);

  return doesSelectorExists;
};

const checkIfContainerHasChildren = async (page: Page) => {
  try {
    const filmElementExists: boolean = await page
      .$$eval("div.film-poster", (elementsArray) => elementsArray.length > 0)
      .catch(() => false);
    return filmElementExists;
  } catch (error) {
    //TODO como validar el error del catch apropiadamente
    return false;
  }
};

const getNextPageURL = async (page: Page) => {
  try {
    const nextPageContainer = await page.$("a.next");
    const nextPageLink = nextPageContainer
      ? await page.evaluate((el) => el.getAttribute("href"), nextPageContainer)
      : null;

    if (!nextPageLink) return null;

    return nextPageLink;
  } catch (error) {
    //TODO como validar el error del catch apropiadamente
    return null;
  }
};

const handleLazyLoad = async (page: Page) => {
  // Get body final height
  const totalHeight: number = await page.evaluate(
    () => document.querySelector("body")?.scrollHeight || 0
  );

  let currentHeight: number = 0;

  // get current viewportHeight
  const viewportHeight: number = page.viewport()?.height || 0;

  if (viewportHeight === currentHeight) return;

  while (currentHeight + viewportHeight < totalHeight) {
    await page.evaluate(
      (_currentHeight: number, _viewportHeight: number) => {
        window.scrollBy(_currentHeight, _viewportHeight);
      },
      currentHeight,
      viewportHeight
    );
    await wait(2000);

    currentHeight = currentHeight + viewportHeight;
  }
};

const scrapper = {
  getPageInstance,
  checkIfSelectorExists,
  closeBrowser,
  getNextPageURL,
  checkIfContainerHasChildren,
  handleLazyLoad,
};

export default scrapper;
