const SYLLABUS_DATA = [
  {
    code: 'BCSE301L',
    name: 'Web Technology',
    credits: 4,
    faculty: 'Dr. S. K. Venkatesan',
    topics: ['HTML5 & Modern CSS3', 'JavaScript ES6+ & React 19', 'REST APIs & State Management', 'Web Security & Auth'],
    mseMax: 30,
    eseMax: 70
  },
  {
    code: 'BCSE302L',
    name: 'Database Management Systems',
    credits: 4,
    faculty: 'Dr. Meenakshi Sundaram',
    topics: ['Relational Algebra & SQL', 'Normalization (1NF to BCNF)', 'Indexing & Query Optimization', 'Transaction ACID & NoSQL'],
    mseMax: 30,
    eseMax: 70
  },
  {
    code: 'BCSE303L',
    name: 'Operating Systems',
    credits: 3,
    faculty: 'Prof. R. Ananthakrishnan',
    topics: ['Process Scheduling & IPC', 'Deadlock Detection & Avoidance', 'Virtual Memory Management', 'File Systems & Storage I/O'],
    mseMax: 30,
    eseMax: 70
  },
  {
    code: 'BCSE304L',
    name: 'Computer Networks',
    credits: 3,
    faculty: 'Dr. P. Swaminathan',
    topics: ['OSI & TCP/IP Protocol Stack', 'Data Link Framing & Flow Control', 'IP Addressing, Subnetting & Routing', 'Transport TCP/UDP & Sockets'],
    mseMax: 30,
    eseMax: 70
  }
];

export default function CurriculumView({ onViewGradeCard }) {
  const syllabusData = SYLLABUS_DATA;

  return (
    <div className="curriculum-container">
      <div className="curriculum-header">
        <div className="curriculum-title-wrap">
          <span className="curr-icon">📚</span>
          <div>
            <h2 className="curr-title">Semester IV Prescribed Curriculum</h2>
            <p className="curr-subtitle">
              School of Computer Science and Engineering (SCOPE) • 4 Core Courses (14 Credits)
            </p>
          </div>
        </div>

        {onViewGradeCard && (
          <button
            type="button"
            className="btn-vit-primary sm"
            onClick={onViewGradeCard}
          >
            📄 View My Marksheet →
          </button>
        )}
      </div>

      <div className="curriculum-cards-grid">
        {syllabusData.map((item) => (
          <div key={item.code} className="vit-card course-info-card">
            <div className="course-card-top">
              <span className="course-code-tag font-mono">{item.code}</span>
              <span className="course-credit-tag">{item.credits} Credits</span>
            </div>

            <h3 className="course-card-title">{item.name}</h3>
            <p className="course-faculty">Instructor: {item.faculty}</p>

            <div className="course-evaluation-strip">
              <div className="eval-pill">
                <span className="eval-type">Mid-Semester Exam</span>
                <span className="eval-weight font-mono">Max 30 (30%)</span>
              </div>
              <div className="eval-pill">
                <span className="eval-type">End-Semester Exam</span>
                <span className="eval-weight font-mono">Max 70 (70%)</span>
              </div>
            </div>

            <div className="topics-section">
              <span className="topics-label">Core Modules:</span>
              <ul className="topics-list">
                {item.topics.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="vit-card assessment-rules-card">
        <h3 className="section-heading">
          <span>⚖️</span> VIT Academic Regulations & Grading Norms
        </h3>
        <div className="rules-grid">
          <div className="rule-box">
            <h4>Assessment Weightage</h4>
            <p>The total marks in each course shall be calculated as: <code>Total = MSE (30%) + ESE (70%)</code>.</p>
          </div>
          <div className="rule-box">
            <h4>Minimum Passing Standard</h4>
            <p>A student must secure a minimum of 40% aggregate marks in the course to secure a passing grade (E or higher).</p>
          </div>
          <div className="rule-box">
            <h4>SGPA Computation</h4>
            <p>SGPA = <code>∑(Course Credits × Grade Points) / Total Registered Credits (14)</code>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
