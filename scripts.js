const form = document.getElementById('receipt-form');
const container = document.getElementById('receipt-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const searchInput = document.getElementById('search-input');
const downloadPdfBtn = document.getElementById('download-pdf-btn');
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

    let printHTML = `
        <div>
            <h1 style="text-align: center;">Receipts</h1>
            <div class="receipt-container">
                ${receipts.map(receipt => `
                    <div class="receipt">
                        <h3>${receipt.name}</h3>
                        <p><strong>Description:</strong> ${receipt.description}</p>
                        <p><strong>Amount:</strong> ₱${receipt.amount.toFixed(2)}</p>
                        <p><strong>Date:</strong> ${receipt.date}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Print Receipts</title>
            <style>
            body {
                font-family: Arial, sans-serif;
                padding: 10px;
                margin: 0;
            }
            .receipt-container {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                justify-content: center;
                margin-top: 10px;
                background-color: #f9f9f9; /* Light gray background for better readability */
                padding: 10px;
                border-radius: 10px; /* Slight rounding for aesthetics */
            }
            .receipt {
                width: 100%;
                max-width: 350px;
                border: 1px solid #000; /* Ensure borders are visible in print */
                border-radius: 5px;
                padding: 10px;
                margin-bottom: 10px;
                background-color: #fff; /* White background for individual receipts */
            }
            h3, p {
                margin: 5px 0;
            }
            @media print {
                body {
                    margin: 0;
                    font-size: 14px;
                }
                .receipt-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    justify-content: center;
                    margin: 0;
                    background-color: #fff; /* Ensure consistent white background during print */
                }
                .receipt {
                    page-break-inside: avoid;
                    border: 1px solid #000; /* Black border for clear visibility */
                    border-radius: 5px; /* Keep consistent rounded borders */
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

// Download all receipts as PDF
downloadPdfBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const receipts = getReceipts();

    if (receipts.length === 0) {
        alert('No receipts to download.');
        return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Receipts', 105, 10, { align: 'center' });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    const margin = 10; // Margin around the page
    const cellWidth = (pageWidth - 3 * margin) / 2; // Two columns
    const startX = margin;
    const startY = 20; // Starting Y-coordinate for the first row
    let currentX = startX;
    let currentY = startY;

    receipts.forEach((receipt, index) => {
        const padding = 5; // Padding inside the cell

        // Wrap description text to fit within the cell width
        const wrappedDescription = doc.splitTextToSize(receipt.description, cellWidth - 2 * padding);

        // Calculate the required cell height based on the content
        const lineHeight = 8;
        const contentHeight = 4 * lineHeight + wrappedDescription.length * lineHeight; // 4 lines for Name, Amount, Date, and a blank line
        const cellHeight = contentHeight + 2 * padding;

        // Add a new page if the content exceeds the page height
        if (currentY + cellHeight > pageHeight - margin) {
            doc.addPage();
            currentX = startX;
            currentY = startY;
        }

        // Draw a border for the receipt cell
        doc.setDrawColor(0);
        doc.rect(currentX, currentY, cellWidth, cellHeight);

        // Add receipt details inside the cell
        let textY = currentY + padding + 4; // Starting text Y-coordinate
        doc.setFontSize(12);
        doc.text(`Name: ${receipt.name}`, currentX + padding, textY);
        textY += lineHeight;

        wrappedDescription.forEach(line => {
            doc.text(line, currentX + padding, textY);
            textY += lineHeight;
        });

        doc.text(`Amount: P${receipt.amount.toFixed(2)}`, currentX + padding, textY);
        textY += lineHeight;
        doc.text(`Date: ${receipt.date}`, currentX + padding, textY);

        // Move to the next column or row
        if (currentX + cellWidth + margin > pageWidth - margin) {
            currentX = startX; // Reset to the first column
            currentY += cellHeight + margin; // Move to the next row
        } else {
            currentX += cellWidth + margin; // Move to the next column
        }
    });

    doc.save('receipts.pdf');
});



renderReceipts();
