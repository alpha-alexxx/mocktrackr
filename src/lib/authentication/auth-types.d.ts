import { UserRole } from '@prisma/client';

import type { User } from 'better-auth';

export interface ExtendedUser extends User {
    twoFactorEnabled: true | null;
    role: UserRole;
}
