const API_KEY = "";
const BASE_URL = "http://localhost:4000";

export const getPopularBundles = async () => {
  console.log("try")
  const response = await fetch(`${BASE_URL}/bundles`);
  const data = await response.json();
  console.log(data)
  return data;
};

export const searchBundles = async (query) => {
  const response = await fetch(`${BASE_URL}/bundles`);
  const data = await response.json();
  return data.results;
};
