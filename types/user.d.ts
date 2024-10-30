type OptionsProps = {
  posters?: boolean;
};

export interface UserListProps {
  username: string;
  options?: OptionsProps;
}

export interface ListByTitleProps extends UserListProps {
  listTitle: string;
}

export interface ListByURLProps {
  listURL: string;
  options?: OptionsProps;
}
