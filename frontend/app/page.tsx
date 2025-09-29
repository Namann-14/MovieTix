"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Film,
  Clock,
  MapPin,
  Star,
  Ticket,
  Users,
  Shield,
  Smartphone,
  CreditCard,
  Headphones,
  TrendingUp,
  Award,
  Play,
  Calendar,
  Zap,
} from "lucide-react"
import { motion } from "framer-motion"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const subtleHover = {
  whileHover: { scale: 1.02, y: -2 },
  transition: { type: "spring", stiffness: 400, damping: 25 },
}

const cardHover = {
  whileHover: { y: -3 },
  transition: { type: "spring", stiffness: 400, damping: 25 },
}

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect authenticated users to their appropriate dashboard
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "ROLE_ADMIN") {
        router.replace("/admin")
      } else if (user.role === "ROLE_CUSTOMER") {
        router.replace("/browse")
      }
    }
  }, [user, loading, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show home page only for unauthenticated users
  if (user) {
    return null // Component will redirect via useEffect
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-12 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 4,
            }}
          />

          {/* Film Strip - Top Left */}
          <motion.div
            className="absolute top-20 left-10 w-16 h-4 bg-primary/20 rounded-sm"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div className="flex h-full">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex-1 border-r border-primary/30 last:border-r-0" />
              ))}
            </div>
          </motion.div>

          {/* Movie Ticket - Top Right */}
          <motion.div
            className="absolute top-32 right-16 w-12 h-8 bg-primary/15 rounded-sm transform rotate-12"
            animate={{
              y: [0, 8, 0],
              rotate: [12, 18, 12],
            }}
            transition={{
              duration: 7,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <div className="w-full h-full border-2 border-dashed border-primary/40 rounded-sm flex items-center justify-center">
              <Ticket className="w-4 h-4 text-primary/60" />
            </div>
          </motion.div>

          {/* Popcorn Container - Bottom Left */}
          <motion.div
            className="absolute bottom-32 left-20 w-8 h-10 bg-gradient-to-t from-primary/20 to-primary/10 rounded-b-lg"
            animate={{
              y: [0, -6, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-primary/40 rounded-full absolute"
                  style={{
                    left: `${i * 2 - 2}px`,
                    top: `${Math.random() * 2}px`,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Film Reel - Bottom Right */}
          <motion.div
            className="absolute bottom-24 right-24 w-10 h-10 border-2 border-primary/30 rounded-full"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-3 h-3 border border-primary/40 rounded-full">
                <div className="w-full h-full bg-primary/20 rounded-full" />
              </div>
            </div>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-primary/40 rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-12px)`,
                }}
              />
            ))}
          </motion.div>

          {/* Cinema Camera - Middle Left */}
          <motion.div
            className="absolute top-1/2 left-8 w-6 h-4 bg-primary/15 rounded-sm transform -translate-y-1/2"
            animate={{
              x: [0, 5, 0],
              y: [0, -3, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 3,
            }}
          >
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-3 h-2 bg-primary/20 rounded-r-full" />
            <Film className="w-3 h-3 text-primary/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </motion.div>

          {/* 3D Glasses - Middle Right */}
          <motion.div
            className="absolute top-1/3 right-12 w-8 h-3 transform rotate-6"
            animate={{
              rotate: [6, 12, 6],
              y: [0, -4, 0],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 4,
            }}
          >
            <div className="w-full h-full bg-primary/10 rounded-full border border-primary/30">
              <div className="flex h-full">
                <div className="flex-1 bg-primary/20 rounded-l-full" />
                <div className="w-1 bg-primary/30" />
                <div className="flex-1 bg-primary/20 rounded-r-full" />
              </div>
            </div>
          </motion.div>

          {/* Star Rating - Top Center */}
          <motion.div
            className="absolute top-16 left-1/2 transform -translate-x-1/2 flex gap-1"
            animate={{
              y: [0, -5, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 5,
            }}
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2 h-2 text-primary/40 fill-current" />
            ))}
          </motion.div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
              Now booking tickets for 200+ theaters
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-balance mb-6 sm:mb-8 leading-tight"
              {...fadeInUp}
            >
              Your Gateway to
              <span className="text-primary block sm:inline"> Cinematic</span>
              <span className="block">Experiences</span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground text-pretty mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
              {...fadeInUp}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            >
              Book movie tickets effortlessly, discover new releases, and enjoy seamless cinema experiences with
              CinemaHub. Join over 50,000 movie lovers today.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4 sm:px-0"
              {...fadeInUp}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            >
              <Link href="/register">
                <motion.div {...subtleHover}>
                  <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6">
                    <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Book Now
                  </Button>
                </motion.div>
              </Link>
              <Link href="/login">
                <motion.div {...subtleHover}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto bg-transparent text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6"
                  >
                    <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Watch Demo
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-2xl mx-auto px-4 sm:px-0"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {[
                { number: "50K+", label: "Users" },
                { number: "200+", label: "Theaters" },
                { number: "1M+", label: "Bookings" },
                { number: "4.9★", label: "Rating" },
              ].map((stat, index) => (
                <motion.div key={index} className="text-center" {...subtleHover}>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Why Choose CinemaHub?</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Experience the future of movie ticket booking with our comprehensive platform
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Ticket,
                title: "Easy Booking",
                description: "Book tickets in just a few clicks with our intuitive interface",
              },
              {
                icon: Clock,
                title: "Real-time Updates",
                description: "Get instant updates on showtimes, availability, and new releases",
              },
              {
                icon: MapPin,
                title: "Multiple Locations",
                description: "Find and book tickets at theaters near you across the city",
              },
              {
                icon: Star,
                title: "Premium Experience",
                description: "Enjoy premium seating options and exclusive movie experiences",
              },
              {
                icon: Users,
                title: "Group Bookings",
                description: "Book multiple seats for friends and family with ease",
              },
              {
                icon: Film,
                title: "Latest Movies",
                description: "Stay updated with the latest blockbusters and indie films",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp} {...cardHover}>
                <Card className="text-center h-full">
                  <CardHeader className="p-4 sm:p-6">
                    <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-sm sm:text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Trusted by Movie Lovers</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Join our growing community of cinema enthusiasts
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { number: "50K+", label: "Happy Customers" },
              { number: "200+", label: "Partner Theaters" },
              { number: "1M+", label: "Tickets Booked" },
              { number: "4.9★", label: "User Rating" },
            ].map((stat, index) => (
              <motion.div key={index} className="text-center" variants={fadeInUp}>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm sm:text-base text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Get your movie tickets in three simple steps
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-3 gap-8 sm:gap-12 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                step: "01",
                title: "Browse Movies",
                description: "Explore the latest movies and showtimes at theaters near you",
                icon: Film,
              },
              {
                step: "02",
                title: "Select Seats",
                description: "Choose your preferred seats with our interactive seat map",
                icon: MapPin,
              },
              {
                step: "03",
                title: "Secure Payment",
                description: "Complete your booking with our secure payment system",
                icon: CreditCard,
              },
            ].map((step, index) => (
              <motion.div key={index} className="text-center relative" variants={fadeInUp}>
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <step.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-secondary rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{step.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground px-2 sm:px-0">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">More Reasons to Love CinemaHub</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Discover additional features that make your movie experience exceptional
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Shield,
                title: "Secure Transactions",
                description: "Your payment information is protected with bank-level security",
              },
              {
                icon: Smartphone,
                title: "Mobile Friendly",
                description: "Book tickets on the go with our responsive mobile interface",
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                description: "Get help whenever you need it with our dedicated support team",
              },
              {
                icon: TrendingUp,
                title: "Trending Movies",
                description: "Stay updated with what's popular and trending in cinemas",
              },
              {
                icon: Award,
                title: "Loyalty Rewards",
                description: "Earn points with every booking and unlock exclusive benefits",
              },
              {
                icon: CreditCard,
                title: "Flexible Payment",
                description: "Multiple payment options including cards, wallets, and UPI",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp} {...cardHover}>
                <Card className="text-center h-full">
                  <CardHeader className="p-4 sm:p-6">
                    <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-sm sm:text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-7xl">
          <div className="max-w-2xl mx-auto">
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Ready to Start Your Cinema Journey?
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 px-4 sm:px-0"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Join thousands of movie lovers who trust CinemaHub for their entertainment needs.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Link href="/register">
                <motion.div {...subtleHover}>
                  <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6">
                    Create Your Account
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
