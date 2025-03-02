# Sequence objects

## Sequences act like strings

In most ways, we can deal with Seq objects as if they were normal JavaScript
strings, for example getting the length, or iterating over the elements:

```ts
import { Seq } from "@bio/seq";

let mySeq = new Seq("GATCG");

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

Unlike a string, the `Seq` object has a `.count()` method. This gives a
_non-overlapping_ count:

```ts
const count = new Seq("AAAA").count("AA");
console.log(count);
// 2
```

For some biological uses, you may actually want an overlapping count (i.e. in
this trivial example). When searching for single letters, this makes no
difference:

```ts
mySeq = new Seq("GATCGATGGGCCTATATAGGATCGAAAATCGC");
console.log(mySeq.length);
// 32
console.log(mySeq.count("G"));
// 9
console.log(100 * (mySeq.count("G") + mySeq.count("C")) / mySeq.length);
// 46.875
```
