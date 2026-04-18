import type { AttemptAnswer, Question } from '../../types'

interface ReviewChoice {
  label: string
  text: string
}

export interface FriendlyReview {
  coachingTitle: string
  statusMessage: string
  correctChoice: ReviewChoice
  selectedChoice?: ReviewChoice
  simpleReason: string
  nextTimeSteps: string[]
}

interface ReviewStrategy {
  simpleReason: string
  nextTimeSteps: string[]
}

function formatChoiceLabel(index: number) {
  return String.fromCharCode(65 + index)
}

function buildChoice(question: Question, index: number): ReviewChoice {
  return {
    label: formatChoiceLabel(index),
    text: question.options[index] ?? 'Unknown choice',
  }
}

function includesOne(source: string, values: readonly string[]) {
  return values.some((value) => source.includes(value))
}

function getTopicSource(question: Question) {
  return [question.topic, ...question.tags].join(' ').toLowerCase()
}

function getReadingStrategy(topicSource: string): ReviewStrategy {
  if (includesOne(topicSource, ['main idea', 'summary', 'best title'])) {
    return {
      simpleReason:
        'Think about the whole passage like one big picture. The right answer matches the whole picture, not one tiny corner.',
      nextTimeSteps: [
        'Ask yourself, "What is this mostly about?" before looking at the choices.',
        'Say the big idea in your own simple words.',
        'Pick the answer that matches the whole passage, not a small detail.',
      ],
    }
  }

  if (includesOne(topicSource, ['inference', 'drawing conclusions'])) {
    return {
      simpleReason:
        'An inference question is a clue puzzle. The passage gives clue pieces, and you pick the answer those pieces point to.',
      nextTimeSteps: [
        'Find two or three clues in the passage.',
        'Ask, "What do these clues tell me together?"',
        'Choose the answer that fits all the clues and adds nothing extra.',
      ],
    }
  }

  if (
    includesOne(topicSource, [
      'context clues',
      'word meaning',
      'reference words',
      'vocabulary',
    ])
  ) {
    return {
      simpleReason:
        'The tricky word lives inside a sentence neighborhood. The words around it help tell you what it means.',
      nextTimeSteps: [
        'Read the words right before and right after the tricky word.',
        'Replace the tricky word with each answer choice in your head.',
        'Keep the choice that makes the sentence sound clear and sensible.',
      ],
    }
  }

  if (
    includesOne(topicSource, ['supporting detail', 'evidence', 'text-evidence'])
  ) {
    return {
      simpleReason:
        'The right answer should have proof in the passage. If you cannot point to the proof, it is probably not the best choice.',
      nextTimeSteps: [
        'Find the sentence or detail that talks about the question.',
        'Look for the answer choice that matches that proof most closely.',
        'Cross out choices that sound nice but are not supported by the passage.',
      ],
    }
  }

  if (includesOne(topicSource, ['sequence'])) {
    return {
      simpleReason:
        'Sequence questions are about order. Make a tiny timeline in your head and follow what happened first, next, and last.',
      nextTimeSteps: [
        'Notice order words like first, next, after, and finally.',
        'Say the events in order using a quick timeline.',
        'Pick the event that belongs in the exact spot the question asks about.',
      ],
    }
  }

  if (includesOne(topicSource, ['author purpose'])) {
    return {
      simpleReason:
        'Author purpose asks why the writer made the passage. The answer should match what the writer is trying to do.',
      nextTimeSteps: [
        'Ask whether the writer is mostly informing, explaining, persuading, or entertaining.',
        'Look at the details the writer chose to include.',
        "Pick the answer that matches the writer's main job.",
      ],
    }
  }

  if (includesOne(topicSource, ['compare texts', 'compare', 'contrast'])) {
    return {
      simpleReason:
        'Comparison questions want the big same-or-different idea. The best answer tells how the passages fit together.',
      nextTimeSteps: [
        'Say one important idea from the first passage.',
        'Say one important idea from the second passage.',
        'Choose the answer that best explains the key difference or similarity.',
      ],
    }
  }

  if (includesOne(topicSource, ['cause and effect', 'cause-effect'])) {
    return {
      simpleReason:
        'Cause and effect is about what happened first and what changed because of it.',
      nextTimeSteps: [
        'Find the event that started the change.',
        'Find what happened because of that event.',
        'Pick the answer that keeps those two parts in the right order.',
      ],
    }
  }

  return {
    simpleReason:
      'Reading questions get easier when you slow down, find the strongest clue, and make the answer match the passage.',
    nextTimeSteps: [
      'Read the question first so you know what to hunt for.',
      'Find the clue in the passage that matters most.',
      'Pick the choice that matches the clue best, not the one that just sounds fancy.',
    ],
  }
}

function getWritingStrategy(topicSource: string): ReviewStrategy {
  if (
    includesOne(topicSource, [
      'subject-verb agreement',
      'pronoun agreement',
      'verb tense',
    ])
  ) {
    return {
      simpleReason:
        'These questions are about matching words. One goes with one, many goes with many, and the time should stay steady.',
      nextTimeSteps: [
        'Find the main subject or noun first.',
        'Check whether it is one or many, and whether the sentence is past, present, or future.',
        'Pick the answer that makes the words match cleanly.',
      ],
    }
  }

  if (
    includesOne(topicSource, [
      'punctuation',
      'quotation punctuation',
      'apostrophes',
      'semicolon',
      'nonessential clause',
    ])
  ) {
    return {
      simpleReason:
        'Punctuation marks are little road signs. They tell the reader where to stop, pause, join ideas, or tuck extra words inside.',
      nextTimeSteps: [
        'Read the sentence out loud in your head and listen for the pause or break.',
        'Decide whether the sentence needs a stop, a join, or extra-info marks.',
        'Choose the answer with the punctuation that makes the sentence easiest to read.',
      ],
    }
  }

  if (
    includesOne(topicSource, [
      'fragment',
      'sentence combination',
      'conciseness',
      'parallel structure',
      'transitions',
      'misplaced modifier',
    ])
  ) {
    return {
      simpleReason:
        'Good writing sounds complete, clear, and smooth. The best answer says the idea without extra mess.',
      nextTimeSteps: [
        'Make sure the sentence feels complete and easy to follow.',
        'Look for repeated words, awkward phrasing, or ideas in the wrong place.',
        'Pick the choice that is shortest only if it also stays clear and correct.',
      ],
    }
  }

  if (includesOne(topicSource, ['capitalization'])) {
    return {
      simpleReason:
        'Capital letters have special jobs. They belong at the start of sentences and on important names.',
      nextTimeSteps: [
        'Check the first word of the sentence.',
        'Look for names of people, places, days, months, or titles.',
        'Pick the answer that uses big letters only where they belong.',
      ],
    }
  }

  if (includesOne(topicSource, ['word choice'])) {
    return {
      simpleReason:
        'Word choice questions want the word that means exactly the right thing and sounds right in the sentence.',
      nextTimeSteps: [
        'Read the whole sentence, not just the blank.',
        'Ask which choice says the idea most clearly.',
        'Cross out words that are too vague, too strong, or do not fit the tone.',
      ],
    }
  }

  return {
    simpleReason:
      'Writing questions get easier when you listen for the clearest, cleanest sentence.',
    nextTimeSteps: [
      'Read the whole sentence slowly.',
      'Check that the grammar, punctuation, and meaning all work together.',
      'Pick the answer that sounds clear, correct, and natural.',
    ],
  }
}

function getMathStrategy(topicSource: string): ReviewStrategy {
  if (includesOne(topicSource, ['fraction', 'ratio', 'percent', 'decimal'])) {
    return {
      simpleReason:
        'These questions are about parts and wholes. Make sure you know what the whole is and what piece you are comparing to it.',
      nextTimeSteps: [
        'Underline the numbers that belong together.',
        'Decide what is the whole and what is the part or comparison.',
        'Do one small step at a time and check whether the answer size makes sense.',
      ],
    }
  }

  if (
    includesOne(topicSource, [
      'area',
      'triangle area',
      'measurement',
      'elapsed time',
      'scale',
    ])
  ) {
    return {
      simpleReason:
        'Measurement questions work best when you match the rule to the unit you need.',
      nextTimeSteps: [
        'Circle the numbers and the unit the question wants.',
        'Pick the rule or formula you need before doing any math.',
        'Check that your final answer has the right unit and sounds reasonable.',
      ],
    }
  }

  if (
    includesOne(topicSource, [
      'division',
      'order of operations',
      'two-step problems',
      'averages',
      'probability',
      'remainders',
    ])
  ) {
    return {
      simpleReason:
        'Math gets friendlier when you break it into tiny jobs instead of trying to do everything at once.',
      nextTimeSteps: [
        'Ask yourself what the question wants you to find.',
        'Choose the operation or operations in the right order.',
        'Solve one step at a time, then check whether the answer fits the story.',
      ],
    }
  }

  return {
    simpleReason:
      'For math questions, slow down, find the important numbers, and solve in little steps.',
    nextTimeSteps: [
      'Read the question all the way through once before you calculate.',
      'Mark the numbers and words that tell you what to do.',
      'Work step by step and check whether your answer makes sense.',
    ],
  }
}

function getInstructionalSupportStrategy(topicSource: string): ReviewStrategy {
  if (
    includesOne(topicSource, [
      'behavior',
      'de-escalation',
      'safety',
      'confidentiality',
    ])
  ) {
    return {
      simpleReason:
        'The best classroom choice usually keeps everyone safe, calm, and respected.',
      nextTimeSteps: [
        'Pick the answer that protects safety first.',
        'Choose the calm, private, respectful helper action.',
        'Avoid answers that embarrass the student or go beyond the paraeducator role.',
      ],
    }
  }

  if (
    includesOne(topicSource, [
      'family communication',
      'teacher communication',
      'communication boundaries',
      'observation',
    ])
  ) {
    return {
      simpleReason:
        'Good school communication is clear, professional, and shared the right way with the right person.',
      nextTimeSteps: [
        'Choose the answer that keeps information accurate and appropriate.',
        'Stay inside the paraeducator role instead of making promises or decisions alone.',
        'Pick the option that helps the teacher or team stay informed.',
      ],
    }
  }

  return {
    simpleReason:
      'The best support answer helps the student learn while still letting the student do the work.',
    nextTimeSteps: [
      "Look for support that matches the student's plan or the teacher's direction.",
      'Pick help that builds independence instead of taking over.',
      'Choose the answer that gives useful support, feedback, or access to the lesson.',
    ],
  }
}

function getStrategy(question: Question): ReviewStrategy {
  const topicSource = getTopicSource(question)

  switch (question.section) {
    case 'reading':
      return getReadingStrategy(topicSource)
    case 'writing':
      return getWritingStrategy(topicSource)
    case 'math':
      return getMathStrategy(topicSource)
    case 'instructional-support':
      return getInstructionalSupportStrategy(topicSource)
  }
}

export function buildFriendlyReview(
  question: Question,
  answer: Pick<AttemptAnswer, 'selectedOption' | 'isCorrect'>
): FriendlyReview {
  const strategy = getStrategy(question)
  const selectedChoice =
    answer.selectedOption === null
      ? undefined
      : buildChoice(question, answer.selectedOption)

  return {
    coachingTitle: answer.isCorrect
      ? 'How to do it again'
      : 'How to get it right next time',
    statusMessage: answer.isCorrect
      ? 'Nice job. You followed the clue that mattered most.'
      : answer.selectedOption === null
        ? 'You left this one blank. A tiny step-by-step plan can make it feel much easier next time.'
        : 'This one is easier when you slow down and let the best clue lead the way.',
    correctChoice: buildChoice(question, question.correctAnswer),
    selectedChoice,
    simpleReason: strategy.simpleReason,
    nextTimeSteps: strategy.nextTimeSteps,
  }
}
