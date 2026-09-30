import { useEffect } from 'react'

interface SeoProps {
  title: string
  description: string
  canonicalPath?: string
  type?: 'website' | 'profile'
  image?: string
  jsonLd?: Record<string, unknown>
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

export default function Seo({ title, description, canonicalPath = '/', type = 'website', image = '/logo.png', jsonLd }: SeoProps) {
  useEffect(() => {
    const origin = window.location.origin
    const canonicalUrl = new URL(canonicalPath, origin).toString()
    document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', canonicalUrl)
    upsertMeta('property', 'og:image', new URL(image, origin).toString())
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl

    const scriptId = 'devfolio-jsonld'
    document.getElementById(scriptId)?.remove()
    if (jsonLd) {
      const script = document.createElement('script')
      script.id = scriptId
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }
    return () => document.getElementById(scriptId)?.remove()
  }, [title, description, canonicalPath, type, image, jsonLd])

  return null
}
