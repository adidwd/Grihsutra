import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    // Mock newsletter signup
    toast({
      title: "Subscribed!",
      description: "You've been subscribed to our newsletter.",
    });
    setEmail("");
  };

  return (
    <>
      {/* Newsletter Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Stay Updated</h3>
          <p className="text-xl text-blue-100 mb-8">
            Get exclusive offers and new collection updates
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white"
            />
            <Button type="submit" className="bg-accent hover:bg-green-600 text-white">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">TextileHome</h4>
              <p className="text-gray-400 mb-4">
                Premium textiles for your home comfort and style.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Products</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/bedsheets" className="hover:text-white transition-colors">
                    Bedsheets
                  </Link>
                </li>
                <li>
                  <Link href="/pillow-covers" className="hover:text-white transition-colors">
                    Pillow Covers
                  </Link>
                </li>
                <li>
                  <Link href="/table-covers" className="hover:text-white transition-colors">
                    Table Covers
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    New Arrivals
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Size Guide
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TextileHome. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
