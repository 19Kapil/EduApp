interface EcaItem {
  description: string;
  instructor: string;
  time: string;
  duration: string;
  keyPoints: string;
}

export const EcaData: Record<string, EcaItem> = {
  Coding: {
    description: "Learn programming languages and solve coding challenges.",
    instructor: "John Doe",
    time: "Friday, 4:00 PM",
    duration: "1 hour",
    keyPoints: "Problem-solving skills, logic building, coding proficiency",
  },
  Robotics: {
    description: "Explore robotics concepts and build robots.",
    instructor: "Jane Smith",
    time: "Friday, 5:00 PM",
    duration: "1.5 hours",
    keyPoints: "Mechanical design, programming, teamwork",
  },
  Dance: {
    description: "Learn different dance styles and choreography.",
    instructor: "Mike Johnson",
    time: "Friday, 6:30 PM",
    duration: "1 hour",
    keyPoints: "Coordination, rhythm, self-expression",
  },
  History: {
    description: "Explore historical events and civilizations.",
    instructor: "Emily Brown",
    time: "Friday, 3:30 PM",
    duration: "1 hour",
    keyPoints: "Understanding of past events, critical thinking",
  },
  Music: {
    description: "Learn to play musical instruments and read music sheets.",
    instructor: "David Wilson",
    time: "Saturday, 10:00 AM",
    duration: "1.5 hours",
    keyPoints: "Music theory, instrument proficiency, ensemble playing",
  },
  Sports: {
    description: "Participate in various sports activities and tournaments.",
    instructor: "Sarah Lee",
    time: "Saturday, 2:00 PM",
    duration: "2 hours",
    keyPoints: "Physical fitness, teamwork, sportsmanship",
  },
  Drawing: {
    description: "Explore different drawing techniques and create artwork.",
    instructor: "Michael Adams",
    time: "Saturday, 4:00 PM",
    duration: "1 hour",
    keyPoints: "Sketching, shading, perspective drawing",
  },
  Chess: {
    description: "Learn chess strategies and tactics, and play chess matches.",
    instructor: "Robert Taylor",
    time: "Sunday, 3:00 PM",
    duration: "1.5 hours",
    keyPoints: "Critical thinking, strategic planning, concentration",
  },
  Drama: {
    description: "Act in theatrical plays and learn dramatic techniques.",
    instructor: "Laura Evans",
    time: "Sunday, 5:00 PM",
    duration: "2 hours",
    keyPoints: "Acting skills, improvisation, stage presence",
  },
  Cooking: {
    description:
      "Learn cooking techniques and recipes from different cuisines.",
    instructor: "Daniel Carter",
    time: "Monday, 6:00 PM",
    duration: "1.5 hours",
    keyPoints: "Culinary skills, food presentation, nutrition knowledge",
  },
};
