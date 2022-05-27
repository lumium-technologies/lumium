const execSync = require('child_process');

console.log("Running predestroy...");

const heroku = new Heroku({token: process.env.HEROKU_API_TOKEN});

if (process.env.REVIEW_APP) {
    console.log("Running predestroy in review app...");
    run().catch(console.error);
    console.log("Done running predestroy");
}

async function run() {
    const output = execSync('../scripts/remove-cloudflare-dns.sh');
    console.log("Removing Cloudflare DNS..., Response:", output);
}
