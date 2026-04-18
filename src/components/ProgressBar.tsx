interface ProgressBarProps {
  value: number
  total: number
  label: string
}

export function ProgressBar({ value, total, label }: ProgressBarProps) {
  const percent = total === 0 ? 0 : (value / total) * 100

  return (
    <div className="progress-shell">
      <div className="progress-copy">
        <span>{label}</span>
        <span>{Math.round(percent)}%</span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
