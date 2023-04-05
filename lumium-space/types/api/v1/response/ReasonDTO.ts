export type StatusType =
    "EMAIL_ALREADY_EXISTS" |
    "EMAIL_DOES_NOT_EXIST" |
    "INVALID_CREDENTIALS" |
    "USERNAME_ALREADY_EXISTS" |
    "PASSWORDS_DO_NOT_MATCH";

export interface ReasonDTO {
    status: StatusType;
    reason: string;
};
