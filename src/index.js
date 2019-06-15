export default function({types: t }) {
  return {
    visitor: {
      JSXAttribute(path, state) {
        console.log(path, 'xxxxxxxxxxxxxx')
      }
    }
  };
}
