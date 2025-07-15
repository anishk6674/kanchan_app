require('dotenv').config();
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

// Import shared utilities (if needed in future)
// const { getConfig } = require('@kanchan/shared');

const customerRoutes = require('./routes/customer.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const orderRoutes = require('./routes/orders.routes');
const dailyUpdates = require('./routes/daily-update.routes');
const settingsRoutes = require('./routes/settings.routes');
const billsRoutes = require('./routes/bills.routes');

const pool = require('./database');

const app = express();
const port = process.env.SERVER_PORT || 5000;

// Configure CORS to allow mobile app access
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Add middleware to log requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} from ${req.ip}`);
  next();
});

// Test database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database!');
    connection.release();
});

// Use the route files
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/daily-updates', dailyUpdates);
app.use('/api/settings', settingsRoutes);
app.use('/api/bills', billsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// PDF generation route for bills
app.post('/generate-bill-pdf', async (req, res) => {
    const { bill, ledgerData, currentPrice, selectedMonth } = req.body;

    if (!bill || !ledgerData || !currentPrice || !selectedMonth) {
        return res.status(400).send('Missing required data for PDF generation');
    }

    let browser;
    try {
        const [year, monthNum] = selectedMonth.split('-');
        const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString('default', { month: 'long' });

        const pricePerCan = bill.customer_type === 'shop' ? currentPrice.shop_price :
                             bill.customer_type === 'monthly' ? currentPrice.monthly_price :
                             currentPrice.order_price;

        const totalCans = ledgerData.reduce((sum, d) => sum + Number(d.delivered_qty), 0);
        const totalAmount = totalCans * pricePerCan;

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Customer Ledger - ${bill.name} (${monthName} ${year})</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { font-family: sans-serif; margin: 0; padding: 0; }
                .pdf-container {
                    width: 36rem;
                    margin: 0 auto;
                    border: 1px solid black;
                    padding: 1rem;
                    box-sizing: border-box;
                    font-size: 10px;
                }
                table { page-break-inside: auto; }
                tr { page-break-inside: avoid; page-break-after: auto; }
                thead { display: table-header-group; }
                .amount-box {
                    text-align: right;
                    font-weight: bold;
                    border: 1px solid black;
                    padding: 0.25rem 0.5rem;
                    font-size: 0.75rem;
                    display: inline-block;
                }
              </style>
            </head>
            <body class="bg-white p-4">
              <div class="pdf-container">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid black; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
                  <div style="text-align: left; font-size: 0.75rem; width: 48%;">
                    <div style="font-weight: bold; color: #1e3a8a; font-size: 1.125rem;">कंचन मिनरल वाटर</div>
                    <div>5, लेबर कॉलोनी, नई आबादी, मंदसौर</div>
                    <div>Ph.: 07422-408555 Mob.: 9425033995</div>
                  </div>
                  <div style="text-align: left; font-size: 0.75rem; width: 48%;">
                    <div style="font-weight: bold; color: #1e3a8a; font-size: 1.125rem;">कंचन चिल्ड वाटर</div>
                    <div>साई मंदिर के पास, अभिनन्दन नगर, मंदसौर</div>
                    <div>Mob.: 9685753343, 9516784779</div>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; font-size: 0.875rem; border-bottom: 1px solid black; padding-bottom: 0.25rem; margin-bottom: 0.5rem;">
                  <div>मो.: ${bill.phone_number}</div>
                  <div style="text-align: right;">दिनांक: ${monthName} ${year}</div>
                  <div style="grid-column: span 2;">श्रीमान: ${bill.name}</div>
                </div>

                <table style="width: 100%; border-collapse: collapse; border: 1px solid black; font-size: 0.75rem; margin-top: 1rem;">
                  <thead>
                    <tr>
                      <th style="border: 1px solid black; padding: 0.25rem; text-align: center;">क्र.</th>
                      <th style="border: 1px solid black; padding: 0.25rem; text-align: center;">संख्या</th>
                      <th style="border: 1px solid black; padding: 0.25rem; text-align: center;">केन वापसी</th>
                      <th style="border: 1px solid black; padding: 0.25rem; text-align: center;">क्र.</th>
                      <th style="border: 1px solid black; padding: 0.25rem; text-align: center;">संख्या</th>
                      <th style="border: 1px solid black; padding: 0.25rem; text-align: center;">केन वापसी</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${Array.from({ length: Math.ceil(31 / 2) }, (_, i) => {
                      const dayLeft = i + 1;
                      const dayRight = i + 1 + Math.ceil(31 / 2);
                      const left = ledgerData.find(entry => new Date(entry.date).getDate() === dayLeft);
                      const right = ledgerData.find(entry => new Date(entry.date).getDate() === dayRight);
                      
                      return `
                      <tr>
                        <td style="border: 1px solid black; padding: 0.25rem; text-align: center;">${dayLeft <= 31 ? dayLeft : ''}</td>
                        <td style="border: 1px solid black; padding: 0.25rem; text-align: center;">${left && dayLeft <= 31 ? left.delivered_qty : ''}</td>
                        <td style="border: 1px solid black; padding: 0.25rem;"></td>
                        <td style="border: 1px solid black; padding: 0.25rem; text-align: center;">${dayRight <= 31 ? dayRight : ''}</td>
                        <td style="border: 1px solid black; padding: 0.25rem; text-align: center;">${right && dayRight <= 31 ? right.delivered_qty : ''}</td>
                        <td style="border: 1px solid black; padding: 0.25rem;"></td>
                      </tr>`;
                    }).join('')}
                  </tbody>
                </table>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid black; margin-top: 0.5rem; padding-top: 0.25rem; font-size: 0.875rem;">
                  <div style="font-size: 0.75rem;">
                    <div>नोट: प्रति माह 12 केन लेना अनिवार्य है।</div>
                    <div>* अगर कार्ड के पोस्ट मान्य नहीं होगा।</div>
                    <div>* केन 1 दिन से अधिक रखने पर प्रति दिन 10 रुपये चार्ज लगेगा।</div>
                  </div>
                  <div class="amount-box">
                    <div>कुल केन: ${totalCans}</div>
                    <div>कुल राशि: ₹${totalAmount}</div>
                  </div>
                </div>
              </div>
            </body>
            </html>
        `;

        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
        });
        const page = await browser.newPage();

        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0'
        });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm'
            }
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${bill.name.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '-')}-bill.pdf"`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send(`Error generating PDF: ${error.message || error}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📱 Mobile app can connect to: http://YOUR_IP:${port}`);
});