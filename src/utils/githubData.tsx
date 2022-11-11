import axios from "axios";

// get github repos for a user
export const getRepos = async (username: string) => {
  const { data } = await axios.get(
    `https://api.github.com/users/${username}/repos`
  );
  return data;
};
