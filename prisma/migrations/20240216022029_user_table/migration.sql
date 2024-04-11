CREATE EXTENSION IF NOT EXISTS CITEXT;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "user_account" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "first_name" CITEXT NOT NULL,
    "last_name" CITEXT NOT NULL,
    "email" CITEXT NOT NULL,
    "password" VARCHAR(255),
    "role" VARCHAR(255) NOT NULL DEFAULT 'DEFAULT_USER',
    "status" VARCHAR(255) NOT NULL DEFAULT 'ACTIVE',
    "phone" VARCHAR(255),
    "avatar_path" TEXT,

    CONSTRAINT "pkey_user_account" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "idx_user_account_email" ON "user_account"("email");

-- CreateTable
CREATE TABLE "user_setting" (
    "id"                BIGSERIAL NOT NULL,
    "created_at"        TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"        TIMESTAMPTZ(3) NOT NULL,
    "user_account_id"   UUID NOT NULL,
    "is_email_verified" BOOLEAN NOT NULL,
    "is_phone_verified" BOOLEAN NOT NULL,

    CONSTRAINT "pkey_user_setting" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_provider"
(
    "id"                BIGSERIAL NOT NULL,
    "created_at"        TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"        TIMESTAMPTZ(3) NOT NULL,
    "user_account_id"   UUID NOT NULL,
    "provider"          VARCHAR(255) NOT NULL,
    "provider_key"      TEXT,
    "metadata"          JSONB,

    CONSTRAINT "pkey_user_provider" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX idx_user_provider_provider_provider_key
ON user_provider (provider, provider_key);

ALTER TABLE user_setting
ADD CONSTRAINT fk_user_setting_user_account_id
FOREIGN KEY (user_account_id)
REFERENCES user_account (id);

ALTER TABLE user_provider
ADD CONSTRAINT  fk_user_provider_user_account_id
FOREIGN KEY (user_account_id)
REFERENCES user_account (id);

CREATE OR REPLACE FUNCTION updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_account_updated_at
BEFORE UPDATE ON "user_account"
FOR EACH ROW
EXECUTE FUNCTION updated_at();

CREATE TRIGGER trigger_user_setting_updated_at
BEFORE UPDATE ON "user_setting"
FOR EACH ROW
EXECUTE FUNCTION updated_at();

CREATE TRIGGER trigger_user_provider_updated_at
BEFORE UPDATE ON "user_provider"
FOR EACH ROW
EXECUTE FUNCTION updated_at();
