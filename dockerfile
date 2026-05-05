FROM node:22-alpine AS prod-builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


FROM nginx:alpine

COPY --from=prod-builder /app/dist/aml-app-frontend/browser /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 4201

CMD ["nginx", "-g", "daemon off;"]
