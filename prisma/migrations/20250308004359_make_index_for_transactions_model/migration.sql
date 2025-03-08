-- CreateIndex
CREATE INDEX "Transactions_date_idx" ON "Transactions"("date");

-- CreateIndex
CREATE INDEX "Transactions_type_idx" ON "Transactions"("type");

-- CreateIndex
CREATE INDEX "Transactions_userId_idx" ON "Transactions"("userId");
