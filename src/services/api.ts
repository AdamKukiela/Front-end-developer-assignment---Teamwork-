import { fetcher } from "./fetcher";

export const getPeople = async () => {
  const response = await fetcher("https://swapi.dev/api/people/");
  return response.results;
};

export const getPlanet = async (planetUrl: string) => {
  const response = await fetcher(planetUrl);
  return response;
};
