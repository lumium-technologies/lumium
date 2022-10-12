const execSync = require('child_process').execSync;

console.log('Running predestroy...');

if (process.env.REVIEW_APP) {
	console.log('Running predestroy in review app...');
	run();
	console.log('Done running predestroy');
}

function run() {
	const output = execSync('./scripts/remove-cloudflare-dns.sh');
	console.log('Removing Cloudflare DNS..., Response:', output.toString());
}
