type QueryOptionsProps = {
  posters: boolean;
};

export interface UserQueryProps {
  username: string;
  category: "watchlist" | "films";
  options: QueryOptionsProps;
}
