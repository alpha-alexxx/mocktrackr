import { createClient } from '@libsql/client/web';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';

/**
 * Global variable for Prisma client to avoid multiple instances in development.
 * This allows Prisma to be cached in development mode, improving performance.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Creates a LibSQL client using the provided database URL and authentication token.
 * This client is used to connect to the database.
 *
 * @returns {Client} A LibSQL client instance.
 */
const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL!, // Database URL (required)
    authToken: process.env.TURSO_AUTH_TOKEN // Authentication token (required)
});

/**
 * Configuration object for Prisma adapter, explicitly passing the database URL and client.
 * The adapter needs the client for handling the database connection.
 *
 * @type {Config}
 */
const config = {
    url: process.env.TURSO_DATABASE_URL!, // Pass the database URL explicitly (required by Prisma)
    client: libsql // The actual client object that handles the connection
};

/**
 * PrismaLibSQL adapter for Prisma that connects to the LibSQL client.
 * This adapter is used to bridge the connection between Prisma and LibSQL.
 *
 * @type {PrismaLibSQL}
 */
const adapter = new PrismaLibSQL(config); // Create an adapter using the LibSQL client and configuration.

/**
 * Initializes a PrismaClient with the provided adapter.
 * If a Prisma client already exists globally (in development), it uses the cached version.
 *
 * @type {PrismaClient}
 */
const prismaClient = globalForPrisma.prisma || new PrismaClient({ adapter });

/**
 * In development mode, store the Prisma client globally to prevent multiple instances.
 * This helps improve performance by reusing the same Prisma client in development.
 */
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;

/**
 * Export the Prisma client as `prismaEdge` to be used in other parts of the application.
 * This provides access to the database through Prisma with the LibSQL adapter.
 */
export const prismaEdge = prismaClient;
