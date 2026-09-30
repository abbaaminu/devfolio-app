import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Project } from '../../types'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ExternalLink,
  Github,
  GripVertical,
  Loader2,
} from 'lucide-react'
import { requiredText } from '../../lib/validation'

interface Props {
  profileId?: string
}

export default function ProjectsEditor({ profileId }: Props) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Project | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (profileId) {
      void fetchProjects()
    } else {
      setLoading(false)
    }
  }, [profileId])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('profile_id', profileId!)
        .order('display_order', { ascending: true })

      if (error) throw error
      setProjects(data || [])
    } catch (err) {
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (project: Partial<Project>) => {
    if (!profileId) return
    try {
      if (editing?.id) {
        const { error } = await supabase
          .from('projects')
          .update({
            ...project,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editing.id)

        if (error) throw error
      } else {
        const title = requiredText(project.title ?? '', 'Project title', 160)
        const { error } = await supabase.from('projects').insert({
          ...project,
          title,
          profile_id: profileId,
          display_order: projects.length,
        })

        if (error) throw error
      }

      setShowForm(false)
      setEditing(null)
      await fetchProjects()
    } catch (err) {
      console.error('Error saving project:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
      await fetchProjects()
    } catch (err) {
      console.error('Error deleting project:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">Projects</h1>
          <p className="text-dark-600 dark:text-dark-400">
            Showcase your best work and highlight your skills.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null)
            setShowForm(true)
          }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-100 dark:bg-dark-800 flex items-center justify-center">
            <Plus className="w-8 h-8 text-dark-400" />
          </div>
          <h3 className="text-lg font-medium text-dark-900 dark:text-white mb-2">No projects yet</h3>
          <p className="text-dark-600 dark:text-dark-400 mb-6">
            Add your first project to start building your portfolio.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Add Your First Project
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="card p-6 flex items-start gap-4">
              <GripVertical className="w-5 h-5 text-dark-400 mt-1 cursor-grab" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-dark-900 dark:text-white flex items-center gap-2">
                      {project.title}
                      {project.featured && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                          Featured
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-dark-600 dark:text-dark-400 mt-1 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.tech_stack?.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 rounded bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <button
                      onClick={() => {
                        setEditing(project)
                        setShowForm(true)
                      }}
                      className="p-2 rounded-lg text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-dark-100 dark:hover:bg-dark-700"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 rounded-lg text-dark-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-dark-100 dark:hover:bg-dark-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ProjectForm
          project={editing}
          onClose={() => {
            setShowForm(false)
            setEditing(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function ProjectForm({
  project,
  onClose,
  onSave,
}: {
  project: Project | null
  onClose: () => void
  onSave: (project: Partial<Project>) => void
}) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    tech_stack: project?.tech_stack?.join(', ') || '',
    live_url: project?.live_url || '',
    github_url: project?.github_url || '',
    image_url: project?.image_url || '',
    featured: project?.featured || false,
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSave({
      ...formData,
      tech_stack: formData.tech_stack.split(',').map((t) => t.trim()).filter(Boolean),
    })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-dark-200 dark:border-dark-700">
          <h2 className="text-xl font-semibold text-dark-900 dark:text-white">
            {project ? 'Edit Project' : 'Add Project'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-dark-400 hover:text-dark-600 dark:hover:text-white hover:bg-dark-100 dark:hover:bg-dark-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="label">Title</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="label">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              className="input min-h-[100px]"
              required
            />
          </div>
          <div>
            <label htmlFor="tech_stack" className="label">Tech Stack (comma-separated)</label>
            <input
              id="tech_stack"
              type="text"
              value={formData.tech_stack}
              onChange={(e) => setFormData((p) => ({ ...p, tech_stack: e.target.value }))}
              className="input"
              placeholder="React, TypeScript, Tailwind"
            />
          </div>
          <div>
            <label htmlFor="live_url" className="label">Live URL</label>
            <input
              id="live_url"
              type="url"
              value={formData.live_url}
              onChange={(e) => setFormData((p) => ({ ...p, live_url: e.target.value }))}
              className="input"
              placeholder="https://yourproject.com"
            />
          </div>
          <div>
            <label htmlFor="github_url" className="label">GitHub URL</label>
            <input
              id="github_url"
              type="url"
              value={formData.github_url}
              onChange={(e) => setFormData((p) => ({ ...p, github_url: e.target.value }))}
              className="input"
              placeholder="https://github.com/user/repo"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              id="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData((p) => ({ ...p, featured: e.target.checked }))}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <label htmlFor="featured" className="text-sm text-dark-700 dark:text-dark-300">
              Feature this project
            </label>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-dark-200 dark:border-dark-700">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
