import { QUERY_RESULT_STATUS } from "@/config";
import puppeteer from "puppeteer";

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

const closeBrowser = async(page) => {
    await page.browser().close();
}

const checkIfEmptyContainer = async (selectorString = "", page) => {
  const doesSelectorExists = page
    .waitForSelector(selectorString, { timeout: 3000 })
    .then(() => true)
    .catch(() => false);

  return doesSelectorExists;
};

const scrapper = {
  getPageInstance,
  checkIfEmptyContainer,
  closeBrowser
};

export default scrapper;
