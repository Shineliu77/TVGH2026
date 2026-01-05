
export enum AppView {
  LOGIN = 'login',
  DASHBOARD = 'dashboard',
  MEASUREMENT = 'measurement',
  EXERCISE_PLAN = 'exercise_plan',
  COMBINED_DIARY = 'combined_diary',
  AI_CHAT = 'ai_chat',
  SMART_GLASSES = 'smart_glasses'
}

export interface User {
  id: string;
  name: string;
}

export interface FitnessData {
  age: number;
  gender: 'M' | 'F' | '';
  waist: number;
  hip: number;
  arm: number;
  calf: number;
  sitStandTime: number;
  gripStrength: number;
  walkSpeed: number;
  sppbScore: number;
  totalActivity: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
