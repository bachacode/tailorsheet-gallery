import HeadingBig from "@/components/common/heading-big";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { LoaderCircle, LucideMoveLeft } from "lucide-react";
import React from "react";
import { AxiosProgressEvent } from 'axios';

interface AppFormLayout {
  headerTitle: string;
  headerDescription?: string;
  backRoute: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitText: string;
  processing: boolean;
  onProcessText: string;
  progress?: AxiosProgressEvent | null
}

export default function AppFormLayout({
  headerTitle,
  headerDescription,
  backRoute,
  children,
  onSubmit,
  processing,
  submitText,
  onProcessText,
  progress
}: AppFormLayout) {
  return (
    <div className="py-8 px-12 space-y-6 border rounded-xl shadow-sm gap-6 flex flex-col mt-10">
      <header className="flex justify-between items-center">

        {/* Heading */}
        <HeadingBig title={headerTitle} description={headerDescription} />

        {/* Back link */}
        <Link href={route(backRoute)} className="bg-blue-500 hover:bg-blue-400 transition-colors text-white px-4 py-2 rounded cursor-pointer">
          <span className="flex items-center">
            <LucideMoveLeft className="h-4 w-4 mr-1.5" />Volver
          </span>
        </Link>

      </header>
      <div>
        <form onSubmit={onSubmit} className="space-y-4">
        {children}

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button type="submit" disabled={processing} className="bg-blue-500 hover:bg-blue-400 min-w-xs transition-colors text-white px-4 py-6 rounded cursor-pointer">
            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {processing ? onProcessText : submitText}
            {progress && (
              <progress value={progress.percentage} max="100">
                {progress.percentage}%
              </progress>
            )}
          </Button>
        </div>
        </form>
      </div>
    </div>
  )
}
