import "module-alias/register";
import { getWatchlist } from "./user/user";
import { getListFilms, getPublicLists } from "./lists/lists";
import { searchFilm } from "./film/film";

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
  //     posters: true,
  //   },
  // });

  const listMovies = await ltbxdScrapper.getListFilms({
    url: 'https://letterboxd.com/maribelbhf/list/si-me-pides-que-elija-una-pelicula-seria/',
    options: {
      posters: false,
    },
  });

  // const userLists = await ltbxdScrapper.getPublicLists({
  //   username: "maribelbhf",
  // });

  // const searchForMovie = await ltbxdScrapper.searchFilm({
  //   title: "SAW",
  // });

  console.log(listMovies.data.length);
}

testFunction();
