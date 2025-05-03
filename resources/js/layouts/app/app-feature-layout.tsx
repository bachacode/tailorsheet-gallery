import HeadingBig from "@/components/common/heading-big";
import { Link } from "@inertiajs/react";
import React from "react";

interface AppFeatureLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  action: {
    route: string;
    text: string;
  }
}

export default function AppFeatureLayout({ title, description = '', children, action }: AppFeatureLayoutProps) {
  return (
    <div className='py-8 px-12 space-y-6'>
      <div className='flex justify-between items-center'>
        <HeadingBig title={title} description={description} />
        <Link href={route(action.route)} className="bg-blue-500 hover:bg-blue-400 transition-colors text-white px-4 py-2 rounded">
          {action.text}
        </Link>
      </div>
      <div>
        {children}
      </div>
    </div>

  )

}
