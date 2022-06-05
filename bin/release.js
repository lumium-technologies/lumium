const execSync = require('child_process').execSync;

console.log("Running release phase...");
run().catch(console.error);
console.log("Done running release phase");

async function run() {
    const appName = process.env.HEROKU_APP_NAME;
    if (process.env.LUMIUM_COMPONENT === 'lumium-api'){
        const output = execSync("npm run db:migrate");
        console.log("Running database migrations..., Output: ", output);
    }
}
