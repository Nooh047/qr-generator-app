import prisma from '../utils/db';

export class UserService {
    /**
     * Upserts a user based on JWT claims to ensure they exist in our database.
     */
    static async syncUser(userId: string, email: string) {
        return prisma.user.upsert({
            where: { id: userId },
            update: { email },
            create: {
                id: userId,
                email,
            },
        });
    }
}
