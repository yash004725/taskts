"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm dark:bg-gray-900/95" : "bg-transparent",
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="grid gap-6 py-6">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    XDigitalHub
                  </span>
                </Link>
                <div className="grid gap-3">
                  <Link href="/" className={cn("font-medium", pathname === "/" && "text-blue-600")}>
                    Home
                  </Link>
                  <Link href="/checkout" className={cn("font-medium", pathname === "/checkout" && "text-blue-600")}>
                    Enroll Now
                  </Link>
                  <Link
                    href="/terms-conditions"
                    className={cn("font-medium", pathname === "/terms-conditions" && "text-blue-600")}
                  >
                    Terms & Conditions
                  </Link>
                  <Link
                    href="/cancellation-refund-policy"
                    className={cn("font-medium", pathname === "/cancellation-refund-policy" && "text-blue-600")}
                  >
                    Cancellation & Refund
                  </Link>
                  <Link
                    href="/privacy-policy"
                    className={cn("font-medium", pathname === "/privacy-policy" && "text-blue-600")}
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="hidden md:flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              XDigitalHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Course Details</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {courseModules.map((module) => (
                      <ListItem key={module.title} title={module.title} href="/">
                        {module.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Legal</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[250px] gap-3 p-4">
                    <ListItem title="Terms & Conditions" href="/terms-conditions">
                      Our terms of service
                    </ListItem>
                    <ListItem title="Cancellation & Refund" href="/cancellation-refund-policy">
                      Our refund policy
                    </ListItem>
                    <ListItem title="Privacy Policy" href="/privacy-policy">
                      Our privacy policy
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Logo (centered) */}
        <Link
          href="/"
          className="md:hidden text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          XDigitalHub
        </Link>

        {/* Right Side - Enroll Button */}
        <div className="flex items-center gap-4">
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hidden md:flex"
            asChild
          >
            <Link href="/checkout">Enroll Now - ₹249</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

// Course Modules for Navigation
const courseModules = [
  {
    title: "3D Modeling Fundamentals",
    description: "Learn to create 3D models from scratch using industry-standard tools",
    href: "/",
  },
  {
    title: "Character Animation",
    description: "Master the principles of animation and bring characters to life",
    href: "/",
  },
  {
    title: "Environment Design",
    description: "Create stunning 3D environments with proper lighting and texturing",
    href: "/",
  },
  {
    title: "Visual Effects",
    description: "Add impressive visual effects using particle systems and dynamics",
    href: "/",
  },
]

const ListItem = ({ className, title, children, ...props }: any) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}
