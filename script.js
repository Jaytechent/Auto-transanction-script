const puppeteer = require('puppeteer-core');
const path = require('path');

const TRANSFER_URL = 'https://app.union.build/transfer?source=xion-testnet-2&destination=bbn-test-5&asset=0x7578696f6e&receiver=0x83fe1f912925790a996cb1b42e86e81d622d437b&amount=0.0001';
const TRANSFER_COUNT = 100;

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = 'C:\\Users\\HP-PC\\AppData\\Local\\Google\\Chrome\\User Data\\Default';
const EXTENSION_PATH = path.resolve(__dirname, 'Keplr-Chrome');

const TRANSFER_BTN_SELECTOR = 'div.p-4.flex.justify-between.gap-2.border-t.border-zinc-800.sticky.bottom-0.bg-zinc-925 > div > div > button';
const SUBMIT_BTN_SELECTOR = 'button.inline-flex.cursor-pointer.items-center.gap-2.justify-center.rounded-md.text-sm.transition-colors.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-50.bg-sky-600.border-sky-600.border.text-white.hover\\:bg-sky-700.dark\\:bg-white.dark\\:border-zinc-100.dark\\:hover\\:bg-zinc-100.dark\\:text-black.font-bold.focus-visible\\:ring-accent.h-9.px-4.py-2';
const NEW_TRANSFER_BTN_SELECTOR = 'div.flex.flex-col.justify-between.gap-3.mt-6 > button';
const KEPLR_APPROVE_SELECTOR = '#app > div > div > div > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div > div.sc-bczRLJ.eVRSjU > div.sc-bBXxYQ.hsXclE > button';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: CHROME_PATH,
    userDataDir: USER_DATA_DIR,
    defaultViewport: null,
    args: [
      '--start-maximized',
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
    ],
  });

  const page = await browser.newPage();
  await page.goto(TRANSFER_URL, { waitUntil: 'networkidle2' });

  console.log('🔐 Please manually connect your wallet, unlock Keplr, and approve the first transaction.');
  console.log('🛑 After approval, click the green Transfer button manually.');
  console.log('⏳ Waiting 1 minute for manual steps...');
  await delay(90000);

  for (let i = 1; i < TRANSFER_COUNT; i++) {
    try {
      console.log(`🚀 Starting Transfer #${i + 1} of ${TRANSFER_COUNT}`);

      // 1. Click "New Transfer"
      await page.waitForSelector(NEW_TRANSFER_BTN_SELECTOR, { timeout: 60000 });
      const newTransferBtn = await page.$(NEW_TRANSFER_BTN_SELECTOR);
      await newTransferBtn.click();
      console.log('🔁 Clicked "New Transfer" button');

      // 2. Wait for visible "Transfer Ready" button
      console.log('⏳ Waiting for visible "Transfer Ready" button...');
      await page.waitForFunction((selector) => {
        const btn = document.querySelector(selector);
        if (!btn) return false;

        const style = window.getComputedStyle(btn);
        const isVisible = btn.offsetParent !== null &&
                          style.display !== 'none' &&
                          style.visibility !== 'hidden' &&
                          !btn.disabled;

        const text = btn.textContent?.trim()?.toLowerCase();
        return isVisible && text === 'transfer ready';
      }, { timeout: 120000 }, TRANSFER_BTN_SELECTOR);

      const btnHandle = await page.$(TRANSFER_BTN_SELECTOR);
      const textContent = await btnHandle.evaluate(el => el.textContent?.trim());
      console.log(`✅ Found button: "${textContent}", clicking...`);
      await btnHandle.click();

      // 3. Wait for Submit page
      console.log('⏳ Waiting for Submit button to appear...');
      await page.waitForSelector(SUBMIT_BTN_SELECTOR, { timeout: 60000 });

      console.log('✅ Submit button is visible. Pausing for 3 seconds for UI...');
      await delay(3000); // brief pause before clicking

      const submitBtn = await page.$(SUBMIT_BTN_SELECTOR);
      await submitBtn.click();
      

   
const KEPLR_APPROVE_BTN_SELECTOR = '#app > div > div > div > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div > div.sc-bczRLJ.eVRSjU > div.sc-bBXxYQ.hsXclE > button';

try {
  console.log('📨 Clicked Submit. Waiting for Keplr approval...');
  await page.waitForSelector(KEPLR_APPROVE_BTN_SELECTOR, { timeout: 500 });

  const approveBtn = await page.$(KEPLR_APPROVE_BTN_SELECTOR);
  if (approveBtn) {
    console.log('✅ Keplr Approve button found, clicking...');
    await approveBtn.click();
    console.log('🟢 Clicked Keplr Approve button.');
  } else {
    throw new Error('Button not found');
  }

  await delay(10000); // wait for TX to process
} catch (e) {
  console.warn('⚠️ Could not auto-click Keplr approve. Please approve manually.');
  await delay(4000);
}


      // 5. Wait for confirmation
      await page.waitForSelector(NEW_TRANSFER_BTN_SELECTOR, { timeout: 90000 });
      console.log('✅ Transfer completed, preparing next one...');
      await delay(5000);

    } catch (err) {
      console.error(`❌ Error on Transfer #${i + 1}:`, err.message);
      console.log('⏱️ Waiting 10 seconds before retrying...');
      await delay(10000);
    }
  }

  console.log('🎉 All transfers completed!');
  await browser.close();
})();





// const puppeteer = require('puppeteer-core');
// const path = require('path');

// const TRANSFER_URL = 'https://app.union.build/transfer?source=xion-testnet-2&destination=1328&asset=0x7578696f6e&receiver=0xd2283d3442508ad63f3afa7f4e874b7826907a0c&amount=0.0001';
// const TRANSFER_COUNT = 24;

// const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
// const USER_DATA_DIR = 'C:\\Users\\HP-PC\\AppData\\Local\\Google\\Chrome\\User Data\\Default';
// const EXTENSION_PATH = path.resolve(__dirname, 'Keplr-Chrome');

// const TRANSFER_BTN_SELECTOR = 'div.p-4.flex.justify-between.gap-2.border-t.border-zinc-800.sticky.bottom-0.bg-zinc-925 > div > div > button';
// const SUBMIT_BTN_SELECTOR = 'button.inline-flex.cursor-pointer.items-center.gap-2.justify-center.rounded-md.text-sm.transition-colors.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-50.bg-sky-600.border-sky-600.border.text-white.hover\\:bg-sky-700.dark\\:bg-white.dark\\:border-zinc-100.dark\\:hover\\:bg-zinc-100.dark\\:text-black.font-bold.focus-visible\\:ring-accent.h-9.px-4.py-2';
// const NEW_TRANSFER_BTN_SELECTOR = 'div.flex.flex-col.justify-between.gap-3.mt-6 > button';

// const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     executablePath: CHROME_PATH,
//     userDataDir: USER_DATA_DIR,
//     defaultViewport: null,
//     args: [
//       '--start-maximized',
//       `--disable-extensions-except=${EXTENSION_PATH}`,
//       `--load-extension=${EXTENSION_PATH}`,
//     ],
//   });

//   const page = await browser.newPage();
//   await page.goto(TRANSFER_URL, { waitUntil: 'networkidle2' });

//   console.log('🔐 Please manually connect your wallet, unlock Keplr, and approve the first transaction.');
//   console.log('🛑 After approval, click the green Transfer button manually.');
//   console.log('⏳ Waiting 1 minute for manual steps...');
//   await delay(60000);

//   for (let i = 1; i < TRANSFER_COUNT; i++) {
//     try {
//       console.log(`🚀 Starting Transfer #${i + 1} of ${TRANSFER_COUNT}`);

//       // 1. Click "New Transfer"
//       await page.waitForSelector(NEW_TRANSFER_BTN_SELECTOR, { timeout: 60000 });
//       const newTransferBtn = await page.$(NEW_TRANSFER_BTN_SELECTOR);
//       await newTransferBtn.click();
//       console.log('🔁 Clicked "New Transfer" button');
// /// Wait for the correct "Transfer Ready" button
// console.log('⏳ Waiting for visible "Transfer Ready" button...');

// await page.waitForFunction((selector) => {
//   const btn = document.querySelector(selector);
//   if (!btn) return false;

//   const style = window.getComputedStyle(btn);
//   const isVisible = btn.offsetParent !== null &&
//                     style.display !== 'none' &&
//                     style.visibility !== 'hidden' &&
//                     !btn.disabled;

//   const text = btn.textContent?.trim()?.toLowerCase();
//   return isVisible && text === 'transfer ready';
// }, { timeout: 120000 }, TRANSFER_BTN_SELECTOR);

// const btnHandle = await page.$(TRANSFER_BTN_SELECTOR);

// // Optional: confirm again before clicking
// const textContent = await btnHandle.evaluate(el => el.textContent?.trim());
// console.log(`✅ Found button: "${textContent}", clicking...`);
// await btnHandle.click();


//      // Wait for Submit page and pause for confirmation
// console.log('⏳ Waiting for Submit button to appear...');
// await page.waitForSelector(SUBMIT_BTN_SELECTOR, { timeout: 60000 });

// console.log('✅ Submit button is visible. Pausing for 5 seconds for manual inspection...');
// await delay(5000); // <-- you can increase this if needed

// // Click the Submit button
// const submitBtn = await page.$(SUBMIT_BTN_SELECTOR);
// await submitBtn.click();
// console.log('📨 Clicked Submit. Waiting for wallet popup...');

//       // 4. Wallet pop-up time
//       console.log('🔔 Please confirm the transaction in Keplr...');
//       await delay(90000); // wait for signing manually

//       // 5. Wait for confirmation UI to show "New Transfer" again
//       await page.waitForSelector(NEW_TRANSFER_BTN_SELECTOR, { timeout: 90000 });
//       console.log('✅ Transfer completed, preparing next one...');

//       await delay(5000); // optional short pause before next transfer

//     } catch (err) {
//       console.error(`❌ Error on Transfer #${i + 1}:`, err.message);
//       console.log('⏱️ Waiting 10 seconds before retrying...');
//       await delay(5000);
//     }
//   }

//   console.log('🎉 All transfers completed!');
//   await browser.close();
// })();

