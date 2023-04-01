const execSync = require('child_process').execSync;

console.log('Running release phase...');
run();
console.log('Done running release phase');

function run() {
    const appName = process.env.HEROKU_APP_NAME;
    if (process.env.LUMIUM_COMPONENT === 'lumium-api') {
        if (process.env.ENVIRONMENT === 'review' && execSync(`PGSSLMODE=require heroku pg:psql -c \"SELECT EXISTS ( SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = '_sqlx_migrations' );\" -a ${appName} | grep -B1 \"(1 row)\"`).includes('f')) {
            execSync(`heroku pg:copy --confirm=${appName} lumium-staging-api::DATABASE DATABASE -a ${appName}`);
        }
    }
}
