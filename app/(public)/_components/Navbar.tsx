import Image from 'next/image'
import Logo from '@/public/Logo.svg';
import { env } from './../../../lib/env';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/themeToggle';
import UserDropdown from './UserDropdown';

const navigationItems = [
    {name: 'Home', href: '/'},
    {name: 'Courses', href: '/courses'},
    {name: 'Dashboard', href: '/dashboard'},
]

function Navbar() {

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60 '>
        <div className='container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8'>
            <Link href='/' className='flex items-center space-x-2 mr-4'>
                <Image src={Logo} className='size-9' alt='Logo'/>
                <span className='font-bold'>{env.NEXT_PUBLIC_APP_NAME}</span>
            </Link>

            <nav className='hidden md:flex md:flex-1 md:items-center md:justify-between'>
                <div className='flex items-center space-x-2'>
                    {navigationItems.map((item) => (
                        <Link key={item.name} href={item.href} className='text-sm font-medium transition-colors hover:text-primary'>
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div className='flex items-center space-x-4'>
                    <ThemeToggle/>
                    <UserDropdown/>
                </div>
            </nav>
        </div>
    </header>
  )
}

export default Navbar