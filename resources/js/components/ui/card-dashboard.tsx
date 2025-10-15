import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardCardProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    color?: string;
    shadow?: boolean;
    pattern?: boolean;
    actions?: { label: string; onClick: () => void; variant?: string }[];
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
    title,
    description,
    icon: Icon,
    color = "bg-white dark:bg-neutral-900",
    shadow = true,
    pattern = false,
    actions = [],
}) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 
                ${color} ${shadow ? "shadow-md hover:shadow-xl transition-shadow duration-300" : ""} cursor-pointer`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {pattern && (
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
            )}

            <Card className="absolute inset-0 size-full bg-transparent border-none">
                <CardHeader
                    className={`flex flex-col items-center justify-center h-full text-center transition-all duration-500 ${
                        hovered ? "-translate-y-8" : ""
                    }`}
                >
                    {!hovered && description && (
                        <CardTitle className="flex items-center justify-center gap-2 text-lg font-semibold">
                            {Icon && <Icon className="h-5 w-5" />}
                            {title}
                        </CardTitle>
                    )}

                    {!hovered && description && (
                        <CardDescription className="text-sm text-muted-foreground transition-opacity duration-500 opacity-100">
                            {description}
                        </CardDescription>
                    )}
                </CardHeader>

            {/* Contenu dynamique au survol */}
            <AnimatePresence>
            {hovered && actions.length > 0 && (
                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4 }}
                >
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        onClick={action.onClick}
                        variant={(action.variant as any) || "secondary"}
                        className="w-full max-w-[180px]"
                    >
                    {action.label}
                    </Button>
                ))}
                </motion.div>
            )}
            </AnimatePresence>
        </Card>
        </div>
    );
};
