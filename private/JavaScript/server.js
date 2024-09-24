const express = require(`express`);
const PDFKit = require(`pdfkit`);
const fs = require(`fs`);

const app = express();
const port = 3000;

// Sample product data (replace with your actual data)
const products = [
    {
        name: `Solar Panel`,
        image: `C:\Users\joshu\OneDrive\Documents\GitHub\DCT-Solar\private\images\LR4-72HPH-460M.png`,
        price: `5000`,
        quantity: 2
    },
    // ... Other products
];

// Function to generate the PDF quote
const defaultImagePath = 'C:\Users\joshu\OneDrive\Documents\GitHub\DCT-Solar\private\images\LR4-72HPH-460M.png';

const generateQuotePDF = (products, filename) => {
    const doc = new PDFKit();
    doc.fontSize(16).text(`Your Quote`, { align: `center` });
    doc.moveDown();

    products.forEach(product => {
        const imagePath = product.image || defaultImagePath;
        doc.image(imagePath, 100, doc.y, { scale: 0.25 });
        doc.fontSize(12).text(`${product.name}`, { align: `left` });
        doc.fontSize(12).text(`Price: ${product.price}`, { align: `left` });
        doc.fontSize(12).text(`Quantity: ${product.quantity}`, { align: 'left' });
        doc.fontSize(12).text(`Total: ${product.price * product.quantity}`, { align: 'left' });
        doc.moveDown();
    });

    const total = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
    doc.fontSize(14).text(`Total: ${total}`, { align: 'right' });

    doc.pipe(fs.createWriteStream(filename));
    doc.end();
};

// Route to handle quote generation
app.get('/quote', (req, res) => {
    const filename = 'quote.pdf';
    generateQuotePDF(products, filename);
    res.download(filename);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});