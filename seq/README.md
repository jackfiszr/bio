# Sequence objects

## Sequences act like strings

In most ways, we can deal with Seq objects as if they were normal JavaScript
strings, for example getting the length, or iterating over the elements:

```ts
import { Seq } from "@bio/seq";

const mySeq = new Seq("GATCG");

for (let index = 0; index < mySeq.length; index++) {
  console.log(`${index} ${mySeq.at(index)}`);
}
// 0 G
// 1 A
// 2 T
// 3 C
// 4 G

console.log(mySeq.length);
// 5
```

You can access elements of the sequence in the same way as for strings (although
brackets notation in **not** available!):

```ts
console.log(mySeq.at(0));
// G
console.log(mySeq.at(2));
// T
console.log(mySeq.at(-1));
// G
```
