declare module 'react-native-bcrypt' {
    export function genSaltSync(rounds?: number): string;
    export function hashSync(data: string, salt: string): string;
    export function compareSync(data: string, encrypted: string): boolean;
  }
  