import { MAIN_URL } from "@/config";
import { ListCardProps, PromiseAllSettledProps } from "@/types";

export const listSummary = async ({ page }) => {
  const listsArray: ListCardProps[]= [];
  const listContainers = await page.$$(".list-set > section.list");

  for (const section of listContainers) {
    const [movieListID, title, movieURLSlug] = (await Promise.allSettled([
      await page.evaluate(
        (el) => el.getAttribute("data-film-list-id"),
        section
      ),
      await section.$eval(".film-list-summary > h2", (el) => el.textContent),
      await section.$eval("a", (el) => el.getAttribute("href")),
    ])) as PromiseAllSettledProps<string|null>[];

    if (
      movieListID.status !== "fulfilled" ||
      title.status !== "fulfilled" ||
      movieURLSlug.status !== "fulfilled" ||
      movieListID.value !== "null" ||
      title.value !== "null" ||
      movieURLSlug.value !== "null"
    )
      continue;

    const url = `${MAIN_URL + movieURLSlug}`;

    listsArray.push({
      id: movieListID.value,
      title: title.value,
      url,
    });
  }

  return listsArray;
};
