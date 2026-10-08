export declare class DomainError extends Error {
    readonly statusCode: number;
    constructor(message: string, statusCode?: number);
}
export declare class InsufficientFundsError extends DomainError {
    constructor(message?: string);
}
export declare class NoActiveMealPackageError extends DomainError {
    constructor(message?: string);
}
export declare class CriticalAllergyBlockError extends DomainError {
    constructor(allergens: string[]);
}
export declare class IdempotencyDuplicateError extends DomainError {
    constructor(idempotencyKey: string);
}
export declare class EntityNotFoundError extends DomainError {
    constructor(entityName: string, identifier: string);
}
//# sourceMappingURL=DomainErrors.d.ts.map