import { useState, useMemo } from 'react';
import {
  getStoredStudentResults,
  deleteStudentResult,
  calculateSemesterResult
} from '../utils/resultCalculator';

export default function StudentRegistry({ onViewGradeCard, onAddNewResult }) {
  const [records, setRecords] = useState(() => getStoredStudentResults());
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
        r.regNo.toLowerCase().includes(q) ||
        r.studentName.toLowerCase().includes(q) ||
        r.program.toLowerCase().includes(q)
    );
  }, [records, searchQuery]);

  const handleDelete = (id, regNo) => {
    if (window.confirm(`Are you sure you want to remove the result record for ${regNo}?`)) {
      const updated = deleteStudentResult(id);
      setRecords(updated);
    }
  };

  return (
    <div className="registry-container">
      <div className="registry-header-bar">
        <div>
          <h2 className="registry-title">VIT Semester IV Result Registry</h2>
          <p className="registry-subtitle">
            Consolidated record of prepared semester results • Winter / Fall Session 2025-26
          </p>
        </div>

        <div className="registry-actions">
          <input
            type="text"
            className="registry-search-input"
            placeholder="🔍 Search by Reg No or Student Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {onAddNewResult && (
            <button
              type="button"
              className="btn-vit-primary sm"
              onClick={onAddNewResult}
            >
              <span>➕ Prepare New Result</span>
            </button>
          )}
        </div>
      </div>

      <div className="vit-card registry-table-card">
        <div className="table-responsive-wrapper">
          <table className="vit-marks-table registry-table">
            <thead>
              <tr>
                <th>Reg No. / PRN</th>
                <th>Student Name</th>
                <th>Programme</th>
                <th className="text-center">Total Marks</th>
                <th className="text-center">Percentage</th>
                <th className="text-center">SGPA</th>
                <th className="text-center">Outcome</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center empty-cell">
                    No student results match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const calc = calculateSemesterResult(rec.subjects);
                  return (
                    <tr key={rec.id}>
                      <td className="font-mono font-bold text-blue">{rec.regNo}</td>
                      <td className="font-medium">{rec.studentName}</td>
                      <td className="text-muted text-sm">{rec.program}</td>
                      <td className="text-center font-mono font-bold">
                        {calc.totalMarks} / 400
                      </td>
                      <td className="text-center font-mono text-cyan">
                        {calc.percentage}%
                      </td>
                      <td className="text-center font-mono font-bold text-emerald">
                        {calc.sgpa}
                      </td>
                      <td className="text-center">
                        <span className={`status-badge ${calc.resultStatus === 'PASS' ? 'pass' : 'fail'}`}>
                          {calc.resultStatus}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="row-actions">
                          <button
                            type="button"
                            className="btn-view-card"
                            onClick={() => onViewGradeCard(rec.regNo)}
                            title="View official marksheet"
                          >
                            📄 View Grade Card
                          </button>
                          <button
                            type="button"
                            className="btn-delete-record"
                            onClick={() => handleDelete(rec.id, rec.regNo)}
                            title="Remove record"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
