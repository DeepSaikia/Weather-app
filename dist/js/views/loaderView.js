export const renderLoader = (parent) => {
     
    const loader =  `<div class="loader-container">
                        <div class="dot dot1"></div>
                        <div class="dot dot2"></div>
                        <div class="dot dot3"></div>    
                    </div>`
    
    parent.classList.toggle('active');
    parent.innerHTML = loader;
        
}

export const clearLoader = (parent) => {
    parent.classList.toggle('active');
    parent.innerHTML = ''    
}
