import { LIST_TYPES, MAIN_URL, QUERY_RESULT_STATUS } from "@/config";
import { ListCardProps, UserListProps } from "@/types";
import puppeteer from "puppeteer";
import { listSummary } from "./scrapper/lists/functions";

const getPublicLists = async (user: UserListProps) => {
  const { username } = user;

  try {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.goto(`${MAIN_URL}/${username}/${LIST_TYPES.lists}`);

    //Check if the list is empty

    const isItEmpty = await page
      .waitForSelector(".list-set", { timeout: 3000 })
      .then(() => false)
      .catch(() => true);

    if (isItEmpty) {
      return {
        status: QUERY_RESULT_STATUS.ok,
        data: [],
      };
    }

    const listsArray: ListCardProps[] = await listSummary({ page });

    return {
      status: QUERY_RESULT_STATUS.ok,
      data: listsArray,
    };
  } catch (error) {
    console.log(error);
  }
};

const user = {
  getPublicLists,
};

export default user;
