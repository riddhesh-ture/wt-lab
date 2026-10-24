import { useState, useEffect, useMemo } from 'react';
import { calculateSemesterResult, getStoredStudentResults } from '../utils/resultCalculator';

export default function GradeCard({ regNo, onBack }) {
  // Use state so the grade card re-reads localStorage whenever regNo changes
  // (e.g. Faculty saves a result then immediately clicks "View Grade Card")
  const [studentRecord, setStudentRecord] = useState(() => {
    const records = getStoredStudentResults();
    if (regNo) {
      const found = records.find((r) => r.regNo.toUpperCase() === regNo.toUpperCase());
      if (found) return found;
    }
    return records[0] ?? null;
  });

  useEffect(() => {
    const records = getStoredStudentResults();
    if (regNo) {
      const found = records.find((r) => r.regNo.toUpperCase() === regNo.toUpperCase());
      setStudentRecord(found ?? records[0] ?? null);
    } else {
      setStudentRecord(records[0] ?? null);
    }
  }, [regNo]);

  const resultSummary = useMemo(() => {
    if (!studentRecord || !studentRecord.subjects) return null;
    return calculateSemesterResult(studentRecord.subjects);
  }, [studentRecord]);

  const handlePrint = () => {
    window.print();
  };

  if (!studentRecord || !resultSummary) {
    return (
      <div className="empty-record-card">
        <h3>No Student Result Found</h3>
        <p>No semester results have been prepared for this registration number yet.</p>
        {onBack && (
          <button type="button" className="btn-vit-secondary" onClick={onBack}>
            ← Back to Marks Entry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grade-card-page">
      {/* Action Bar (Hidden in Print) */}
      <div className="grade-card-actions-bar no-print">
        {onBack && (
          <button type="button" className="btn-action-back" onClick={onBack}>
            ← Back to Portal
          </button>
        )}
        <div className="actions-right">
          <span className="print-hint">Tip: Use landscape or portrait A4 for printing</span>
          <button type="button" className="btn-print-card" onClick={handlePrint}>
            <span>🖨️ Print / Download Marksheet (PDF)</span>
          </button>
        </div>
      </div>

      {/* Official Printable Grade Card Container */}
      <div className="official-grade-sheet" id="printable-grade-sheet">
        {/* Decorative Institutional Header */}
        <header className="grade-sheet-header">
          <div className="institution-crest">
            <span className="crest-logo">🏛️</span>
          </div>
          <div className="institution-titles">
            <h1 className="inst-name">vishawakarma INSTITUTE OF TECHNOLOGY</h1>
            <h2 className="inst-sub">Deemed to be University under Section 3 of UGC Act, 1956</h2>
            <h3 className="inst-dept">OFFICE OF THE CONTROLLER OF EXAMINATIONS</h3>
            <div className="report-title-pill">
              SEMESTER GRADE REPORT • ACADEMIC YEAR {studentRecord.academicYear || '2025-2026'}
            </div>
          </div>
          <div className="institution-qr">
            <div className="qr-box">
              <span className="qr-text">VERIFIED</span>
              <span className="qr-code-icon">🏁</span>
              <span className="qr-id font-mono">{studentRecord.regNo}</span>
            </div>
          </div>
        </header>

        <div className="watermark-overlay">VIT RESULT</div>

        {/* Student Identification Details Table */}
        <section className="student-metadata-section">
          <div className="meta-grid">
            <div className="meta-cell">
              <span className="meta-k">Register Number / PRN:</span>
              <span className="meta-v font-mono font-bold text-blue">{studentRecord.regNo}</span>
            </div>
            <div className="meta-cell">
              <span className="meta-k">Student Name:</span>
              <span className="meta-v font-bold">{studentRecord.studentName}</span>
            </div>
            <div className="meta-cell">
              <span className="meta-k">Programme & Branch:</span>
              <span className="meta-v">{studentRecord.program}</span>
            </div>
            <div className="meta-cell">
              <span className="meta-k">School:</span>
              <span className="meta-v">{studentRecord.school || 'School of Computer Science and Engineering (SCOPE)'}</span>
            </div>
            <div className="meta-cell">
              <span className="meta-k">Semester / Session:</span>
              <span className="meta-v font-bold">{studentRecord.semester} (Winter / Fall Session)</span>
            </div>
            <div className="meta-cell">
              <span className="meta-k">Result Publication Date:</span>
              <span className="meta-v">{studentRecord.publishedDate || '15-May-2026'}</span>
            </div>
          </div>
        </section>

        {/* Tabular Statement of Marks */}
        <section className="marks-statement-section">
          <table className="grade-statement-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>S.No</th>
                <th style={{ width: '110px' }}>Course Code</th>
                <th>Course Title</th>
                <th className="text-center" style={{ width: '60px' }}>Credits</th>
                <th className="text-center" style={{ width: '90px' }}>MSE (30%)</th>
                <th className="text-center" style={{ width: '90px' }}>ESE (70%)</th>
                <th className="text-center" style={{ width: '90px' }}>Total (100)</th>
                <th className="text-center" style={{ width: '60px' }}>Grade</th>
                <th className="text-center" style={{ width: '50px' }}>GP</th>
                <th className="text-center" style={{ width: '80px' }}>Credit Pts</th>
                <th className="text-center" style={{ width: '70px' }}>Result</th>
              </tr>
            </thead>
            <tbody>
              {resultSummary.subjects.map((sub, index) => (
                <tr key={sub.code}>
                  <td className="text-center font-mono">{index + 1}</td>
                  <td className="font-mono font-bold text-blue">{sub.code}</td>
                  <td className="font-medium">{sub.name}</td>
                  <td className="text-center font-mono">{sub.credits}</td>
                  <td className="text-center font-mono">{sub.mseMarks}</td>
                  <td className="text-center font-mono">{sub.eseMarks}</td>
                  <td className="text-center font-mono font-bold">{sub.totalMarks}</td>
                  <td className="text-center">
                    <span className={`official-grade grade-${sub.grade}`}>
                      {sub.grade}
                    </span>
                  </td>
                  <td className="text-center font-mono">{sub.gradePoints}</td>
                  <td className="text-center font-mono font-bold">{sub.creditPoints}</td>
                  <td className="text-center">
                    <span className={sub.grade === 'F' ? 'text-fail font-bold' : 'text-pass font-bold'}>
                      {sub.grade === 'F' ? 'FAIL' : 'PASS'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="tfoot-totals">
                <td colSpan="3" className="text-right font-bold">Semester Totals:</td>
                <td className="text-center font-mono font-bold">{resultSummary.totalCredits}</td>
                <td colSpan="2" className="text-right text-muted font-bold">Marks Scored:</td>
                <td className="text-center font-mono font-bold text-blue">{resultSummary.totalMarks} / 400</td>
                <td colSpan="2" className="text-right font-bold">Total Pts:</td>
                <td className="text-center font-mono font-bold">{resultSummary.totalCreditPoints}</td>
                <td className={`text-center font-bold ${resultSummary.resultStatus === 'PASS' ? 'text-pass' : 'text-fail'}`}>
                  {resultSummary.resultStatus}
                </td>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* Results Summary Box */}
        <section className="grade-summary-box">
          <div className="summary-col">
            <span className="sum-label">Credits Registered</span>
            <span className="sum-val font-mono">{resultSummary.totalCredits}</span>
          </div>
          <div className="summary-col">
            <span className="sum-label">Credits Earned</span>
            <span className="sum-val font-mono">
              {resultSummary.resultStatus === 'PASS' ? resultSummary.totalCredits : 'Pending'}
            </span>
          </div>
          <div className="summary-col">
            <span className="sum-label">Overall Percentage</span>
            <span className="sum-val font-mono">{resultSummary.percentage}%</span>
          </div>
          <div className="summary-col highlight-col">
            <span className="sum-label">SGPA (Scale of 10)</span>
            <span className="sum-val font-mono font-bold text-emerald">{resultSummary.sgpa}</span>
          </div>
          <div className="summary-col">
            <span className="sum-label">Final Outcome</span>
            <span className={`sum-status-tag ${resultSummary.resultStatus === 'PASS' ? 'pass' : 'fail'}`}>
              {resultSummary.resultStatus}
            </span>
          </div>
          <div className="summary-col">
            <span className="sum-label">Classification</span>
            <span className="sum-val classification-val">{resultSummary.classification}</span>
          </div>
        </section>

        {/* Grading Scale Guide */}
        <section className="grading-scale-strip">
          <span className="scale-title">VIT Grading System:</span>
          <span className="scale-item"><strong>S:</strong> 90–100 (10 GP)</span>
          <span className="scale-item"><strong>A:</strong> 80–89 (9 GP)</span>
          <span className="scale-item"><strong>B:</strong> 70–79 (8 GP)</span>
          <span className="scale-item"><strong>C:</strong> 60–69 (7 GP)</span>
          <span className="scale-item"><strong>D:</strong> 50–59 (6 GP)</span>
          <span className="scale-item"><strong>E:</strong> 40–49 (5 GP)</span>
          <span className="scale-item"><strong>F:</strong> Below 40 (0 GP - Fail)</span>
        </section>

        {/* Institutional Signatures & Verification Seal */}
        <footer className="grade-sheet-footer">
          <div className="footer-seal-block">
            <div className="official-stamp-graphic">
              <span className="stamp-inner">VIT COE SEAL</span>
            </div>
            <span className="seal-caption">Controller of Examinations Seal</span>
          </div>

          <div className="footer-sig-block">
            <div className="sig-line"></div>
            <span className="sig-name">Dr. abc</span>
            <span className="sig-title">Coordinator, Examination Cell</span>
          </div>

          <div className="footer-sig-block">
            <div className="sig-line digital-signed">
              <span className="digital-sign-tag">DIGITALLY SIGNED</span>
            </div>
            <span className="sig-name">xyz</span>
            <span className="sig-title">Controller of Examinations</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
