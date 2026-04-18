import type { ThemePreference } from '../types'

interface ThemeToggleProps {
  preference: ThemePreference
  onChange: (preference: ThemePreference) => void
}

const OPTIONS: ThemePreference[] = ['system', 'light', 'dark']

export function ThemeToggle({ preference, onChange }: ThemeToggleProps) {
  return (
    <div className="theme-toggle" role="group" aria-label="Theme preference">
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          className={
            option === preference
              ? 'theme-toggle__button is-active'
              : 'theme-toggle__button'
          }
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
