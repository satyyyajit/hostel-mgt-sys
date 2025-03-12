import Link from "next/link";
import Image from "next/image";
import { Building2Icon, GraduationCapIcon, MenuIcon, HomeIcon, InfoIcon, PhoneIcon } from 'lucide-react';

// Custom Button Component
const CustomButton = ({ href, children, className = "", variant = "primary" }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md  px-6 py-3 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantStyles = {
    primary: "bg-indigo-500 text-white hover:bg-indigo-400 focus:ring-blue-100",
    secondary: "bg-white text-black hover:bg-gray-200 focus:ring-gray-100 border border-gray-300",
  };
  
  return (
    <Link href={href} className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </Link>
  );
};

// Custom Card Component
const CustomCard = ({ icon, title, description, href, buttonText = "Login" }) => {
  return (
    <div className="flex flex-col rounded-2xl border-2 border-indigo-200 bg-card p-8 text-center shadow-sm transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
      <div className="mb-6 flex justify-center text-primary">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-foreground">{title}</h3>
      <p className="mb-6 text-muted-foreground flex-grow">{description}</p>
      <div className="mt-auto">
        <CustomButton href={href} variant="secondary">{buttonText}</CustomButton>
      </div>
    </div>
  );
};

// Feature Component
const Feature = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col items-center p-6 text-center rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-lg border-2 border-gray-300">
      <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

// Navbar Component
const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Building2Icon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">HOSTEL MANAGEMENT SYSTEM</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#" className="text-foreground hover:text-primary transition-colors">Home</Link>
          <Link href="#features" className="text-foreground hover:text-primary transition-colors">Features</Link>
          <Link href="#login-section" className="text-foreground hover:text-primary transition-colors">Login</Link>
          
        </nav>
        
        
      </div>
    </header>
  );
};

// Main Component
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/10 py-20 md:py-32">
          <div className="absolute inset-0 z-0">
            <Image
              src="/grid.png"
              alt="Background pattern"
              fill
              className="object-cover opacity-100"
              priority
            />
          </div>
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white   md:text-6xl">
                Hostel Management System
              </h1>
              <p className="mb-8 text-lg text-gray-300 md:text-xl">
                Streamline your hostel operations with our comprehensive management solution.
                Designed for both administrators and students.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CustomButton href="#login-section" className="text-lg">
                  Get Started
                </CustomButton>
                <CustomButton href="#features" variant="secondary" className="text-lg">
                  Learn More
                </CustomButton>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Key Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our hostel management system provides powerful tools for efficient administration and a seamless experience for students.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <Feature 
                icon={<HomeIcon size={24} />}
                title="Room Management"
                description="Efficiently manage room allocations, transfers, and maintenance requests."
              />
              <Feature 
                icon={<InfoIcon size={24} />}
                title="Tracking & Reporting"
                description="Track student attendance, generate reports, and monitor hostel activities."
              />
              <Feature 
                icon={<PhoneIcon size={24} />}
                title="Effeciency & Security"
                description="Protected records, automated processes, and secure data storage."
              />
            </div>
          </div>
        </section>

        {/* Login Section */}
        <section id="login-section" className="container mx-auto py-20 px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Login Portals</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access your respective portal to manage hostel operations or view your student information.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <CustomCard
              icon={<Building2Icon size={64} />}
              title="Warden Portal"
              description="Manage room allocation, fee collection, student records, and oversee all hostel operations from a centralized dashboard."
              href="/login/admin"
              buttonText="Admin Login"
            />
            <CustomCard
              icon={<GraduationCapIcon size={64} />}
              title="Student Portal"
              description="View your room details, check fee status, submit maintenance requests, and manage all aspects of your hostel experience."
              href="/login/student"
              buttonText="Student Login"
            />
          </div>
        </section>

        {/* Contact Section */}
        
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2Icon className="h-6 w-6 text-primary" />
                <h3 className="font-bold">Hostel Management</h3>
              </div>
              <p className="text-muted-foreground">
                Providing efficient hostel management solutions for educational institutions.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#login-section" className="text-muted-foreground hover:text-primary transition-colors">Login</Link></li>
              </ul>
            </div>
            
            
            
            
          </div>
          
          <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} Hostel Management System.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
