export class DataSheet {
  date: number;
  monthName: string;
  subjectName: string;
  dayName: string;
  time: string;

  constructor(
    date: number,
    monthName: string,
    subjectName: string,
    dayName: string,
    time: string
  ) {
    this.date = date;
    this.monthName = monthName;
    this.subjectName = subjectName;
    this.dayName = dayName;
    this.time = time;
  }
}

export const dateSheet: DataSheet[] = [
  new DataSheet(11, "JAN", "Computer Science", "Monday", "9:00am"),
  new DataSheet(12, "JAN", "Biology", "Tuesday", "10:00am"),
  new DataSheet(13, "JAN", "Chemistry", "Wednesday", "9:30am"),
  new DataSheet(14, "JAN", "Physics", "Thursday", "11:00am"),
  new DataSheet(15, "JAN", "Mathematics", "Friday", "9:00am"),
  new DataSheet(16, "JAN", "Urdu", "Saturday", "11:00am"),
];
