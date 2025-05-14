import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';

/**
 * Global variable to hold the Prisma client instance.
 * This allows the Prisma client to be reused in development mode for better performance.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Creates a LibSQL client using the database URL and authentication token from the environment variables.
 * The LibSQL client is responsible for establishing the connection to the LibSQL database.
 *
 * @returns {Client} The LibSQL client instance.
 */
const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL!, // The URL for connecting to the database (required).
    authToken: process.env.TURSO_AUTH_TOKEN // The authentication token for connecting to the database (required).
});

/**
 * Configuration object required by Prisma's adapter to connect to the LibSQL database.
 * This configuration explicitly passes the database URL and the LibSQL client.
 *
 * @type {Config}
 */
const config = {
    url: process.env.TURSO_DATABASE_URL!, // The URL needed by Prisma to connect to the database.
    client: libsql // The actual LibSQL client that will be used to manage the database connection.
};

/**
 * PrismaLibSQL adapter that connects Prisma with the LibSQL client.
 * The adapter makes it possible to use Prisma with LibSQL as the database provider.
 *
 * @type {PrismaLibSQL}
 */
const adapter = new PrismaLibSQL(config); // Create an adapter using the LibSQL client and configuration.

/**
 * Initializes the Prisma client, using the custom adapter.
 * If a Prisma client instance already exists globally (in development), it will reuse that instance.
 *
 * @type {PrismaClient}
 */
const prismaClient = globalForPrisma.prisma || new PrismaClient({ adapter }); // Reuse global Prisma client if available, otherwise create a new one.

/**
 * In development mode, store the Prisma client globally to avoid creating multiple instances.
 * This improves performance by using the same instance during the development lifecycle.
 */
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient; // Cache Prisma client in development mode.

/**
 * Export the Prisma client as `prismaServerLess` to be used in other parts of the application.
 * This provides access to the database through Prisma with the LibSQL adapter in serverless environments.
 */
export const prismaServerLess = prismaClient; // Export the Prisma client for use in serverless contexts.
