import React, { useRef, useState } from 'react';
import { UMLClassModel } from '../types';
import { Download, Copy, Check } from 'lucide-react';

interface DiagramBoxProps {
  model: UMLClassModel;
}

export const DiagramBox: React.FC<DiagramBoxProps> = ({ model }) => {
  const [copied, setCopied] = useState(false);
  const [svgDownloaded, setSvgDownloaded] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const { className, isAbstract, isInterface, superClass, interfaces, attributes, methods } = model;
  const displayName = className.trim() || 'ClassName';

  const copyUmlText = () => {
    let text = `+----------------------------------+\n`;
    text += `| ${displayName.padEnd(32)} |\n`;
    text += `+----------------------------------+\n`;
    attributes.forEach((a) => {
      const line = `${a.visibility}${a.name || 'attr'}:${a.type || 'type'}`;
      text += `| ${line.padEnd(32)} |\n`;
    });
    text += `+----------------------------------+\n`;
    methods.forEach((m) => {
      const line = `${m.visibility}${m.name || 'method'}(${m.parameters}):${m.returnType || 'void'}`;
      text += `| ${line.padEnd(32)} |\n`;
    });
    text += `+----------------------------------+\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSvg = () => {
    const width = 340;
    const headerHeight = 50;
    const attrItemHeight = 24;
    const methodItemHeight = 24;

    const attrSectionHeight = Math.max(30, attributes.length * attrItemHeight + 16);
    const methodSectionHeight = Math.max(30, methods.length * methodItemHeight + 16);
    const totalHeight = headerHeight + attrSectionHeight + methodSectionHeight;

    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${totalHeight}" viewBox="0 0 ${width} ${totalHeight}" style="background:#ffffff; font-family:'Courier New', Courier, monospace;">\n`;
    
    // Outer border
    svgContent += `  <rect x="2" y="2" width="${width - 4}" height="${totalHeight - 4}" fill="#ffffff" stroke="#000000" stroke-width="2.5"/>\n`;
    
    // Header divider
    svgContent += `  <line x1="2" y1="${headerHeight}" x2="${width - 2}" y2="${headerHeight}" stroke="#000000" stroke-width="2.5"/>\n`;
    svgContent += `  <text x="${width / 2}" y="${headerHeight / 2 + 6}" font-size="16" font-weight="bold" text-anchor="middle" fill="#000000">${displayName}</text>\n`;

    // Attributes divider
    const attrLineY = headerHeight + attrSectionHeight;
    svgContent += `  <line x1="2" y1="${attrLineY}" x2="${width - 2}" y2="${attrLineY}" stroke="#000000" stroke-width="2.5"/>\n`;
    
    // Attributes
    let currentY = headerHeight + 20;
    attributes.forEach((a) => {
      const text = `${a.visibility}${a.name || 'attr'}:${a.type || 'type'}`;
      svgContent += `  <text x="16" y="${currentY}" font-size="14" font-weight="600" fill="#000000">${text}</text>\n`;
      currentY += attrItemHeight;
    });

    // Methods
    currentY = attrLineY + 20;
    methods.forEach((m) => {
      const text = `${m.visibility}${m.name || 'method'}(${m.parameters}):${m.returnType || 'void'}`;
      svgContent += `  <text x="16" y="${currentY}" font-size="14" font-weight="600" fill="#000000">${text}</text>\n`;
      currentY += methodItemHeight;
    });

    svgContent += `</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${displayName}_UML.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSvgDownloaded(true);
    setTimeout(() => setSvgDownloaded(false), 2000);
  };

  return (
    <div className="diagram-container">
      <div className="diagram-header-bar">
        <div className="diagram-title-wrap">
          <span className="diagram-badge">Visual UML Diagram</span>
          <span className="diagram-subtitle">3-Tier Class Box</span>
        </div>
        <div className="diagram-actions">
          <button
            onClick={downloadSvg}
            className="diagram-icon-btn"
            title="Download diagram as high-resolution SVG image"
          >
            {svgDownloaded ? <Check size={14} className="text-emerald-500" /> : <Download size={14} />}
            <span>{svgDownloaded ? 'Downloaded' : 'Save SVG'}</span>
          </button>

          <button
            onClick={copyUmlText}
            className="diagram-icon-btn"
            title="Copy ASCII UML text format"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy UML'}</span>
          </button>
        </div>
      </div>

      {/* UML Class Box matching the user's drawing */}
      <div className="uml-canvas-wrapper">
        <div className="uml-class-card" ref={boxRef}>
          {/* Top Compartment: Class Name */}
          <div className="uml-compartment uml-name-compartment">
            {isInterface && <div className="uml-stereotype">&laquo;interface&raquo;</div>}
            {isAbstract && !isInterface && <div className="uml-stereotype">&laquo;abstract&raquo;</div>}
            <div className={`uml-class-name ${isAbstract ? 'italic' : ''}`}>
              {displayName}
            </div>
            {(superClass || interfaces) && (
              <div className="uml-inheritance-sub">
                {superClass && <span>extends {superClass}</span>}
                {superClass && interfaces && <span> | </span>}
                {interfaces && <span>implements {interfaces}</span>}
              </div>
            )}
          </div>

          {/* Middle Compartment: Attributes / Variables */}
          <div className="uml-compartment uml-attributes-compartment">
            {attributes.length === 0 ? (
              <div className="uml-empty-line">/* no attributes */</div>
            ) : (
              attributes.map((attr) => {
                const nameStr = attr.name.trim() || 'attribute';
                const typeStr = attr.type.trim() || 'type';
                return (
                  <div key={attr.id} className="uml-item-line attribute-line">
                    <span className={`uml-sign sign-${attr.visibility}`}>{attr.visibility}</span>
                    <span className="uml-item-name">{nameStr}</span>
                    <span className="uml-colon">:</span>
                    <span className="uml-item-type">{typeStr}</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Compartment: Methods */}
          <div className="uml-compartment uml-methods-compartment">
            {methods.length === 0 ? (
              <div className="uml-empty-line">/* no methods */</div>
            ) : (
              methods.map((method) => {
                const nameStr = method.name.trim() || 'method';
                const retStr = method.returnType.trim() || 'void';
                const paramStr = method.parameters.trim();
                return (
                  <div key={method.id} className="uml-item-line method-line">
                    <span className={`uml-sign sign-${method.visibility}`}>{method.visibility}</span>
                    <span className="uml-item-name">{nameStr}</span>
                    <span className="uml-parens">({paramStr})</span>
                    <span className="uml-colon">:</span>
                    <span className="uml-item-type">{retStr}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Legend for UML Visibility Signs */}
        <div className="uml-legend">
          <span className="legend-title">Legend:</span>
          <span className="legend-item"><strong className="text-emerald-500">+</strong> public</span>
          <span className="legend-item"><strong className="text-rose-500">-</strong> private</span>
          <span className="legend-item"><strong className="text-amber-500">#</strong> protected</span>
          <span className="legend-item"><strong className="text-blue-500">~</strong> package</span>
        </div>
      </div>
    </div>
  );
};
