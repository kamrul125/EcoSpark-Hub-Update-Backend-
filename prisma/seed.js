"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const adminPassword = await bcryptjs_1.default.hash('AdminPassword123', 12);
    const userPassword = await bcryptjs_1.default.hash('UserPassword123', 12);
    await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {
            name: 'Admin',
            password: adminPassword,
            role: 'ADMIN',
        },
        create: {
            name: 'Admin',
            email: 'admin@example.com',
            password: adminPassword,
            role: 'ADMIN',
        },
    });
    await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {
            name: 'User',
            password: userPassword,
            role: 'MEMBER',
        },
        create: {
            name: 'User',
            email: 'user@example.com',
            password: userPassword,
            role: 'MEMBER',
        },
    });
    console.log('🌱 Seeding completed successfully!');
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
