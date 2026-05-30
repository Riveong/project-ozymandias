import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Video, Users, Zap, Shield, Star, Play, ArrowRight, Check, Menu, X, Quote, Globe, Clock } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Ozymandias AI</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group">
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <Link to="/dashboard" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5">
              + Create
            </Link>
          </div>

          <button className="md:hidden text-gray-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            <Link to="/dashboard" className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-full text-center">
              + Create
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const HeroSection = () => (
  <section className="pt-32 pb-24 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
    <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
    <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
    
    <div className="relative max-w-5xl mx-auto px-6 text-center">
      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-blue-100 mb-10">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        <span className="text-sm text-gray-700 font-medium">#1 AI Brand Ambassador in Indonesia</span>
      </div>

      <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
        <span className="text-gray-900">Create AI Video</span>
        <br />
        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Brand Ambassador
        </span>
        <br />
        <span className="text-gray-400">in 60 Seconds</span>
      </h1>

      <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Transform your product photos and face into <span className="font-semibold text-gray-900">professional promotional videos</span> with AI. No studio, no actors, no expensive costs.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        <Link to="/dashboard" className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center gap-3 hover:-translate-y-1">
          Create Free Video
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        <button className="group px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 font-semibold rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-3 hover:-translate-y-1">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
            <Play className="w-4 h-4 text-white ml-0.5" />
          </div>
          Watch Demo
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-8 text-gray-500">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <span className="text-sm">60 Seconds</span>
        </div>
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-purple-500" />
          <span className="text-sm">4-8 Shots</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-green-500" />
          <span className="text-sm">Multi-language</span>
        </div>
      </div>
    </div>
  </section>
);

const FeatureCard = ({ icon: Icon, title, description, color }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-amber-500'
  };
  
  return (
    <div className="group p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
      <div className={`w-16 h-16 bg-gradient-to-br ${colors[color]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    { icon: Video, title: "Studio Quality Videos", desc: "Generate promotional videos with cinematic quality that rivals professional studio productions.", color: 'blue' },
    { icon: Users, title: "Multi-Persona Support", desc: "Choose from various AI personas or use your own face for personal branding.", color: 'purple' },
    { icon: Zap, title: "Lightning Fast", desc: "From input to finished video in just 60 seconds. No waiting for hours.", color: 'orange' },
    { icon: Shield, title: "Safe & Private", desc: "Your data and content are encrypted and secure. Full control over your digital assets.", color: 'green' }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 font-bold text-sm uppercase tracking-wider rounded-full mb-4">Key Features</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Everything You Need</h2>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">Complete platform for creating engaging and professional AI promotional video content</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    { num: "01", title: "Upload Photos", desc: "Upload your product photo and face photo or choose from available AI personas.", color: 'bg-blue-600' },
    { num: "02", title: "Set Details", desc: "Enter product information, speaking style, and other preferences as needed.", color: 'bg-indigo-600' },
    { num: "03", title: "Generate Video", desc: "AI will create a professional promotional video in seconds.", color: 'bg-purple-600' }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent_79px,#677788_79px,#677788_80px,transparent_80px),linear-gradient(#677788_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-blue-400 font-bold text-sm uppercase tracking-wider rounded-full mb-4 backdrop-blur-sm">Simplicity</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">Three easy steps to create a professional brand ambassador video</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-all duration-300"></div>
              <div className="relative bg-gray-800 rounded-2xl p-10 text-center border border-gray-700">
                <div className={`w-24 h-24 ${s.color} rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl`}>
                  <span className="text-3xl font-black text-white">{s.num}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{s.title}</h3>
                <p className="text-gray-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialSection = () => (
  <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
    <div className="max-w-4xl mx-auto px-6">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 font-bold text-sm uppercase tracking-wider rounded-full mb-4">Testimonials</span>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900">Trusted by Brands</h2>
      </div>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 relative">
        <Quote className="absolute top-8 left-8 w-16 h-16 text-blue-100" />
        <div className="relative">
          <p className="text-xl text-gray-700 italic leading-relaxed mb-8 pl-8">"Ozymandias AI has completely transformed our marketing workflow. We can now create professional promotional videos in minutes instead of days. The quality is amazing!"</p>
          <div className="flex items-center gap-4 pl-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">S</div>
            <div>
              <p className="font-bold text-gray-900">Sarah Wijaya</p>
              <p className="text-gray-500 text-sm">Marketing Director, TokoSkincare ID</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const PricingCard = ({ name, price, features, isPopular = false }) => (
  <div className={`relative p-8 rounded-3xl border-2 transition-all duration-300 hover:-translate-y-2 ${isPopular ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-transparent shadow-2xl shadow-blue-500/30' : 'bg-white border-gray-200 shadow-lg hover:shadow-xl hover:border-blue-200'}`}>
    {isPopular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-sm font-black text-gray-900 shadow-lg">
        ⭐ Most Popular
      </div>
    )}
    <h3 className={`text-2xl font-black mb-2 ${isPopular ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
    <div className="flex items-baseline gap-1 mb-8">
      <span className={`text-5xl font-black ${isPopular ? 'text-white' : 'text-gray-900'}`}>{price}</span>
      <span className={isPopular ? 'text-blue-200' : 'text-gray-500'}>/month</span>
    </div>
    <ul className="space-y-4 mb-10">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isPopular ? 'bg-white/20' : 'bg-green-100'}`}>
            <Check className={`w-4 h-4 ${isPopular ? 'text-white' : 'text-green-600'}`} />
          </div>
          <span className={isPopular ? 'text-blue-100' : 'text-gray-700'}>{f}</span>
        </li>
      ))}
    </ul>
    <button className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isPopular ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
      Get Started
    </button>
  </div>
);

const PricingSection = () => {
  const plans = [
    { name: "Starter", price: "Free", features: ["5 videos/month", "3 AI personas", "480p quality", "Watermark"] },
    { name: "Pro", price: "Rp 199k", isPopular: true, features: ["50 videos/month", "All personas", "1080p quality", "No watermark", "Priority processing", "Basic analytics"] },
    { name: "Enterprise", price: "Custom", features: ["Unlimited videos", "API access", "4K quality", "Custom persona", "Dedicated support"] }
  ];

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 font-bold text-sm uppercase tracking-wider rounded-full mb-4">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-gray-600">Start free and upgrade anytime based on your business needs</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((p, i) => <PricingCard key={i} {...p} />)}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => (
  <section className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
    <div className="absolute inset-0">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
    </div>
    
    <div className="relative max-w-3xl mx-auto px-6 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue-500/50">
        <Sparkles className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to Create Your First Brand Ambassador Video?</h2>
      <p className="text-xl text-blue-200 mb-12">Join thousands of brands already using Ozymandias AI for their promotional content</p>
      <Link to="/dashboard" className="group inline-flex items-center gap-4 px-12 py-6 bg-white text-gray-900 font-bold text-xl rounded-full hover:shadow-2xl transition-all hover:-translate-y-1">
        Start Free Now
        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-50 border-t border-gray-200 py-16">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Ozymandias AI</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">AI Brand Ambassador platform for creating professional promotional videos in seconds.</p>
        </div>
        <div>
          <h4 className="text-gray-900 font-bold mb-4">Product</h4>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li><a href="#features" className="hover:text-blue-600 transition-colors">Features</a></li>
            <li><a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-900 font-bold mb-4">Company</h4>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-900 font-bold mb-4">Legal</h4>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-colors">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">© 2026 Ozymandias AI. All rights reserved.</p>
        <div className="flex gap-3">
          <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-gray-900 border border-gray-200 transition-all">𝕏</a>
          <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-pink-500 border border-gray-200 transition-all">IG</a>
          <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-red-500 border border-gray-200 transition-all">YT</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
