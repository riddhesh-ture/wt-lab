import React from 'react';
import { UMLClassModel, AttributeItem, MethodItem, Visibility } from '../types';
import { Plus, Trash2, Code2 } from 'lucide-react';

interface BuilderFormProps {
  model: UMLClassModel;
  setModel: React.Dispatch<React.SetStateAction<UMLClassModel>>;
  onGenerate: () => void;
  autoSync: boolean;
  setAutoSync: (val: boolean) => void;
}

const COMMON_TYPES = ['int', 'String', 'boolean', 'double', 'float', 'char', 'long', 'void'];

export const BuilderForm: React.FC<BuilderFormProps> = ({
  model,
  setModel,
  onGenerate,
  autoSync,
  setAutoSync,
}) => {
  // Update class name
  const handleClassNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModel((prev) => ({ ...prev, className: e.target.value }));
  };

  // Attributes operations
  const addAttribute = () => {
    const newAttr: AttributeItem = {
      id: 'attr_' + Date.now() + Math.random().toString(36).substr(2, 4),
      visibility: '-',
      name: '',
      type: 'String',
    };
    setModel((prev) => ({
      ...prev,
      attributes: [...prev.attributes, newAttr],
    }));
  };

  const updateAttribute = (id: string, field: keyof AttributeItem, value: any) => {
    setModel((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attr) =>
        attr.id === id ? { ...attr, [field]: value } : attr
      ),
    }));
  };

  const removeAttribute = (id: string) => {
    setModel((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((attr) => attr.id !== id),
    }));
  };

  // Methods operations
  const addMethod = () => {
    const newMethod: MethodItem = {
      id: 'meth_' + Date.now() + Math.random().toString(36).substr(2, 4),
      visibility: '+',
      name: '',
      returnType: 'void',
      parameters: '',
    };
    setModel((prev) => ({
      ...prev,
      methods: [...prev.methods, newMethod],
    }));
  };

  const updateMethod = (id: string, field: keyof MethodItem, value: any) => {
    setModel((prev) => ({
      ...prev,
      methods: prev.methods.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    }));
  };

  const removeMethod = (id: string) => {
    setModel((prev) => ({
      ...prev,
      methods: prev.methods.filter((m) => m.id !== id),
    }));
  };

  return (
    <div className="builder-container">
      {/* Top Banner */}
      <div className="builder-top-banner">
        <div>
          <h2 className="builder-title">UML Architecture Builder</h2>
          <p className="builder-desc">Configure class name, attributes, and methods. Signs map directly to Java access modifiers.</p>
        </div>
      </div>

      {/* Class Details Box */}
      <div className="form-card">
        <div className="form-group">
          <label className="form-label">
            <span>Class Name (Title in UML)</span>
            <span className="text-xs text-muted">e.g. Student, Employee</span>
          </label>
          <input
            type="text"
            className="input-text text-lg font-semibold"
            value={model.className}
            onChange={handleClassNameChange}
            placeholder="e.g. Student"
          />
        </div>

        {/* Class Type selector */}
        <div className="class-type-toggles">
          <button
            type="button"
            className={`type-chip ${!model.isAbstract && !model.isInterface ? 'active' : ''}`}
            onClick={() => setModel((prev) => ({ ...prev, isAbstract: false, isInterface: false }))}
          >
            Normal Class
          </button>
          <button
            type="button"
            className={`type-chip ${model.isAbstract ? 'active' : ''}`}
            onClick={() => setModel((prev) => ({ ...prev, isAbstract: !prev.isAbstract, isInterface: false }))}
          >
            Abstract Class
          </button>
          <button
            type="button"
            className={`type-chip ${model.isInterface ? 'active' : ''}`}
            onClick={() => setModel((prev) => ({ ...prev, isInterface: !prev.isInterface, isAbstract: false }))}
          >
            Interface
          </button>
        </div>
      </div>

      {/* Variables / Attributes Section */}
      <div className="form-card">
        <div className="section-header">
          <div>
            <h3 className="section-title">Attributes (Variables)</h3>
            <p className="section-subtitle">Format in UML: <code>&lt;sign&gt;&lt;name&gt;:&lt;type&gt;</code></p>
          </div>
          <button onClick={addAttribute} className="btn-secondary btn-sm">
            <Plus size={14} />
            <span>Add Variable</span>
          </button>
        </div>

        {model.attributes.length === 0 ? (
          <div className="empty-section-tip">
            No variables added yet. Click <strong>"+ Add Variable"</strong> to define attributes (e.g. <code>-studid:int</code>).
          </div>
        ) : (
          <div className="items-table">
            <div className="table-header-row attr-grid">
              <span>Sign</span>
              <span>Variable Name</span>
              <span>Data Type</span>
              <span></span>
            </div>

            {model.attributes.map((attr) => (
              <div key={attr.id} className="item-row attr-grid">
                {/* Sign Selector */}
                <select
                  value={attr.visibility}
                  onChange={(e) => updateAttribute(attr.id, 'visibility', e.target.value as Visibility)}
                  className={`select-sign sign-badge-${attr.visibility}`}
                  title="Choose UML Sign: - (private), + (public), # (protected), ~ (package)"
                >
                  <option value="-">- (private)</option>
                  <option value="+">+ (public)</option>
                  <option value="#"># (protected)</option>
                  <option value="~">~ (default)</option>
                </select>

                {/* Variable Name */}
                <input
                  type="text"
                  placeholder="e.g. studid"
                  value={attr.name}
                  onChange={(e) => updateAttribute(attr.id, 'name', e.target.value)}
                  className="input-text"
                />

                {/* Data Type */}
                <div className="type-input-wrap">
                  <input
                    type="text"
                    list={`type-list-${attr.id}`}
                    placeholder="e.g. int"
                    value={attr.type}
                    onChange={(e) => updateAttribute(attr.id, 'type', e.target.value)}
                    className="input-text"
                  />
                  <datalist id={`type-list-${attr.id}`}>
                    {COMMON_TYPES.map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                </div>

                {/* Delete Row */}
                <button
                  onClick={() => removeAttribute(attr.id)}
                  className="btn-delete"
                  title="Remove this variable"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Methods Section */}
      <div className="form-card">
        <div className="section-header">
          <div>
            <h3 className="section-title">Methods</h3>
            <p className="section-subtitle">Format in UML: <code>&lt;sign&gt;&lt;name&gt;(&lt;params&gt;):&lt;returnType&gt;</code></p>
          </div>
          <button onClick={addMethod} className="btn-secondary btn-sm">
            <Plus size={14} />
            <span>Add Method</span>
          </button>
        </div>

        {model.methods.length === 0 ? (
          <div className="empty-section-tip">
            No methods added yet. Click <strong>"+ Add Method"</strong> to define functions (e.g. <code>+learn():String</code>).
          </div>
        ) : (
          <div className="items-table">
            <div className="table-header-row method-grid">
              <span>Sign</span>
              <span>Method Name</span>
              <span>Parameters</span>
              <span>Return Type</span>
              <span></span>
            </div>

            {model.methods.map((m) => (
              <div key={m.id} className="item-row method-grid">
                {/* Sign Selector */}
                <select
                  value={m.visibility}
                  onChange={(e) => updateMethod(m.id, 'visibility', e.target.value as Visibility)}
                  className={`select-sign sign-badge-${m.visibility}`}
                  title="Choose UML Sign: + (public), - (private), # (protected), ~ (package)"
                >
                  <option value="+">+ (public)</option>
                  <option value="-">- (private)</option>
                  <option value="#"># (protected)</option>
                  <option value="~">~ (default)</option>
                </select>

                {/* Method Name */}
                <input
                  type="text"
                  placeholder="e.g. learn"
                  value={m.name}
                  onChange={(e) => updateMethod(m.id, 'name', e.target.value)}
                  className="input-text"
                />

                {/* Parameters */}
                <input
                  type="text"
                  placeholder="e.g. int hours (optional)"
                  value={m.parameters}
                  onChange={(e) => updateMethod(m.id, 'parameters', e.target.value)}
                  className="input-text text-sm"
                  title="Parameters in format: type name, type name"
                />

                {/* Return Type */}
                <div className="type-input-wrap">
                  <input
                    type="text"
                    list={`ret-list-${m.id}`}
                    placeholder="e.g. String"
                    value={m.returnType}
                    onChange={(e) => updateMethod(m.id, 'returnType', e.target.value)}
                    className="input-text"
                  />
                  <datalist id={`ret-list-${m.id}`}>
                    {COMMON_TYPES.map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                </div>

                {/* Delete Row */}
                <button
                  onClick={() => removeMethod(m.id)}
                  className="btn-delete"
                  title="Remove this method"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="builder-bottom-actions">
        <button onClick={onGenerate} className="btn-primary-generate">
          <Code2 size={18} />
          <span>Generate Java Code</span>
        </button>

        <label className="auto-sync-toggle">
          <input
            type="checkbox"
            checked={autoSync}
            onChange={(e) => setAutoSync(e.target.checked)}
          />
          <span>Auto-sync code while typing</span>
        </label>
      </div>
    </div>
  );
};
