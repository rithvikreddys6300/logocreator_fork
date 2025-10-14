"use client";

import { useState, useEffect } from "react";
import { getLogoHistory, removeLogoFromHistory, clearLogoHistory, LogoHistoryItem } from "@/app/lib/logoHistory";
import { Button } from "@/app/components/ui/button";
import { DownloadIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";

export default function DashboardPage() {
  const [logoHistory, setLogoHistory] = useState<LogoHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isSignedIn } = useUser();

  useEffect(() => {
    // Load history from localStorage
    const history = getLogoHistory();
    setLogoHistory(history.items);
    setIsLoading(false);
  }, []);

  const handleDeleteLogo = (id: string) => {
    removeLogoFromHistory(id);
    setLogoHistory(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Logo deleted",
      description: "Logo has been removed from your history.",
    });
  };

  const handleClearAll = () => {
    clearLogoHistory();
    setLogoHistory([]);
    toast({
      title: "History cleared",
      description: "All logos have been removed from your history.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#343434] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="mb-4">Please sign in to view your logo history.</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#343434] text-white">
      {/* Header */}
      <header className="border-b border-[#2C2C2C] bg-[#2C2C2C] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-white hover:text-gray-300">
              ← Back to Logo Creator
            </Link>
            <h1 className="text-2xl font-bold">Logo History</h1>
          </div>
          {logoHistory.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Clear All History
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Clear All History</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete all logos from your history? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {}}>Cancel</Button>
                  <Button variant="destructive" onClick={handleClearAll}>
                    Clear All
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="loader mb-4" />
              <p>Loading your logo history...</p>
            </div>
          </div>
        ) : logoHistory.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <Image
                src="/generate-icon.svg"
                alt="No logos"
                width={64}
                height={64}
                className="mx-auto mb-4 opacity-50"
              />
              <h2 className="text-xl font-semibold mb-2">No logos yet</h2>
              <p className="text-gray-400 mb-6">
                Create your first logo to see it appear in your history.
              </p>
              <Link href="/">
                <Button>Create Your First Logo</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {logoHistory.map((logo) => (
              <div
                key={logo.id}
                className="bg-[#2C2C2C] rounded-lg p-4 border border-[#404040] hover:border-[#606060] transition-colors"
              >
                {/* Logo Image */}
                <div className="relative aspect-square mb-4 bg-white rounded-lg overflow-hidden">
                  <Image
                    src={logo.imageData}
                    alt={`Logo for ${logo.companyName}`}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Logo Details */}
                <div className="space-y-2 mb-4">
                  <h3 className="font-semibold text-lg truncate">{logo.companyName}</h3>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>Style: {logo.style}</p>
                    <p>Primary: {logo.primaryColor}</p>
                    <p>Background: {logo.backgroundColor}</p>
                    {logo.additionalInfo && (
                      <p className="truncate" title={logo.additionalInfo}>
                        Info: {logo.additionalInfo}
                      </p>
                    )}
                    <p>Created: {formatDate(logo.createdAt)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    asChild
                  >
                    <a href={logo.imageData} download={`${logo.companyName}-logo.png`}>
                      <DownloadIcon className="h-4 w-4 mr-1" />
                      Download
                    </a>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Logo</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete the logo for "{logo.companyName}"? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {}}>Cancel</Button>
                        <Button variant="destructive" onClick={() => handleDeleteLogo(logo.id)}>
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
