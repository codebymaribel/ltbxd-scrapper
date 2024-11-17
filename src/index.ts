import "module-alias/register";
import { getWatchlist } from "./user/user";
import { getListFilms, getPublicLists } from "./lists/lists";
import { searchFilm } from "./film/film";
import { measureFunctionTime } from "@/helpers";

const ltbxdScrapper = {
  getWatchlist,
  getListFilms,
  getPublicLists,
  searchFilm,
};

async function testFunction() {
  // const userwatchlist = await ltbxdScrapper.getWatchlist({
  //   username: "maribelbhf",
  //   options: {
  //     posters: false,
  //   },
  // });

  // const listMovies = await ltbxdScrapper.getListFilms({
  //   url: 'https://letterboxd.com/maribelbhf/list/si-me-pides-que-elija-una-pelicula-seria/',
  //   options: {
  //     posters: false,
  //   },
  // });

  // const userLists = await ltbxdScrapper.getPublicLists({
  //   username: "maribelbhf",
  // });

  // const searchForMovie = await ltbxdScrapper.searchFilm({
  //   title: "SAW",
  // });

  // console.log(listMovies.data.length);

  // const response = await measureFunctionTime(ltbxdScrapper.getWatchlist, {
  //   username: 'maribelbhf',
  // });

  //   const response = await measureFunctionTime(ltbxdScrapper.getListFilms,{
  //   url: 'https://letterboxd.com/anyaltman/list/romcoms-para-combatir-la-depresion-de-un/',
  //   options: {
  //     posters: false,
  //   },
  // });

  // const response = await measureFunctionTime(ltbxdScrapper.getPublicLists, {
  //   username: "anyaltman",
  // });

  console.log(response);
}

testFunction();
