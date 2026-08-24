import { UMLClassModel, Visibility } from '../types';

export interface CodeGenOptions {
  includeConstructor: boolean;
  includeGettersSetters: boolean;
  bracketStyle: 'allman' | 'kr'; // allman is { on new line as shown in professor's drawing
  methodBody: 'empty' | 'return'; // empty matches Sir's exact drawing: public String learn() { }
}

export function visibilityToJava(vis: Visibility): string {
  switch (vis) {
    case '+':
      return 'public ';
    case '-':
      return 'private ';
    case '#':
      return 'protected ';
    case '~':
      return ''; // package-private
    default:
      return 'public ';
  }
}

export function getDefaultReturnValue(type: string): string {
  const t = type.trim().toLowerCase();
  if (t === 'void') return '';
  if (t === 'int' || t === 'short' || t === 'byte' || t === 'long') return '0';
  if (t === 'float') return '0.0f';
  if (t === 'double') return '0.0';
  if (t === 'boolean') return 'false';
  if (t === 'char') return "'\\0'";
  if (t === 'string') return '""';
  return 'null';
}

export function generateJavaCode(model: UMLClassModel, options: CodeGenOptions): string {
  const { className, isAbstract, isInterface, superClass, interfaces, attributes, methods } = model;
  const name = className.trim() || 'MyClass';
  const indent = '    ';
  const isAllman = options.bracketStyle === 'allman';

  const classOpenBrace = isAllman ? '\n{\n' : ' {\n';
  const blockOpenBrace = isAllman ? '\n' + indent + '{\n' : ' {\n';

  let code = '';

  // Class / Interface declaration
  let decl = 'public ';
  if (isInterface) {
    decl += `interface ${name}`;
  } else {
    if (isAbstract) decl += 'abstract ';
    decl += `class ${name}`;
  }

  if (superClass.trim() && !isInterface) {
    decl += ` extends ${superClass.trim()}`;
  }

  if (interfaces.trim()) {
    decl += isInterface ? ` extends ${interfaces.trim()}` : ` implements ${interfaces.trim()}`;
  }

  code += decl + classOpenBrace;

  // Attributes / Fields
  if (attributes.length > 0) {
    attributes.forEach((attr) => {
      const fieldName = attr.name.trim();
      const fieldType = attr.type.trim() || 'String';
      if (fieldName) {
        const vis = visibilityToJava(attr.visibility);
        code += `${indent}${vis}${fieldType} ${fieldName};\n`;
      }
    });
    code += '\n';
  }

  // Constructor (if requested and not an interface)
  if (!isInterface && options.includeConstructor) {
    // Default constructor
    code += `${indent}public ${name}()${isAllman ? '\n' + indent + '{\n' : ' {\n'}`;
    code += `${indent}}\n\n`;

    // Parameterized constructor if attributes exist
    if (attributes.length > 0) {
      const params = attributes
        .filter((a) => a.name.trim())
        .map((a) => `${a.type.trim() || 'String'} ${a.name.trim()}`)
        .join(', ');

      code += `${indent}public ${name}(${params})${isAllman ? '\n' + indent + '{\n' : ' {\n'}`;
      attributes
        .filter((a) => a.name.trim())
        .forEach((a) => {
          const fn = a.name.trim();
          code += `${indent}${indent}this.${fn} = ${fn};\n`;
        });
      code += `${indent}}\n\n`;
    }
  }

  // Getters & Setters (if requested and not an interface)
  if (!isInterface && options.includeGettersSetters && attributes.length > 0) {
    attributes
      .filter((a) => a.name.trim())
      .forEach((a) => {
        const fn = a.name.trim();
        const ft = a.type.trim() || 'String';
        const capitalized = fn.charAt(0).toUpperCase() + fn.slice(1);

        // Getter
        code += `${indent}public ${ft} get${capitalized}()${isAllman ? '\n' + indent + '{\n' : ' {\n'}`;
        code += `${indent}${indent}return this.${fn};\n`;
        code += `${indent}}\n\n`;

        // Setter
        code += `${indent}public void set${capitalized}(${ft} ${fn})${isAllman ? '\n' + indent + '{\n' : ' {\n'}`;
        code += `${indent}${indent}this.${fn} = ${fn};\n`;
        code += `${indent}}\n\n`;
      });
  }

  // Methods
  if (methods.length > 0) {
    methods.forEach((m, idx) => {
      const mName = m.name.trim();
      const mReturn = m.returnType.trim() || 'void';
      if (mName) {
        const vis = isInterface ? '' : visibilityToJava(m.visibility);
        const params = m.parameters.trim();

        if (isInterface || isAbstract) {
          code += `${indent}${vis}${mReturn} ${mName}(${params});\n`;
        } else {
          code += `${indent}${vis}${mReturn} ${mName}(${params})${blockOpenBrace}`;
          if (options.methodBody === 'return') {
            const retVal = getDefaultReturnValue(mReturn);
            if (retVal !== '') {
              code += `${indent}${indent}return ${retVal};\n`;
            }
          }
          code += `${indent}}\n`;
        }

        if (idx < methods.length - 1) {
          code += '\n';
        }
      }
    });
  }

  code += '}\n';
  return code;
}
