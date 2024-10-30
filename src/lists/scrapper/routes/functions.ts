import { wait } from "@/helpers";

export const isThereAnotherPage = async ({ page }) => {
    try {
      const isThereAnotherPage = await page
        .$eval(".paginate-nextprev", () => true)
        .catch(() => false);
  
      return isThereAnotherPage;
    } catch (error) {
      //TODO como validar el error del catch apropiadamente
      return false;
    }
  };
  
  export const nextPageURL = async ({ page }) => {
    try {
      const nextPageLink = await page.evaluate(() => {
        try {
          const element = document.querySelector(".next");
          const href = (element as HTMLAnchorElement).href;
          return href;
        } catch (error) {
          return null;
        }
      });
  
      return nextPageLink;
    } catch (error) {
      //TODO como validar el error del catch apropiadamente
      return null;
    }
  };
  
  export const handleLazyLoad = async ({ page }) => {
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