FROM node:12-alpine

# Create app directory
WORKDIR /workspace
COPY package.json package-lock.json /workspace/

# Install app dependencies
RUN npm install


# Bundle app source
COPY . .

RUN npm run build
EXPOSE 3000

CMD [ "npm", "start" ]
