export interface IWhatsAppMessengerPort {
    sendTextMessage(to: string, message: string): Promise<boolean>;
    sendMealConsumedNotification(to: string, studentName: string, gradeSection: string, timeStr: string, remainingBalance: number, remainingMeals: number): Promise<boolean>;
    sendLowBalanceAlert(to: string, studentName: string, currentBalance: number, remainingMeals: number): Promise<boolean>;
}
export declare class WhatsAppCloudApiAdapter implements IWhatsAppMessengerPort {
    private readonly token;
    private readonly phoneNumberId;
    constructor();
    sendTextMessage(to: string, message: string): Promise<boolean>;
    sendMealConsumedNotification(to: string, studentName: string, gradeSection: string, timeStr: string, remainingBalance: number, remainingMeals: number): Promise<boolean>;
    sendLowBalanceAlert(to: string, studentName: string, currentBalance: number, remainingMeals: number): Promise<boolean>;
}
//# sourceMappingURL=whatsappService.d.ts.map