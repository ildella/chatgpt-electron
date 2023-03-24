console.info('PRELOAD')

const { ipcRenderer } = require('electron')

ipcRenderer.on('request-find-in-page', () => {
  let searchInput = document.getElementById('search-input')
  
  if (!searchInput) {
    searchInput = document.createElement('input')
    searchInput.id = 'search-input'
    searchInput.placeholder = 'Type to search...'
    searchInput.style.position = 'fixed'
    searchInput.style.top = '10px'
    searchInput.style.right = '10px'
    searchInput.style.zIndex = '1000'
    
    document.body.appendChild(searchInput)
  }

  searchInput.style.display = 'block' 
  searchInput.focus()

  let firstInput = true
  searchInput.addEventListener('input', event => {
    const searchText = searchInput.value
    const options = {
      forward: true,
      // findNext: true,
      findNext: firstInput ? false : true,
      matchCase: false,
      wordStart: false,
    }

    ipcRenderer.send('find-in-page', searchText, options)
    firstInput = false
  })

  ipcRenderer.on('restore-focus', event => {
    console.info('restore-focus event')
    searchInput.focus()
  })

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      ipcRenderer.send('stop-find-in-page', 'keepSelection');
      // firstInput = true
      // document.body.removeChild(searchInput)
      searchInput.style.display = 'none' 
    }
  })

})
