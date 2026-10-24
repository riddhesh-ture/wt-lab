// VIT Core Subjects Configuration for Semester IV
export const DEFAULT_SUBJECTS = [
  {
    code: 'BCSE301L',
    name: 'Web Technology',
    credits: 4,
    mseMarks: 26, // max 30 (30% weightage)
    eseMarks: 62  // max 70 (70% weightage)
  },
  {
    code: 'BCSE302L',
    name: 'Database Management Systems',
    credits: 4,
    mseMarks: 27,
    eseMarks: 59
  },
  {
    code: 'BCSE303L',
    name: 'Operating Systems',
    credits: 3,
    mseMarks: 24,
    eseMarks: 54
  },
  {
    code: 'BCSE304L',
    name: 'Computer Networks',
    credits: 3,
    mseMarks: 25,
    eseMarks: 58
  }
];

export const TOTAL_SEMESTER_CREDITS = DEFAULT_SUBJECTS.reduce((sum, s) => sum + s.credits, 0); // 14

/**
 * Calculates total marks for a subject out of 100
 * MSE weightage: 30% (max 30)
 * ESE weightage: 70% (max 70)
 */
export function calculateSubjectTotal(mseMarks, eseMarks) {
  const mse = Math.max(0, Math.min(30, Number(mseMarks) || 0));
  const ese = Math.max(0, Math.min(70, Number(eseMarks) || 0));
  return Math.round((mse + ese) * 10) / 10;
}

/**
 * VIT Letter Grade & Grade Points mapping:
 * 90 - 100 : S (10)
 * 80 - 89  : A (9)
 * 70 - 79  : B (8)
 * 60 - 69  : C (7)
 * 50 - 59  : D (6)
 * 40 - 49  : E (5)
 * Below 40 : F (0) - Fail
 */
export function calculateGrade(totalMarks) {
  const rounded = Math.round(totalMarks);
  if (rounded >= 90) return { grade: 'S', gradePoints: 10, label: 'Outstanding' };
  if (rounded >= 80) return { grade: 'A', gradePoints: 9, label: 'Excellent' };
  if (rounded >= 70) return { grade: 'B', gradePoints: 8, label: 'Very Good' };
  if (rounded >= 60) return { grade: 'C', gradePoints: 7, label: 'Good' };
  if (rounded >= 50) return { grade: 'D', gradePoints: 6, label: 'Fair' };
  if (rounded >= 40) return { grade: 'E', gradePoints: 5, label: 'Pass' };
  return { grade: 'F', gradePoints: 0, label: 'Fail' };
}

/**
 * Calculates overall Semester results:
 * Total Marks, Percentage, Credits, Credit Points, SGPA, and Status
 */
export function calculateSemesterResult(subjects) {
  let totalMarks = 0;
  let totalCredits = 0;
  let totalCreditPoints = 0;
  let hasFailed = false;

  const processedSubjects = subjects.map((sub) => {
    const mse = Math.max(0, Math.min(30, Number(sub.mseMarks) || 0));
    const ese = Math.max(0, Math.min(70, Number(sub.eseMarks) || 0));
    const total = calculateSubjectTotal(mse, ese);
    const { grade, gradePoints, label } = calculateGrade(total);
    const creditPoints = sub.credits * gradePoints;

    totalMarks += total;
    totalCredits += sub.credits;
    totalCreditPoints += creditPoints;

    if (grade === 'F') {
      hasFailed = true;
    }

    return {
      ...sub,
      mseMarks: mse,
      eseMarks: ese,
      totalMarks: total,
      grade,
      gradePoints,
      creditPoints,
      gradeLabel: label
    };
  });

  const percentage = Math.round((totalMarks / (processedSubjects.length * 100)) * 1000) / 10;
  const sgpa = totalCredits > 0 ? Math.round((totalCreditPoints / totalCredits) * 100) / 100 : 0;
  const resultStatus = hasFailed ? 'FAIL' : 'PASS';

  let classification;
  if (!hasFailed) {
    if (sgpa >= 8.5) classification = 'First Class with Distinction';
    else if (sgpa >= 6.5) classification = 'First Class';
    else classification = 'Second Class';
  } else {
    classification = 'Re-appear Required';
  }

  return {
    subjects: processedSubjects,
    totalMarks,
    maxMarks: processedSubjects.length * 100,
    percentage,
    totalCredits,
    totalCreditPoints,
    sgpa,
    resultStatus,
    classification
  };
}

// Sample Pre-seeded VIT Student Results
export const INITIAL_STUDENTS_REGISTRY = [
  {
    id: 'vit_21BCE1042',
    regNo: '21BCE1042',
    studentName: 'Aarav Sharma',
    program: 'B.Tech Computer Science and Engineering',
    semester: 'Semester IV',
    academicYear: '2025-2026',
    school: 'School of Computer Science and Engineering (SCOPE)',
    campus: 'VIT vishawakarma Campus',
    email: 'student@vit.edu',
    publishedDate: '15-May-2026',
    subjects: [
      { code: 'BCSE301L', name: 'Web Technology', credits: 4, mseMarks: 27, eseMarks: 64 },
      { code: 'BCSE302L', name: 'Database Management Systems', credits: 4, mseMarks: 28, eseMarks: 63 },
      { code: 'BCSE303L', name: 'Operating Systems', credits: 3, mseMarks: 25, eseMarks: 58 },
      { code: 'BCSE304L', name: 'Computer Networks', credits: 3, mseMarks: 26, eseMarks: 60 }
    ]
  },
  {
    id: 'vit_21BCE1085',
    regNo: '21BCE1085',
    studentName: 'Priya Narayanan',
    program: 'B.Tech Computer Science and Engineering',
    semester: 'Semester IV',
    academicYear: '2025-2026',
    school: 'School of Computer Science and Engineering (SCOPE)',
    campus: 'VIT vishawakarma Campus',
    email: 'priya.n2021@vitstudent.ac.in',
    publishedDate: '15-May-2026',
    subjects: [
      { code: 'BCSE301L', name: 'Web Technology', credits: 4, mseMarks: 29, eseMarks: 66 },
      { code: 'BCSE302L', name: 'Database Management Systems', credits: 4, mseMarks: 28, eseMarks: 65 },
      { code: 'BCSE303L', name: 'Operating Systems', credits: 3, mseMarks: 27, eseMarks: 62 },
      { code: 'BCSE304L', name: 'Computer Networks', credits: 3, mseMarks: 28, eseMarks: 64 }
    ]
  },
  {
    id: 'vit_21BCE1120',
    regNo: '21BCE1120',
    studentName: 'Rohan Deshmukh',
    program: 'B.Tech Computer Science and Engineering',
    semester: 'Semester IV',
    academicYear: '2025-2026',
    school: 'School of Computer Science and Engineering (SCOPE)',
    campus: 'VIT vishawakarma Campus',
    email: 'rohan.d2021@vitstudent.ac.in',
    publishedDate: '15-May-2026',
    subjects: [
      { code: 'BCSE301L', name: 'Web Technology', credits: 4, mseMarks: 22, eseMarks: 48 },
      { code: 'BCSE302L', name: 'Database Management Systems', credits: 4, mseMarks: 21, eseMarks: 45 },
      { code: 'BCSE303L', name: 'Operating Systems', credits: 3, mseMarks: 18, eseMarks: 42 },
      { code: 'BCSE304L', name: 'Computer Networks', credits: 3, mseMarks: 20, eseMarks: 46 }
    ]
  }
];

export function getStoredStudentResults() {
  try {
    const data = localStorage.getItem('vit_student_results');
    if (!data) {
      localStorage.setItem('vit_student_results', JSON.stringify(INITIAL_STUDENTS_REGISTRY));
      return INITIAL_STUDENTS_REGISTRY;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_STUDENTS_REGISTRY;
  }
}

export function saveStudentResult(studentData) {
  const current = getStoredStudentResults();
  const existingIdx = current.findIndex(
    (s) => s.regNo.toUpperCase() === studentData.regNo.toUpperCase()
  );

  let updated;
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = { ...studentData, id: current[existingIdx].id };
  } else {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mon = now.toLocaleString('en-GB', { month: 'short' });
    const yyyy = now.getFullYear();
    const newEntry = {
      ...studentData,
      id: `vit_${Date.now()}`,
      publishedDate: `${dd}-${mon}-${yyyy}`
    };
    updated = [newEntry, ...current];
  }

  localStorage.setItem('vit_student_results', JSON.stringify(updated));
  return updated;
}

export function deleteStudentResult(id) {
  const current = getStoredStudentResults();
  const filtered = current.filter((s) => s.id !== id);
  localStorage.setItem('vit_student_results', JSON.stringify(filtered));
  return filtered;
}
