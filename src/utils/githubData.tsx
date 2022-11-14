import axios from "axios";

// get github repos for a user
export const getRepos = async (username: string) => {
  const { data } = await axios.get(
    `https://api.github.com/users/${username}/repos`
  );
  return data;
};

export const getRawFile = async (repo: string, branch: string) => {
  const { data } = await axios.get(`https://raw.githubusercontent.com/jleg13/${repo}/${branch}/README.md`);
  return data;
}
