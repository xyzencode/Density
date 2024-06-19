FROM node

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json .

# Bundle app source
RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs in
CMD [ "npm", "start" ]

# Run the app
EXPOSE 3000