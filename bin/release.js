const execSync = require('child_process').execSync;

console.log("Running release phase...");
run().catch(console.error);
console.log("Done running release phase");

async function run() {
    const appName = process.env.HEROKU_APP_NAME;
    if (process.env.LUMIUM_COMPONENT === 'lumium-api'){
        if (execSync(`PGSSLMODE=require heroku pg:psql -c \"SELECT EXISTS ( SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'typeorm_metadata' );\" -a ${appName} | grep -B1 \"(1 row)\"`).includes("f")) {
            execSync(`heroku pg:copy --confirm=${appName} lumium-staging-api::DATABASE DATABASE -a ${appName}`);
        }
        const output = execSync("npm run db:migrate");
        console.log("Running database migrations..., Output: ", output.toString());
    }
}
