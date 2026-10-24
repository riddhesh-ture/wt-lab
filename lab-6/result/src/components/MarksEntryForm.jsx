import { useState, useMemo } from 'react';
import {
  DEFAULT_SUBJECTS,
  calculateSemesterResult,
  saveStudentResult
} from '../utils/resultCalculator';

export default function MarksEntryForm({ onResultSaved, onViewGradeCard }) {
  const [studentInfo, setStudentInfo] = useState({
    regNo: '21BCE1042',
    studentName: 'Aarav Sharma',
    program: 'B.Tech Computer Science and Engineering',
    semester: 'Semester IV',
    academicYear: '2025-2026',
    school: 'School of Computer Science and Engineering (SCOPE)',
    campus: 'VIT vishawakarma Campus'
  });

  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Live real-time calculations
  const resultSummary = useMemo(() => {
    return calculateSemesterResult(subjects);
  }, [subjects]);

  const handleMarksChange = (index, field, value) => {
    const numVal = value === '' ? '' : Math.max(0, Number(value));
    setSubjects((prev) => {
      const updated = [...prev];
      const max = field === 'mseMarks' ? 30 : 70;
      const validVal = numVal === '' ? 0 : Math.min(max, numVal);
      updated[index] = { ...updated[index], [field]: validVal };
      return updated;
    });
    setSaveSuccess('');
  };

  const handleStudentInfoChange = (field, val) => {
    setStudentInfo((prev) => ({ ...prev, [field]: val }));
    setSaveSuccess('');
  };

  const handleSaveResult = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!studentInfo.regNo.trim() || !studentInfo.studentName.trim()) {
      setErrorMessage('Please provide student registration number and name.');
      return;
    }

    const payload = {
      ...studentInfo,
      subjects: resultSummary.subjects,
      totalMarks: resultSummary.totalMarks,
      percentage: resultSummary.percentage,
      sgpa: resultSummary.sgpa,
      resultStatus: resultSummary.resultStatus,
      classification: resultSummary.classification
    };

    saveStudentResult(payload);
    setSaveSuccess(`Result for ${studentInfo.regNo} (${studentInfo.studentName}) prepared and published!`);

    if (onResultSaved) {
      onResultSaved(payload);
    }
  };

  const loadPreset = (type) => {
    if (type === 'distinction') {
      setStudentInfo({
        regNo: '21BCE1085',
        studentName: 'Priya Narayanan',
        program: 'B.Tech Computer Science and Engineering',
        semester: 'Semester IV',
        academicYear: '2025-2026',
        school: 'School of Computer Science and Engineering (SCOPE)',
        campus: 'VIT vishawakarma Campus'
      });
      setSubjects([
        { code: 'BCSE301L', name: 'Web Technology', credits: 4, mseMarks: 29, eseMarks: 67 },
        { code: 'BCSE302L', name: 'Database Management Systems', credits: 4, mseMarks: 28, eseMarks: 65 },
        { code: 'BCSE303L', name: 'Operating Systems', credits: 3, mseMarks: 27, eseMarks: 62 },
        { code: 'BCSE304L', name: 'Computer Networks', credits: 3, mseMarks: 28, eseMarks: 64 }
      ]);
    } else if (type === 'average') {
      setStudentInfo({
        regNo: '21BCE1120',
        studentName: 'Rohan Deshmukh',
        program: 'B.Tech Computer Science and Engineering',
        semester: 'Semester IV',
        academicYear: '2025-2026',
        school: 'School of Computer Science and Engineering (SCOPE)',
        campus: 'VIT vishawakarma Campus'
      });
      setSubjects([
        { code: 'BCSE301L', name: 'Web Technology', credits: 4, mseMarks: 21, eseMarks: 49 },
        { code: 'BCSE302L', name: 'Database Management Systems', credits: 4, mseMarks: 20, eseMarks: 46 },
        { code: 'BCSE303L', name: 'Operating Systems', credits: 3, mseMarks: 19, eseMarks: 43 },
        { code: 'BCSE304L', name: 'Computer Networks', credits: 3, mseMarks: 22, eseMarks: 47 }
      ]);
    }
    setSaveSuccess('');
  };

  return (
    <div className="marks-entry-container">
      {/* Form Header */}
      <div className="entry-header-card">
        <div className="entry-title-wrap">
          <span className="entry-icon">📝</span>
          <div>
            <h2 className="entry-title">Semester Result Preparation & Calculator</h2>
            <p className="entry-subtitle">
              VIT Academic Regulation • Mid-Sem Exam (30%) + End-Sem Exam (70%)
            </p>
          </div>
        </div>

        <div className="entry-presets-bar">
          <span className="preset-label">Quick Presets:</span>
          <button
            type="button"
            className="btn-preset"
            onClick={() => loadPreset('distinction')}
          >
            ⭐ Top Scorer (S-Grade)
          </button>
          <button
            type="button"
            className="btn-preset"
            onClick={() => loadPreset('average')}
          >
            📊 Average Scorer
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="vit-alert vit-alert-success" role="alert">
          <span className="alert-icon">✅</span>
          <div className="alert-content">
            <strong>Success:</strong> {saveSuccess}
          </div>
          {onViewGradeCard && (
            <button
              type="button"
              className="btn-alert-action"
              onClick={() => onViewGradeCard(studentInfo.regNo)}
            >
              View Grade Card →
            </button>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="vit-alert vit-alert-error" role="alert">
          <span className="alert-icon">⚠️</span>
          <div className="alert-content">{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleSaveResult} className="result-entry-form">
        {/* Student Bio Metadata */}
        <div className="vit-card student-bio-card">
          <h3 className="section-heading">
            <span>👤</span> Student Identification Details
          </h3>
          <div className="bio-fields-grid">
            <div className="bio-group">
              <label htmlFor="student-regno">Registration No. / PRN *</label>
              <input
                id="student-regno"
                type="text"
                placeholder="e.g. 21BCE1042"
                value={studentInfo.regNo}
                onChange={(e) => handleStudentInfoChange('regNo', e.target.value.toUpperCase())}
                required
              />
            </div>

            <div className="bio-group">
              <label htmlFor="student-name">Student Full Name *</label>
              <input
                id="student-name"
                type="text"
                placeholder="e.g. Aarav Sharma"
                value={studentInfo.studentName}
                onChange={(e) => handleStudentInfoChange('studentName', e.target.value)}
                required
              />
            </div>

            <div className="bio-group">
              <label htmlFor="student-program">Degree & Branch</label>
              <input
                id="student-program"
                type="text"
                value={studentInfo.program}
                onChange={(e) => handleStudentInfoChange('program', e.target.value)}
              />
            </div>

            <div className="bio-group">
              <label htmlFor="student-semester">Semester</label>
              <input
                id="student-semester"
                type="text"
                value={studentInfo.semester}
                onChange={(e) => handleStudentInfoChange('semester', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 4 Subjects Marks Entry Table */}
        <div className="vit-card marks-table-card">
          <div className="table-header-strip">
            <h3 className="section-heading">
              <span>📚</span> Four Core Course Evaluation (MSE 30% + ESE 70%)
            </h3>
            <div className="weightage-tags">
              <span className="weight-tag mse">MSE: Max 30 (30%)</span>
              <span className="weight-tag ese">ESE: Max 70 (70%)</span>
              <span className="weight-tag total">Total: Max 100</span>
            </div>
          </div>

          <div className="table-responsive-wrapper">
            <table className="vit-marks-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th className="text-center">Credits</th>
                  <th className="text-center">MSE (30%)</th>
                  <th className="text-center">ESE (70%)</th>
                  <th className="text-center">Total (100)</th>
                  <th className="text-center">Grade</th>
                  <th className="text-center">GP</th>
                  <th className="text-center">Credit Pts</th>
                </tr>
              </thead>
              <tbody>
                {resultSummary.subjects.map((sub, idx) => (
                  <tr key={sub.code}>
                    <td className="font-mono font-bold text-blue">{sub.code}</td>
                    <td className="font-medium">{sub.name}</td>
                    <td className="text-center font-mono">{sub.credits}</td>
                    <td className="text-center">
                      <div className="mark-input-wrap">
                        <input
                          type="number"
                          min="0"
                          max="30"
                          step="0.5"
                          className="mark-input"
                          value={subjects[idx].mseMarks}
                          onChange={(e) => handleMarksChange(idx, 'mseMarks', e.target.value)}
                          aria-label={`MSE marks for ${sub.name}`}
                          required
                        />
                        <span className="mark-max">/30</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="mark-input-wrap">
                        <input
                          type="number"
                          min="0"
                          max="70"
                          step="0.5"
                          className="mark-input"
                          value={subjects[idx].eseMarks}
                          onChange={(e) => handleMarksChange(idx, 'eseMarks', e.target.value)}
                          aria-label={`ESE marks for ${sub.name}`}
                          required
                        />
                        <span className="mark-max">/70</span>
                      </div>
                    </td>
                    <td className="text-center font-mono font-bold score-cell">
                      {sub.totalMarks}
                    </td>
                    <td className="text-center">
                      <span className={`grade-chip grade-${sub.grade}`}>
                        {sub.grade}
                      </span>
                    </td>
                    <td className="text-center font-mono">{sub.gradePoints}</td>
                    <td className="text-center font-mono font-bold text-accent">
                      {sub.creditPoints}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Live Real-time Score Ribbon */}
          <div className="live-summary-ribbon">
            <div className="summary-stat-box">
              <span className="summary-label">Total Marks</span>
              <span className="summary-val font-mono">
                {resultSummary.totalMarks} <span className="sub-val">/ 400</span>
              </span>
            </div>

            <div className="summary-stat-box">
              <span className="summary-label">Percentage</span>
              <span className="summary-val font-mono text-cyan">
                {resultSummary.percentage}%
              </span>
            </div>

            <div className="summary-stat-box">
              <span className="summary-label">Total Credits</span>
              <span className="summary-val font-mono">
                {resultSummary.totalCredits}
              </span>
            </div>

            <div className="summary-stat-box highlight-sgpa">
              <span className="summary-label">Semester SGPA</span>
              <span className="summary-val font-mono text-emerald">
                {resultSummary.sgpa} <span className="sub-val">/ 10.00</span>
              </span>
            </div>

            <div className="summary-stat-box">
              <span className="summary-label">Result Status</span>
              <span className={`status-badge ${resultSummary.resultStatus === 'PASS' ? 'pass' : 'fail'}`}>
                {resultSummary.resultStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-submit-row">
          <button type="submit" className="btn-vit-primary">
            <span>💾 Save & Publish Semester Result</span>
          </button>
          {onViewGradeCard && (
            <button
              type="button"
              className="btn-vit-secondary"
              onClick={() => onViewGradeCard(studentInfo.regNo)}
            >
              <span>📄 View Official Grade Card</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
