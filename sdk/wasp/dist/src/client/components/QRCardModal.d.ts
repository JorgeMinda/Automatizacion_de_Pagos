import React from 'react';
interface QRCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: {
        id: string;
        firstName: string;
        lastName: string;
        gradeSection: string;
        staticCode: string;
        qrSeed: string;
    };
}
export declare const QRCardModal: React.FC<QRCardModalProps>;
export {};
//# sourceMappingURL=QRCardModal.d.ts.map