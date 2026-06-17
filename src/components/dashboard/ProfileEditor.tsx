import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Profile } from '../../types'
import { Save, Loader2 } from 'lucide-react'

interface Props {
  profile: Profile | null
  onUpdate: (profile: Profile) => void
}

export default function ProfileEditor({ profile, onUpdate }: Props) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    title: profile?.title || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    website: profile?.website || '',
    github: profile?.github || '',
    linkedin: profile?.linkedin || '',
    twitter: profile?.twitter || '',
    email: profile?.email || '',
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', profile.id)
        .select()
        .single()

      if (error) throw error
      onUpdate(data)
    } catch (err) {
      console.error('Error saving profile:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">Profile</h1>
        <p className="text-dark-600 dark:text-dark-400">
          Tell visitors who you are and what you do.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="label">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="input"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="title" className="label">Professional Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="Senior Software Engineer"
            />
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="label">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="input min-h-[120px] resize-y"
            placeholder="Write a short bio about yourself..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="location" className="label">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className="input"
              placeholder="San Francisco, CA"
            />
          </div>
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="website" className="label">Website</label>
          <input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            className="input"
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div className="border-t border-dark-200 dark:border-dark-700 pt-6">
          <h3 className="text-sm font-medium text-dark-700 dark:text-dark-300 mb-4">Social Links</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="github" className="label">GitHub</label>
              <input
                id="github"
                name="github"
                type="text"
                value={formData.github}
                onChange={handleChange}
                className="input"
                placeholder="johndoe"
              />
            </div>
            <div>
              <label htmlFor="linkedin" className="label">LinkedIn</label>
              <input
                id="linkedin"
                name="linkedin"
                type="text"
                value={formData.linkedin}
                onChange={handleChange}
                className="input"
                placeholder="johndoe"
              />
            </div>
            <div>
              <label htmlFor="twitter" className="label">Twitter</label>
              <input
                id="twitter"
                name="twitter"
                type="text"
                value={formData.twitter}
                onChange={handleChange}
                className="input"
                placeholder="johndoe"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
