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
                        color="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
                        //pattern
                        actions={[
                        { label: "Afficher la liste", onClick: () => console.log("Liste utilisateurs") },
                        { label: "Ajouter un utilisateur", onClick: () => console.log("Ajout utilisateur") },
                        { label: "Ajouter un profil", onClick: () => console.log("Ajout profil") },
                        ]}
                    />

                    <DashboardCard
                        title="Services"
                        description="Gérez les services et modules"
                        icon={ServerIcon}
                        color="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900"
                        shadow
                        actions={[
                        { label: "Liste des services", onClick: () => console.log("Services") },
                        { label: "Créer un service", onClick: () => console.log("Créer service") },
                        ]}
                    />

                    <DashboardCard
                        title="Modules"
                        description="Accédez aux différentes sections"
                        icon={LayoutGrid}
                        color="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
                        shadow
                        actions={[
                        { label: "Voir les modules", onClick: () => console.log("Modules") },
                        { label: "Ajouter un module", onClick: () => console.log("Ajout module") },
                        ]}
                    />
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
