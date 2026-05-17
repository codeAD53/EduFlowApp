# Initialize
npm init -y

# Core
npm install express
npm install pg                        # PostgreSQL client
npm install dotenv                    # Environment variables
npm install cors                      # Allow React to talk to Express
npm install bcryptjs                  # Password hashing
npm install jsonwebtoken              # JWT auth

# AI
npm install openai                    # If using OpenAI
# OR
npm install @anthropic-ai/sdk         # If using Claude

# TypeScript & Dev
npm install -D typescript
npm install -D ts-node                # Run TS directly in dev
npm install -D nodemon                # Auto restart on save
npm install -D @types/express
npm install -D @types/pg
npm install -D @types/cors
npm install -D @types/bcryptjs
npm install -D @types/jsonwebtoken
npm install -D @types/node
npx tsc --init

`tsconfig.json`
{
  "compilerOptions": {
    "target": "ESnext",
    "module": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
psql -U postgres

\l list all databases
\q exit

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/codeAD53/EduFlowApp.git
git pull origin main --allow-unrelated-histories
git push -u origin main

real jwt auth bearertoken during regs/login not jwt secret= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.eyJpZCI6IjEyMyIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20ifQ
.signature `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJodHRwMjI0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzc4OTk3MTgxLCJleHAiOjE3Nzk2MDE5ODF9.xPmt6yhYwQFoPXXd17BLhNJv1Gkuycvj-MCq7r9omDU`