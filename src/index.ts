import "module-alias/register";
import { getPublicLists, getWatchlist } from "./user/user";
import { listByTitle } from "./lists/lists";
import { searchFilm } from "./film/film";

const ltbxdScrapper = {
  getWatchlist,
  listByTitle,
  getPublicLists,
  searchFilm,
};

async function testFunction() {
  // const userwatchlist = await ltbxdScrapper.getWatchlist({
  //   username: "maribelbhf",
  //   options: {
  //     posters: true,
  //   },
  // });

  // const publicList = await ltbxdScrapper.listByTitle({
  //   username: "maribelbhf",
  //   listTitle: "Peliculitas para asustarnos de manera uteana v1.0",
  //   options: {
  //     posters: false,
  //   },
  // });

  // const userLists = await ltbxdScrapper.getPublicLists({
  //   username: "maribelbhf",
  // });

  const searchForMovie = await ltbxdScrapper.searchFilm({
    title: "SAW",
  });

  console.log(searchForMovie);
}

testFunction();
