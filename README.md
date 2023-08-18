## BECG Group assignment

```
// start the server
$ npm install
$ npm run start

// test
$ npm run test
```

## What I considered for making it

- I wanted to use Context Api actually, but using Redux was suggested in the document. so I thought about which data should I put up on the store and which data I shouldn't

- I've left small ideas around all the code, they have mainly have a thing to do with the number of times whenever react gets updated and the level of each state updating

## What to test

- by text and filter them by first letter
- The system should also display a couple of metrics in chart format based on found results
- A letter should be selected by default
- loading and error states and representation

## when you are checking its loading process!, snatch the async task

1. mock and re implement the whole function
2. spying and recording the function
3. change the result of function
