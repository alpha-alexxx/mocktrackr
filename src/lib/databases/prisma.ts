import { PrismaClient } from '@prisma/client';

/**
 * Global variable to store the Prisma client instance.
 * This is used to prevent creating multiple instances of Prisma client in development mode.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Initializes the Prisma client.
 * If the client already exists globally (in development), it will reuse that instance.
 * This caching mechanism ensures that only one Prisma client instance is created during development,
 * improving performance and reducing memory consumption.
 */
export const prisma = globalForPrisma.prisma || new PrismaClient();

/**
 * In development mode, store the Prisma client globally to avoid creating multiple instances.
 * This helps improve performance by reusing the same Prisma client during the development lifecycle.
 */
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; // Cache Prisma client in development mode.
