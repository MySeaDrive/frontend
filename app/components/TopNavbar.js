"use client"

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Input, Button, User, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from '@/app/hooks/useSession';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { fetchWithAuth } from '@/app/utils/api';
import { useState } from 'react';
import toast from "react-hot-toast";

export default function TopNavbar() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { session, loading: sessionLoading } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAddNewDive = async () => {
    try {
      const newDive = await fetchWithAuth('/dives/save', {
        method: 'POST',
        body: { name: 'Untitled Dive' }
      });
      router.push(`/dashboard/dive/${newDive.id}`);
      toast.success('New dive added!')
    } catch (error) {
      console.error('Error creating new dive:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login/');
  };

  if (sessionLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null; // Or a simplified navbar for non-authenticated users
  }

  return (
    <Navbar 
      isBordered 
      maxWidth='2xl' 
      className="bg-blue-200 bg-opacity-70 backdrop-blur-sm"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >

      <NavbarContent className="hidden sm:flex" justify="start">
        <a href="/dashboard">
          <Image src="/logo.webp" width="40" height="100"/>
        </a>
        <NavbarItem className="w-full max-w-[600px]">
          <Input
            classNames={{
              base: "w-full h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 bg-white dark:bg-default-500/20",
            }}
            placeholder="find a dive by name or location"
            size="sm"
            type="search"
          />
        </NavbarItem>
      </NavbarContent>
      
      
      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <Button className="bg-blue-500 text-white shadow text-xs button-text" variant="solid" onClick={handleAddNewDive}>
            Add a new dive
          </Button>
        </NavbarItem>
        <Dropdown placement="bottom-end">
          <NavbarItem>
            <DropdownTrigger>
              <User
                as="button"
                avatarProps={{
                  isBordered: true,
                  src: "https://i.pravatar.cc/150?u=a042581f1e29026024d",
                }}
                className="transition-transform"
              />
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="email" className="h-14 gap-2" isReadOnly>
              <p className="font-semibold">signed in as</p>
              <p className="font-semibold">{session.user.email}</p>
            </DropdownItem>
            <DropdownItem key="add_dive" className="sm:hidden" onClick={handleAddNewDive}>
              Add a new dive
            </DropdownItem>
            <DropdownItem key="account">Account</DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={handleLogout}>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}