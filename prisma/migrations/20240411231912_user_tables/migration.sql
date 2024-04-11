-- DropForeignKey
ALTER TABLE "user_setting" DROP CONSTRAINT "fk_user_setting_user_account_id";

-- CreateIndex
CREATE INDEX "idx_user_account_email" ON "user_account"("email");

-- AddForeignKey
ALTER TABLE "user_setting" ADD CONSTRAINT "fk_user_setting_user_account_id" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "idx_user_account_email" RENAME TO "user_account_email_key";
