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
        console.log("Adding Cloudflare DNS..., Response:", output);
    });
    if (process.env.LUMIUM_COMPONENT === 'lumium-api') {
        if (execSync(`heroku pg:psql -c \"SELECT EXISTS ( SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'typeorm_metadata' );\" -a ${appName} | grep -B1 \"(1 row)\"`).includes("f")) {
            execSync(`heroku pg:copy lumium-staging-api::DATABASE DATABASE -a ${appName}`);
            const output = execSync("npm run db:migrate");
            console.log("Running database migrations..., Output: ", output);
        }
    }
}
