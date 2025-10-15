import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FaUser } from "react-icons/fa";
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.profile?.datas?.avatar ?? undefined} alt={user.username} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {/*getInitials(user.profile?.datas?.fullname)*/}
                    <FaUser className="" />
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.profile?.datas?.fullname}</span>
                <span className="truncate text-xs text-muted-foreground uppercase">{user.profile?.type}</span>
                {showEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.profile?.datas?.email ? user.profile?.datas?.email : user.profile?.datas?.phone}
                    </span>
                )}
            </div>
        </>
    );
}
