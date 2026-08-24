import { useState, useMemo } from 'react';
import { getStoredStudentResults, calculateSemesterResult } from '../utils/resultCalculator';

export default function AnalyticsView() {
  // Read fresh from localStorage on every mount so newly saved results appear immediately
  const [records] = useState(() => getStoredStudentResults());

  const stats = useMemo(() => {
    if (!records || records.length === 0) return null;

    let totalSgpa = 0;
    let highestSgpa = 0;
    let passCount = 0;
    const gradeCounts = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };

    const subjectStats = {
      BCSE301L: { name: 'Web Technology', mseSum: 0, eseSum: 0, count: 0 },
      BCSE302L: { name: 'Database Management Systems', mseSum: 0, eseSum: 0, count: 0 },
      BCSE303L: { name: 'Operating Systems', mseSum: 0, eseSum: 0, count: 0 },
      BCSE304L: { name: 'Computer Networks', mseSum: 0, eseSum: 0, count: 0 }
    };

    records.forEach((rec) => {
      const calc = calculateSemesterResult(rec.subjects);
      totalSgpa += calc.sgpa;
      if (calc.sgpa > highestSgpa) highestSgpa = calc.sgpa;
      if (calc.resultStatus === 'PASS') passCount++;

      calc.subjects.forEach((s) => {
        if (gradeCounts[s.grade] !== undefined) {
          gradeCounts[s.grade]++;
        }
        if (subjectStats[s.code]) {
          subjectStats[s.code].mseSum += s.mseMarks;
          subjectStats[s.code].eseSum += s.eseMarks;
          subjectStats[s.code].count++;
        }
      });
    });

    const count = records.length;
    return {
      totalStudents: count,
      avgSgpa: Math.round((totalSgpa / count) * 100) / 100,
      highestSgpa,
      passPercentage: Math.round((passCount / count) * 1000) / 10,
      gradeCounts,
      subjectStats
    };
  }, [records]);

  if (!stats) {
    return <div className="empty-record-card">No records available for analytics.</div>;
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2 className="analytics-title">VIT Semester Performance Analytics</h2>
        <p className="analytics-subtitle">
          Cohort Statistics & Evaluation Breakdown • 4 Subjects (MSE 30% / ESE 70%)
        </p>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="analytics-kpi-grid">
        <div className="kpi-card">
          <span className="kpi-icon">👥</span>
          <div className="kpi-data">
            <span className="kpi-label">Students Evaluated</span>
            <span className="kpi-val font-mono">{stats.totalStudents}</span>
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-icon">🎯</span>
          <div className="kpi-data">
            <span className="kpi-label">Class Average SGPA</span>
            <span className="kpi-val font-mono text-cyan">{stats.avgSgpa} / 10</span>
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-icon">🏆</span>
          <div className="kpi-data">
            <span className="kpi-label">Highest SGPA</span>
            <span className="kpi-val font-mono text-emerald">{stats.highestSgpa} / 10</span>
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-icon">✅</span>
          <div className="kpi-data">
            <span className="kpi-label">Pass Percentage</span>
            <span className="kpi-val font-mono text-blue">{stats.passPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Grid: Subject Performance & Grade Distribution */}
      <div className="analytics-split-grid">
        {/* Subject-Wise Mean Analysis */}
        <div className="vit-card chart-card">
          <h3 className="section-heading">
            <span>📊</span> Course-Wise Average Performance (MSE vs ESE)
          </h3>
          <div className="subject-bars-list">
            {Object.entries(stats.subjectStats).map(([code, sub]) => {
              const count = sub.count || 1;
              const avgMse = Math.round((sub.mseSum / count) * 10) / 10;
              const avgEse = Math.round((sub.eseSum / count) * 10) / 10;
              const avgTotal = Math.round((avgMse + avgEse) * 10) / 10;
              const pct = Math.min(100, Math.round(avgTotal));

              return (
                <div key={code} className="sub-perf-row">
                  <div className="sub-perf-meta">
                    <span className="font-mono font-bold text-blue">{code}</span>
                    <span className="sub-perf-name">{sub.name}</span>
                    <span className="sub-perf-totals font-mono">
                      MSE: <strong>{avgMse}</strong>/30 • ESE: <strong>{avgEse}</strong>/70 • Total: <strong>{avgTotal}</strong>/100
                    </span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="vit-card chart-card">
          <h3 className="section-heading">
            <span>📈</span> Grade Distribution Spectrum
          </h3>
          <div className="grade-spectrum-grid">
            {Object.entries(stats.gradeCounts).map(([grade, count]) => (
              <div key={grade} className="spectrum-slot">
                <span className={`spectrum-chip grade-${grade}`}>{grade}</span>
                <span className="spectrum-count font-mono">{count}</span>
                <span className="spectrum-label">
                  {grade === 'S' ? '>=90' : grade === 'A' ? '80-89' : grade === 'B' ? '70-79' : grade === 'C' ? '60-69' : grade === 'D' ? '50-59' : grade === 'E' ? '40-49' : '<40'}
                </span>
              </div>
            ))}
          </div>

          <div className="weightage-note-box">
            <h4>⚖️ VIT Assessment Formula</h4>
            <p>
              Final Subject Marks = <code>MSE (out of 30) + ESE (out of 70)</code>.
              SGPA is computed by dividing Total Credit Points by 14 registered credits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
