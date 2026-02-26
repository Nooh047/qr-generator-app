const { Client } = require('pg');

async function testConnection(uri) {
    const client = new Client({ connectionString: uri });
    try {
        await client.connect();
        console.log(`[SUCCESS] Found true deployment region: ${uri.split('@')[1].split('.pooler')[0]}`);
        await client.end();
        return true;
    } catch (err) {
        if (err.message.includes("password authentication failed")) {
            console.log(`[FOUND REGION] Password failed but region is 100% correct: ${uri.split('@')[1].split('.pooler')[0]}`);
            return true;
        }
    }
    return false;
}

async function main() {
    const password = "QrEngineInker2026";
    const proj = "guvuzywiuuyqbartlhxu";

    const regions = [
        "aws-0-us-east-1", "aws-0-us-west-1", "aws-0-us-west-2",
        "aws-0-eu-central-1", "aws-0-eu-west-1", "aws-0-eu-west-2",
        "aws-0-ap-south-1", "aws-0-ap-southeast-1", "aws-0-ap-southeast-2",
        "aws-0-ap-northeast-1", "aws-0-ap-northeast-2",
        "aws-0-sa-east-1", "aws-0-ca-central-1",
        // Supabase specific eu-west-3, ap-southeast-3
        "aws-0-eu-west-3", "aws-0-ap-southeast-3"
    ];

    console.log("Beginning global region discovery scan for project ID...");

    const promises = regions.map(async (region) => {
        const uri = `postgresql://postgres.${proj}:${password}@${region}.pooler.supabase.com:5432/postgres`;
        const result = await testConnection(uri);
        if (result) {
            console.log(`\n\n[WINNER] The true connection is: postgresql://postgres.${proj}:${password}@${region}.pooler.supabase.com:5432/postgres\n\n`);
            process.exit(0);
        }
    });

    await Promise.all(promises);
    console.log("Scan complete. No matching region found.");
}

main();
