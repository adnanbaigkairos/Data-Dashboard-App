"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DownloadCloud, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { LogoIcon } from '@/components/icons/LogoIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

export function AppHeader() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleDownload = (format: 'PDF' | 'Image' | 'HTML') => {
    // Placeholder for download functionality
    toast({
      title: "Download Initiated (Placeholder)",
      description: `Dashboard download as ${format} is not yet implemented.`,
    });
    console.log(`Download dashboard as ${format}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <LogoIcon className="h-6 w-6" />
            <span className="font-bold sm:inline-block text-lg">
              Data Canvas
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <DownloadCloud className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Download Dashboard</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDownload('PDF')}>Download as PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('Image')}>Download as Image</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('HTML')}>Download as HTML</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle theme"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
