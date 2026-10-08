export type BotConversationState = 'MAIN_MENU' | 'AWAITING_STUDENT_QUERY' | 'HUMAN_AGENT_SILENCED';
export interface BotSession {
    phoneNumber: string;
    state: BotConversationState;
    lastActive: Date;
}
export interface StudentAuthQueryResult {
    found: boolean;
    studentName?: string;
    gradeSection?: string;
    walletBalance?: number;
    availableMeals?: number;
    staticCode?: string;
}
export declare class WhatsAppStateMachine {
    static processMessage(userMessage: string, menuItems: Array<{
        name: string;
        price: number;
    }>, currentState?: BotConversationState, studentLookup?: (query: string) => Promise<StudentAuthQueryResult | null>): {
        reply: string;
        nextState: BotConversationState;
    };
}
//# sourceMappingURL=stateMachine.d.ts.map