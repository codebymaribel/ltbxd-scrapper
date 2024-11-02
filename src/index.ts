import "module-alias/register";
import list from "./lists/lists";
import user from "./user/user";

async function testFunction() {
  const userwatchlist = await user.getWatchlist({
    username: "maribelbhf",
    options: {
      posters: true,
    },
  });

  const publicList = await list.listByTitle({
    username: "maribelbhf",
    listTitle: "Peliculitas para asustarnos de manera uteana v1.0",
    options: {
      posters: false,
    },
  });

  const userLists = await user.getPublicLists({
    username: "maribelbhf"
  })

  console.log(userwatchlist.data.length)
}

testFunction();
