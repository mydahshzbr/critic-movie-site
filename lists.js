document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("listGallery");
  const editor = document.getElementById("listEditor");
  const galleryGrid = document.getElementById("galleryGrid");
  
  // Form Elements
  const searchInput = document.getElementById("filmSearchInput");
  const resultsBox = document.getElementById("listSearchResults");
  const container = document.getElementById("selectedFilmsContainer");
  const saveBtn = document.getElementById("saveListBtn");
  const deleteBtn = document.getElementById("deleteListBtn");

  let currentEditingId = null;
  let selectedFilms = [];

  async function init() {
    renderGallery(); // Load lists from localStorage
    
    document.getElementById("showCreateForm").onclick = () => openEditor();
    document.getElementById("cancelBtn").onclick = () => closeEditor();
    
    searchInput.addEventListener("input", handleSearch);
    saveBtn.onclick = saveList;
    deleteBtn.onclick = deleteList;
  }

  // 1. LOAD: Get lists from Local Storage
  function renderGallery() {
    const userLists = JSON.parse(localStorage.getItem("critic_lists")) || [];
    galleryGrid.innerHTML = userLists.length ? "" : '<p class="empty-msg">You haven’t created any lists yet.</p>';
    
    userLists.forEach(list => {
      const card = document.createElement("div");
      card.className = "list-preview-card";
      
      const previewPosters = list.films.slice(0, 3).map(id => {
        const m = movies.find(movie => movie.id === id);
        return m ? `<img src="${m.poster}" class="stack-img">` : '';
      }).join('');

      card.innerHTML = `
        <div class="poster-stack">${previewPosters}</div>
        <div class="list-card-info">
          <h3>${list.name}</h3>
          <p>${list.films.length} films</p>
          <button class="btn-main" onclick="editListById(${list.id})">Edit</button>
        </div>
      `;
      galleryGrid.appendChild(card);
    });
  }

  // 2. OPEN EDITOR
  window.editListById = (id) => {
    const userLists = JSON.parse(localStorage.getItem("critic_lists")) || [];
    const list = userLists.find(l => l.id == id);
    if (list) openEditor(list);
  };

  function openEditor(list = null) {
    gallery.classList.add("hidden");
    editor.classList.remove("hidden");
    
    if (list) {
      currentEditingId = list.id;
      document.getElementById("editorTitle").textContent = "Edit List";
      document.getElementById("listName").value = list.name;
      document.getElementById("listDescription").value = list.description;
      document.getElementById("listTags").value = list.tags;
      document.getElementById("isRanked").checked = list.isRanked;
      
      selectedFilms = list.films.map(id => movies.find(m => m.id === id)).filter(Boolean);
      deleteBtn.classList.remove("hidden");
    } else {
      resetForm();
    }
    renderFilmGrid();
  }

  // 3. SAVE: Save to Local Storage
  function saveList() {
    const name = document.getElementById("listName").value.trim();
    if (!name) return alert("Please name your list.");

    const listData = {
      id: currentEditingId || Date.now(),
      name,
      description: document.getElementById("listDescription").value,
      tags: document.getElementById("listTags").value,
      isRanked: document.getElementById("isRanked").checked,
      films: selectedFilms.map(f => f.id)
    };

    let userLists = JSON.parse(localStorage.getItem("critic_lists")) || [];

    if (currentEditingId) {
      // Update existing
      const index = userLists.findIndex(l => l.id === currentEditingId);
      userLists[index] = listData;
    } else {
      // Add new
      userLists.unshift(listData);
    }

    localStorage.setItem("critic_lists", JSON.stringify(userLists));
    closeEditor();
    renderGallery();
  }

  // 4. DELETE: Remove from Local Storage
  function deleteList() {
    if (!confirm("Delete this list?")) return;
    let userLists = JSON.parse(localStorage.getItem("critic_lists")) || [];
    userLists = userLists.filter(l => l.id !== currentEditingId);
    localStorage.setItem("critic_lists", JSON.stringify(userLists));
    closeEditor();
    renderGallery();
  }

  // SEARCH logic remains the same but uses the local 'movies' array
  function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    resultsBox.innerHTML = "";
    if (!query) return resultsBox.classList.add("hidden");

    const filtered = movies.filter(m => m.title.toLowerCase().includes(query));
    resultsBox.classList.remove("hidden");
    filtered.forEach(m => {
      const div = document.createElement("div");
      div.className = "search-item";
      div.textContent = `${m.title} (${m.year})`;
      div.onclick = () => {
        if (!selectedFilms.find(f => f.id === m.id)) selectedFilms.push(m);
        renderFilmGrid();
        resultsBox.classList.add("hidden");
        searchInput.value = "";
      };
      resultsBox.appendChild(div);
    });
  }

  function renderFilmGrid() {
    if (selectedFilms.length === 0) {
      container.innerHTML = `<div class="empty-state"><h2>Your list is empty.</h2></div>`;
    } else {
      container.className = "selected-films-grid";
      container.innerHTML = selectedFilms.map((f, i) => `
        <div class="film-card-mini">
          <div class="remove-film" onclick="removeFilmFromList(${f.id})">×</div>
          <img src="${f.poster}">
          ${document.getElementById("isRanked").checked ? `<div class="rank-num">${i+1}</div>` : ''}
        </div>
      `).join("");
    }
  }

  window.removeFilmFromList = (id) => {
    selectedFilms = selectedFilms.filter(f => f.id !== id);
    renderFilmGrid();
  };

  function closeEditor() {
    gallery.classList.remove("hidden");
    editor.classList.add("hidden");
  }

  function resetForm() {
    currentEditingId = null;
    document.getElementById("editorTitle").textContent = "New List";
    document.getElementById("listName").value = "";
    document.getElementById("listDescription").value = "";
    document.getElementById("listTags").value = "";
    document.getElementById("isRanked").checked = false;
    selectedFilms = [];
    deleteBtn.classList.add("hidden");
  }

  init();
});