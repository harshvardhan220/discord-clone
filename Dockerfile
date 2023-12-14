FROM node:20.9.0
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]