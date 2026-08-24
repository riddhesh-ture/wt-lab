export type Visibility = '-' | '+' | '#' | '~';

export interface AttributeItem {
  id: string;
  visibility: Visibility;
  name: string;
  type: string;
}

export interface ParameterItem {
  name: string;
  type: string;
}

export interface MethodItem {
  id: string;
  visibility: Visibility;
  name: string;
  returnType: string;
  parameters: string; // e.g. "hours: int" or empty
}

export interface UMLClassModel {
  className: string;
  isAbstract: boolean;
  isInterface: boolean;
  superClass: string;
  interfaces: string;
  attributes: AttributeItem[];
  methods: MethodItem[];
}
