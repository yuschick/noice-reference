type Agreement = {
  name: string;
  revision: string;
};

export const currentAgreement: Agreement = {
  name: 'terms-of-service',
  revision: '2023-10-23',
} as const;

/**
 * Validates if the current user ToS agreement is up to date and valid.
 * This needs to be checked in clients that handles users.
 * @param agreement
 * @returns
 */
export const isCurrentAgreement = (agreement: Agreement) =>
  agreement.name === currentAgreement.name &&
  agreement.revision === currentAgreement.revision;
