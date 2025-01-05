let currentPage = 1;
const itemsPerPage = 4;

function saveChord() {
    const title = document.getElementById('title').value.trim();
    const lyrics = document.getElementById('lyrics').value.trim();

    if (!title || !lyrics) {
        alert('Please enter both title and lyrics.');
        return;
    }

    const chords = JSON.parse(localStorage.getItem('chords')) || [];
    chords.push({ title, lyrics });
    localStorage.setItem('chords', JSON.stringify(chords));

    document.getElementById('title').value = '';
    document.getElementById('lyrics').value = '';

    renderChords();
}

function renderChords() {
    const chordList = document.getElementById('chordList');
    const chords = JSON.parse(localStorage.getItem('chords')) || [];
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();

    // Filter chords based on search query
    const filteredChords = chords.filter(chord =>
        chord.title.toLowerCase().includes(searchQuery)
    );

    // Pagination logic
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedChords = filteredChords.slice(start, end);

    chordList.innerHTML = '';
    paginatedChords.forEach((chord, index) => {
        const chordDiv = document.createElement('div');
        chordDiv.className = 'chord';
        chordDiv.innerHTML = `
            <h3>${chord.title}</h3>
            <button onclick="showLyrics('${escapeString(chord.title)}', '${escapeString(chord.lyrics)}')">View Lyrics</button>
            <button onclick="deleteChord(${start + index})">Delete</button>
            <button onclick="editChord(${start + index})">Edit</button> <!-- Edit Button -->
        `;
        chordList.appendChild(chordDiv);
    });

    renderPagination(filteredChords.length);
}

function renderPagination(totalItems) {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.onclick = () => {
            currentPage = i;
            renderChords();
        };
        if (i === currentPage) {
            button.style.backgroundColor = '#007bff';
            button.style.color = '#fff';
        }
        pagination.appendChild(button);
    }
}

function escapeString(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function showLyrics(title, lyrics) {
    const modal = document.getElementById('lyricsModal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalLyrics').textContent = lyrics.replace(/\\n/g, '\n');
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('lyricsModal');
    modal.style.display = 'none';
}

function deleteChord(index) {
    const chords = JSON.parse(localStorage.getItem('chords')) || [];
    chords.splice(index, 1);
    localStorage.setItem('chords', JSON.stringify(chords));

    renderChords();
}

function filterChords() {
    currentPage = 1;
    renderChords();
}

function editChord(index) {
    const chords = JSON.parse(localStorage.getItem('chords')) || [];
    const chord = chords[index];
    
    // Set the current title and lyrics in the input fields
    document.getElementById('title').value = chord.title;
    document.getElementById('lyrics').value = chord.lyrics;

    // Change the save button to "Update"
    const saveButton = document.querySelector('button[onclick="saveChord()"]');
    saveButton.textContent = 'Update Chord';
    saveButton.onclick = () => updateChord(index);  // Update logic on click
}

function updateChord(index) {
    const title = document.getElementById('title').value.trim();
    const lyrics = document.getElementById('lyrics').value.trim();

    if (!title || !lyrics) {
        alert('Please enter both title and lyrics.');
        return;
    }

    const chords = JSON.parse(localStorage.getItem('chords')) || [];
    chords[index] = { title, lyrics };  // Update the chord at the specified index
    localStorage.setItem('chords', JSON.stringify(chords));

    document.getElementById('title').value = '';
    document.getElementById('lyrics').value = '';
    
    // Change the button back to "Save"
    const saveButton = document.querySelector('button[onclick="updateChord()"]');
    saveButton.textContent = 'Save Chord';
    saveButton.onclick = saveChord;

    renderChords();
}

// Render chords on page load
renderChords();
