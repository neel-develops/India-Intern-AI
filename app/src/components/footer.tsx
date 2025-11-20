
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const studentLinks = [
       { href: "/register", label: "Create Profile"},
       { href: "/internships", label: "Browse Internships"},
       { href: "/eligibility", label: "Check Eligibility"},
       { href: "/login", label: "Student Login"},
  ];

  return (
    <footer className="bg-muted/20 border-t">
      <div className="container mx-auto py-12 px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 col-span-1 md:col-span-2">
           <Link href="/" className="flex flex-col items-start gap-2 max-w-xs">
              <Image src="https://i.ibb.co/LdN7TD1j/image-removebg-preview.png" alt="IndiaIntern.ai Logo" width={150} height={33} />
              <p className="text-xs text-muted-foreground -mt-2">A project of Smart India Hackathon in collaboration with the Ministry of Corporate Affairs.</p>
            </Link>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-foreground">For Students</h4>
          <ul className="space-y-2 text-sm">
            {studentLinks.map(link => (
                <li key={link.href}><Link href={link.href} className="text-muted-foreground hover:text-primary">{link.label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-foreground">For Industry</h4>
           <ul className="space-y-2 text-sm">
             <li><span className="text-muted-foreground">Recruiter tools coming soon</span></li>
          </ul>
        </div>
      </div>
      <div className="bg-muted/30 py-4 border-t">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} IndiaIntern.ai. All Rights Reserved.
          </div>
      </div>
    </footer>
  );
}
