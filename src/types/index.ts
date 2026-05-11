export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface NameI18n {
  zh: string;
  en: string;
  original?: string;
}

export interface LifeEvent {
  year: number;
  location: GeoPoint;
  placeName: string;
}

export interface Philosopher {
  id: string;
  name: NameI18n;
  birth: LifeEvent;
  death?: LifeEvent;
  schools: string[];
  influences: string[];
  influencedBy: string[];
  ideas: string[];
  importance: number;
  description: string;
}

export interface School {
  id: string;
  name: NameI18n;
  region: Region;
  period: {
    start: number;
    end: number;
  };
  color: string;
  description: string;
}

export enum Region {
  GREECE = '古希腊',
  ROME = '古罗马',
  EUROPE_WEST = '西欧',
  EUROPE_CENTRAL = '中欧',
  EUROPE_EAST = '东欧',
  CHINA = '中国',
  JAPAN = '日本',
  INDIA = '印度',
  PERSIA = '波斯',
  ARABIA = '阿拉伯世界',
  AMERICAS = '美洲',
  OTHER = '其他'
}

export type TimeRange = {
  start: number;
  end: number;
};
