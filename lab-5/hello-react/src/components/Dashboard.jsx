import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import MarksEntryForm from './MarksEntryForm';
import GradeCard from './GradeCard';
import StudentRegistry from './StudentRegistry';
import AnalyticsView from './AnalyticsView';
import CurriculumView from './CurriculumView';

export default function Dashboard({ activeTab, setActiveTab }) {
  const { user } = useAuth();
  const [selectedRegNo, setSelectedRegNo] = useState(user?.regNo || '21BCE1042');

  // Keep selectedRegNo in sync if the logged-in student changes
  useEffect(() => {
    if (user?.regNo) setSelectedRegNo(user.regNo);
  }, [user?.regNo]);

  const handleViewGradeCard = (regNo) => {
    if (regNo) {
      setSelectedRegNo(regNo);
    }
    setActiveTab('gradeCard');
  };

  return (
    <div className="vit-portal-dashboard">
      {/* Top Academic Notification Banner */}
      <div className="academic-alert-strip no-print">
        <div className="alert-strip-left">
          <span className="live-bullet"></span>
          <span className="alert-bold">EXAM CELL NOTICE:</span>
          <span>
            Semester IV Continuous Assessment (MSE 30%) and End-Semester (ESE 70%) results are finalized for publication.
          </span>
        </div>
        <div className="alert-strip-right">
          <span className="academic-term-tag">Winter/Fall 2025-26</span>
        </div>
      </div>

      {/* Main Tab Render */}
      <div className="dashboard-view-wrapper">
        {/* FACULTY SPECIFIC VIEWS */}
        {user.role === 'Faculty' && (
          <>
            {activeTab === 'entry' && (
              <MarksEntryForm
                onResultSaved={(data) => setSelectedRegNo(data.regNo)}
                onViewGradeCard={handleViewGradeCard}
              />
            )}

            {activeTab === 'registry' && (
              <StudentRegistry
                onViewGradeCard={handleViewGradeCard}
                onAddNewResult={() => setActiveTab('entry')}
              />
            )}

            {activeTab === 'analytics' && <AnalyticsView />}

            {activeTab === 'gradeCard' && (
              <GradeCard
                regNo={selectedRegNo}
                onBack={() => setActiveTab('registry')}
              />
            )}
          </>
        )}

        {/* STUDENT SPECIFIC VIEWS */}
        {user.role === 'Student' && (
          <>
            {activeTab === 'gradeCard' && (
              <GradeCard regNo={user?.regNo} />
            )}

            {activeTab === 'curriculum' && (
              <CurriculumView onViewGradeCard={() => setActiveTab('gradeCard')} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
