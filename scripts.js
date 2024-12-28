const form = document.getElementById('receipt-form');
const container = document.getElementById('receipt-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const searchInput = document.getElementById('search-input');
const receiptsPerPage = 10;
let currentPage = 1;
let filteredReceipts = [];

// Retrieve receipts from localStorage
const getReceipts = () => JSON.parse(localStorage.getItem('receipts')) || [];

// Save receipts to localStorage
const saveReceipts = (receipts) => localStorage.setItem('receipts', JSON.stringify(receipts));

// Search receipts based on name or description
const searchReceipts = () => {
    const query = searchInput.value.toLowerCase();
    const receipts = getReceipts();
    filteredReceipts = receipts.filter(receipt => 
        receipt.name.toLowerCase().includes(query) || 
        receipt.description.toLowerCase().includes(query)
    );
    currentPage = 1; // Reset to first page on new search
    renderReceipts();
};

// Render the receipts as cards with pagination
const renderReceipts = () => {
    const receipts = filteredReceipts.length > 0 ? filteredReceipts : getReceipts();
    const totalPages = Math.ceil(receipts.length / receiptsPerPage);
    const start = (currentPage - 1) * receiptsPerPage;
    const end = start + receiptsPerPage;
    const receiptsToRender = receipts.slice(start, end);

    container.innerHTML = '';
    receiptsToRender.forEach((receipt, index) => {
        const card = document.createElement('div');
        card.classList.add('receipt-card');
        card.innerHTML = `
            <h3>${receipt.name}</h3>
            <p><strong>Description:</strong> ${receipt.description}</p>
            <p><strong>Amount:</strong> ₱${receipt.amount.toFixed(2)}</p>
            <p><strong>Date:</strong> ${receipt.date}</p>
            <button onclick="editReceipt(${index + start})">Edit</button>
            <button class="delete-btn" onclick="deleteReceipt(${index + start})">Delete</button>
        `;
        container.appendChild(card);
    });

    // Update button states
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
};

// Navigate through pages
const navigatePage = (direction) => {
    const receipts = filteredReceipts.length > 0 ? filteredReceipts : getReceipts();
    const totalPages = Math.ceil(receipts.length / receiptsPerPage);

    if (direction === 'next' && currentPage < totalPages) {
        currentPage++;
    } else if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    }

    renderReceipts();
};

// Add a new receipt
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const dateInput = document.getElementById('date').value;
    const date = dateInput ? new Date(dateInput).toLocaleDateString() : new Date().toLocaleDateString();

    const receipts = getReceipts();
    receipts.push({ name, description, amount, date });
    saveReceipts(receipts);

    renderReceipts();
    form.reset();
});

// Edit a receipt
window.editReceipt = (index) => {
    const receipts = getReceipts();
    const receipt = receipts[index];

    document.getElementById('name').value = receipt.name;
    document.getElementById('description').value = receipt.description;
    document.getElementById('amount').value = receipt.amount;
    document.getElementById('date').value = new Date(receipt.date).toISOString().split('T')[0];

    receipts.splice(index, 1); // Remove the old receipt
    saveReceipts(receipts);
    renderReceipts();
};

// Delete a receipt
window.deleteReceipt = (index) => {
    const receipts = getReceipts();
    receipts.splice(index, 1);
    saveReceipts(receipts);
    renderReceipts();
};

// Print all receipts with pagination (10 per page)
window.printAllReceipts = () => {
    const receipts = getReceipts();
    if (receipts.length === 0) {
        alert('No receipts to print.');
        return;
    }

    const totalPages = Math.ceil(receipts.length / receiptsPerPage);
    let printHTML = '';

    for (let page = 1; page <= totalPages; page++) {
        const start = (page - 1) * receiptsPerPage;
        const end = start + receiptsPerPage;
        const receiptsToPrint = receipts.slice(start, end);

        printHTML += `
            <div class="page">
                <h1>Receipts - Page ${page}</h1>
                <div class="receipt-container">
                    ${receiptsToPrint.map(receipt => `
                        <div class="receipt">
                            <h3>${receipt.name}</h3>
                            <p><strong>Description:</strong> ${receipt.description}</p>
                            <p><strong>Amount:</strong> ₱${receipt.amount.toFixed(2)}</p>
                            <p><strong>Date:</strong> ${receipt.date}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div style="page-break-before: always;"></div>
        `;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Print All Receipts</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }
                .receipt-container {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                    margin-top: 20px;
                }
                .receipt {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    margin-bottom: 20px;
                }
                h3, p {
                    margin: 5px 0;
                }
                .page {
                    margin-bottom: 40px;
                }
                @media print {
                    body {
                        margin: 0;
                    }
                    .receipt-container {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 20px;
                        margin: 0;
                    }
                    .receipt {
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        margin-bottom: 20px;
                        page-break-inside: avoid;
                    }
                    @page {
                        size: A4;
                        margin: 0;
                    }
                }
            </style>
        </head>
        <body>
            ${printHTML}
            <script>
                window.print();
                setTimeout(() => window.close(), 1000);
            </script>
        </body>
        </html>
    `);
};

// Initial render
renderReceipts();
