"use client"

import { useEffect, useState } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Input, Button, User, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function TopNavbar() {

  const [user, setUser] = useState(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      } else {
        router.push('/login/');
      }
    };

    checkSession();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login/');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Navbar isBordered maxWidth='full'>
      <NavbarBrand>
        <Image 
          src="/logo.png" 
          alt="Logo" 
          width={110} 
          height={110}
        />
      </NavbarBrand>
      
      <NavbarContent justify="center">
        <NavbarItem>
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[20rem] h-10 min-w-[30rem]",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 bg-white dark:bg-default-500/20",
            }}
            placeholder="Find a dive by name or location"
            size="sm"
            type="search"
          />
        </NavbarItem>
      </NavbarContent>
      
      <NavbarContent justify="end">
        <NavbarItem className='mx-5'>
          <Button color="primary" variant="solid">
            Add a new dive
          </Button>
        </NavbarItem>
        <NavbarItem>
            
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
              <User
                as="button"
                avatarProps={{
                  isBordered: true,
                  src: "https://i.pravatar.cc/150?u=a042581f1e29026024d",
                }}
                className="transition-transform"
                name={user.email}
              />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="account">Account</DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={handleLogout}>Logout</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}