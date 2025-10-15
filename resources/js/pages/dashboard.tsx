import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardCard } from '@/components/ui/card-dashboard';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, ServerIcon, Users, UsersIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tableau de bord" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <DashboardCard
                        title="Utilisateurs & Profils"
                        description="Gérez les comptes et rôles"
                        icon={UsersIcon}
                        //color="bg-green-200 dark:bg-green-950"
                        onClick={() => console.log('Aller vers utilisateurs')}
                    />

                    <DashboardCard
                        title="Services"
                        description="Gérez les services et modules"
                        icon={ServerIcon}
                        //color="bg-yellow-200 dark:bg-yellow-950"
                        shadow
                    />

                    <DashboardCard
                        title="Modules"
                        description="Accédez aux différentes sections"
                        icon={LayoutGrid}
                        //color="bg-blue-200 dark:bg-blue-950"
                        shadow
                    />
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
