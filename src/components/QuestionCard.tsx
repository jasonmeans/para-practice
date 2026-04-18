import { SECTION_LABELS } from '../data/constants'
import type { Question } from '../types'

interface QuestionCardProps {
  question: Question
  selectedOption: number | null
  confidence?: 1 | 2 | 3
  onSelect: (selectedOption: number) => void
  onConfidence: (confidence: 1 | 2 | 3) => void
}

const CONFIDENCE_LABELS: Record<1 | 2 | 3, string> = {
  1: 'Unsure',
  2: 'Somewhat sure',
  3: 'Very sure',
}

export function QuestionCard({
  question,
  selectedOption,
  confidence,
  onSelect,
  onConfidence,
}: QuestionCardProps) {
  return (
    <article className="question-card">
      <div className="question-card__meta">
        <span className="meta-pill">{SECTION_LABELS[question.section]}</span>
        <span className="meta-pill">{question.topic}</span>
        <span className="meta-pill">{question.difficulty}</span>
      </div>

      {question.scenario ? (
        <div className="question-scenario">
          <p>{question.scenario}</p>
        </div>
      ) : null}

      <h2 className="question-prompt">{question.prompt}</h2>

      <fieldset className="answer-list">
        <legend className="sr-only">Answer choices</legend>
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index

          return (
            <label
              key={option}
              className={
                isSelected ? 'answer-option is-selected' : 'answer-option'
              }
            >
              <input
                type="radio"
                name={question.id}
                checked={isSelected}
                onChange={() => onSelect(index)}
              />
              <span className="answer-option__letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
            </label>
          )
        })}
      </fieldset>

      <fieldset className="confidence-list">
        <legend className="confidence-title">Confidence</legend>
        <div className="confidence-list__items">
          {[1, 2, 3].map((level) => {
            const typedLevel = level as 1 | 2 | 3

            return (
              <label
                key={level}
                className={
                  confidence === typedLevel
                    ? 'confidence-option is-selected'
                    : 'confidence-option'
                }
              >
                <input
                  type="radio"
                  name={`${question.id}-confidence`}
                  checked={confidence === typedLevel}
                  onChange={() => onConfidence(typedLevel)}
                />
                {CONFIDENCE_LABELS[typedLevel]}
              </label>
            )
          })}
        </div>
      </fieldset>
    </article>
  )
}
