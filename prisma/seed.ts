import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const questions = [
  {
    text: 'What is the capital of France?',
    options: JSON.stringify(['London', 'Paris', 'Berlin', 'Rome']),
    correctAnswer: 1,
    category: 'Geography',
    difficulty: 'easy',
    explanation: 'Paris is the capital and most populous city of France.',
  },
  {
    text: 'Who painted the Mona Lisa?',
    options: JSON.stringify(['Van Gogh', 'Picasso', 'Leonardo da Vinci', 'Michelangelo']),
    correctAnswer: 2,
    category: 'Art',
    difficulty: 'easy',
    explanation: 'The Mona Lisa was painted by Leonardo da Vinci between 1503 and 1519.',
  },
  {
    text: 'What is the chemical symbol for Gold?',
    options: JSON.stringify(['Go', 'Gd', 'Au', 'Ag']),
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'medium',
    explanation: 'Au comes from the Latin word "Aurum" meaning gold.',
  },
  {
    text: 'Which planet is known as the Red Planet?',
    options: JSON.stringify(['Venus', 'Jupiter', 'Saturn', 'Mars']),
    correctAnswer: 3,
    category: 'Science',
    difficulty: 'easy',
    explanation: 'Mars appears red due to iron oxide (rust) on its surface.',
  },
  {
    text: 'Who wrote Romeo and Juliet?',
    options: JSON.stringify(['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Homer']),
    correctAnswer: 1,
    category: 'Literature',
    difficulty: 'easy',
    explanation: 'Romeo and Juliet was written by William Shakespeare around 1594-1596.',
  },
  {
    text: 'What is the largest ocean?',
    options: JSON.stringify(['Atlantic', 'Indian', 'Arctic', 'Pacific']),
    correctAnswer: 3,
    category: 'Geography',
    difficulty: 'easy',
    explanation: 'The Pacific Ocean is the largest ocean, covering more than 30% of Earth\'s surface.',
  },
  {
    text: 'In what year did World War II end?',
    options: JSON.stringify(['1943', '1944', '1945', '1946']),
    correctAnswer: 2,
    category: 'History',
    difficulty: 'easy',
    explanation: 'World War II ended in 1945 with Germany surrendering in May and Japan in September.',
  },
  {
    text: 'What is the speed of light approximately?',
    options: JSON.stringify(['300,000 km/s', '150,000 km/s', '500,000 km/s', '1,000,000 km/s']),
    correctAnswer: 0,
    category: 'Science',
    difficulty: 'medium',
    explanation: 'The speed of light in a vacuum is approximately 299,792 km/s, often rounded to 300,000 km/s.',
  },
  {
    text: 'Which country has the largest population?',
    options: JSON.stringify(['USA', 'India', 'China', 'Russia']),
    correctAnswer: 1,
    category: 'Geography',
    difficulty: 'medium',
    explanation: 'As of 2023, India surpassed China to become the most populous country with over 1.4 billion people.',
  },
  {
    text: 'Who invented the telephone?',
    options: JSON.stringify(['Thomas Edison', 'Nikola Tesla', 'Alexander Graham Bell', 'Guglielmo Marconi']),
    correctAnswer: 2,
    category: 'History',
    difficulty: 'easy',
    explanation: 'Alexander Graham Bell is credited with inventing the telephone and receiving the first patent in 1876.',
  },
  {
    text: 'What is the smallest planet in our solar system?',
    options: JSON.stringify(['Mars', 'Mercury', 'Pluto', 'Venus']),
    correctAnswer: 1,
    category: 'Science',
    difficulty: 'medium',
    explanation: 'Mercury is the smallest planet in our solar system (Pluto is now classified as a dwarf planet).',
  },
  {
    text: 'Which element has atomic number 1?',
    options: JSON.stringify(['Helium', 'Oxygen', 'Carbon', 'Hydrogen']),
    correctAnswer: 3,
    category: 'Science',
    difficulty: 'easy',
    explanation: 'Hydrogen has atomic number 1, meaning it has one proton in its nucleus.',
  },
  {
    text: 'Who was the first President of the United States?',
    options: JSON.stringify(['Abraham Lincoln', 'Thomas Jefferson', 'George Washington', 'John Adams']),
    correctAnswer: 2,
    category: 'History',
    difficulty: 'easy',
    explanation: 'George Washington served as the first President of the United States from 1789 to 1797.',
  },
  {
    text: 'What is the longest river in the world?',
    options: JSON.stringify(['Amazon', 'Mississippi', 'Yangtze', 'Nile']),
    correctAnswer: 3,
    category: 'Geography',
    difficulty: 'medium',
    explanation: 'The Nile River in Africa is generally considered the longest river at approximately 6,650 km.',
  },
  {
    text: 'Which programming language was created by Guido van Rossum?',
    options: JSON.stringify(['Java', 'Python', 'Ruby', 'C++']),
    correctAnswer: 1,
    category: 'Technology',
    difficulty: 'medium',
    explanation: 'Python was created by Guido van Rossum and first released in 1991.',
  },
  {
    text: 'What is the powerhouse of the cell?',
    options: JSON.stringify(['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus']),
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'easy',
    explanation: 'Mitochondria are known as the powerhouse of the cell as they produce ATP through cellular respiration.',
  },
  {
    text: 'Who discovered penicillin?',
    options: JSON.stringify(['Louis Pasteur', 'Robert Koch', 'Alexander Fleming', 'Joseph Lister']),
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'medium',
    explanation: 'Alexander Fleming discovered penicillin in 1928 when he noticed mold killing bacteria in a petri dish.',
  },
  {
    text: 'What is the national animal of Australia?',
    options: JSON.stringify(['Koala', 'Emu', 'Wombat', 'Red Kangaroo']),
    correctAnswer: 3,
    category: 'General Knowledge',
    difficulty: 'medium',
    explanation: 'The Red Kangaroo is the national animal of Australia and appears on the Australian coat of arms.',
  },
  {
    text: 'Which country is known as the Land of the Rising Sun?',
    options: JSON.stringify(['China', 'South Korea', 'Japan', 'Thailand']),
    correctAnswer: 2,
    category: 'Geography',
    difficulty: 'easy',
    explanation: 'Japan is known as the Land of the Rising Sun. The Japanese name "Nihon" or "Nippon" means "sun origin".',
  },
  {
    text: 'What is 15% of 200?',
    options: JSON.stringify(['20', '25', '30', '35']),
    correctAnswer: 2,
    category: 'Mathematics',
    difficulty: 'easy',
    explanation: '15% of 200 = 0.15 × 200 = 30.',
  },
  {
    text: 'Who composed Symphony No. 5?',
    options: JSON.stringify(['Mozart', 'Bach', 'Beethoven', 'Chopin']),
    correctAnswer: 2,
    category: 'Art',
    difficulty: 'medium',
    explanation: 'Ludwig van Beethoven composed Symphony No. 5 in C minor, completed in 1808.',
  },
  {
    text: 'What does DNA stand for?',
    options: JSON.stringify(['Deoxyribonucleic Acid', 'Dinitrogen Acid', 'Dynamic Nucleic Acid', 'Dense Nucleic Arrangement']),
    correctAnswer: 0,
    category: 'Science',
    difficulty: 'medium',
    explanation: 'DNA stands for Deoxyribonucleic Acid, the molecule that carries genetic instructions.',
  },
  {
    text: 'Which gas do plants absorb during photosynthesis?',
    options: JSON.stringify(['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen']),
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'easy',
    explanation: 'Plants absorb Carbon Dioxide (CO₂) during photosynthesis and release oxygen as a byproduct.',
  },
  {
    text: 'What is the currency of Japan?',
    options: JSON.stringify(['Yuan', 'Won', 'Baht', 'Yen']),
    correctAnswer: 3,
    category: 'General Knowledge',
    difficulty: 'easy',
    explanation: 'The Japanese Yen (¥) is the official currency of Japan.',
  },
  {
    text: 'Who wrote "To Kill a Mockingbird"?',
    options: JSON.stringify(['Ernest Hemingway', 'F. Scott Fitzgerald', 'Harper Lee', 'John Steinbeck']),
    correctAnswer: 2,
    category: 'Literature',
    difficulty: 'medium',
    explanation: '"To Kill a Mockingbird" was written by Harper Lee and published in 1960.',
  },
  {
    text: 'What is the largest continent?',
    options: JSON.stringify(['Africa', 'North America', 'Antarctica', 'Asia']),
    correctAnswer: 3,
    category: 'Geography',
    difficulty: 'easy',
    explanation: 'Asia is the largest continent, covering about 44.6 million km² and home to 60% of the world\'s population.',
  },
  {
    text: 'Which planet has the most moons?',
    options: JSON.stringify(['Jupiter', 'Uranus', 'Neptune', 'Saturn']),
    correctAnswer: 3,
    category: 'Science',
    difficulty: 'hard',
    explanation: 'Saturn has the most moons with 146 confirmed moons as of 2023, surpassing Jupiter\'s count.',
  },
  {
    text: 'Who invented the World Wide Web?',
    options: JSON.stringify(['Bill Gates', 'Steve Jobs', 'Tim Berners-Lee', 'Mark Zuckerberg']),
    correctAnswer: 2,
    category: 'Technology',
    difficulty: 'medium',
    explanation: 'Tim Berners-Lee invented the World Wide Web in 1989 while working at CERN.',
  },
  {
    text: 'What is the boiling point of water at sea level?',
    options: JSON.stringify(['90°C', '95°C', '100°C', '105°C']),
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'easy',
    explanation: 'Water boils at 100°C (212°F) at standard atmospheric pressure (sea level).',
  },
  {
    text: 'In which year did man first land on the Moon?',
    options: JSON.stringify(['1965', '1967', '1969', '1971']),
    correctAnswer: 2,
    category: 'History',
    difficulty: 'easy',
    explanation: 'Apollo 11 successfully landed on the Moon on July 20, 1969, with Neil Armstrong and Buzz Aldrin.',
  },
]

async function main() {
  console.log('Seeding database with 30 questions...')

  // Clear existing questions
  await prisma.question.deleteMany()

  for (const question of questions) {
    await prisma.question.create({ data: question })
  }

  console.log(`✅ Successfully seeded ${questions.length} questions!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
