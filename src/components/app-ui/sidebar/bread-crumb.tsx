'use client';

import * as React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

interface PathSegment {
    name: string;
    href: string;
}

export function AppBreadcrumb(): React.ReactElement {
    const pathname = usePathname();

    // Skip the '(protected)' part from the pathname
    const path = pathname.replace(/^\/\(protected\)/, '');

    // Split the path into segments
    const segments: PathSegment[] = path
        .split('/')
        .filter(Boolean)
        .map(
            (segment: string): PathSegment => ({
                name: segment.charAt(0).toUpperCase() + segment.slice(1),
                href: segment
            })
        );

    // If we're on the dashboard page (root of protected routes)
    if (segments.length === 0 || (segments.length === 1 && segments[0].href === 'dashboard')) {
        return (
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        );
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {/* Dashboard is always shown */}
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href='/dashboard'>Dashboard</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {/* Show additional path segments */}
                {segments.length > 0 && segments[0].href !== 'dashboard' && (
                    <>
                        <BreadcrumbSeparator />
                        {segments.map((segment, index) => {
                            const isLast = index === segments.length - 1;
                            const href = `/dashboard/${segments
                                .slice(0, index + 1)
                                .map((s) => s.href)
                                .join('/')}`;

                            return (
                                <React.Fragment key={segment.href}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage>{segment.name}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link href={href}>{segment.name}</Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </React.Fragment>
                            );
                        })}
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
