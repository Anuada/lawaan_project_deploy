const form = document.getElementById('crudForm');
const itemList = document.getElementById('itemList');
const localStorageKey = 'foodMenuItems';

// Initialize items from localStorage
let items = JSON.parse(localStorage.getItem(localStorageKey)) || {
  monday: { breakfast: '', lunch: '', dinner: '' },
  tuesday: { breakfast: '', lunch: '', dinner: '' },
  wednesday: { breakfast: '', lunch: '', dinner: '' },
  thursday: { breakfast: '', lunch: '', dinner: '' },
  friday: { breakfast: '', lunch: '', dinner: '' },
  saturday: { breakfast: '', lunch: '', dinner: '' },
  sunday: { breakfast: '', lunch: '', dinner: '' }
};

// Render items
function renderItems() {
  itemList.innerHTML = '';
  const table = document.createElement('table');
  table.className = 'table table-bordered';

  // Create table header
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Day</th>
      <th>Breakfast</th>
      <th>Lunch</th>
      <th>Dinner</th>
      <th>Actions</th>
    </tr>
  `;
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');
  for (const day in items) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${day.toUpperCase()}</strong></td>
      <td>${items[day].breakfast || 'No menu set'}</td>
      <td>${items[day].lunch || 'No menu set'}</td>
      <td>${items[day].dinner || 'No menu set'}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick="editItem('${day}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteItem('${day}')">Clear</button>
      </td>
    `;
    tbody.appendChild(row);
  }
  table.appendChild(tbody);
  itemList.appendChild(table);
}

// Add or update item
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputs = form.querySelectorAll('input');
  inputs.forEach((input) => {
    const [day, meal] = input.id.split(/(?=[A-Z])/); // Split ID into day and meal
    const value = input.value.trim();
    if (value) {
      if (!items[day]) {
        items[day] = { breakfast: '', lunch: '', dinner: '' };
      }
      items[day][meal.toLowerCase()] = value; // Update the menu for the specific day and meal
    }
  });
  localStorage.setItem(localStorageKey, JSON.stringify(items));
  renderItems();
  form.reset();
});

// Edit item
function editItem(day) {
  const updatedBreakfast = prompt(`Edit breakfast for ${day.toUpperCase()}:`, items[day].breakfast);
  const updatedLunch = prompt(`Edit lunch for ${day.toUpperCase()}:`, items[day].lunch);
  const updatedDinner = prompt(`Edit dinner for ${day.toUpperCase()}:`, items[day].dinner);

  if (updatedBreakfast !== null && updatedBreakfast.trim()) {
    items[day].breakfast = updatedBreakfast;
  }
  if (updatedLunch !== null && updatedLunch.trim()) {
    items[day].lunch = updatedLunch;
  }
  if (updatedDinner !== null && updatedDinner.trim()) {
    items[day].dinner = updatedDinner;
  }

  localStorage.setItem(localStorageKey, JSON.stringify(items));
  renderItems();
}

// Delete item (clear menu for a specific day)
function deleteItem(day) {
  items[day] = { breakfast: '', lunch: '', dinner: '' }; // Clear the menu for the specific day
  localStorage.setItem(localStorageKey, JSON.stringify(items));
  renderItems();
}

// Initial render
renderItems();
