export interface ModelValidationErrors {
    [key: string]: { [key: string]: string };
}
export interface UserInterface {
    email: string;
    id: string;
    username: string;
    cash: number;
}
