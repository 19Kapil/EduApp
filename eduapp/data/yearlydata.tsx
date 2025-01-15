interface YearlyPlanItem {
  month: string;
  task: string;
  completed: boolean;
}

interface CourseData {
  [key: string]: {
    monthlyPlan: string;
    progress: number;
    yearlyPlan: YearlyPlanItem[];
  };
}

const courseData: CourseData = {
  Math: {
    monthlyPlan: "Math Monthly Plan",
    progress: 80,
    yearlyPlan: [
      { month: "January", task: "Introduction to Algebra", completed: true },
      { month: "February", task: "Geometry Basics", completed: false },
      { month: "March", task: "Trigonometry Fundamentals", completed: true },
      { month: "April", task: "Calculus Concepts", completed: false },
      { month: "May", task: "Probability and Statistics", completed: true },
      { month: "June", task: "Number Theory", completed: false },
      { month: "July", task: "Linear Algebra Principles", completed: true },
      { month: "August", task: "Differential Equations", completed: false },
      { month: "September", task: "Mathematical Analysis", completed: true },
      { month: "October", task: "Discrete Mathematics", completed: false },
      { month: "November", task: "Applied Mathematics", completed: true },
      { month: "December", task: "Advanced Topics in Math", completed: false },
    ],
  },
  Science: {
    monthlyPlan: "Science Monthly Plan",
    progress: 90,
    yearlyPlan: [
      { month: "January", task: "Introduction to Physics", completed: true },
      { month: "February", task: "Chemistry Essentials", completed: false },
      { month: "March", task: "Biology Basics", completed: true },
      { month: "April", task: "Environmental Science", completed: false },
      { month: "May", task: "Astronomy Fundamentals", completed: true },
      { month: "June", task: "Geology Principles", completed: false },
      { month: "July", task: "Anatomy and Physiology", completed: true },
      { month: "August", task: "Ecology Studies", completed: false },
      { month: "September", task: "Microbiology Concepts", completed: true },
      { month: "October", task: "Genetics and Evolution", completed: false },
      { month: "November", task: "Biochemistry Fundamentals", completed: true },
      { month: "December", task: "Neuroscience Topics", completed: false },
    ],
  },
  English: {
    monthlyPlan: "English Monthly Plan",
    progress: 85,
    yearlyPlan: [
      {
        month: "January",
        task: "Grammar and Sentence Structure",
        completed: true,
      },
      { month: "February", task: "Literature Analysis", completed: false },
      { month: "March", task: "Writing Skills Development", completed: true },
      { month: "April", task: "Public Speaking Techniques", completed: false },
      { month: "May", task: "Creative Writing Workshop", completed: true },
      { month: "June", task: "Critical Reading Strategies", completed: false },
      { month: "July", task: "Poetry Appreciation", completed: true },
      { month: "August", task: "Drama and Theater Studies", completed: false },
      { month: "September", task: "Essay Writing Practice", completed: true },
      { month: "October", task: "Technical Writing Skills", completed: false },
      {
        month: "November",
        task: "Research Paper Preparation",
        completed: true,
      },
      {
        month: "December",
        task: "Advanced English Literature",
        completed: false,
      },
    ],
  },
  History: {
    monthlyPlan: "History Monthly Plan",
    progress: 75,
    yearlyPlan: [
      { month: "January", task: "World History Overview", completed: true },
      {
        month: "February",
        task: "American History Highlights",
        completed: false,
      },
      { month: "March", task: "Ancient Civilizations Study", completed: true },
      {
        month: "April",
        task: "European History Exploration",
        completed: false,
      },
      { month: "May", task: "Asian History Perspectives", completed: true },
      { month: "June", task: "African History Insights", completed: false },
      {
        month: "July",
        task: "Middle Eastern History Overview",
        completed: true,
      },
      {
        month: "August",
        task: "Latin American History Survey",
        completed: false,
      },
      {
        month: "September",
        task: "Australian History Examination",
        completed: true,
      },
      {
        month: "October",
        task: "Polar Regions History Analysis",
        completed: false,
      },
      { month: "November", task: "History of Exploration", completed: true },
      { month: "December", task: "Modern World History", completed: false },
    ],
  },
  Art: {
    monthlyPlan: "Art Monthly Plan",
    progress: 70,
    yearlyPlan: [
      { month: "January", task: "Drawing Techniques", completed: true },
      { month: "February", task: "Color Theory", completed: false },
      { month: "March", task: "Art History Survey", completed: true },
      { month: "April", task: "Painting Fundamentals", completed: false },
      { month: "May", task: "Sculpture Principles", completed: true },
      { month: "June", task: "Photography Basics", completed: false },
      { month: "July", task: "Graphic Design Essentials", completed: true },
      { month: "August", task: "Mixed Media Exploration", completed: false },
      { month: "September", task: "Digital Art Creation", completed: true },
      {
        month: "October",
        task: "Artistic Styles Examination",
        completed: false,
      },
      { month: "November", task: "Art Critique and Analysis", completed: true },
      { month: "December", task: "Contemporary Art Trends", completed: false },
    ],
  },

  Physics: {
    monthlyPlan: "Physics Monthly Plan",
    progress: 5,
    yearlyPlan: [
      { month: "January", task: "Mechanics and Motion", completed: true },
      { month: "February", task: "Thermodynamics Basics", completed: false },
      { month: "March", task: "Electricity and Magnetism", completed: true },
      { month: "April", task: "Optics and Waves", completed: false },
      { month: "May", task: "Nuclear Physics Concepts", completed: true },
      {
        month: "June",
        task: "Quantum Mechanics Fundamentals",
        completed: false,
      },
      { month: "July", task: "Relativity Theory", completed: true },
      { month: "August", task: "Astrophysics Principles", completed: false },
      {
        month: "September",
        task: "Particle Physics Overview",
        completed: true,
      },
      { month: "October", task: "Fluid Dynamics Study", completed: false },
      { month: "November", task: "Acoustics and Sound Waves", completed: true },
      { month: "December", task: "Plasma Physics Insights", completed: false },
    ],
  },
  Biology: {
    monthlyPlan: "Biology Monthly Plan",
    progress: 95,
    yearlyPlan: [
      { month: "January", task: "Cell Biology Fundamentals", completed: true },
      { month: "February", task: "Genetics and Heredity", completed: false },
      { month: "March", task: "Evolutionary Biology", completed: true },
      { month: "April", task: "Ecology and Ecosystems", completed: false },
      { month: "May", task: "Physiology Principles", completed: true },
      { month: "June", task: "Microbiology Concepts", completed: false },
      { month: "July", task: "Botany Basics", completed: true },
      { month: "August", task: "Zoology Fundamentals", completed: false },
      { month: "September", task: "Human Anatomy Studies", completed: true },
      { month: "October", task: "Neuroscience Topics", completed: false },
      { month: "November", task: "Immunology Insights", completed: true },
      {
        month: "December",
        task: "Biotechnology Applications",
        completed: false,
      },
    ],
  },
  Chemistry: {
    monthlyPlan: "Chemistry Monthly Plan",
    progress: 90,
    yearlyPlan: [
      { month: "January", task: "Atomic Structure", completed: true },
      { month: "February", task: "Chemical Reactions", completed: false },
      { month: "March", task: "Periodic Table and Elements", completed: true },
      { month: "April", task: "Chemical Bonding", completed: false },
      { month: "May", task: "States of Matter", completed: true },
      { month: "June", task: "Thermodynamics Principles", completed: false },
      { month: "July", task: "Electrochemistry Concepts", completed: true },
      { month: "August", task: "Organic Chemistry Basics", completed: false },
      {
        month: "September",
        task: "Inorganic Chemistry Fundamentals",
        completed: true,
      },
      {
        month: "October",
        task: "Analytical Chemistry Techniques",
        completed: false,
      },
      { month: "November", task: "Biochemistry Overview", completed: true },
      {
        month: "December",
        task: "Polymer Chemistry Insights",
        completed: false,
      },
    ],
  },
};

export { CourseData, courseData };
