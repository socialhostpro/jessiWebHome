FROM node:22-alpine
WORKDIR /app
COPY . .
RUN rm -f Dockerfile
ENV NODE_ENV=production
USER node
CMD ["node", "server.js"]
