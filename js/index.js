const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const reposList = document.getElementById('reposList');
const toggleSearchTypeButton = document.getElementById('toggleSearchType');

let searchType = 'user';

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.ariaValueMax.trim();
    if (!query) return;


    try {
        const response = await fetch('https://api.github.com/${searchType}?q=${query}');
        const data = await response.json();
        displayResults(data.items);
    } catch (error) {
        console.error('Error', error);
    }
});

toggleSearchTypeButton.addEventListener('click', () => {
    searchType = searchType === 'users' ? 'repositories' : 'users';
    searchInput.placeholder = `Search GitHub ${searchType}`;
  });
  
  function displayResults(results) {
    searchResults.innerHTML = '';
    if (results.length === 0) {
      searchResults.innerHTML = 'No results found.';
      return;
    }
  
    results.forEach(result => {
      const { login, avatar_url, html_url } = result;
      const userElement = document.createElement('div');
      userElement.innerHTML = `
        <div>
          <img src="${avatar_url}" alt="${login}" width="50">
          <a href="${html_url}" target="_blank">${login}</a>
        </div>
      `;
      userElement.addEventListener('click', () => {
        fetchRepos(login);
      });
      searchResults.appendChild(userElement);
    });
  }
  
  async function fetchRepos(username) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      const repos = await response.json();
      displayRepos(repos);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  function displayRepos(repos) {
    reposList.innerHTML = '';
    if (repos.length === 0) {
      reposList.innerHTML = 'No repositories found.';
      return;
    }
  
    const reposElement = document.createElement('ul');
    repos.forEach(repo => {
      const repoItem = document.createElement('li');
      repoItem.textContent = repo.name;
      reposElement.appendChild(repoItem);
    });
    reposList.appendChild(reposElement);
  }