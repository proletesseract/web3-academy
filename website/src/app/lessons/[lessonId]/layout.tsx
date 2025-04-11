// This is a server component
import { Metadata } from 'next';

// Instruct Next.js to revalidate the data at most every 5 seconds
export const revalidate = 5;

// Enable dynamic rendering for this route
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Lesson | Immutable Academy',
};

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-screen-2xl mx-auto">
      {children}
    </div>
  );
} 