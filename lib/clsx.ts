// Missing dependency - adding clsx for className utilities
export type ClassValue = string | number | boolean | undefined | null | ClassValue[];

export function clsx(...inputs: ClassValue[]): string {
    return inputs
        .flat()
        .filter(Boolean)
        .join(' ')
        .trim();
}
