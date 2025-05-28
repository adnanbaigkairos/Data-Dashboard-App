import type { SVGProps } from 'react';

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="hsl(var(--primary))" stroke="none" />
      <path d="M9 12l2 2 4-4" stroke="hsl(var(--primary-foreground))" />
      <line x1="3" y1="9" x2="21" y2="9" stroke="hsl(var(--background))" strokeOpacity="0.5" />
      <line x1="9" y1="3" x2="9" y2="21" stroke="hsl(var(--background))" strokeOpacity="0.5" />
    </svg>
  );
}
