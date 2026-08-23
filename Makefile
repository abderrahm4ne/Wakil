.PHONY: dev generate db-push db-migrate db-studio

dev:
	npm run dev

generate:
	npx prisma generate

db-push:
	npx prisma db push

db-migrate:
	npx prisma migrate dev

db-studio:
	npx prisma studio