'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

interface PhotoUploadStepProps {
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  onSubmit: () => void
  loading: boolean
}

const slots = [
  ['casual', 'Casual / Everyday Look'],
  ['formal', 'Formal / Office Look'],
  ['fullBody', 'Full Body Shot'],
  ['ethnic', 'Ethnic / Traditional Look (optional)'],
] as const

function PhotoSlot({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const response = await fetch('/api/tan-lerida/upload-file', { method: 'POST', body: form })
      const data = await response.json()
      if (data.success) onChange(data.url)
    } finally {
      setUploading(false)
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div
      className={`relative border bg-[#111111] p-4 transition-colors ${dragOver ? 'border-[#C0392B]' : 'border-[#2A2A2A]'}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#A0A0A0]">{label}</span>
      {value ? (
        <div className="relative h-40 w-full overflow-hidden rounded-sm">
          <Image src={value} alt={label} fill className="object-cover" />
          <button type="button" className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs text-white hover:bg-black" onClick={() => onChange('')}>✕</button>
        </div>
      ) : (
        <button
          type="button"
          className="flex h-40 w-full items-center justify-center rounded-sm border border-dashed border-[#2A2A2A] text-sm text-[#A0A0A0] hover:border-[#C0392B] hover:text-[#F5F5F5]"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading…' : 'Click or drag image here'}
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFileChange} />
      <input
        className="input-luxury mt-2 text-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…or paste an image URL"
      />
    </div>
  )
}

export function PhotoUploadStep({ values, onChange, onSubmit, loading }: PhotoUploadStepProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        {slots.map(([key, label]) => (
          <PhotoSlot key={key} label={label} value={values[key] ?? ''} onChange={(url) => onChange(key, url)} />
        ))}
      </div>
      <div className="rounded-sm border border-[#2A2A2A] bg-black/20 p-4 text-sm text-[#A0A0A0]">
        By uploading photos, you confirm you own the likeness, consent to AI processing, and understand Tangred will use the images only for styling analysis and generated recommendations.
      </div>
      <button type="button" onClick={onSubmit} className="btn-red" disabled={loading}>
        {loading ? 'Analysing your photos…' : 'Save photos'}
      </button>
    </div>
  )
}
