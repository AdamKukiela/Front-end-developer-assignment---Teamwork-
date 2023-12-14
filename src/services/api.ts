import { fetcher } from "./fetcher";

export const getPeople = async () => {
  const response = await fetcher("https://swapi.dev/api/people/");
  return response.results;
};
