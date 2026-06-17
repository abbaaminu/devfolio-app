import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Experience } from '../../types'
import { Plus, Pencil, Trash2, X, Loader2, Calendar, MapPin } from 'lucide-react'

interface Props {
  profileId?: string
}

export default function ExperienceEditor({ profileId }: Props) {
  const [experience, setExperience] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Experience | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (profileId) fetchExperience()
  }, [profileId])

  const fetchExperience = async () => {
    try {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .eq('profile_id', profileId!)
        .order('display_order', { ascending: true })

      if (error) throw error
      setExperience(data || [])
    } catch (err) {
      console.error('Error fetching experience:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (exp: Partial<Experience>) => {
    try {
      if (editing?.id) {
        const { error } = await supabase
          .from('experience')
          .update({
            ...exp,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editing.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('experience').insert({
          ...exp,
          profile_id: profileId,
          display_order: experience.length,
        })

        if (error) throw error
      }

      setShowForm(false)
      setEditing(null)
      fetchExperience()
    } catch (err) {
      console.error('Error saving experience:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return

    try {
      const { error } = await supabase.from('experience').delete().eq('id', id)
      if (error) throw error
      fetchExperience()
    } catch (err) {
      console.error('Error deleting experience:', err)
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
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">Experience</h1>
          <p className="text-dark-600 dark:text-dark-400">
            Share your professional journey and career highlights.
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
          Add Experience
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-100 dark:bg-dark-800 flex items-center justify-center">
            <Plus className="w-8 h-8 text-dark-400" />
          </div>
          <h3 className="text-lg font-medium text-dark-900 dark:text-white mb-2">No experience yet</h3>
          <p className="text-dark-600 dark:text-dark-400 mb-6">
            Add your work history to showcase your career progression.
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Add Your First Experience
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-dark-900 dark:text-white">{exp.position}</h3>
                  <p className="text-primary-600 dark:text-primary-400 font-medium">{exp.company}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-dark-500 dark:text-dark-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {exp.location}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-dark-600 dark:text-dark-400 text-sm">{exp.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditing(exp)
                      setShowForm(true)
                    }}
                    className="p-2 rounded-lg text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-dark-100 dark:hover:bg-dark-700"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="p-2 rounded-lg text-dark-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-dark-100 dark:hover:bg-dark-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ExperienceForm
          experience={editing}
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

function ExperienceForm({
  experience,
  onClose,
  onSave,
}: {
  experience: Experience | null
  onClose: () => void
  onSave: (exp: Partial<Experience>) => void
}) {
  const [formData, setFormData] = useState({
    company: experience?.company || '',
    position: experience?.position || '',
    location: experience?.location || '',
    start_date: experience?.start_date || '',
    end_date: experience?.end_date || '',
    current: experience?.current || false,
    description: experience?.description || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSave(formData)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-dark-200 dark:border-dark-700">
          <h2 className="text-xl font-semibold text-dark-900 dark:text-white">
            {experience ? 'Edit Experience' : 'Add Experience'}
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
            <label htmlFor="company" className="label">Company</label>
            <input
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="position" className="label">Position</label>
            <input
              id="position"
              type="text"
              value={formData.position}
              onChange={(e) => setFormData((p) => ({ ...p, position: e.target.value }))}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="location" className="label">Location</label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
              className="input"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className="label">Start Date</label>
              <input
                id="start_date"
                type="text"
                value={formData.start_date}
                onChange={(e) => setFormData((p) => ({ ...p, start_date: e.target.value }))}
                className="input"
                placeholder="Jan 2020"
                required
              />
            </div>
            <div>
              <label htmlFor="end_date" className="label">End Date</label>
              <input
                id="end_date"
                type="text"
                value={formData.end_date}
                onChange={(e) => setFormData((p) => ({ ...p, end_date: e.target.value }))}
                className="input disabled:opacity-50"
                placeholder="Present"
                disabled={formData.current}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="current"
              type="checkbox"
              checked={formData.current}
              onChange={(e) => setFormData((p) => ({ ...p, current: e.target.checked }))}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <label htmlFor="current" className="text-sm text-dark-700 dark:text-dark-300">
              I currently work here
            </label>
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
          <div className="flex gap-3 justify-end pt-4 border-t border-dark-200 dark:border-dark-700">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
