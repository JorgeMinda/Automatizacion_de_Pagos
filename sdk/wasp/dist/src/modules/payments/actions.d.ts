import type { ProcessDirectPayment } from 'wasp/server/operations';
interface ProcessPaymentInput {
    [key: string]: any;
    studentId: string;
    amount: number;
    destination: 'PAQUETE' | 'MONEDERO';
    bankReference: string;
    packageUnits?: number;
    unitPrice?: number;
}
export declare const processDirectPayment: ProcessDirectPayment<ProcessPaymentInput, {
    success: boolean;
    paymentId: string;
    packageId?: string;
}>;
export declare const registerStudentForParent: any;
export declare const setUserRole: any;
export {};
//# sourceMappingURL=actions.d.ts.map