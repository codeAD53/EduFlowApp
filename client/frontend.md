# Create React app with TypeScript
npm create vite@latest client -- --template react-ts

cd client

# Styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Routing
npm install react-router-dom
npm install -D @types/react-router-dom

# HTTP requests
npm install axios

# UI extras (optional but useful)
npm install lucide-react               # Clean icons
npm install react-hot-toast            # Toast notifications

# State (only if you go beyond Context)
# npm install zustand                  # Lightweight, skip for now