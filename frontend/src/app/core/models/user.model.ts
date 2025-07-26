export interface User {
  id: string;
  name: string;
  email: string;
  weight?: number;
  height?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    thighs?: number;
  };
} 