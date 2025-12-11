'use client'

import { forwardRef } from "react";
import { cn } from "@/utils/utils";
import Link from "next/link";

interface NavLinkCompatProps  {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  href: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, href, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, activeClassName, pendingClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
