# front2back

This is a simple register and login app that allows the user to add items to a list

## Getting Started

These are things you need to do to get your app running

### Prerequisits

Be sure you have node and npm installed globally.

```
git clone https://github.com/jacobhamblin83/front2back.git
```
```
cd front2back
```
```
npm install
```
### Create necessary files

```
touch config.js
```
Edit the config.js file to look like this:
```
module.exports = {
    secret: "anysecretyouwanthere"
}
```
Add a "secret." It can be whatever you want

## Deployment

In the command line, from the front2back directory run
```
node index.js
```
You can see the app at localhost:3000


