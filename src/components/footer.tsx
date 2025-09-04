
import Link from 'next/link';
import { Logo } from './icons';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto py-12 px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8 text-orange-500" />
            <h3 className="text-xl font-bold">intern.ai</h3>
          </div>
          <p className="text-sm text-blue-200">
            A Smart India Hackathon 2025 Project for the Ministry of Corporate Affairs.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="text-blue-200 hover:text-white">About Us</Link></li>
            <li><Link href="#" className="text-blue-200 hover:text-white">Contact</Link></li>
            <li><Link href="#" className="text-blue-200 hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">In collaboration with</h4>
          <div className="flex items-center gap-4">
             <Image src="https://i.imgur.com/gG4gH0g.png" alt="SIH 2025 Logo" width={140} height={56} />
             <Image src="https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Ministry_of_Corporate_Affairs_India.svg/1200px-Ministry_of_Corporate_Affairs_India.svg.png" alt="Ministry of Corporate Affairs Logo" width={40} height={40} />
          </div>
        </div>
      </div>
      <div className="bg-blue-950/50 py-4">
          <div className="container mx-auto text-center text-sm text-blue-300">
            © {new Date().getFullYear()} intern.ai. All Rights Reserved.
          </div>
      </div>
    </footer>
  );
}
