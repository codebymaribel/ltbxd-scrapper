type OptionsProps = {
  posters?: boolean;
};

export interface UserQueryProps {
  username: string;
  options?: OptionsProps;
}
