import { UserRole } from '@/prisma';

import type { User } from 'better-auth';

export interface ExtendedUser extends User {
    twoFactorEnabled: true | null;
    role: UserRole;
}
export type Session = typeof auth.$Infer.Session;
