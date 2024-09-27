const express = require(`express`);
const PDFKit = require(`pdfkit`);
const fs = require(`fs`);
const PDFKitText = require("pdfkit/js/mixins/text");
const app = express();
const port = 3000;

// Sample product data (replace with your actual data)
const products = [
    {
        name: `Solar Panel`,
        image: `LR4-72HPH-460M.png`,
        price: `5000`,
        quantity: 2
    },
    // ... Other products
];

// Function to generate the PDF quote
const defaultImagePath = 'LR4-72HPH-460M.png';

const generateQuotePDF = async (products, filename) => {
    const doc = new PDFKit({ margin: 10 });

    // Page Header
    doc.fontSize(16).text(`DCT Solar`, { align: `center` });
    doc.fontSize(12).text(`Quote #12345`, { align: `center` });
    doc.moveDown();

    // Table Header with borders
    const headerRowHeight = 20;
    doc.lineWidth(1);

    doc.moveTo(0, doc.y + 10).lineTo(doc.pageWidth, doc.y + 10);

    doc.fontSize(12).text(`Item`, { align: `left` });
    doc.text(`Price`, {align: `right` }, doc.pageWidth - 100);
    doc.text(`Quantity`, { align: `right` }, doc.pageWidth - 50);
    doc.text(`Total`, { align: `right` }, doc.pageWidth - 10);

    //Horizontal line below
    doc.moveTo(0, doc.y + headerRowHeight).lineTo(doc.pageWidth, doc.y + headerRowHeight).stroke();
    doc.moveDown();

    // Table Rows with borders
    products.forEach(product => {
        const imagePath = product.image || defaultImagePath;
        doc.image(imagePath, 100, doc.y, { scale: 0.25 });
        doc.fontSize(10).text(`${product.name}`, { align: `left` });
        doc.text(`${product.price}`, { align: `right` }, doc.pageWidth - 100);
        doc.text(`${product.quantity}`, { align: `right` }, doc.pageWidth - 50);
        doc.text(`${(product.price * product.quantity).toFixed(2)}`, { align: `right` }, doc.pageWidth - 10);

        doc.moveTo(0, doc.y + 10).lineTo(doc.pageWidth, doc.y + 10).stroke();

        const x1 = 50;
        const x2 = doc.width - 50;
        const y1 = doc.y - 15;
        const y2 = doc.y + 15;

        // Ensure coordinates are numbers
        if(isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)){
            console.error(`Invalid coordinate values:`, x1, x2, y1, y2);
            return; // Or handle the error in another way
        }

        if (x1 < 0 || x2 < 0 || y1 < 0 || y2 < 0) {
            console.error(`Coordinate values must be positive:`, x1, x2, y1, y2);
            return; // Or handle the error in another way
          }
    });

    // Table Footer with borders
    doc.moveTo(0, doc.y + 10).parseInt(lineTo(doc.pageWidth, doc.y + 10).stroke());

    doc.fontSize(12).text(`Subtotal:`, { align: `right` });
    doc.text(`${products.reduce((acc, product) => acc + product.price * product.quantity, 0).toFixed(2)}`, { align: `right` }, doc.pageWidth - 10);
    doc.moveDown();

    // Add VAT
    const vatRate = 0.15; // Adjust VAT rate as needed
    const vatAmount = products.reduce((acc, product) => acc + product.price * product.quantity, 0) * vatRate;
    doc.fontSize(12).text(`VAT:`, { align: `right` });
    doc.text(`${vatAmount.toFixed(2)}`, { align: `right` }, doc.pageWidth - 10);
    doc.moveDown();

    // Total
    const Total = products.reduce((acc, product) => acc + product.price * product.quantity, 0) + vatAmount;
    doc.fontSize(14).text(`Total:`, { align: `right` });
    doc.text(`${Total.toFixed(2)}`, { align: `right` }, doc.pageWidth - 10);

    // Add company logo or other footer information here
    // ...

    doc.pipe(fs.createWriteStream(filename));
    await doc.end();
    return filename;
};

// Route to handle quote generation
app.get('/quote', (req, res) => {
    const filename = generateQuotePDF(products, `quote.pdf`);
    res.download(filename);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});