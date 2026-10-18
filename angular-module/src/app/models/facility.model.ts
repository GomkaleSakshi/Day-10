export type FacilityStatus = 'Active' | 'Inactive' | 'Maintenance';

export interface Facility {
  id: number;
  name: string;
  location: string;
  category: string;
  description: string;
  status: FacilityStatus;
  created_at?: string;
  updated_at?: string;
}
