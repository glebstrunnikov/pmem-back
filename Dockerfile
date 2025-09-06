# back/Dockerfile
FROM node:20

# Set working directory
WORKDIR /srv/app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies including Strapi
RUN npm install

# Copy the rest of the project
COPY . .

# Expose the Strapi port
EXPOSE 1337

# Start Strapi
CMD ["npm", "run", "develop"]
