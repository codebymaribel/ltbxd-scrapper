import { LIST_TYPES, MAIN_URL, QUERY_RESULT_STATUS } from "@/config";
import { ListCardProps, UserListProps } from "@/types";
import puppeteer, { Page } from "puppeteer";
import { listSummary } from "./functions";
import scrapper from "../shared/scrapper";

const getPublicLists = async (user: UserListProps) => {
  const { username } = user;

  try {
    const { status, page } = await scrapper.getPageInstance(
      `${MAIN_URL}/${username}/${LIST_TYPES.lists}`
    );

    if (status !== QUERY_RESULT_STATUS.ok) {
      if (page) await scrapper.closeBrowser(page);
      return {
        status,
        data: [],
      };
    }

    const areThereAnyLists = await scrapper.checkIfSelectorExists(
      ".list-set",
      page
    );

    if (!areThereAnyLists) {
      return {
        status: QUERY_RESULT_STATUS.ok,
        data: [],
      };
    }

    const listsArray: ListCardProps[] = await listSummary({ page });

    await scrapper.closeBrowser(page);

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
