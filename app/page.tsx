import Link from "next/link";
import { Home as HomeIcon, Building2, Search, Users, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6FAFD] to-white">
      {/* Navbar */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <HomeIcon className="w-8 h-8 text-[#0A1931]" />
          <span className="text-2xl font-bold text-[#0A1931]">HomiePG</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-[#4A7FA7] hover:text-[#0A1931] transition-colors font-medium">
            About
          </Link>
          <Link href="#" className="text-[#4A7FA7] hover:text-[#0A1931] transition-colors font-medium">
            Features
          </Link>
          <Link href="#" className="text-[#4A7FA7] hover:text-[#0A1931] transition-colors font-medium">
            Contact
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#0A1931] mb-6 leading-tight">
            Find Your Perfect <span className="text-[#4A7FA7]">PG Home</span>
          </h1>
          <p className="text-xl text-[#4A7FA7] mb-10">
            Discover verified paying guest accommodations with all amenities, transparent pricing, and seamless booking experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Customer CTA */}
          <Link href="/customer/dashboard" className="group">
            <div className="bg-gradient-to-br from-[#0A1931] to-[#1A3D63] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">I&apos;m looking for a PG</h2>
              <p className="text-[#B3CFE5] mb-6">
                Search, compare, and book verified PGs with all amenities. Find your second home today!
              </p>
              <div className="flex items-center gap-2 text-white font-semibold">
                Start Searching
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Owner CTA */}
          <Link href="/owner/dashboard" className="group">
            <div className="bg-white border-2 border-[#D9E3EC] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:border-[#4A7FA7]">
              <div className="w-16 h-16 bg-[#EDF4FB] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8 text-[#0A1931]" />
              </div>
              <h2 className="text-2xl font-bold text-[#0A1931] mb-3">I&apos;m a PG Owner</h2>
              <p className="text-[#4A7FA7] mb-6">
                List your property, manage residents, track payments, and grow your business effortlessly.
              </p>
              <div className="flex items-center gap-2 text-[#0A1931] font-semibold">
                List Your Property
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#0A1931] text-center mb-12">Why Choose HomiePG?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-[#EDF4FB] rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7 text-[#0A1931]" />
              </div>
              <h3 className="text-xl font-semibold text-[#0A1931] mb-2">Verified Listings</h3>
              <p className="text-[#4A7FA7]">All properties are thoroughly verified for safety and authenticity.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-[#EDF4FB] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-[#0A1931]" />
              </div>
              <h3 className="text-xl font-semibold text-[#0A1931] mb-2">Best-in-class Amenities</h3>
              <p className="text-[#4A7FA7]">From WiFi to food, all essential amenities are available.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-[#EDF4FB] rounded-xl flex items-center justify-center mx-auto mb-4">
                <HomeIcon className="w-7 h-7 text-[#0A1931]" />
              </div>
              <h3 className="text-xl font-semibold text-[#0A1931] mb-2">Seamless Experience</h3>
              <p className="text-[#4A7FA7]">Book, pay, and manage your stay all in one place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#D9E3EC] bg-[#F6FAFD]">
        <div className="max-w-7xl mx-auto px-6 text-center text-[#4A7FA7]">
          <p>© 2024 HomiePG. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
