
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t">
      <div className="container mx-auto py-12 px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="flex items-center">
            <Image src="https://i.ibb.co/LdN7TD1j/image-removebg-preview.png" alt="IndiaIntern.ai Logo" width={200} height={50} />
          </div>
          <div className="text-sm text-muted-foreground">
            A project of Smart India Hackathon.
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-foreground">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="text-muted-foreground hover:text-primary">About Us</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-foreground">In collaboration with</h4>
          <div className="flex items-center gap-4">
             <Image src="https://i.ibb.co/zTP3djy5/SIH-Logo-removebg-preview.png" alt="SIH 2025 Logo" width={140} height={56} />
             <Image src="https://i.ibb.co/Lz5KDwfF/Ministry-of-Corporate-Affairs-India-svg-removebg-preview.png" alt="Ministry of Corporate Affairs Logo" width={56} height={56} />
          </div>
        </div>
      </div>
      <div className="bg-gray-200/50 dark:bg-gray-900/50 py-4 border-t">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} IndiaIntern.ai. All Rights Reserved.
          </div>
      </div>
    </footer>
  );
}
