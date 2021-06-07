

const search = document.querySelector('.search');
const searchBtn = document.querySelector('.search-btn');
const closeBtn = document.querySelector('.close-btn');
const searchInput = document.querySelector('.search-location');

export const init = () => {

    searchBtn.addEventListener('click', ev => {
        search.classList.add('active');
        searchInput.classList.add('active');
        searchBtn.classList.add('active');
        closeBtn.classList.add('active');
    })
    
    closeBtn.addEventListener('click', ev => {
        search.classList.remove('active');
        searchInput.classList.remove('active');
        searchBtn.classList.remove('active');
        closeBtn.classList.remove('active');
    })

}

