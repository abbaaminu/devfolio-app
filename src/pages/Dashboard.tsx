import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Profile } from '../types'
import {
  Code2,
  LayoutDashboard,
  User,
  Briefcase,
  Wrench,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Plus,
} from 'lucide-react'
import ProfileEditor from '../components/dashboard/ProfileEditor'
import ProjectsEditor from '../components/dashboard/ProjectsEditor'
import ExperienceEditor from '../components/dashboard/ExperienceEditor'
import SkillsEditor from '../components/dashboard/SkillsEditor'
import SettingsPage from '../components/dashboard/SettingsPage'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle()

      if (error) throw error

      if (!data) {
        const newProfile = {
          user_id: user!.id,
          name: '',
          title: '',
          bio: '',
          avatar_url: null,
          location: null,
          website: null,
          github: null,
          linkedin: null,
          twitter: null,
          email: user!.email,
          theme: 'dark',
        }
        const { data: created, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single()

        if (createError) throw createError
        setProfile(created)
      } else {
        setProfile(data)
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/dashboard/profile', icon: User, label: 'Profile' },
    { to: '/dashboard/projects', icon: Briefcase, label: 'Projects' },
    { to: '/dashboard/experience', icon: Code2, label: 'Experience' },
    { to: '/dashboard/skills', icon: Wrench, label: 'Skills' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-900 border-b border-dark-200 dark:border-dark-800 px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="flex items-center gap-2">
          <Code2 className="w-6 h-6 text-primary-600" />
          <span className="font-bold text-dark-900 dark:text-white">DevFolio</span>
        </div>
        <button
          onClick={handleSignOut}
          className="p-2 rounded-lg text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-dark-900 border-r border-dark-200 dark:border-dark-800 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo - Desktop */}
          <div className="hidden lg:flex items-center gap-2 px-6 h-16 border-b border-dark-200 dark:border-dark-800">
            <Code2 className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-dark-900 dark:text-white">DevFolio</span>
          </div>

          {/* Mobile close */}
          <div className="lg:hidden flex items-center justify-between px-6 h-16 border-b border-dark-200 dark:border-dark-800">
            <div className="flex items-center gap-2">
              <Code2 className="w-6 h-6 text-primary-600" />
              <span className="font-bold text-dark-900 dark:text-white">DevFolio</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* View Portfolio Link */}
          <div className="px-4 py-4 border-t border-dark-200 dark:border-dark-800">
            <a
              href={`/${user?.email?.split('@')[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              View Portfolio
            </a>
          </div>

          {/* Sign Out - Desktop */}
          <div className="hidden lg:block px-4 py-4 border-t border-dark-200 dark:border-dark-800">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-dark-600 dark:text-dark-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route index element={<DashboardOverview profile={profile} />} />
            <Route path="profile" element={<ProfileEditor profile={profile} onUpdate={setProfile} />} />
            <Route path="projects" element={<ProjectsEditor profileId={profile?.id} />} />
            <Route path="experience" element={<ExperienceEditor profileId={profile?.id} />} />
            <Route path="skills" element={<SkillsEditor profileId={profile?.id} />} />
            <Route path="settings" element={<SettingsPage profile={profile} onUpdate={setProfile} />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

function DashboardOverview({ profile }: { profile: Profile | null }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
          Welcome back, {profile?.name || 'Developer'}!
        </h1>
        <p className="text-dark-600 dark:text-dark-400">
          Manage your portfolio and keep it up to date.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard
          title="Profile"
          description="Complete your profile to make a great first impression."
          action="Edit Profile"
          to="/dashboard/profile"
          completed={!!profile?.name && !!profile?.bio}
        />
        <OverviewCard
          title="Projects"
          description="Add your best work to showcase your skills."
          action="Add Projects"
          to="/dashboard/projects"
        />
        <OverviewCard
          title="Experience"
          description="Highlight your professional journey."
          action="Add Experience"
          to="/dashboard/experience"
        />
        <OverviewCard
          title="Skills"
          description="Show off your technical expertise."
          action="Add Skills"
          to="/dashboard/skills"
        />
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
          Your Portfolio URL
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex-1 px-4 py-3 bg-dark-50 dark:bg-dark-800 rounded-lg text-dark-600 dark:text-dark-300 text-sm truncate">
            {window.location.origin}/{profile?.email?.split('@')[0] || profile?.user_id.slice(0, 8)}
          </div>
          <a
            href={`/${profile?.email?.split('@')[0] || profile?.user_id.slice(0, 8)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}

function OverviewCard({
  title,
  description,
  action,
  to,
  completed,
}: {
  title: string
  description: string
  action: string
  to: string
  completed?: boolean
}) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-dark-900 dark:text-white">{title}</h3>
        {completed !== undefined && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              completed
                ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400'
                : 'bg-dark-100 dark:bg-dark-700 text-dark-500 dark:text-dark-400'
            }`}
          >
            {completed ? 'Complete' : 'Pending'}
          </span>
        )}
      </div>
      <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">{description}</p>
      <NavLink
        to={to}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
      >
        <Plus className="w-4 h-4" />
        {action}
      </NavLink>
    </div>
  )
}
