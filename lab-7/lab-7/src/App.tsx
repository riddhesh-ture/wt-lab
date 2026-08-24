import React, { useState, useEffect } from 'react';
import { UMLClassModel } from './types';
import { generateJavaCode, CodeGenOptions } from './utils/codeGenerator';
import { Navbar } from './components/Navbar';
import { BuilderForm } from './components/BuilderForm';
import { DiagramBox } from './components/DiagramBox';
import { CodeViewer } from './components/CodeViewer';

const DEFAULT_MODEL: UMLClassModel = {
  className: 'Student',
  isAbstract: false,
  isInterface: false,
  superClass: '',
  interfaces: '',
  attributes: [
    { id: 'attr_1', visibility: '-', name: 'studid', type: 'int' },
    { id: 'attr_2', visibility: '+', name: 'name', type: 'String' },
    { id: 'attr_3', visibility: '#', name: 'age', type: 'int' },
  ],
  methods: [
    { id: 'meth_1', visibility: '+', name: 'learn', returnType: 'String', parameters: '' },
  ],
};

const EMPTY_MODEL: UMLClassModel = {
  className: 'MyClass',
  isAbstract: false,
  isInterface: false,
  superClass: '',
  interfaces: '',
  attributes: [],
  methods: [],
};

export const App: React.FC = () => {
  const [model, setModel] = useState<UMLClassModel>(DEFAULT_MODEL);
  const [autoSync, setAutoSync] = useState<boolean>(true);

  const [options, setOptions] = useState<CodeGenOptions>({
    includeConstructor: false,
    includeGettersSetters: false,
    bracketStyle: 'allman', // '{' on new line
    methodBody: 'empty',
  });

  const [generatedCode, setGeneratedCode] = useState<string>(() =>
    generateJavaCode(DEFAULT_MODEL, {
      includeConstructor: false,
      includeGettersSetters: false,
      bracketStyle: 'allman',
      methodBody: 'empty',
    })
  );

  // Auto-sync code whenever model or options change
  useEffect(() => {
    if (autoSync) {
      setGeneratedCode(generateJavaCode(model, options));
    }
  }, [model, options, autoSync]);

  const handleManualGenerate = () => {
    setGeneratedCode(generateJavaCode(model, options));
  };

  const handleReset = () => {
    setModel(JSON.parse(JSON.stringify(EMPTY_MODEL)));
  };

  return (
    <div className="app-shell">
      <Navbar onReset={handleReset} />

      <main className="main-content">
        <div className="workspace-grid">
          {/* Left Column: Form Builder */}
          <section className="column-builder">
            <BuilderForm
              model={model}
              setModel={setModel}
              onGenerate={handleManualGenerate}
              autoSync={autoSync}
              setAutoSync={setAutoSync}
            />
          </section>

          {/* Right Column: Visual Diagram & Java Code */}
          <section className="column-output">
            <div className="output-stack">
              {/* UML Class Diagram (The 3-Tier Box) */}
              <DiagramBox model={model} />

              {/* Generated Java Code */}
              <CodeViewer
                className={model.className}
                code={generatedCode}
                options={options}
                setOptions={setOptions}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
