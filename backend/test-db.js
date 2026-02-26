const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Testing connection to Supabase...');
        const usersCount = await prisma.user.count();
        console.log(`Connection successful! Current user count: ${usersCount}`);

        // Test creating a temporary record
        console.log('Testing write access...');
        const testUser = await prisma.user.create({
            data: {
                email: `test_${Date.now()}@example.com`,
                name: 'Test Connectivity'
            }
        });
        console.log(`Write successful! Created test user ID: ${testUser.id}`);

        // Clean up
        await prisma.user.delete({ where: { id: testUser.id } });
        console.log('Cleanup successful.');
    } catch (error) {
        console.error('Database connection test failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
