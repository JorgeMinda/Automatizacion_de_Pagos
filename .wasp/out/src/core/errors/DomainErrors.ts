export class DomainError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InsufficientFundsError extends DomainError {
  constructor(message = 'Saldo insuficiente en el monedero para procesar la transacción.') {
    super(message, 402);
  }
}

export class NoActiveMealPackageError extends DomainError {
  constructor(message = 'El estudiante no cuenta con paquetes de almuerzo activos disponibles.') {
    super(message, 422);
  }
}

export class CriticalAllergyBlockError extends DomainError {
  constructor(allergens: string[]) {
    super(
      `Alerta Médica Crítica Bloqueante: El estudiante presenta diagnósticos de alergia severa (${allergens.join(', ')}). Requiere confirmación manual del supervisor.`,
      422
    );
  }
}

export class IdempotencyDuplicateError extends DomainError {
  constructor(idempotencyKey: string) {
    super(`Transacción duplicada detectada para la clave ${idempotencyKey}. Operación omitida de forma segura.`, 409);
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(entityName: string, identifier: string) {
    super(`${entityName} con identificador "${identifier}" no fue encontrado en el sistema.`, 404);
  }
}
