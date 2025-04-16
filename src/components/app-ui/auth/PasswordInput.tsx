'use client';

import type React from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
    id: string;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    name?: string;
}

export function PasswordInput({
    id,
    placeholder = '••••••••',
    disabled,
    className,
    onChange,
    onBlur,
    name
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className='relative'>
            <Input
                id={id}
                name={name}
                type={showPassword ? 'text' : 'password'}
                placeholder={showPassword ? placeholder || 'Enter Your Password' : '••••••••'}
                disabled={disabled}
                className={cn('pr-10', className)}
                onChange={onChange}
                onBlur={onBlur}
            />
            <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}>
                {showPassword ? (
                    <EyeOff className='text-muted-foreground h-4 w-4' />
                ) : (
                    <Eye className='text-muted-foreground h-4 w-4' />
                )}
                <span className='sr-only'>{showPassword ? 'Hide password' : 'Show password'}</span>
            </Button>
        </div>
    );
}
