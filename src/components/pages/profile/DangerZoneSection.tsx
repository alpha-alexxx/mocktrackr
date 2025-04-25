'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { PasswordInput } from '@/components/app-ui/auth/PasswordInput';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/authentication/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';

import { AlertTriangle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const deleteAccountSchema = z.object({
    confirmText: z.string().min(1, "Please type 'delete my account' to confirm"),
    password: z.string().min(1, 'Password is required')
});

/**
 * DangerZone Component
 *
 * A component that handles the account deletion process with proper validation
 * and security measures. It requires both a confirmation text and the user's
 * current password before proceeding with account deletion.
 *
 * @component
 * @returns {JSX.Element} The rendered danger zone section
 */
export function DangerZone() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof deleteAccountSchema>>({
        resolver: zodResolver(deleteAccountSchema),
        defaultValues: {
            confirmText: '',
            password: ''
        }
    });

    const onSubmit = async (values: z.infer<typeof deleteAccountSchema>) => {
        if (values.confirmText !== 'delete my account' || values.password === '') {
            toast.error('blank input');

            return;
        }

        setIsLoading(true);
        try {
            await authClient.deleteUser({
                password: values.password,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading('Deleting account...', {
                            id: 'delete-account'
                        });
                    },
                    onSuccess: () => {
                        toast.success('Account deleted successfully', {
                            id: 'delete-account'
                        });
                        router.push('/goodbye');
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message || 'Failed to delete account', {
                            id: 'delete-account'
                        });
                    }
                }
            });
        } catch (error) {
            console.error('Delete account error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className='border-red-200 dark:border-red-900'>
            <CardHeader className='pb-3 text-red-500'>
                <div className='flex items-center gap-2'>
                    <AlertTriangle className='h-5 w-5' />
                    <CardTitle>Danger Zone</CardTitle>
                </div>
                <CardDescription className='text-red-500/80'>
                    Permanently delete your account and all of your data.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className='text-muted-foreground text-sm'>
                    Once you delete your account, there is no going back. This action cannot be undone.
                </p>
            </CardContent>
            <CardFooter>
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant='destructive' className='w-full'>
                            Delete Account
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account and remove your
                                data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                                <div className='grid gap-4'>
                                    <FormField
                                        control={form.control}
                                        name='confirmText'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Type <code className='font-semibold'>delete my account</code> to
                                                    confirm
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className='border-red-200 dark:border-red-900'
                                                        type='text'
                                                        placeholder='delete my account'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='password'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Enter your password to confirm</FormLabel>
                                                <FormControl>
                                                    <PasswordInput
                                                        {...field}
                                                        id='password'
                                                        placeholder='Enter Your Password'
                                                        className='border-red-200 dark:border-red-900'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        type='submit'
                                        className='bg-red-500 hover:bg-red-600'
                                        disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                Deleting...
                                            </>
                                        ) : (
                                            'Delete Account'
                                        )}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </form>
                        </Form>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
}
