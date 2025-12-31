import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Oops! The page you're looking for does not exist.</p>
      <Link href="/">
        <Button >Go Back Home</Button>
      </Link>
    </div>
  );
}
