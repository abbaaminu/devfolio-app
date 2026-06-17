import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Code2, Layers, Zap, Palette, ArrowRight, Github, Star, ChevronRight } from 'lucide-react'

const features = [
  {
    icon: Layers,
    title: 'Beautiful Templates',
    description: 'Choose from professionally designed templates that make your work shine.',
  },
  {
    icon: Zap,
    title: 'Easy to Customize',
    description: 'Intuitive dashboard to manage your profile, projects, and skills effortlessly.',
  },
  {
    icon: Palette,
    title: 'Dark Mode Ready',
    description: 'Your portfolio looks stunning in both light and dark themes.',
  },
]

const stats = [
  { value: '2,500+', label: 'Developers' },
  { value: '10,000+', label: 'Projects' },
  { value: '99.9%', label: 'Uptime' },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-950/80 backdrop-blur-lg border-b border-dark-100 dark:border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Code2 className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-dark-900 dark:text-white">DevFolio</span>
            </Link>
            <div className="flex items-center gap-4">
              {user ? (
                <Link to="/dashboard" className="btn-primary">
                  Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              ) : (
                <>
                  <Link to="/auth" className="btn-ghost">
                    Sign In
                  </Link>
                  <Link to="/auth" className="btn-primary">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] dark:opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-full text-sm font-medium text-primary-700 dark:text-primary-300 mb-8 animate-fade-in">
              <Star className="w-4 h-4" />
              <span>Trusted by 2,500+ developers worldwide</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-dark-900 dark:text-white leading-tight mb-6 animate-slide-up">
              Your code tells a story.
              <br />
              <span className="text-gradient">Make it unforgettable.</span>
            </h1>
            <p className="text-lg sm:text-xl text-dark-600 dark:text-dark-300 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
              Create a stunning developer portfolio in minutes. Showcase your projects, skills, and experience with beautiful, customizable templates.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link to="/auth" className="btn-primary text-base px-8 py-4">
                Create Your Portfolio
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a href="#features" className="btn-secondary text-base px-8 py-4">
                Learn More
              </a>
            </div>
          </div>

          {/* Preview Image */}
          <div className="mt-20 relative animate-scale-in" style={{ animationDelay: '300ms' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-dark-950 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-dark-200 dark:border-dark-700">
              <div className="bg-dark-800 flex items-center gap-2 px-4 py-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-block px-4 py-1 bg-dark-700 rounded text-xs text-dark-300">
                    yourname.devfolio.app
                  </div>
                </div>
              </div>
              <div className="aspect-[16/10] bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-accent-500 mb-4" />
                  <div className="h-4 w-32 mx-auto bg-dark-700 rounded mb-2" />
                  <div className="h-3 w-48 mx-auto bg-dark-700/50 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-dark-900 dark:bg-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-dark-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-dark-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 dark:text-white mb-4">
              Everything you need to stand out
            </h2>
            <p className="text-lg text-dark-600 dark:text-dark-300">
              Powerful features to create a portfolio that gets you noticed.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-8 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-900/50 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-6 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-dark-600 dark:text-dark-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to build your portfolio?
          </h2>
          <p className="text-lg text-primary-100 mb-10 max-w-2xl mx-auto">
            Join thousands of developers who have already created stunning portfolios with DevFolio.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-lg shadow-lg hover:bg-primary-50 transition-all duration-200"
          >
            Get Started Free
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-dark-900 border-t border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-6 h-6 text-primary-500" />
              <span className="font-bold text-white">DevFolio</span>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
