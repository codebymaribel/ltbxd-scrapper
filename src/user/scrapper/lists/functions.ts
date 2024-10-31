import { MAIN_URL } from "@/config";
import { takeScreenshot } from "@/helpers";
import { ListCardProps } from "@/types";

export const listSummary = async ({ page }) => {
  const listsArray: ListCardProps[] = [];
  const listContainers = await page.$$(".list-set > section.list");

  for (const section of listContainers) {
    const movieListID = await page.evaluate(el => el.getAttribute("data-film-list-id"), section)
    const title = await section.$eval(
      ".film-list-summary > h2",
      (el) => el.textContent
    );
    const movieURLSlug = await section.$eval("a", (el) =>
      el.getAttribute("href")
    );
    const url = `${MAIN_URL + movieURLSlug}`;

    listsArray.push({
      id: movieListID,
      title,
      url,
    });
  }

  return listsArray
};
