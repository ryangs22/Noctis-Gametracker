const API_KEY = 'f72b1bbe34aa416c8a16705624de5b7f';
const BASE_URL = 'https://api.rawg.io/api';

const getDates = () => {
  const now = new Date();
  const yearAgo = new Date();
  const tenYearsAgo = new Date();
  yearAgo.setFullYear(now.getFullYear() - 1);
  tenYearsAgo.setFullYear(now.getFullYear() - 10);
  
  const formatDate = (d) => d.toISOString().split('T')[0];
  return { 
    now: formatDate(now), 
    yearAgo: formatDate(yearAgo),
    tenYearsAgo: formatDate(tenYearsAgo)
  };
};

const formatGameInfo = (rawgGame) => {
  const genresList = rawgGame.genres ? rawgGame.genres.map(g => g.name) : [];
  
  const platformsArray = rawgGame.parent_platforms 
    ? rawgGame.parent_platforms.map(p => p.platform.name) 
    : [];

  return {
    id: rawgGame.id.toString(), 
    title: rawgGame.name,
    cover: rawgGame.background_image || 'https://via.placeholder.com/300x400?text=Sem+Capa',
    rating: rawgGame.rating, // Nota da comunidade (ex: 4.47)
    released: rawgGame.released, // Data completa para o Modal usar
    releaseYear: rawgGame.released ? rawgGame.released.substring(0, 4) : 'N/A', 
    genres: genresList,
    platforms: platformsArray,
    developer: rawgGame.developers ? rawgGame.developers[0]?.name : 'Desenvolvedora Desconhecida',
    description: rawgGame.description_raw || rawgGame.description || '', 
  };
};

export const getGameDetails = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);
    const data = await response.json();
    return formatGameInfo(data);
  } catch (error) {
    return null;
  }
};;

export const getTopRatedGames = async () => {
  const { now, tenYearsAgo } = getDates();
  try {
    const response = await fetch(`${BASE_URL}/games?key=${API_KEY}&ordering=-metacritic&dates=${tenYearsAgo},${now}&page_size=5`);
    const data = await response.json();
    return data.results.map(formatGameInfo);
  } catch (error) {
    return [];
  }
};

export const getTrendingGames = async () => {
  const { now, yearAgo } = getDates();
  try {
    const response = await fetch(`${BASE_URL}/games?key=${API_KEY}&dates=${yearAgo},${now}&ordering=-added&page_size=40`);
    const data = await response.json();
    return data.results.map(formatGameInfo);
  } catch (error) {
    return [];
  }
};

export const getExploreGames = async () => {
  try {
    const randomPage = Math.floor(Math.random() * 15) + 1; 
    const response = await fetch(`${BASE_URL}/games?key=${API_KEY}&metacritic=80,100&page=${randomPage}&page_size=40`);
    const data = await response.json();
    return data.results.map(formatGameInfo);
  } catch (error) {
    return [];
  }
};

export const searchGames = async (query) => {
  if (!query) return [];
  try {
    const response = await fetch(`${BASE_URL}/games?key=${API_KEY}&search=${query}&page_size=40`);
    const data = await response.json();
    return data.results.map(formatGameInfo);
  } catch (error) {
    return [];
  }
};