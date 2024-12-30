// Initialize Cash Book
let cashBook = JSON.parse(localStorage.getItem("cashBook")) || [];
const cashBookBody = document.getElementById("cashBookBody");
const totalAmount = document.getElementById("totalAmount");
const balanceAmount = document.getElementById("balanceAmount");

// Load balance from localStorage
const savedBalance = parseFloat(localStorage.getItem("balance")) || 0;
document.getElementById("balance").value = savedBalance;
updateTable();

// Load responsible person from localStorage
const savedResponsiblePerson = localStorage.getItem("responsiblePerson") || "[Your Name Here]";
document.getElementById("responsiblePerson").value = savedResponsiblePerson;
document.getElementById("footerResponsiblePerson").textContent = savedResponsiblePerson;

// Function to update the table, total, and balance
function updateTable() {
  const balance = parseFloat(document.getElementById("balance").value) || 0;
  let total = 0;

  // Clear the table body
  cashBookBody.innerHTML = "";

  // Loop through the cashBook entries and add them to the table
  cashBook.forEach((entry, index) => {
    total += entry.amount;
    const row = `
      <tr>
        <td>${entry.item}</td>
        <td>${entry.amount.toFixed(2)}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="updateItem(${index})">Update</button>
          <button class="btn btn-danger btn-sm" onclick="deleteItem(${index})">Delete</button>
        </td>
      </tr>
    `;
    cashBookBody.innerHTML += row;
  });

  // Update balance and total display
  const remainingBalance = balance - total;
  balanceAmount.textContent = remainingBalance.toFixed(2);
  totalAmount.textContent = total.toFixed(2);

  // Save the updated cashBook to localStorage
  localStorage.setItem("cashBook", JSON.stringify(cashBook));
}

// Function to save the balance to localStorage
function saveBalance() {
  const balance = document.getElementById("balance").value;
  localStorage.setItem("balance", balance);
}

// Function to delete the balance (reset to 0)
function deleteBalance() {
  localStorage.removeItem("balance");
  document.getElementById("balance").value = 0;
  updateTable();
}

// Function to add an item to the cashBook
function addItem() {
  const item = document.getElementById("item").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);

  // Validate input fields
  if (!item || isNaN(amount)) {
    alert("Please fill out all fields correctly.");
    return;
  }

  // Add the new item to the cashBook
  cashBook.push({ item, amount });
  document.getElementById("item").value = ""; // Clear item input
  document.getElementById("amount").value = ""; // Clear amount input
  updateTable(); // Update the table
}

// Function to update an item in the cashBook
function updateItem(index) {
  const item = prompt("Enter new item name:", cashBook[index].item);
  const amount = parseFloat(prompt("Enter new amount:", cashBook[index].amount));

  // Validate the updated input
  if (item && !isNaN(amount)) {
    cashBook[index] = { item, amount }; // Update the item
    updateTable(); // Refresh the table
  } else {
    alert("Invalid input. Update canceled.");
  }
}

// Function to delete an item from the cashBook
function deleteItem(index) {
  cashBook.splice(index, 1); // Remove the item at the given index
  updateTable(); // Refresh the table
}

// Add or update the responsible person's name
function addResponsiblePerson() {
  const name = document.getElementById("responsiblePerson").value.trim() || "[Your Name Here]";
  localStorage.setItem("responsiblePerson", name); // Save to localStorage
  document.getElementById("footerResponsiblePerson").textContent = name; // Update footer dynamically
  alert("Responsible person updated successfully!");
}

// Download PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf; // Get jsPDF object
    const doc = new jsPDF(); // Create a new PDF instance

    // Get responsible person and current date/time
    const responsiblePerson = document.getElementById("responsiblePerson").value || 'Unknown';
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    // Add title to the PDF
    doc.setFontSize(16);
    doc.text("Cash Book", 14, 20); // Title placement

    // Add responsible person and current date/time
    doc.setFontSize(12);
    doc.text(`Responsible Person: ${responsiblePerson}`, 14, 30); // Responsible person placement
    doc.text(`Date: ${currentDate}`, 14, 35); // Date placement
    doc.text(`Time: ${currentTime}`, 14, 40); // Time placement

    // Add table headers
    const headers = ['Item', 'Amount'];
    const rows = cashBook.map(entry => [entry.item, entry.amount.toFixed(2)]);

    // Add the table to the PDF
    doc.autoTable({
        head: [headers],
        body: rows,
        startY: 50, // Starting Y position for the table
        theme: 'grid', // Style of the table
        headStyles: { fillColor: [22, 160, 133] }, // Custom header color
        styles: { cellPadding: 2, fontSize: 10 } // Table cell styles
    });

    // Add the total and remaining balance below the table
    const total = parseFloat(totalAmount.textContent);
    const remainingBalance = parseFloat(balanceAmount.textContent);

    doc.setFontSize(12);
    doc.text(`Total: ${total.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10); // Total row position
    doc.text(`Remaining Balance: ${remainingBalance.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 20); // Balance row position

    // Save the PDF with the name 'cashbook.pdf'
    doc.save("cashbook.pdf");
}

