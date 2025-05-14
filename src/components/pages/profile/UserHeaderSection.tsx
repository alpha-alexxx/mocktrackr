'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExtendedUser } from '@/lib/types/auth-types';
import { cn } from '@/lib/utils';

import { EditProfileDialog } from './EditProfileDialog';
import { Edit } from 'lucide-react';

export default function UserHeaderSection({ user }: { user?: ExtendedUser }) {
    const roleColors: Record<string, string> = {
        USER: 'bg-sky-500 text-white',
        ADMIN: 'bg-emerald-500 text-white',
        SUPERADMIN: 'bg-rose-500 text-white'
    };

    if (!user) return null;

    return (
        <Card className='overflow-hidden'>
            <CardContent>
                <div className='flex flex-col gap-6 sm:flex-row sm:items-center'>
                    <div className='relative mx-auto size-24'>
                        <Avatar className='size-full'>
                            <AvatarImage
                                src={user.image || '/user-placeholder.svg?height=96&width=96'}
                                alt={user.name}
                            />
                            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='flex-1 space-y-1.5'>
                        <div className='flex items-center gap-2'>
                            <h2 className='text-2xl font-bold'>{user.name}</h2>
                            <Badge className={cn(roleColors[user.role || 'USER'])}>{user.role || 'USER'}</Badge>
                        </div>
                        <p className='text-muted-foreground'>{user.email}</p>
                    </div>
                    <EditProfileDialog user={user}>
                        <Button variant={'outline'} className='shrink-0 gap-1 sm:self-start' size='sm'>
                            <Edit className='h-4 w-4' />
                            <span>Edit Profile</span>
                        </Button>
                    </EditProfileDialog>
                </div>
            </CardContent>
        </Card>
    );
}
