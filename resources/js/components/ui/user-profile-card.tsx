import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { type User } from "@/types";

interface UserProfileCardProps {
  user: User;
  className?: string;
  bgColor?: string; // optionnel pour personnaliser
  textColor?: string;
}

export function UserProfileCard({ user, className = "", bgColor, textColor }: UserProfileCardProps) {
  return (
    <Card className={`${className} ${bgColor ?? ""} ${textColor ?? ""}`}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 overflow-hidden rounded-full">
            <AvatarImage src={user.profile?.datas?.avatar ?? undefined} alt={user.username} />
            <AvatarFallback>
              <FaUser />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle>{user.username}</CardTitle>
            <CardDescription>
              {user.status ? `Statut: ${user.status}` : "Statut non défini"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <h4 className="font-semibold mb-2">Profils associés</h4>
        <div className="grid gap-2">
          {user.profile ? (
            <div className="flex flex-col p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <span className="font-medium">{user.profile.type ?? "Type inconnu"}</span>
              {user.profile.datas && (
                <div className="text-sm text-muted-foreground mt-1">
                  {Object.entries(user.profile.datas).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-semibold">{key}: </span>{value as string}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2 text-xs text-muted-foreground">
                {user.profile.is_certified ? "Certifié ✅" : "Non certifié ❌"}
              </div>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Aucun profil disponible</span>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <button className="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600">
          Voir profil complet
        </button>
      </CardFooter>
    </Card>
  );
}
