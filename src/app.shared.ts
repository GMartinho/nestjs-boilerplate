export const enum UserAccountRole {
    DEFAULT_USER = 'DEFAULT_USER',
    ADMIN = 'ADMIN'
}

export const enum UserAccountStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
    ARCHIVED = 'ARCHIVED'
}

export const enum UserProviderOptions {
    EMAIL = 'EMAIL',
    GOOGLE = 'GOOGLE',
    FACEBOOK = 'FACEBOOK',
    APPLE = 'APPLE',
    X = 'X'
}

export const enum FileStorageProvider {
    AWS_S3 = 'AWS_S3',
    GCLOUD_STORAGE = 'GCLOUD_STORAGE',
    AZURE_STORAGE = 'AZURE_STORAGE'
}

export type MaybeType<T> = T | undefined;