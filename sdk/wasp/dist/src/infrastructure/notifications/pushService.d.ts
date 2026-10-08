export declare class PushNotificationService {
    /**
     * Dispara una notificación Push al dispositivo móvil del padre de familia al validar el almuerzo en POS.
     */
    static notifyMealDelivered(params: {
        parentToken?: string;
        studentName: string;
        gradeSection: string;
        mealName: string;
        deliveredAt: Date;
    }): Promise<boolean>;
}
//# sourceMappingURL=pushService.d.ts.map