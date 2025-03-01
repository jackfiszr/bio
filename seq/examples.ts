//
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

//
console.log(mySeq.at(0));
// G
console.log(mySeq.at(2));
// T
console.log(mySeq.at(-1));
// G
