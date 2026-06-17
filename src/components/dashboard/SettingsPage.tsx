import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Profile } from '../../types'
import { Save, Loader2, Moon, Sun, Monitor } from 'lucide-react'

interface Props {
  profile: Profile | null
  onUpdate: (profile: Profile) => void
}

export default function SettingsPage({ profile, onUpdate }: Props) {
  const { user } = useAuth()
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(profile?.theme || 'dark')
  const [saving, setSaving] = useState(false)

  const handleSaveTheme = async () => {
    if (!profile) return

    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ theme })
        .eq('id', profile.id)
        .select()
        .single()

      if (error) throw error
      onUpdate(data)
    } catch (err) {
      console.error('Error saving settings:', err)
    } finally {
      setSaving(false)
    }
  }

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">Settings</h1>
        <p className="text-dark-600 dark:text-dark-400">
          Manage your account preferences and portfolio settings.
        </p>
      </div>

      {/* Account Info */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">Account</h2>
        <div className="space-y-4">
          <div>
            <label className="label">Email</label>
            <div className="input bg-dark-50 dark:bg-dark-700 cursor-not-allowed">
              {user?.email}
            </div>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">Portfolio Theme</h2>
        <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
          Choose the default theme for your public portfolio page.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === t.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-dark-200 dark:border-dark-700 hover:border-dark-300 dark:hover:border-dark-600'
              }`}
            >
              <t.icon
                className={`w-6 h-6 mx-auto mb-2 ${
                  theme === t.value ? 'text-primary-600' : 'text-dark-400'
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  theme === t.value
                    ? 'text-primary-700 dark:text-primary-300'
                    : 'text-dark-700 dark:text-dark-300'
                }`}
              >
                {t.label}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={handleSaveTheme} className="btn-primary" disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Theme
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
