
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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DASHBOARD_CAPTURE_ID = "dashboard-content-to-capture";

export function AppHeader() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleDownload = async (format: 'PDF' | 'Image' | 'HTML') => {
    const dashboardElement = document.getElementById(DASHBOARD_CAPTURE_ID);

    if (!dashboardElement) {
      toast({
        title: "Error",
        description: "Could not find dashboard content to capture.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `Preparing ${format} Download...`,
      description: "Please wait while your dashboard is being processed.",
    });

    try {
      if (format === 'Image' || format === 'PDF') {
        // html2canvas has issues with capturing elements that have their own scroll.
        // Temporarily disable scroll on the element and its parents for better capture.
        const originalScrollTops: { element: HTMLElement; scrollTop: number }[] = [];
        let current: HTMLElement | null = dashboardElement;
        while (current) {
          if (current.scrollTop > 0 || current.scrollLeft > 0) {
            originalScrollTops.push({ element: current, scrollTop: current.scrollTop });
            current.scrollTop = 0; // Reset scroll to capture from top
          }
          if (current.parentElement && current.parentElement !== document.body) {
            current = current.parentElement;
          } else {
            current = null;
          }
        }
        
        // Add a small delay to allow the DOM to update after scroll reset
        await new Promise(resolve => setTimeout(resolve, 100));


        const canvas = await html2canvas(dashboardElement, {
          allowTaint: true,
          useCORS: true,
          scrollX: 0,
          scrollY: 0, // Capture from the top after resetting scroll
          windowWidth: dashboardElement.scrollWidth,
          windowHeight: dashboardElement.scrollHeight,
          logging: false,
          onclone: (document) => {
            // Attempt to ensure Tailwind styles are applied in the cloned document
            // This is often tricky and might not always work perfectly.
            const styleSheets = Array.from(document.styleSheets);
            let globalStyles = "";
            try {
              styleSheets.forEach(sheet => {
                if (sheet.href && sheet.href.includes('globals.css')) { // Heuristic
                    // Accessing cssRules can throw CORS error if stylesheet is remote & not configured
                    Array.from(sheet.cssRules).forEach(rule => globalStyles += rule.cssText);
                } else if (!sheet.href) { // Inline styles
                    Array.from(sheet.cssRules).forEach(rule => globalStyles += rule.cssText);
                }
              });
            } catch (e) {
              console.warn("Could not fully access stylesheets for html2canvas cloning:", e);
            }
            if (globalStyles) {
                const style = document.createElement('style');
                style.textContent = globalStyles;
                document.head.appendChild(style);
            }
          }
        });

        // Restore original scroll positions
        originalScrollTops.forEach(({ element, scrollTop }) => {
          element.scrollTop = scrollTop;
        });

        if (format === 'Image') {
          const image = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = image;
          link.download = 'dashboard.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast({ title: "Image Downloaded", description: "Dashboard saved as PNG." });
        } else if (format === 'PDF') {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
          });
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
          pdf.save('dashboard.pdf');
          toast({ title: "PDF Downloaded", description: "Dashboard saved as PDF." });
        }
      } else if (format === 'HTML') {
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const content = dashboardElement.outerHTML;
        
        // Try to get all computed styles from the main document and inline them
        // This is a very heavy operation and might not be perfectly accurate or performant.
        // A simpler approach would be to link to external stylesheets if possible,
        // or just accept that the HTML will be structural with basic styles.
        let styles = "";
        Array.from(document.styleSheets).forEach(sheet => {
          try {
            Array.from(sheet.cssRules).forEach(rule => styles += rule.cssText);
          } catch (e) {
            console.warn("Could not access CSS rules from stylesheet:", sheet.href, e);
          }
        });

        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Dashboard Snapshot</title>
            <style>
              /* Embedded styles from the application */
              ${styles}
              /* Basic body styling for the snapshot */
              body { margin: 0; padding: 1rem; font-family: sans-serif; }
              /* Ensure the dashboard content itself doesn't add extra margins if body has padding */
              #${DASHBOARD_CAPTURE_ID} { margin: 0 !important; padding: 0 !important; }
            </style>
          </head>
          <body class="${currentTheme}">
            <h1>Dashboard Snapshot (Styles may vary from live view)</h1>
            ${content}
          </body>
          </html>
        `;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'dashboard.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast({
          title: "HTML Downloaded",
          description: "Dashboard structure saved as HTML. Note: Dynamic content and some styles might not be fully preserved.",
        });
      }
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: `Could not generate ${format}. Check console for details.`,
        variant: "destructive",
      });
    }
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
              <DropdownMenuItem onClick={() => handleDownload('Image')}>Download as Image (PNG)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('PDF')}>Download as PDF</DropdownMenuItem>
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
