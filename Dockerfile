FROM node:18-alpine


WORKDIR /app


COPY package*.json ./


RUN npm install --production


COPY . .


RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser


EXPOSE 3000


HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1


CMD ["npm", "start"]