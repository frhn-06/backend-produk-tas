# 1. Ambil Node.js versi 20
FROM node:20-alpine

# 2. Tentukan folder kerja di dalam container
WORKDIR /app

# 3. Copy file package.json dan package-lock.json
COPY package*.json ./

# 4. Install dependencies dengan mengabaikan script opsional/postinstall (seperti ngrok)
RUN npm install --ignore-scripts

# 5. Copy seluruh sisa kode backend Anda
COPY . .

# 6. Buka port Express (sesuaikan jika port aplikasi Anda bukan 5000)
EXPOSE 5000

# 7. Jalankan perintah untuk development
CMD ["npm", "run", "dev"]