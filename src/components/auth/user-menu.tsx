import { useNavigate } from '@tanstack/react-router'
import { LogOut, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { signOut } from '#/server/auth'

interface UserMenuProps {
    user: {
        email?: string | null
        user_metadata?: {
            full_name?: string
            avatar_url?: string
        }
    }
}

export function UserMenu({ user }: UserMenuProps) {
    const navigate = useNavigate()
    const name = user.user_metadata?.full_name ?? user.email ?? 'User'
    const avatar = user.user_metadata?.avatar_url
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    const handleSignOut = async () => {
        await signOut()
        navigate({ to: '/{-$lang}' })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <button className="flex items-center gap-2 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={avatar} alt={name} />
                        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{name}</p>
                    {user.email && (
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
