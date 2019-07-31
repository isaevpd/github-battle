import axios from 'axios';

const GITHUB_API_KEY = 'IM_API_KEY';
const GITHUB_SECRET = 'IM_API_SECRET';
const params = `?client_id=${GITHUB_API_KEY}&client_secret=${GITHUB_SECRET}`;

const getProfile = username => {
  return axios.get(`https://api.github.com/users/${username}${params}`)
    .then(user => user.data);
};

const getRepos = username => {
  return axios.get(`https://api.github.com/users/${username}/repos${params}&per_page=100`)
};

const getStarCount = repos => {
  return repos.data.reduce((count, repo) => count + repo.stargazers_count, 0);
};

const calculateScore = (profile, repos) => {
  const followers = profile.followers;
  const totalStars = getStarCount(repos);
  return (followers * 3) + totalStars;
};

const handleError = error => {
  console.warn(error);
  return null;
};

const getUserData = player => {
  return axios.all([
    getProfile(player),
    getRepos(player)
  ]).then(function (data) {
    const [profile, repos] = data;
    return {
      profile: profile,
      score: calculateScore(profile, repos)
    }
  });
};

const sortPlayers = players => {
  return players.sort(function (first, second) {
    return first.score - second.score;
  });
};

export const battle = players => {
  return axios.all(players.map(getUserData))
    .then(sortPlayers)
    .catch(handleError);
};

export const fetchPopularRepos = language => {
  const encodedURI = window.encodeURI('https://api.github.com/search/repositories?q=stars:>1+language:'+ language + '&sort=stars&order=desc&type=Repositories');
  return axios.get(encodedURI).then(response => response.data.items);
};
