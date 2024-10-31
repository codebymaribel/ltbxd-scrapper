import "module-alias/register";
import getList from "./lists/lists";
import user from "./user/user";

async function testFunction() {
  const userwatchlist = await getList.watchlist({
    username: "maribelbhf",
    options: {
      posters: true,
    },
  });

  const publicList = await getList.listByTitle({
    username: "maribelbhf",
    listTitle: "Peliculitas para asustarnos de manera uteana v1.0",
    options: {
      posters: false,
    },
  });

  //TODO check if user exists

  const userLists = await user.getPublicLists({
    username: "maribelbhf"
  })

  // console.log(publicList.data.length);

  console.log(userLists)
}

testFunction();
