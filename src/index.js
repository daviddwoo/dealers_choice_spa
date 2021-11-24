const axios = require('axios');

const userList = document.getElementById('users');
const languageList = document.getElementById('languages');
const currentList = document.getElementById('current');

let users, languages, currents;

const renderUsers = () => {
    const html = users.map((user) => `
      <li>
        <a href='#${user.id}'>
          ${user.name}
        </a>
      </li>
    `).join('');
    userList.innerHTML = html;
};

const renderLanguages = () => {
    const html = languages.map((lang) => `
      <li>
          ${lang.name}
        <button data-id='${lang.id}'>Add Language</button>
      </li>
    `).join('');
    languageList.innerHTML = html;
};

const renderCurrent = () => {
    const html = currents.map((curr) => {
        const language = languages.find((lang) => lang.id === curr.languageId);
        return `
          <li>
            ${language.name}
            <button data-id='${curr.id}'>Delete</button>
          </li>
        `
    }).join('');
    currentList.innerHTML = html;
    renderLanguages();
};

const getCurrent = async() => {
    const userId = window.location.hash.slice(1);
    currents = (await axios.get(`/users/${userId}/learnings`)).data;
    renderCurrent();
};

languageList.addEventListener('click', async(ev) => {
    if(ev.target.tagName === 'BUTTON') {
        const userId = window.location.hash.slice(1);
        const languageId = ev.target.getAttribute('data-id');
        const response = (await axios.post(`/users/${userId}/learnings`, {languageId})).data;
        currents.push(response);
        renderCurrent();
    }
});

currentList.addEventListener('click', async(ev) => {
    if(ev.target.tagName === 'BUTTON') {
        const learningId = ev.target.getAttribute('data-id');
        await axios.delete(`/learnings/${learningId}`);
        currents = currents.filter((current) => current.id !== learningId * 1)
        renderCurrent();
    }
})

window.addEventListener('hashchange', async()=> {
    renderUsers();
    getCurrent();
});

const setup = async() => {
    users = (await axios.get('/users')).data;
    languages = (await axios.get('/languages')).data;
    renderUsers();
    const userId = window.location.hash.slice(1);
    if(!userId) window.location.hash = users[0].id;
    if(userId) getCurrent()
}

setup();