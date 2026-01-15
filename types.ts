
export interface VideoSubmission {
  id: string;
  studentName: string;
  studentId: string;
  videoUrl: string;
  originalFileName: string;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  progress?: number;
}

export enum DownloadBatchSize {
  FIVE = 5
}
