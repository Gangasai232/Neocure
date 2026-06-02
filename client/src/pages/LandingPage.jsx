import React from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Landing from "/Landing.png";
import Team from "/Team.png";
import {
  Activity,
  Calendar,
  Users,
  ClipboardList,
  Heart,
  Shield,
  Clock,
  CreditCard,
  Stethoscope,
  UserCircle,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Smart Scheduling",
      description:
        "Book appointments with ease. Our intelligent system helps you find the perfect time slot with your preferred doctor.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Patient Management",
      description:
        "Comprehensive patient records and history management. Access your medical information anytime, anywhere.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Health Predictions",
      description:
        "AI-powered health risk assessment. Get insights into potential health concerns before they become serious.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: "Digital Records",
      description:
        "Secure, encrypted medical records accessible from anywhere. Your health data is always at your fingertips.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Easy Payments",
      description:
        "Seamless payment integration for consultations and services. Multiple payment options for your convenience.",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description:
        "Bank-level encryption and HIPAA compliance. Your health information is protected with military-grade security.",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  const stats = [
    {
      number: "50K+",
      label: "Patients Served",
      icon: <Users className="w-5 h-5" />,
    },
    {
      number: "200+",
      label: "Expert Doctors",
      icon: <Stethoscope className="w-5 h-5" />,
    },
    {
      number: "98%",
      label: "Satisfaction Rate",
      icon: <Heart className="w-5 h-5" />,
    },
    {
      number: "24/7",
      label: "Support Available",
      icon: <Clock className="w-5 h-5" />,
    },
  ];

  const services = [
    {
      name: "General Physician Consultation",
      price: "₹500",
      duration: "15 minutes",
      icon: <UserCircle />,
      category: "consultation",
    },
    {
      name: "Dermatologist Consultation",
      price: "₹800",
      duration: "20 minutes",
      icon: <Stethoscope />,
      category: "consultation",
    },
    {
      name: "Complete Blood Count (CBC)",
      price: "₹750",
      duration: "10 minutes",
      icon: <Activity />,
      category: "diagnostic",
    },
    {
      name: "Chest X-Ray",
      price: "₹1,000",
      duration: "15 minutes",
      icon: <Heart />,
      category: "diagnostic",
    },
    {
      name: "Physiotherapy Session",
      price: "₹1,200",
      duration: "45 minutes",
      icon: <ClipboardList />,
      category: "therapy",
    },
    {
      name: "Psychological Counseling",
      price: "₹1,500",
      duration: "50 minutes",
      icon: <Shield />,
      category: "therapy",
    },
    {
      name: "Full Body Health Checkup",
      price: "₹3,500",
      duration: "60 minutes",
      icon: <CheckCircle />,
      category: "checkup",
    },
    {
      name: "Appendix Removal Surgery",
      price: "₹25,000",
      duration: "90 minutes",
      icon: <Activity />,
      category: "surgery",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HealthCare+
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#services"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                Services
              </a>
              <a
                href="#about"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
            </div>

            <div className="flex items-center gap-3">
              <ModeToggle />
              <Link to="/login">
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered Healthcare Platform
              </Badge>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Your Health,
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Experience the future of healthcare with our comprehensive
                Hospital Management System. Book appointments, manage records,
                and get AI-powered health predictions - all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="hover:bg-neutral-100 dark:hover:bg-neutral-800 w-full sm:w-auto"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="text-blue-600 dark:text-blue-400">
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.number}</div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10" />
                <img
                  src={Landing}
                  alt="Landing Page"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-110 transition-transform duration-300"
              >
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <div className="text-4xl font-bold mb-1">{stat.number}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need for
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Better Healthcare
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform combines cutting-edge technology with
              user-friendly design to deliver exceptional healthcare management
              experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-20 md:py-32 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-neutral-900 dark:to-neutral-950"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                About Our
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Healthcare Platform
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We're revolutionizing healthcare management with cutting-edge
                technology and compassionate care
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold">Our Mission</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To make quality healthcare accessible to everyone through
                  innovative technology. We combine advanced AI-powered
                  diagnostics with a user-friendly platform that connects
                  patients with the best healthcare professionals.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Our comprehensive Hospital Management System streamlines every
                  aspect of healthcare delivery - from appointment scheduling to
                  medical records management, ensuring you receive the best care
                  possible.
                </p>
              </div>
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10" />
                  <img
                    src={Team}
                    alt="Medical Team"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">Innovation</h4>
                <p className="text-muted-foreground">
                  Leveraging AI and machine learning to provide predictive
                  health insights and personalized care
                </p>
              </Card>

              <Card className="text-center p-6 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">Patient-Centric</h4>
                <p className="text-muted-foreground">
                  Every feature is designed with patients in mind, ensuring ease
                  of use and accessibility
                </p>
              </Card>

              <Card className="text-center p-6 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">Security</h4>
                <p className="text-muted-foreground">
                  Your health data is protected with military-grade encryption
                  and strict privacy protocols
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-20 md:py-32 bg-neutral-50 dark:bg-neutral-900/50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Affordable Healthcare
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                For Everyone
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transparent pricing with no hidden fees. Quality healthcare should
              be accessible to all.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 hover:border-blue-500"
              >
                <CardHeader>
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                    {React.cloneElement(service.icon, { className: "w-8 h-8" })}
                  </div>
                  <CardTitle className="text-base font-semibold min-h-[48px] flex items-center justify-center">
                    {service.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {service.price}
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    {service.duration}
                  </p>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied patients who trust us with their health.
            Get started today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-neutral-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Create Free Account
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Get In Touch
              </h2>
              <p className="text-lg text-muted-foreground">
                Have questions? We're here to help 24/7
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white mb-4">
                    <Phone className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg">Phone</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white mb-4">
                    <Mail className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg">Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    support@healthcare.com
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white mb-4">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg">Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    123 Medical Center Dr.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-neutral-50 dark:bg-neutral-900/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" fill="white" />
                </div>
                <span className="font-bold text-lg">HealthCare+</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Making healthcare accessible, affordable, and efficient for
                everyone.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#features"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#about"
                    className="hover:text-blue-600 transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    HIPAA Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2026 HealthCare+. All rights reserved. Made with{" "}
              <Heart className="inline w-4 h-4 text-red-500" fill="red" /> for
              better healthcare.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
