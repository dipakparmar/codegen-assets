# typescript-zeit

This is a starter kit for `typescript` with `zeit`. To get started:

1. Firstly, [download the starter-kit](https://github.com/hasura/codegen-assets/raw/master/typescript-zeit/starter-kit.zip) and `cd` into it.

2. You first need to install the `now-cli`.

  ```bash
  npm install -g now
  ```

3. Install the dependencies and start the now dev server:

  ```bash
  npm ci
  now dev
  ```

## Development

If you want to add a route (say `/greet`), you can just add a new file called `greet.js` in the `api` directory. This file must have a default export function that behaves as a request handler.

Note: Make sure you import `NowRequest, NowResponse` from `@now/node`

Example of `greet.js`

```typescript
import { NowRequest, NowResponse } from '@now/node'

const greetHandler = (req: NowRequest, res: NowResponse) => {
  return res.json({
    "greeting"
  })
}

export default greetHandler;
```

### Throwing erros

You can throw an error object or a list of error objects from your handler. The response must be 4xx and the error object must have a string field called `message`.

```js
retun res.status(400).json({
  message: 'invalid email'
});
```

## Deployment

```bash
now
```
