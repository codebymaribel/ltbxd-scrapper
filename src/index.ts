import "module-alias/register";
import { getWatchlist } from "./user/user";
import { getListFilms, getPublicLists } from "./lists/lists";
import { searchFilm } from "./film/film";

export const ltbxdScrapper = {
  getWatchlist,
  getListFilms,
  getPublicLists,
  searchFilm,
};
