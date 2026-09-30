import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Profile, Project, Experience, Skill } from '../types'
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  ExternalLink,
  Calendar,
  Moon,
  Sun,
  Loader2,
} from 'lucide-react'
import Seo from '../components/Seo'

export default function Portfolio() {
  const { username } = useParams()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [experience, setExperience] = useState<Experience[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    void fetchPortfolio(controller.signal)
    return () => controller.abort()
  }, [username])

  useEffect(() => {
    if (profile?.theme === 'dark') {
      setDarkMode(true)
    } else if (profile?.theme === 'light') {
      setDarkMode(false)
    }
  }, [profile])

  const fetchPortfolio = async (signal: AbortSignal) => {
    setLoading(true)
    setNotFound(false)
    setProfile(null)
    try {
      if (!username || !/^[a-zA-Z0-9._-]{1,100}$/.test(username)) {
        setNotFound(true)
        return
      }

      // Try to find profile by id, user_id, or email username part
      let profileData = null

      // Try by profile id first (exact match)
      const { data: byId } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', username)
        .abortSignal(signal)
        .maybeSingle()

      if (byId) {
        profileData = byId
      } else {
        // Try by user_id (exact or prefix match for shortened UUID)
        const { data: byUserId } = await supabase
          .from('profiles')
          .select('*')
          .or(`user_id.eq.${username},user_id.ilike.${username}-%`)
          .abortSignal(signal)
          .maybeSingle()

        if (byUserId) {
          profileData = byUserId
        } else {
          // Try by email username part (everything before @)
          const { data: byEmail } = await supabase
            .from('profiles')
            .select('*')
            .ilike('email', `${username}@%`)
            .abortSignal(signal)
            .maybeSingle()

          if (byEmail) {
            profileData = byEmail
          }
        }
      }

      if (!profileData) {
        setNotFound(true)
        return
      }

      setProfile(profileData)

      // Fetch independent sections in parallel and fail closed on any query error.
      const [projectsRes, experienceRes, skillsRes] = await Promise.all([
        supabase
          .from('projects')
          .select('*')
          .eq('profile_id', profileData.id)
          .abortSignal(signal)
          .order('display_order', { ascending: true }),
        supabase
          .from('experience')
          .select('*')
          .eq('profile_id', profileData.id)
          .abortSignal(signal)
          .order('display_order', { ascending: true }),
        supabase
          .from('skills')
          .select('*')
          .eq('profile_id', profileData.id)
            .abortSignal(signal)
          .order('category', { ascending: true }),
      ])

          const sectionError = projectsRes.error ?? experienceRes.error ?? skillsRes.error
          if (sectionError) throw sectionError

      setProjects(projectsRes.data || [])
      setExperience(experienceRes.data || [])
      setSkills(skillsRes.data || [])
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      console.error('Error fetching portfolio:', err)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <p className="text-dark-400 mb-8">Portfolio not found</p>
          <a href="/" className="btn-primary">Go Home</a>
        </div>
      </div>
    )
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Seo
        title={profile ? `${profile.name || 'Developer'} | DevFolio` : 'Developer Portfolio | DevFolio'}
        description={profile?.bio || 'A professional developer portfolio.'}
        canonicalPath={username ? `/${encodeURIComponent(username)}` : '/'}
        type="profile"
        image={profile?.avatar_url || '/logo.png'}
        jsonLd={profile ? { '@context': 'https://schema.org', '@type': 'ProfilePage', name: profile.name, description: profile.bio, url: window.location.href } : undefined}
      />
      <div className="min-h-screen bg-white dark:bg-dark-950 text-dark-900 dark:text-white">
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="fixed top-6 right-6 z-50 p-3 rounded-full bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Hero Section */}
        <header className="relative pt-32 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-accent-500/10 dark:from-primary-900/20 dark:to-accent-900/20" />
          <div className="relative max-w-4xl mx-auto text-center">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white dark:border-dark-800 shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto mb-6 bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                {profile?.name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-3">{profile?.name || 'Developer'}</h1>
            {profile?.title && (
              <p className="text-xl text-primary-600 dark:text-primary-400 font-medium mb-4">
                {profile.title}
              </p>
            )}
            {profile?.bio && (
              <p className="text-lg text-dark-600 dark:text-dark-300 max-w-2xl mx-auto mb-6">
                {profile.bio}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-4 text-dark-500 dark:text-dark-400">
              {profile?.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </span>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-1.5 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </a>
              )}
            </div>
            {/* Social Links */}
            <div className="flex items-center justify-center gap-4 mt-6">
              {profile?.github && (
                <a
                  href={`https://github.com/${profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {profile?.linkedin && (
                <a
                  href={`https://linkedin.com/in/${profile.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {profile?.twitter && (
                <a
                  href={`https://twitter.com/${profile.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {profile?.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-white transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-6 pb-20 space-y-20">
          {/* Projects Section */}
          {projects.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary-500" />
                Projects
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <article
                    key={project.id}
                    className="card p-6 group hover:border-primary-500/50 transition-all"
                  >
                    {project.image_url && (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-dark-600 dark:text-dark-400 mt-2 text-sm">
                          {project.description}
                        </p>
                        {project.tech_stack && project.tech_stack.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {project.tech_stack.map((tech) => (
                              <span
                                key={tech}
                                className="text-xs px-2 py-1 rounded bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-dark-400 hover:text-dark-600 dark:hover:text-white hover:bg-dark-100 dark:hover:bg-dark-700"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-dark-400 hover:text-dark-600 dark:hover:text-white hover:bg-dark-100 dark:hover:bg-dark-700"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Experience Section */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-accent-500" />
                Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <article key={exp.id} className="card p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{exp.position}</h3>
                        <p className="text-primary-600 dark:text-primary-400 font-medium">
                          {exp.company}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-dark-500 dark:text-dark-400">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                          </span>
                          {exp.location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4" />
                              {exp.location}
                            </span>
                          )}
                        </div>
                        <p className="text-dark-600 dark:text-dark-400 mt-3 text-sm">
                          {exp.description}
                        </p>
                      </div>
                      {exp.current && (
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 self-start">
                          Current
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Skills Section */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary-400" />
                Skills
              </h2>
              <div className="space-y-6">
                {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h3 className="text-sm font-medium text-dark-500 dark:text-dark-400 mb-3 uppercase tracking-wider">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <div
                          key={skill.id}
                          className="relative group px-4 py-2 rounded-lg bg-dark-100 dark:bg-dark-800"
                        >
                          <span className="text-sm font-medium">{skill.name}</span>
                          <div
                            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-b-lg"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-dark-200 dark:border-dark-800 py-8 px-6">
          <div className="max-w-5xl mx-auto text-center text-sm text-dark-500 dark:text-dark-400">
            <p>Built with DevFolio</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
