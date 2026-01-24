import { apiFetch, getApiImageUrl } from './api';

export interface SizeChartEntry {
  label: string;
  bust: string;
  waist: string;
  hip: string;
  shoulder: string;
  length: string;
}

export interface HowToMeasure {
  guideImage: string;
  steps: { title: string; desc: string }[];
}

export interface SizeChartData {
  _id: string;
  name: string;
  table: SizeChartEntry[];
  howToMeasureImage: string; 
  unit: string;
}

export const fetchSizeChart = async (): Promise<{ success: boolean; data: SizeChartData }> => {
  return apiFetch('/size-chart');
};

export const getHowToMeasureImageUrl = (path: string | undefined, fallback: string = '/assets/Apparel-Illustration.svg'): string => {
  return getApiImageUrl(path, fallback);
};
