import type { Question } from '../types'

function makeQuestion(question: Question) {
  return question
}

export const questionBank: Question[] = [
  makeQuestion({
    id: 'read-001',
    section: 'reading',
    topic: 'main idea',
    difficulty: 'foundation',
    scenario:
      'The school library started a lunchtime reading circle in October. At first only six students attended, but by January the group had filled every chair near the window. Students said they liked hearing classmates recommend books and having a quiet place to read before afternoon classes.',
    prompt: 'What is the main idea of the passage?',
    options: [
      'The school library plans to buy more chairs.',
      'Students enjoy a lunchtime reading circle that has grown over time.',
      'Most students prefer reading during afternoon classes.',
      'Book recommendations should come only from librarians.',
    ],
    correctAnswer: 1,
    explanation:
      'The passage focuses on the reading circle growing because students enjoy the shared reading time and recommendations.',
    tags: ['reading-comprehension', 'main-idea', 'community'],
  }),
  makeQuestion({
    id: 'read-002',
    section: 'reading',
    topic: 'inference',
    difficulty: 'core',
    scenario:
      'Mina packed her folder the night before the field trip, set an alarm for thirty minutes earlier than usual, and waited by the door before sunrise. She checked the bus permission slip twice before leaving.',
    prompt: 'What can the reader most reasonably infer about Mina?',
    options: [
      'She is nervous because she forgot the trip date.',
      'She is excited and wants to make sure she is prepared.',
      'She dislikes field trips and hopes the bus is late.',
      'She usually ignores directions from school.',
    ],
    correctAnswer: 1,
    explanation:
      'Her careful preparation and early start suggest excitement and a desire to be ready.',
    tags: ['reading-comprehension', 'inference', 'details'],
  }),
  makeQuestion({
    id: 'read-003',
    section: 'reading',
    topic: 'context clues',
    difficulty: 'foundation',
    scenario:
      'When the class hamster escaped, Mr. Ortiz moved slowly and spoke in a calm voice so the frightened animal would not dart behind the shelves. Even the most reluctant students joined the search.',
    prompt: 'What does the word "reluctant" most nearly mean in the passage?',
    options: ['eager', 'uncertain', 'hidden', 'careless'],
    correctAnswer: 1,
    explanation:
      'Students who were reluctant were not eager at first; they were hesitant or uncertain about joining in.',
    tags: ['vocabulary', 'context-clues', 'reading'],
  }),
  makeQuestion({
    id: 'read-004',
    section: 'reading',
    topic: 'author purpose',
    difficulty: 'core',
    scenario:
      'Families are invited to our Thursday Math Night from 5:30 to 7:00 p.m. Students will rotate through short games that practice estimation, fractions, and mental math. Translators and take-home activity cards will be available at check-in.',
    prompt: 'What is the author’s primary purpose?',
    options: [
      'To persuade families to volunteer in the cafeteria',
      'To entertain readers with a story about math class',
      'To inform families about a school event and its features',
      'To compare two approaches to teaching math',
    ],
    correctAnswer: 2,
    explanation:
      'The passage gives practical information about an upcoming event, including time, activities, and supports.',
    tags: ['author-purpose', 'informational-text', 'reading'],
  }),
  makeQuestion({
    id: 'read-005',
    section: 'reading',
    topic: 'compare texts',
    difficulty: 'stretch',
    scenario:
      'Passage A says students should take notes by hand because writing slows them down enough to process ideas. Passage B argues that typed notes can be more useful because students can search, sort, and revise them later.',
    prompt: 'How do the two passages differ?',
    options: [
      'Passage A supports note taking, but Passage B rejects note taking.',
      'Passage A focuses on processing during class, while Passage B focuses on organizing notes after class.',
      'Passage A is written for teachers, while Passage B is written for librarians.',
      'Passage A gives data from a survey, while Passage B tells a personal story.',
    ],
    correctAnswer: 1,
    explanation:
      'The passages emphasize different advantages: immediate processing versus later organization and revision.',
    tags: ['compare-contrast', 'reading', 'study-skills'],
  }),
  makeQuestion({
    id: 'read-006',
    section: 'reading',
    topic: 'supporting detail',
    difficulty: 'foundation',
    scenario:
      'The article explains that bees help gardens thrive by moving pollen from flower to flower. It also notes that many vegetables, including cucumbers and squash, depend on pollinators to grow fruit.',
    prompt:
      'Which detail best supports the idea that bees are important to gardens?',
    options: [
      'Bees are usually active during daylight hours.',
      'Some gardeners wear gloves while planting.',
      'Many vegetables depend on pollinators to produce fruit.',
      'Flowers come in many colors and sizes.',
    ],
    correctAnswer: 2,
    explanation:
      'That detail directly explains how bees help gardens produce vegetables.',
    tags: ['supporting-detail', 'science-reading', 'evidence'],
  }),
  makeQuestion({
    id: 'read-007',
    section: 'reading',
    topic: 'sequence',
    difficulty: 'foundation',
    scenario:
      'First, the class gathered fallen leaves from the playground. Next, students sorted them by shape and color. After that, they pressed the leaves between sheets of newspaper. Finally, they labeled the dried leaves for a science display.',
    prompt: 'What happened immediately before the leaves were labeled?',
    options: [
      'Students sorted the leaves by shape and color.',
      'Students gathered leaves from the playground.',
      'Students dried the leaves between sheets of newspaper.',
      'Students displayed the leaves in the hallway.',
    ],
    correctAnswer: 2,
    explanation:
      'Pressing the leaves between newspaper came right before labeling them for the display.',
    tags: ['sequence', 'details', 'reading'],
  }),
  makeQuestion({
    id: 'read-008',
    section: 'reading',
    topic: 'evidence',
    difficulty: 'core',
    scenario:
      'The principal wrote, "Attendance improved after we added a second breakfast cart near the bus lane. Students arriving late no longer had to choose between going to class on time and eating before first period."',
    prompt: 'Which claim is best supported by the quotation?',
    options: [
      'Students prefer hot breakfasts to cold breakfasts.',
      'Changing access to breakfast may have helped students arrive ready for class.',
      'Bus schedules should be adjusted every semester.',
      'Students should always eat in the classroom.',
    ],
    correctAnswer: 1,
    explanation:
      'The quote directly links easier breakfast access with improved attendance and on-time arrival.',
    tags: ['text-evidence', 'cause-effect', 'reading'],
  }),
  makeQuestion({
    id: 'read-009',
    section: 'reading',
    topic: 'summary',
    difficulty: 'core',
    scenario:
      'A short article describes how volunteers restored a neglected school courtyard. They removed weeds, repaired benches, planted shade trees, and built raised beds for science lessons. By spring, classes were using the courtyard for reading, observation, and outdoor art.',
    prompt: 'Which sentence is the best summary of the article?',
    options: [
      'Volunteers improved a school courtyard so it could support learning activities.',
      'Shade trees are the most important part of a school courtyard.',
      'Raised garden beds are difficult to build without volunteers.',
      'Outdoor art classes should happen only in the spring.',
    ],
    correctAnswer: 0,
    explanation:
      'A strong summary captures the overall transformation and its purpose without getting lost in minor details.',
    tags: ['summary', 'reading', 'main-idea'],
  }),
  makeQuestion({
    id: 'read-010',
    section: 'reading',
    topic: 'author purpose',
    difficulty: 'stretch',
    scenario:
      'The article notes that some schools begin classes later so older students can get more sleep. It then describes research linking sleep to attention, memory, and mood during the school day.',
    prompt: 'Why does the author include the research findings?',
    options: [
      'To provide evidence supporting later school start times',
      'To show that all students should take naps during class',
      'To explain why homework should be assigned at night',
      'To argue that sports practices should end earlier than classes',
    ],
    correctAnswer: 0,
    explanation:
      'The research supports the article’s point that sleep affects learning and attention, which strengthens the discussion of later start times.',
    tags: ['author-purpose', 'evidence', 'informational-reading'],
  }),
  makeQuestion({
    id: 'read-011',
    section: 'reading',
    topic: 'word meaning',
    difficulty: 'core',
    scenario:
      'At rehearsal, the conductor asked the percussion section to play with restraint so the softer flute melody could still be heard.',
    prompt: 'What does "restraint" most nearly mean in the sentence?',
    options: [
      'careful control',
      'great speed',
      'strong excitement',
      'public applause',
    ],
    correctAnswer: 0,
    explanation:
      'The percussion players are being asked to control their volume so another instrument can be heard clearly.',
    tags: ['vocabulary', 'context-clues', 'reading'],
  }),
  makeQuestion({
    id: 'read-012',
    section: 'reading',
    topic: 'cause and effect',
    difficulty: 'foundation',
    scenario:
      'The sidewalk outside the school became icy overnight. As a result, buses unloaded students at the side entrance, and staff members spread sand near the doors.',
    prompt: 'Which event happened because the sidewalk became icy?',
    options: [
      'The buses arrived earlier than usual.',
      'Students entered through the side entrance.',
      'School was canceled for the day.',
      'Staff members moved the main office.',
    ],
    correctAnswer: 1,
    explanation:
      'The icy sidewalk caused staff to change where students entered the building.',
    tags: ['cause-effect', 'reading', 'details'],
  }),
  makeQuestion({
    id: 'read-013',
    section: 'reading',
    topic: 'drawing conclusions',
    difficulty: 'core',
    scenario:
      'Both essays praise community service, but one focuses on the personal growth that comes from volunteering while the other emphasizes how neighborhoods benefit when many people help.',
    prompt: 'What conclusion can the reader draw from the essays?',
    options: [
      'Community service can be valuable for both individuals and communities.',
      'Only adults should take part in community service.',
      'Neighborhood projects are more useful than school projects.',
      'Volunteering is helpful only when people receive credit for it.',
    ],
    correctAnswer: 0,
    explanation:
      'Taken together, the essays highlight benefits to both the volunteer and the broader community.',
    tags: ['conclusions', 'compare-texts', 'reading'],
  }),
  makeQuestion({
    id: 'read-014',
    section: 'reading',
    topic: 'reference words',
    difficulty: 'foundation',
    scenario:
      'The class planted sunflower seeds in two trays. After three days, the seeds in the tray near the window sprouted first because it received more sunlight.',
    prompt: 'What does the word "it" refer to in the sentence?',
    options: [
      'the class',
      'the tray near the window',
      'the sunflower seeds',
      'the sunlight',
    ],
    correctAnswer: 1,
    explanation:
      'The pronoun refers to the tray near the window, which received more sunlight.',
    tags: ['reference-words', 'reading', 'details'],
  }),
  makeQuestion({
    id: 'read-015',
    section: 'reading',
    topic: 'best title',
    difficulty: 'foundation',
    scenario:
      'A passage explains how a class used maps, interviews, and old photographs to learn how their town changed over fifty years. Students then created a display comparing past and present landmarks.',
    prompt: 'Which title best fits the passage?',
    options: [
      'How Weather Changes a Town',
      'Students Explore Local History',
      'Why Old Photographs Fade',
      'The Best Way to Build a Museum',
    ],
    correctAnswer: 1,
    explanation:
      'The passage is about students investigating how their town changed over time, so the title should reflect local history.',
    tags: ['title', 'main-idea', 'reading'],
  }),
  makeQuestion({
    id: 'read-016',
    section: 'reading',
    topic: 'inference',
    difficulty: 'stretch',
    scenario:
      'Jordan read the directions for the science project twice, highlighted every due date, and asked his teacher whether the final model had to stand on its own. Later he borrowed a ruler from the supply shelf before leaving.',
    prompt: 'Which inference is best supported by the passage?',
    options: [
      'Jordan plans carefully before starting assignments.',
      'Jordan dislikes science but enjoys art.',
      'Jordan forgot to bring his project to school.',
      'Jordan does not understand written directions.',
    ],
    correctAnswer: 0,
    explanation:
      'His questions, highlighting, and preparation show a careful planning style.',
    tags: ['inference', 'study-habits', 'reading'],
  }),
  makeQuestion({
    id: 'write-001',
    section: 'writing',
    topic: 'subject-verb agreement',
    difficulty: 'foundation',
    prompt: 'Choose the sentence with correct subject-verb agreement.',
    options: [
      'The list of supplies are on the table.',
      'The list of supplies is on the table.',
      'The list of supplies were on the table.',
      'The list of supplies be on the table.',
    ],
    correctAnswer: 1,
    explanation:
      'The subject is singular: "list." A singular subject takes the verb "is."',
    tags: ['grammar', 'subject-verb-agreement'],
  }),
  makeQuestion({
    id: 'write-002',
    section: 'writing',
    topic: 'punctuation',
    difficulty: 'foundation',
    prompt:
      'Which option correctly punctuates the sentence?\nBefore the concert the choir practiced in the hallway.',
    options: [
      'Before the concert, the choir practiced in the hallway.',
      'Before, the concert the choir practiced in the hallway.',
      'Before the concert the choir, practiced in the hallway.',
      'Before the concert the choir practiced, in the hallway.',
    ],
    correctAnswer: 0,
    explanation: 'An introductory phrase should be followed by a comma.',
    tags: ['punctuation', 'introductory-phrase'],
  }),
  makeQuestion({
    id: 'write-003',
    section: 'writing',
    topic: 'sentence combination',
    difficulty: 'core',
    prompt:
      'Choose the best revision.\nThe class finished the mural. The class invited families to see it.',
    options: [
      'The class finished the mural, and invited families to see it.',
      'The class finished the mural and invited families to see it.',
      'The class finished the mural, families were invited to see it.',
      'The class finished the mural inviting families see it.',
    ],
    correctAnswer: 1,
    explanation:
      'This revision combines the ideas clearly and concisely with correct grammar.',
    tags: ['sentence-combining', 'clarity', 'writing'],
  }),
  makeQuestion({
    id: 'write-004',
    section: 'writing',
    topic: 'pronoun agreement',
    difficulty: 'foundation',
    prompt: 'Which sentence uses pronouns correctly?',
    options: [
      'Each student should hang up their coat before class.',
      'Each student should hang up his or her coat before class.',
      'Each student should hang up our coat before class.',
      'Each student should hang up your coat before class.',
    ],
    correctAnswer: 1,
    explanation:
      'The singular subject "each student" matches the singular pronoun phrase "his or her."',
    tags: ['pronoun-agreement', 'grammar'],
  }),
  makeQuestion({
    id: 'write-005',
    section: 'writing',
    topic: 'verb tense',
    difficulty: 'foundation',
    prompt: 'Choose the sentence with consistent verb tense.',
    options: [
      'Mara opens the notebook and wrote the answer.',
      'Mara opened the notebook and wrote the answer.',
      'Mara opens the notebook and was writing the answer.',
      'Mara had opened the notebook and writes the answer.',
    ],
    correctAnswer: 1,
    explanation:
      'Both verbs are in the past tense, so the sentence is consistent.',
    tags: ['verb-tense', 'grammar'],
  }),
  makeQuestion({
    id: 'write-006',
    section: 'writing',
    topic: 'fragment',
    difficulty: 'core',
    prompt:
      'Which option revises the fragment into a complete sentence?\nBecause the buses were delayed.',
    options: [
      'Because the buses were delayed the principal.',
      'Because the buses were delayed, arrival time changed.',
      'The buses were delayed because.',
      'Delayed because the buses were.',
    ],
    correctAnswer: 1,
    explanation:
      'A complete sentence needs a full independent clause, which option B provides.',
    tags: ['sentence-fragment', 'grammar'],
  }),
  makeQuestion({
    id: 'write-007',
    section: 'writing',
    topic: 'apostrophes',
    difficulty: 'foundation',
    prompt: 'Which sentence uses the apostrophe correctly?',
    options: [
      'The teachers lounge is near the office.',
      'The teacher’s lounge is near the office.',
      'The teachers’ lounge is near the office.',
      'The teachers lounge’s is near the office.',
    ],
    correctAnswer: 2,
    explanation:
      'The lounge belongs to multiple teachers, so the plural possessive form "teachers’" is correct.',
    tags: ['apostrophes', 'possessives'],
  }),
  makeQuestion({
    id: 'write-008',
    section: 'writing',
    topic: 'nonessential clause',
    difficulty: 'core',
    prompt:
      'Choose the best punctuation for the sentence.\nThe robotics coach, who arrives early every day, unlocks the lab.',
    options: [
      'The robotics coach who arrives early every day unlocks the lab.',
      'The robotics coach, who arrives early every day, unlocks the lab.',
      'The robotics coach who arrives early every day, unlocks the lab.',
      'The robotics coach, who arrives early every day unlocks the lab.',
    ],
    correctAnswer: 1,
    explanation:
      'A nonessential clause should be set off with commas on both sides.',
    tags: ['commas', 'nonessential-clause', 'writing'],
  }),
  makeQuestion({
    id: 'write-009',
    section: 'writing',
    topic: 'word choice',
    difficulty: 'core',
    prompt:
      'A note to families should sound respectful and clear. Which word best completes the sentence?\nPlease ______ the attached form by Friday.',
    options: ['return', 'dump', 'grab', 'chase'],
    correctAnswer: 0,
    explanation:
      'The word "return" is precise and appropriate for a respectful school message.',
    tags: ['word-choice', 'tone', 'writing'],
  }),
  makeQuestion({
    id: 'write-010',
    section: 'writing',
    topic: 'parallel structure',
    difficulty: 'stretch',
    prompt: 'Which sentence uses parallel structure correctly?',
    options: [
      'The goal is to read carefully, writing notes, and to ask questions.',
      'The goal is reading carefully, to write notes, and questions.',
      'The goal is to read carefully, to write notes, and to ask questions.',
      'The goal is careful reading, writing notes, and to ask questions.',
    ],
    correctAnswer: 2,
    explanation:
      'Each item in the series uses the same infinitive form: "to read," "to write," "to ask."',
    tags: ['parallel-structure', 'sentence-style'],
  }),
  makeQuestion({
    id: 'write-011',
    section: 'writing',
    topic: 'capitalization',
    difficulty: 'foundation',
    prompt: 'Which sentence is capitalized correctly?',
    options: [
      'Our class visited the pacific ocean last May.',
      'Our class visited the Pacific Ocean last May.',
      'Our class visited the Pacific ocean last may.',
      'Our Class visited the Pacific Ocean last May.',
    ],
    correctAnswer: 1,
    explanation:
      'Proper nouns such as "Pacific Ocean" and the month "May" should be capitalized.',
    tags: ['capitalization', 'grammar'],
  }),
  makeQuestion({
    id: 'write-012',
    section: 'writing',
    topic: 'misplaced modifier',
    difficulty: 'stretch',
    prompt:
      'Which revision fixes the misplaced modifier?\nWalking into the library, the posters caught Ava’s attention.',
    options: [
      'Walking into the library, Ava noticed the posters.',
      'The posters caught Ava’s attention, walking into the library.',
      'Walking into the library, the attention of Ava was caught by the posters.',
      'The posters, walking into the library, caught Ava’s attention.',
    ],
    correctAnswer: 0,
    explanation:
      'The revised sentence clearly shows that Ava, not the posters, is walking into the library.',
    tags: ['misplaced-modifier', 'sentence-clarity'],
  }),
  makeQuestion({
    id: 'write-013',
    section: 'writing',
    topic: 'semicolon',
    difficulty: 'core',
    prompt: 'Choose the sentence that uses a semicolon correctly.',
    options: [
      'The rain stopped; and the class went outside.',
      'The rain stopped; the class went outside.',
      'The rain; stopped the class went outside.',
      'The rain stopped the class; went outside.',
    ],
    correctAnswer: 1,
    explanation:
      'A semicolon can join two closely related independent clauses without a conjunction.',
    tags: ['semicolon', 'punctuation'],
  }),
  makeQuestion({
    id: 'write-014',
    section: 'writing',
    topic: 'transitions',
    difficulty: 'core',
    prompt:
      'Choose the best transition.\nMia finished her math page early. ______, she checked her work before turning it in.',
    options: ['However', 'Next', 'Instead', 'For example'],
    correctAnswer: 1,
    explanation:
      '"Next" shows the order of events clearly: first Mia finished, then she checked her work.',
    tags: ['transitions', 'organization'],
  }),
  makeQuestion({
    id: 'write-015',
    section: 'writing',
    topic: 'conciseness',
    difficulty: 'core',
    prompt: 'Which revision is most concise?',
    options: [
      'At this point in time, the meeting is scheduled for 3:00 p.m.',
      'The meeting is scheduled for 3:00 p.m.',
      'The meeting currently right now is at 3:00 p.m.',
      'It is the case that the meeting is for 3:00 p.m.',
    ],
    correctAnswer: 1,
    explanation:
      'Option B removes unnecessary words while keeping the meaning clear.',
    tags: ['conciseness', 'style'],
  }),
  makeQuestion({
    id: 'write-016',
    section: 'writing',
    topic: 'quotation punctuation',
    difficulty: 'stretch',
    prompt: 'Which sentence punctuates the quotation correctly?',
    options: [
      'Ms. Lee said “Please stack the notebooks by color.”',
      'Ms. Lee said, “Please stack the notebooks by color.”',
      'Ms. Lee said, “Please stack the notebooks by color”.',
      'Ms. Lee said “Please stack the notebooks by color”.',
    ],
    correctAnswer: 1,
    explanation:
      'A comma should appear before the quotation, and the period belongs inside the closing quotation mark.',
    tags: ['quotation-marks', 'punctuation'],
  }),
  makeQuestion({
    id: 'math-001',
    section: 'math',
    topic: 'fractions',
    difficulty: 'foundation',
    prompt: 'What is 1/4 + 2/4?',
    options: ['3/8', '3/4', '1/2', '2/8'],
    correctAnswer: 1,
    explanation:
      'When fractions have the same denominator, add the numerators: 1 + 2 = 3, so the sum is 3/4.',
    tags: ['fractions', 'addition'],
  }),
  makeQuestion({
    id: 'math-002',
    section: 'math',
    topic: 'ratios',
    difficulty: 'foundation',
    prompt:
      'A class has 8 blue markers and 4 red markers. What is the ratio of blue markers to red markers in simplest form?',
    options: ['8:4', '4:8', '2:1', '1:2'],
    correctAnswer: 2,
    explanation:
      'The ratio 8:4 simplifies by dividing both numbers by 4, giving 2:1.',
    tags: ['ratios', 'simplifying'],
  }),
  makeQuestion({
    id: 'math-003',
    section: 'math',
    topic: 'percentages',
    difficulty: 'core',
    prompt:
      'A notebook costs $6.00 and is on sale for 25% off. What is the sale price?',
    options: ['$1.50', '$4.50', '$5.25', '$7.50'],
    correctAnswer: 1,
    explanation:
      'Twenty-five percent of $6.00 is $1.50. Subtracting the discount gives $4.50.',
    tags: ['percentages', 'money'],
  }),
  makeQuestion({
    id: 'math-004',
    section: 'math',
    topic: 'area',
    difficulty: 'foundation',
    prompt:
      'What is the area of a rectangle that is 7 units long and 3 units wide?',
    options: [
      '10 square units',
      '20 square units',
      '21 square units',
      '28 square units',
    ],
    correctAnswer: 2,
    explanation: 'Area of a rectangle equals length times width: 7 × 3 = 21.',
    tags: ['geometry', 'area'],
  }),
  makeQuestion({
    id: 'math-005',
    section: 'math',
    topic: 'measurement',
    difficulty: 'foundation',
    prompt: 'How many inches are in 3 feet?',
    options: ['12', '24', '36', '48'],
    correctAnswer: 2,
    explanation: 'Each foot is 12 inches, so 3 feet equals 3 × 12 = 36 inches.',
    tags: ['measurement', 'unit-conversion'],
  }),
  makeQuestion({
    id: 'math-006',
    section: 'math',
    topic: 'averages',
    difficulty: 'core',
    prompt: 'What is the mean of 4, 6, 8, and 10?',
    options: ['6', '7', '8', '9'],
    correctAnswer: 1,
    explanation: 'Add the numbers to get 28, then divide by 4. The mean is 7.',
    tags: ['mean', 'data'],
  }),
  makeQuestion({
    id: 'math-007',
    section: 'math',
    topic: 'decimals',
    difficulty: 'foundation',
    prompt: 'Which number has a 5 in the tenths place?',
    options: ['0.54', '1.05', '5.01', '2.45'],
    correctAnswer: 0,
    explanation:
      'In 0.54, the digit 5 is directly to the right of the decimal point, which is the tenths place.',
    tags: ['decimals', 'place-value'],
  }),
  makeQuestion({
    id: 'math-008',
    section: 'math',
    topic: 'division',
    difficulty: 'core',
    prompt:
      'Twenty-four science journals are shared equally among 6 tables. How many journals does each table receive?',
    options: ['3', '4', '5', '6'],
    correctAnswer: 1,
    explanation: 'Dividing 24 by 6 gives 4 journals per table.',
    tags: ['division', 'word-problems'],
  }),
  makeQuestion({
    id: 'math-009',
    section: 'math',
    topic: 'elapsed time',
    difficulty: 'core',
    prompt:
      'A movie begins at 1:25 p.m. and ends at 3:00 p.m. How long is the movie?',
    options: [
      '1 hour 15 minutes',
      '1 hour 25 minutes',
      '1 hour 35 minutes',
      '2 hours',
    ],
    correctAnswer: 2,
    explanation:
      'From 1:25 to 2:25 is 1 hour, and from 2:25 to 3:00 is 35 minutes, for a total of 1 hour 35 minutes.',
    tags: ['elapsed-time', 'measurement'],
  }),
  makeQuestion({
    id: 'math-010',
    section: 'math',
    topic: 'two-step problems',
    difficulty: 'core',
    prompt:
      'A classroom has 5 tables. Each table seats 4 students. If 3 seats are empty, how many students are seated?',
    options: ['17', '20', '23', '27'],
    correctAnswer: 0,
    explanation:
      'There are 5 × 4 = 20 seats total. If 3 are empty, then 17 students are seated.',
    tags: ['word-problems', 'multiplication', 'subtraction'],
  }),
  makeQuestion({
    id: 'math-011',
    section: 'math',
    topic: 'probability',
    difficulty: 'stretch',
    prompt:
      'A bag contains 3 green cubes, 2 yellow cubes, and 5 blue cubes. What is the probability of drawing a yellow cube?',
    options: ['1/5', '2/10', '2/5', '1/2'],
    correctAnswer: 0,
    explanation:
      'There are 10 cubes total, and 2 are yellow. The probability 2/10 simplifies to 1/5.',
    tags: ['probability', 'fractions'],
  }),
  makeQuestion({
    id: 'math-012',
    section: 'math',
    topic: 'triangle area',
    difficulty: 'stretch',
    prompt:
      'A triangle has a base of 8 units and a height of 5 units. What is its area?',
    options: [
      '13 square units',
      '20 square units',
      '40 square units',
      '80 square units',
    ],
    correctAnswer: 1,
    explanation:
      'Area of a triangle is 1/2 × base × height = 1/2 × 8 × 5 = 20.',
    tags: ['geometry', 'area', 'triangle'],
  }),
  makeQuestion({
    id: 'math-013',
    section: 'math',
    topic: 'scale',
    difficulty: 'stretch',
    prompt:
      'On a map, 1 inch represents 4 miles. Two towns are 3 inches apart on the map. How far apart are the towns?',
    options: ['7 miles', '12 miles', '16 miles', '24 miles'],
    correctAnswer: 1,
    explanation: 'Multiply 3 inches by 4 miles per inch to get 12 miles.',
    tags: ['scale', 'multiplication'],
  }),
  makeQuestion({
    id: 'math-014',
    section: 'math',
    topic: 'remainders',
    difficulty: 'core',
    prompt:
      'Thirty-one students are going on a trip. Each van holds 6 students. How many vans are needed?',
    options: ['5', '6', '7', '31'],
    correctAnswer: 1,
    explanation:
      '31 divided by 6 is 5 remainder 1, so one more van is needed. The class needs 6 vans.',
    tags: ['division', 'remainders', 'word-problems'],
  }),
  makeQuestion({
    id: 'math-015',
    section: 'math',
    topic: 'order of operations',
    difficulty: 'core',
    prompt: 'What is the value of 3 + 4 × 2?',
    options: ['11', '14', '16', '24'],
    correctAnswer: 0,
    explanation: 'Multiply first: 4 × 2 = 8. Then add 3 to get 11.',
    tags: ['order-of-operations'],
  }),
  makeQuestion({
    id: 'math-016',
    section: 'math',
    topic: 'fractions in context',
    difficulty: 'core',
    prompt:
      'A pitcher contains 12 cups of water. If students drink 3/4 of the water, how many cups do they drink?',
    options: ['3 cups', '8 cups', '9 cups', '16 cups'],
    correctAnswer: 2,
    explanation: 'Three-fourths of 12 is 12 ÷ 4 = 3, then 3 × 3 = 9 cups.',
    tags: ['fractions', 'multiplication', 'word-problems'],
  }),
  makeQuestion({
    id: 'inst-001',
    section: 'instructional-support',
    topic: 'checking for understanding',
    difficulty: 'foundation',
    scenario:
      'During small-group reading, several students nod when the paraeducator asks whether they understand the directions, but two students have not opened their books.',
    prompt: 'What is the best next step?',
    options: [
      'Move on quickly so the lesson stays on schedule.',
      'Ask students to restate the directions or show the first step.',
      'Tell the teacher the students refused to work.',
      'Finish the task for the students so no one falls behind.',
    ],
    correctAnswer: 1,
    explanation:
      'Having students restate or demonstrate the first step is a direct way to check actual understanding.',
    tags: ['instructional-support', 'formative-check', 'small-group'],
  }),
  makeQuestion({
    id: 'inst-002',
    section: 'instructional-support',
    topic: 'confidentiality',
    difficulty: 'foundation',
    scenario:
      'A neighbor asks a paraeducator why a student leaves class each day for extra support.',
    prompt: 'What should the paraeducator do?',
    options: [
      'Explain the student’s services so the neighbor understands.',
      'Share only the student’s schedule, not the reason for support.',
      'Protect the student’s privacy and refer questions to appropriate school staff.',
      'Discuss the student’s progress if the neighbor promises not to repeat it.',
    ],
    correctAnswer: 2,
    explanation:
      'Student support information is private. The paraeducator should protect confidentiality and refer questions appropriately.',
    tags: ['confidentiality', 'professional-boundaries'],
  }),
  makeQuestion({
    id: 'inst-003',
    section: 'instructional-support',
    topic: 'accommodations',
    difficulty: 'core',
    scenario:
      'A student with a documented classroom accommodation needs directions presented in smaller steps.',
    prompt: 'Which action best supports the accommodation?',
    options: [
      'Read the entire assignment once and expect the student to remember it.',
      'Break the task into short parts and check after each one.',
      'Give the student fewer directions than other students without telling the teacher.',
      'Allow the student to skip all difficult questions.',
    ],
    correctAnswer: 1,
    explanation:
      'Breaking work into manageable steps aligns with the stated accommodation and supports independence.',
    tags: ['accommodations', 'scaffolding', 'instructional-support'],
  }),
  makeQuestion({
    id: 'inst-004',
    section: 'instructional-support',
    topic: 'behavior support',
    difficulty: 'core',
    scenario:
      'A student begins tapping a pencil loudly during a quiet writing period. The student usually settles down after a brief reminder.',
    prompt: 'What is the most appropriate response?',
    options: [
      'Use a calm, private reminder of the expected behavior.',
      'Stop class and lecture the student in front of everyone.',
      'Take away the student’s recess for the rest of the week immediately.',
      'Ignore the behavior even if it continues to disrupt others.',
    ],
    correctAnswer: 0,
    explanation:
      'A calm, private reminder is respectful, minimally disruptive, and matched to a behavior that usually improves with redirection.',
    tags: ['behavior', 'positive-support', 'classroom-management'],
  }),
  makeQuestion({
    id: 'inst-005',
    section: 'instructional-support',
    topic: 'small-group instruction',
    difficulty: 'core',
    scenario:
      'While supporting a math group, the paraeducator notices one student is answering every question before others can think.',
    prompt: 'What is the best response?',
    options: [
      'Tell the strong student to stop participating.',
      'Invite other students to explain first and use wait time before calling on anyone.',
      'Give the strong student a separate worksheet and ignore the group dynamic.',
      'Answer the questions without involving students.',
    ],
    correctAnswer: 1,
    explanation:
      'Wait time and intentional turn-taking help all students engage without shutting down a student who is eager.',
    tags: ['small-group', 'participation', 'instructional-support'],
  }),
  makeQuestion({
    id: 'inst-006',
    section: 'instructional-support',
    topic: 'observation',
    difficulty: 'foundation',
    scenario:
      'A teacher asks the paraeducator to observe a student during independent reading and report what happens.',
    prompt: 'Which observation note is most useful?',
    options: [
      'The student was lazy today.',
      'The student read for 6 minutes, looked around the room twice, and asked for help once.',
      'The student did not try hard enough to focus.',
      'The student was probably tired from staying up late.',
    ],
    correctAnswer: 1,
    explanation:
      'Useful observation notes are objective, specific, and based on what can be seen or heard.',
    tags: ['observation', 'data-collection', 'professional-practice'],
  }),
  makeQuestion({
    id: 'inst-007',
    section: 'instructional-support',
    topic: 'multilingual learners',
    difficulty: 'core',
    scenario:
      'A multilingual learner understands the science concept when classmates demonstrate it but struggles to follow long verbal explanations.',
    prompt: 'Which support is most helpful?',
    options: [
      'Use visuals, gestures, and short modeled steps.',
      'Speak much faster so the lesson finishes on time.',
      'Remove the student from science until language skills improve.',
      'Only ask yes-or-no questions during class.',
    ],
    correctAnswer: 0,
    explanation:
      'Visuals, gestures, and modeling make content more accessible without lowering the learning goal.',
    tags: ['multilingual-learners', 'visual-support', 'access'],
  }),
  makeQuestion({
    id: 'inst-008',
    section: 'instructional-support',
    topic: 'safety',
    difficulty: 'foundation',
    scenario:
      'A student quietly tells a paraeducator that another student has been threatening to hurt him after school.',
    prompt: 'What should the paraeducator do first?',
    options: [
      'Promise to keep it secret so the student keeps trusting adults.',
      'Take the concern seriously and report it immediately to the appropriate school staff.',
      'Tell the student to solve the problem independently.',
      'Wait a few days to see whether the threat continues.',
    ],
    correctAnswer: 1,
    explanation:
      'Safety concerns require prompt reporting to the appropriate staff. A promise of secrecy would be inappropriate.',
    tags: ['student-safety', 'reporting', 'professional-responsibility'],
  }),
  makeQuestion({
    id: 'inst-009',
    section: 'instructional-support',
    topic: 'wait time',
    difficulty: 'foundation',
    scenario:
      'A paraeducator asks a student how she solved a problem and starts to answer for her after only one second of silence.',
    prompt: 'Why is more wait time important?',
    options: [
      'It gives the student time to think and respond independently.',
      'It makes the lesson shorter.',
      'It allows the paraeducator to avoid eye contact.',
      'It guarantees the student will always answer correctly.',
    ],
    correctAnswer: 0,
    explanation:
      'Wait time supports processing and encourages students to respond in their own words.',
    tags: ['wait-time', 'student-independence'],
  }),
  makeQuestion({
    id: 'inst-010',
    section: 'instructional-support',
    topic: 'teacher communication',
    difficulty: 'core',
    scenario:
      'After a reading group, the paraeducator noticed one student could decode words accurately but struggled to explain what the paragraph meant.',
    prompt: 'What is the best way to share this information?',
    options: [
      'Report the specific observation to the teacher soon after the lesson.',
      'Wait until the end of the school year to mention it.',
      'Post the concern in a public family group chat.',
      'Discuss the student with unrelated staff in the hallway.',
    ],
    correctAnswer: 0,
    explanation:
      'Specific and timely communication helps the teacher plan next steps while protecting professionalism.',
    tags: ['teacher-communication', 'observations', 'reading-support'],
  }),
  makeQuestion({
    id: 'inst-011',
    section: 'instructional-support',
    topic: 'independence',
    difficulty: 'core',
    scenario:
      'A student asks for help on every step of a worksheet even though she can usually complete the first problem after one prompt.',
    prompt: 'Which response best promotes independence?',
    options: [
      'Do the first four problems for the student.',
      'Give one prompt, then ask the student to try the next step alone.',
      'Tell the student she should already know how to do the work.',
      'Take the worksheet away if the student keeps asking for help.',
    ],
    correctAnswer: 1,
    explanation:
      'A prompt followed by a chance to work independently supports growth without removing needed support.',
    tags: ['independence', 'prompting', 'scaffolding'],
  }),
  makeQuestion({
    id: 'inst-012',
    section: 'instructional-support',
    topic: 'assistive technology',
    difficulty: 'stretch',
    scenario:
      'A student uses text-to-speech software during writing assignments and becomes upset when a substitute asks him to put away his headphones.',
    prompt: 'What should the paraeducator do?',
    options: [
      'Support the approved tool and explain its role to the substitute or teacher as appropriate.',
      'Remove the headphones immediately because they look different from what others use.',
      'Tell the student to skip the assignment.',
      'Ignore the student’s frustration and walk away.',
    ],
    correctAnswer: 0,
    explanation:
      'Approved assistive tools should be supported consistently so the student can access the task.',
    tags: ['assistive-technology', 'access', 'accommodations'],
  }),
  makeQuestion({
    id: 'inst-013',
    section: 'instructional-support',
    topic: 'feedback',
    difficulty: 'core',
    scenario: 'A student completes a diagram but labels two parts incorrectly.',
    prompt: 'Which feedback is most effective?',
    options: [
      'This is all wrong.',
      'Try again later.',
      'You correctly identified the stem. Recheck the labels for the roots and leaves.',
      'You always rush through science work.',
    ],
    correctAnswer: 2,
    explanation:
      'Specific feedback points out what is correct and where the student should focus next.',
    tags: ['feedback', 'instructional-support', 'science'],
  }),
  makeQuestion({
    id: 'inst-014',
    section: 'instructional-support',
    topic: 'assessment support',
    difficulty: 'core',
    scenario:
      'During a classroom quiz, a student whispers, "Is this answer right?" to the paraeducator.',
    prompt: 'What is the most appropriate response?',
    options: [
      'Point to the correct answer choice.',
      'Read the question again if allowed and encourage the student to do his own thinking.',
      'Tell the student which two answers to eliminate.',
      'Skip the question and complete it for the student after the quiz.',
    ],
    correctAnswer: 1,
    explanation:
      'During an assessment, support should follow classroom rules and preserve the student’s independent work.',
    tags: ['assessment', 'boundaries', 'support'],
  }),
  makeQuestion({
    id: 'inst-015',
    section: 'instructional-support',
    topic: 'de-escalation',
    difficulty: 'stretch',
    scenario:
      'A frustrated student crumples a paper and says, "I can’t do any of this."',
    prompt: 'Which action is most helpful?',
    options: [
      'Respond calmly, acknowledge the frustration, and offer a manageable next step.',
      'Argue that the work is easy and the student is overreacting.',
      'Send the student out immediately without speaking.',
      'Finish the entire task so the student can calm down.',
    ],
    correctAnswer: 0,
    explanation:
      'Calm acknowledgement plus one manageable step helps reduce emotion and restore progress.',
    tags: ['de-escalation', 'student-support', 'behavior'],
  }),
  makeQuestion({
    id: 'inst-016',
    section: 'instructional-support',
    topic: 'family communication boundaries',
    difficulty: 'stretch',
    scenario:
      'At dismissal, a family member asks the paraeducator whether a student will be moved to a different reading group next month.',
    prompt: 'What should the paraeducator do?',
    options: [
      'Share the probable placement because the family member seems concerned.',
      'Explain that instructional placement questions should be discussed with the teacher or designated staff member.',
      'Promise to text the family member later with more details.',
      'Guess at the answer based on what happened in class that week.',
    ],
    correctAnswer: 1,
    explanation:
      'Placement decisions should be handled through the teacher or designated staff so communication stays accurate and appropriate.',
    tags: ['family-communication', 'professional-boundaries'],
  }),
]

export const questionsById = new Map(
  questionBank.map((question) => [question.id, question])
)
