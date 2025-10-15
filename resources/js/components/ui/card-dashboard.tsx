import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface DashboardCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  color?: string; // ex: bg-blue-100 dark:bg-blue-950
  shadow?: boolean;
  pattern?: boolean;
  onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon: Icon,
  color = 'bg-white dark:bg-neutral-900',
  shadow = true,
  pattern = false,
  onClick,
}) => {
  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 
        ${color} ${shadow ? 'shadow-md hover:shadow-xl transition-shadow duration-300' : ''} 
        cursor-pointer`}
      onClick={onClick}
    >
      {pattern && (
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
      )}
      <Card className="absolute inset-0 size-full bg-transparent border-none">
        <CardHeader className="flex flex-col justify-center h-full text-center gap-2">
          <CardTitle className="flex items-center justify-center gap-2 text-lg font-semibold">
            {Icon && <Icon className="h-5 w-5" />}
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-sm text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      </Card>
    </div>
  );
};
