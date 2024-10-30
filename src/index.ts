import "module-alias/register";
import { getUserList } from "./lists/lists";

getUserList({
  username: "maribelbhf",
  category: "watchlist",
  options: {
    posters: true,
  },
});
