"use client"

import {
  BookOpen,
  ChevronDownIcon,
  Home,
  LayoutDashboardIcon,
  LogOutIcon,
  User,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { useSignOut } from "@/hooks/use-signout"

export default function UserDropdown() {
    const {data: session, isPending} = authClient.useSession()
    const {name, email, image} = session?.user || {}
    const handleSignOut = useSignOut()

    if (isPending) {return null}
    if (!session) {
    return (
      <>
        <Link href={"/login"} className={buttonVariants({variant:"ghost"})}>
          Login
        </Link>
        <Link href={"/login"} className={buttonVariants()}>
          Get Started
        </Link>
      </>);
    }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className=" p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={image?? `https://avatar.vercel.sh/${name || email}`} alt={name} />
            <AvatarFallback><User/></AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild >
            <Link href="/">
                <Home size={16} className="opacity-60" aria-hidden="true" />
                <span>Home</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/courses">
                <BookOpen size={16} className="opacity-60" aria-hidden="true" />
                <span>Courses</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
                <LayoutDashboardIcon size={16} className="opacity-60" aria-hidden="true" />
                <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
