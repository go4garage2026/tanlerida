'use client'

interface BodyProfileStepProps {
  values: {
    gender: string
    ageRange: string
    heightCm: number
    bodyBuild: string
    skinTone: string
    resonance: string[]
  }
  onChange: (key: string, value: string | number | string[]) => void
  onSubmit: () => void
  loading: boolean
}

const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say']
const bodyBuildOptions = ['Slim', 'Athletic', 'Regular', 'Broad', 'Plus']
const ageRangeOptions = ['18-24', '25-30', '31-35', '36-40', '41-50', '51-60', '60+']
const skinToneOptions = ['Very fair', 'Fair', 'Light medium', 'Warm medium', 'Olive', 'Wheat', 'Tan', 'Deep brown', 'Dark']
const resonanceOptions = ['Classic Professional', 'Contemporary Smart', 'Traditional Indian', 'Minimalist', 'Bold Statement']

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#A0A0A0]">{label}</label>
      <select className="input-luxury w-full appearance-none" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

export function BodyProfileStep({ values, onChange, onSubmit, loading }: BodyProfileStepProps) {
  const toggleResonance = (value: string) => {
    const next = values.resonance.includes(value)
      ? values.resonance.filter((item) => item !== value)
      : [...values.resonance, value]

    onChange('resonance', next)
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField label="Gender" value={values.gender} options={genderOptions} onChange={(v) => onChange('gender', v)} />
        <SelectField label="Age range" value={values.ageRange} options={ageRangeOptions} onChange={(v) => onChange('ageRange', v)} />
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#A0A0A0]">Height (cm)</label>
          <input className="input-luxury w-full" value={values.heightCm} onChange={(event) => onChange('heightCm', Number(event.target.value))} placeholder="Height in cm" type="number" min={120} max={230} />
        </div>
        <SelectField label="Body build" value={values.bodyBuild} options={bodyBuildOptions} onChange={(v) => onChange('bodyBuild', v)} />
        <div className="md:col-span-2">
          <SelectField label="Skin tone" value={values.skinTone} options={skinToneOptions} onChange={(v) => onChange('skinTone', v)} />
        </div>
      </div>
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#A0A0A0]">Style resonance</p>
        <div className="flex flex-wrap gap-3">
          {resonanceOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleResonance(option)}
              className={`border px-4 py-3 text-xs uppercase tracking-[0.16em] ${values.resonance.includes(option) ? 'border-[#C0392B] text-[#F5F5F5]' : 'border-[#2A2A2A] text-[#A0A0A0]'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <button type="button" onClick={onSubmit} className="btn-red" disabled={loading}>
        {loading ? 'Saving profile…' : 'Save profile'}
      </button>
    </div>
  )
}
