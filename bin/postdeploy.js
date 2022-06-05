const Heroku = require('heroku-client');
const execSync = require('child_process').execSync;

console.log("Running postdeploy...");

const heroku = new Heroku({token: process.env.HEROKU_API_KEY});

if (process.env.REVIEW_APP) {
    console.log("Running postdeploy in review app...");
    run().catch(console.error);
    console.log("Done running postdeploy");
}

async function run() {
    const appName = process.env.HEROKU_APP_NAME;
    const prNumber = process.env.HEROKU_PR_NUMBER;
    const reviewDomain = ".review.lumium.space";
    let hostName = `pr-${prNumber}`;
    if (process.env.LUMIUM_COMPONENT === 'lumium-api') {
        hostName = hostName + ".api";
    }
    hostName = hostName + reviewDomain;
    heroku.post(`/apps/${appName}/domains`, {
        body: {
            hostname: hostName,
            sni_endpoint: null
        }
    }).then(app => {
        const dnsTarget = app.cname;
        const output = execSync(`./scripts/add-cloudflare-dns.sh ${dnsTarget}`);
        console.log("Adding Cloudflare DNS..., Response:", output.toString());
    });
}
