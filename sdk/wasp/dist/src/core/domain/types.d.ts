export type UserRole = 'PADRE' | 'CAJERO' | 'ADMIN';
export type PaymentStatus = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
export type PaymentDestination = 'PAQUETE' | 'MONEDERO';
export type ProductType = 'SIMPLE' | 'PRODUCIDO';
export type SyncStatus = 'PENDING' | 'SYNCED' | 'FAILED';
export type AllergySeverity = 'MODERADO' | 'CRITICO';
export type LedgerEntryType = 'DEBIT' | 'CREDIT';
export interface StudentProfile {
    id: string;
    parentId: string;
    firstName: string;
    lastName: string;
    gradeSection: string;
    photoUrl?: string | null;
    staticCode: string;
    walletBalance: number;
}
export interface MealPackageSummary {
    id: string;
    totalUnits: number;
    availableUnits: number;
    unitPrice: number;
    expiresAt?: Date | null;
}
export interface StudentValidationResult {
    student: StudentProfile & {
        allergies: Array<{
            id: string;
            allergen: string;
            description: string;
            severity: AllergySeverity;
        }>;
    };
    activePackageUnits: number;
    walletBalance: number;
    hasCriticalAllergy: boolean;
}
export interface RecipeBOMItem {
    rawMaterialSku: string;
    quantity: number;
    unit: string;
}
export interface POSDailySummary {
    totalScheduled: number;
    totalDelivered: number;
    totalPending: number;
}
//# sourceMappingURL=types.d.ts.map