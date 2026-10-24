import React, { useState } from 'react';
import { Copy, Check, Download, Settings, FileCode } from 'lucide-react';
import { CodeGenOptions } from '../utils/codeGenerator';

interface CodeViewerProps {
  className: string;
  code: string;
  options: CodeGenOptions;
  setOptions: React.Dispatch<React.SetStateAction<CodeGenOptions>>;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  className,
  code,
  options,
  setOptions,
}) => {
  const [copied, setCopied] = useState(false);
  const fileName = `${className.trim() || 'MyClass'}.java`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJavaFile = () => {
    const blob = new Blob([code], { type: 'text/x-java-source;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Split lines for line numbers
  const lines = code.split('\n');

  return (
    <div className="code-viewer-card">
      {/* Code Header Bar */}
      <div className="code-header">
        <div className="code-file-badge">
          <FileCode size={16} className="text-amber-400" />
          <span className="font-mono font-medium">{fileName}</span>
        </div>

        <div className="code-actions">
          <button
            onClick={copyToClipboard}
            className={`btn-code-action ${copied ? 'btn-copied' : ''}`}
            title="Copy Java code to clipboard"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={downloadJavaFile}
            className="btn-code-action"
            title="Download .java file to your computer"
          >
            <Download size={15} />
            <span>Download .java</span>
          </button>
        </div>
      </div>

      {/* Code Options Bar */}
      <div className="code-options-bar">
        <div className="options-title">
          <Settings size={13} />
          <span>Options:</span>
        </div>

        <label className="option-label">
          <input
            type="checkbox"
            checked={options.includeConstructor}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, includeConstructor: e.target.checked }))
            }
          />
          <span>Constructors</span>
        </label>

        <label className="option-label">
          <input
            type="checkbox"
            checked={options.includeGettersSetters}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, includeGettersSetters: e.target.checked }))
            }
          />
          <span>Getters &amp; Setters</span>
        </label>

        <div className="option-select-group">
          <span>Body:</span>
          <select
            value={options.methodBody}
            onChange={(e) =>
              setOptions((prev) => ({
                ...prev,
                methodBody: e.target.value as 'empty' | 'return',
              }))
            }
            className="select-style"
          >
            <option value="empty">Empty body</option>
            <option value="return">Default return</option>
          </select>
        </div>

        <div className="option-select-group">
          <span>Braces:</span>
          <select
            value={options.bracketStyle}
            onChange={(e) =>
              setOptions((prev) => ({
                ...prev,
                bracketStyle: e.target.value as 'allman' | 'kr',
              }))
            }
            className="select-style"
          >
            <option value="allman">Allman (&#123; on new line)</option>
            <option value="kr">K&amp;R (&#123; on same line)</option>
          </select>
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="code-display-wrap font-mono">
        <div className="line-numbers">
          {lines.map((_, i) => (
            <div key={i} className="line-num">{i + 1}</div>
          ))}
        </div>
        <pre className="code-content">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
