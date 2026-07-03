# Backend Project Setup (TypeScript + Express + Prisma + PostgreSQL)

This guide will help you set up a backend project using **TypeScript**, **Express.js**, **Prisma ORM**, and **PostgreSQL**.

---

# Step 1: Install TypeScript

Install TypeScript along with the required development dependencies.

```bash
npm install -D typescript tsx @types/node
```

---

# Step 2: Initialize TypeScript

Generate the TypeScript configuration file.

```bash
tsc --init
```

This command creates a `tsconfig.json` file.

Replace its contents with the following configuration:

```json
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "target": "ES2022",
    "types": [],
    "outDir": "dist",
    "rootDir": "src",
    "noImplicitAny": true,
    "strictNullChecks": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "isolatedModules": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

---

# Step 3: Install Required Runtime Dependencies

Install the packages required to build an Express backend.

```bash
npm install express cors cookie-parser jsonwebtoken dotenv bcrypt zod
```

### Packages

* **express** – Backend framework
* **cors** – Cross-Origin Resource Sharing
* **cookie-parser** – Parse cookies from requests
* **jsonwebtoken** – JWT Authentication
* **dotenv** – Environment variables
* **bcrypt** – Password hashing
* **zod** – Request validation

---

# Step 4: Install Type Definitions

Install TypeScript definitions for the runtime packages.

```bash
npm install -D @types/express @types/cors @types/cookie-parser @types/jsonwebtoken @types/dotenv @types/bcrypt
```

---

# Step 5: Install Multer (Optional)

If your project supports **image or file uploads**, install Multer.

```bash
npm install multer
```

---

# Step 6: Install Cloudinary (Optional)

If you're uploading images to **Cloudinary**, install the following packages.

```bash
npm install -D @types/multer cloudinary
```

---

# Step 7: Install Prisma

Install Prisma CLI and PostgreSQL type definitions.

```bash
npm install -D prisma @types/pg
```

---

# Step 8: Install Prisma Client & PostgreSQL Driver

Install Prisma Client, PostgreSQL adapter, and PostgreSQL driver.

```bash
npm install @prisma/client @prisma/adapter-pg pg
```

---

## Installed Tech Stack

* TypeScript
* Express.js
* Prisma ORM
* PostgreSQL
* JWT Authentication
* bcrypt
* Zod Validation
* dotenv
* Cookie Parser
* CORS
* Multer *(optional)*
* Cloudinary *(optional)*

---

The project is now ready for the next steps:

* Initialize Prisma
* Configure PostgreSQL
* Create the Prisma schema
* Generate Prisma Client
* Build the Express server
* Implement Authentication
* Add CRUD APIs
