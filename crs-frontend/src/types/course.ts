export interface Course {
    id: number;
    tenMonHoc: string;
    soTinChi: number;
    soChoToiDa: number;
    soChoConLai: number;
}

export interface PagedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

// Bổ sung kiểu dữ liệu cho Form
export interface CourseFormValues {
    tenMonHoc: string;
    soTinChi: string; // Sử dụng string trong form để quản lý input rỗng tốt hơn
    soChoToiDa: string;
}

export const emptyCourseForm: CourseFormValues = {
    tenMonHoc: '',
    soTinChi: '',
    soChoToiDa: '',
};