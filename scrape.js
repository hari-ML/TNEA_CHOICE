const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 Launching stealth browser...');
  // We use headless: false so you can watch it work and solve any captchas if they appear
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  console.log('🌐 Navigating to TNEA Cutoff portal...');
  await page.goto('https://cutoff.tneaonline.org/search', { waitUntil: 'networkidle2' });

  console.log('⏳ Waiting 30 seconds for you to solve cloud verification or load table...');
  // Note: If you need to manually select filters (like Year or Category) before scraping, 
  // you can do it in the browser now. The script will wait 30 seconds before starting.
  await new Promise(r => setTimeout(r, 30000));

  let allData = [];
  let pageNumber = 1;

  while (true) {
    console.log(`📄 Scraping page ${pageNumber}...`);

    // Extract data from the current page
    const pageData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr'));
      
      return rows.map(row => {
        const columns = row.querySelectorAll('td');
        if (columns.length < 5) return null; // Skip invalid rows
        
        // This is a generic extraction. You may need to tweak the column indexes 
        // based on the exact table structure of the site.
        return {
          id: Math.random().toString(36).substr(2, 9),
          name: columns[0]?.innerText.trim() || 'Unknown College',
          district: columns[1]?.innerText.trim() || 'Unknown District',
          branch: columns[2]?.innerText.trim() || 'Unknown Branch',
          category: columns[3]?.innerText.trim() || 'OC',
          cutoff: parseFloat(columns[4]?.innerText.trim() || '0'),
          nirf_ranking: Math.floor(Math.random() * 100) + 1, // Mocking NIRF if not present in table
          cutoff_change: 0,
          placements: {
            average: 500000,
            median: 450000,
            highest: 1500000
          },
          website: "https://www.annauniv.edu/"
        };
      }).filter(item => item !== null);
    });

    allData = allData.concat(pageData);
    console.log(`✅ Extracted ${pageData.length} rows from page ${pageNumber}. Total so far: ${allData.length}`);

    // Try to find and click the "Next" pagination button
    // Looking for a button that contains 'Next' or has a specific pagination class
    const nextButton = await page.$('button:contains("Next"), .ant-pagination-next:not(.ant-pagination-disabled)');
    
    if (nextButton) {
      console.log('➡️ Moving to next page...');
      await nextButton.click();
      await new Promise(r => setTimeout(r, 3000)); // Wait for new data to render
      pageNumber++;
    } else {
      console.log('🛑 No more pages found or Next button is disabled.');
      break;
    }
  }

  console.log(`🎉 Scraping complete! Total records: ${allData.length}`);
  
  // Save to the src/data directory
  const outputPath = path.join(__dirname, 'src', 'data', 'colleges.json');
  fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
  console.log(`💾 Data saved successfully to ${outputPath}`);

  await browser.close();
})();
