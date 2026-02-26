const { Client } = require('pg');

async function testConnection(uri) {
    const client = new Client({ connectionString: uri });
    try {
        await client.connect();
        console.log(`[SUCCESS] Connected to: ${uri.replace(/:[^:@]*@/, ':****@')}`);
        await client.end();
    } catch (err) {
        console.error(`[FAILED] ${uri.replace(/:[^:@]*@/, ':****@')} -> ${err.message}`);
    }
}

async function main() {
    const password = "QrEngineInker2026";
    const proj = "guvuzywiuuyqbartlhxu";

    const uris = [
        // Supavisor Session Pooler (port 5432)
        `postgresql://postgres.${proj}:${password}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`,
        // Supavisor Transaction Pooler (port 6543)
        `postgresql://postgres.${proj}:${password}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`,
        // Old Pgbouncer Pooler Format (port 6543 without tenant prefix)
        `postgresql://postgres:${password}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`,
        // Old Pgbouncer Pooler Format (port 5432 without tenant prefix)
        `postgresql://postgres:${password}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`
    ];

    for (const uri of uris) {
        await testConnection(uri);
    }
}

main();
