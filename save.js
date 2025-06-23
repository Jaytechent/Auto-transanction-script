const totalTransfers = 500;
let currentTransfer = 0;

async function sendMultipleTransactions() {
  while (currentTransfer < totalTransfers) {
    console.log(`Sending transaction ${currentTransfer + 1} of ${totalTransfers}`);
    await sendTransaction();
    currentTransfer++;
  }
  console.log('All transactions sent successfully.');
}

sendMultipleTransactions();
