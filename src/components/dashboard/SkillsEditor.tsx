import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Skill } from '../../types'
import { Plus, X, Trash2, Loader2 } from 'lucide-react'

interface Props {
  profileId?: string
}

const SKILL_CATEGORIES = ['Languages', 'Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other']

export default function SkillsEditor({ profileId }: Props) {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Languages', proficiency: 80 })

  useEffect(() => {
    if (profileId) {
      void fetchSkills()
    } else {
      setLoading(false)
    }
  }, [profileId])

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('profile_id', profileId!)
        .order('category', { ascending: true })
        .order('display_order', { ascending: true })

      if (error) throw error
      setSkills(data || [])
    } catch (err) {
      console.error('Error fetching skills:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileId) return
    try {
      const { error } = await supabase.from('skills').insert({
        ...newSkill,
        profile_id: profileId,
        display_order: skills.filter((s) => s.category === newSkill.category).length,
      })

      if (error) throw error
      setNewSkill({ name: '', category: 'Languages', proficiency: 80 })
      setShowForm(false)
      await fetchSkills()
    } catch (err) {
      console.error('Error adding skill:', err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id)
      if (error) throw error
      await fetchSkills()
    } catch (err) {
      console.error('Error deleting skill:', err)
    }
  }

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

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
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">Skills</h1>
          <p className="text-dark-600 dark:text-dark-400">
            Highlight your technical expertise and proficiencies.
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-100 dark:bg-dark-800 flex items-center justify-center">
            <Plus className="w-8 h-8 text-dark-400" />
          </div>
          <h3 className="text-lg font-medium text-dark-900 dark:text-white mb-2">No skills yet</h3>
          <p className="text-dark-600 dark:text-dark-400 mb-6">
            Add your technical skills to showcase your expertise.
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="card p-6">
              <h3 className="font-semibold text-dark-900 dark:text-white mb-4">{category}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-3 bg-dark-50 dark:bg-dark-800 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-dark-900 dark:text-white truncate">{skill.name}</div>
                      <div className="w-full bg-dark-200 dark:bg-dark-700 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-primary-500 h-1.5 rounded-full"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="ml-3 p-1.5 rounded text-dark-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-dark-100 dark:hover:bg-dark-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Skill Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="card w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-dark-200 dark:border-dark-700">
              <h2 className="text-xl font-semibold text-dark-900 dark:text-white">Add Skill</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg text-dark-400 hover:text-dark-600 dark:hover:text-white hover:bg-dark-100 dark:hover:bg-dark-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-6">
              <div>
                <label htmlFor="name" className="label">Skill Name</label>
                <input
                  id="name"
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill((p) => ({ ...p, name: e.target.value }))}
                  className="input"
                  placeholder="React, Python, AWS..."
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="label">Category</label>
                <select
                  id="category"
                  value={newSkill.category}
                  onChange={(e) => setNewSkill((p) => ({ ...p, category: e.target.value }))}
                  className="input"
                >
                  {SKILL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="proficiency" className="label">
                  Proficiency: {newSkill.proficiency}%
                </label>
                <input
                  id="proficiency"
                  type="range"
                  min="10"
                  max="100"
                  value={newSkill.proficiency}
                  onChange={(e) => setNewSkill((p) => ({ ...p, proficiency: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-dark-200 dark:border-dark-700">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">Add Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
