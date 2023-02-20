export interface Item {
  name: string;
  values: number[];
}

export interface JoyplotData {
  dates: string[];
  series: Item[];
}

export interface JoyplotState {
  search: string;
  byParty: boolean;
}

export interface BarplotState {
  data: any | null;
  error: string | null;
  loading: boolean;
}

export interface TreemapData {
  name: string;
  value: number;
  count: number;
}

export interface TreemapState {
  data: Array<TreemapData | []>;
  error: string | null;
  loading: boolean;
}

export interface Range {
  startDate: Date;
  endDate: Date;
}

export interface CircularPackingData {
  name: string;
  group: number;
  total: number;
  party: string;
}

export interface MapData {
  expense: number;
  normalized_expense: number;
}

export interface MapDataObject {
  [key: string]: MapData;
}

export interface MapState {
  data: MapData | null;
  error: string | null;
  loading: boolean;
}
