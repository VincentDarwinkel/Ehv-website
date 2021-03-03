# pull official base image
FROM node:15.10.0-alpine3.10

# add `/app/node_modules/.bin` to $PATH
ENV PATH node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts -g --silent

# start app
CMD ["npm", "start"]