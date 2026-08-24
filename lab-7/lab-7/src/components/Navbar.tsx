import React from 'react';
import { Layers, RotateCcw } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset }) => {
  return (
    <header className="app-navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="nav-logo">
            <Layers size={22} className="text-indigo-400" />
          </div>
          <div>
            <div className="nav-title-row">
              <h1 className="nav-title">UML Class Diagram &amp; Java Code Generator</h1>
              <span className="badge-lab">Lab-7</span>
            </div>
            <p className="nav-subtitle">Interactive Visual UML Modeling &amp; Java Code Export</p>
          </div>
        </div>

        <div className="nav-actions">
          <button
            onClick={onReset}
            className="btn-nav-outline"
            title="Reset to default template"
          >
            <RotateCcw size={15} />
            <span>Reset Diagram</span>
          </button>
        </div>
      </div>
    </header>
  );
};
