// types/job-notes.ts

export interface AddNote {
  title: string;
  content: string;
  images?: string[]; // Array of Cloudinary URLs
}

export interface Note {
  id: string;
  title: string;
  content: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userId: string;
  images?: string[]; // Optional images array
}

export interface PageInfo {
  totalCount: number;
  filteredCount: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface GetAllNotesResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    notes: Note[];
    pageInfo: PageInfo;
  };
}
