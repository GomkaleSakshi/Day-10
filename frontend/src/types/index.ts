export type FacilityStatus = 'Active' | 'Inactive' | 'Maintenance';
export type InspectionStatus = 'Pending' | 'In Progress' | 'Completed' | 'Failed';
export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

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

export interface Inspection {
  id: number;
  facility_id: number;
  facility_name?: string;
  inspector_name: string;
  inspection_date: string;
  status: InspectionStatus;
  findings: string;
  remarks: string;
  created_at?: string;
  updated_at?: string;
}

export interface Complaint {
  id: number;
  facility_id: number;
  facility_name?: string;
  title: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  reported_by: string;
  resolution_notes: string;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardStats {
  totalFacilities: number;
  activeFacilities: number;
  maintenanceFacilities: number;
  totalInspections: number;
  pendingInspections: number;
  completedInspections: number;
  totalComplaints: number;
  openComplaints: number;
  resolvedComplaints: number;
}

export interface ChartRow {
  status?: string;
  priority?: string;
  value: number;
}

export interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
  facilityStatusChart: ChartRow[];
  inspectionStatusChart: ChartRow[];
  complaintPrioritySummary: ChartRow[];
  recentInspections: Inspection[];
  recentComplaints: Complaint[];
}
