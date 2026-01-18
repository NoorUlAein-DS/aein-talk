# 1. Node.js image
FROM node:20

# 2. Folder create karein
WORKDIR /app

# 3. Dependencies copy aur install karein
COPY package*.json ./
RUN npm install

# 4. Saara code copy karein
COPY . .

# 5. Hugging Face Port setup
ENV PORT=7860
EXPOSE 7860

# 6. Server start karein
CMD ["node", "server.js"]