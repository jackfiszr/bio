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

## Slicing a sequence

A more complicated example, let’s get a slice of the sequence:

```ts
mySeq = new Seq("GATCGATGGGCCTATATAGGATCGAAAATCGC");

console.log(mySeq.slice(4, 12));
// Seq { sequence: "GATGGGCC" }
```

Note that ‘Seq‘ objects follow the usual indexing conventions for JavaScript
strings, with the first element of the sequence numbered 0. When you do a slice
the first item is included (i.e. 4 in this case) and the last is excluded (12 in
this case).

## Turning Seq objects into strings

If you really do just need a plain string, for example to write to a file, or
insert into a database, then this is very easy to get:

```ts
console.log(mySeq.toString());
// GATCGATGGGCCTATATAGGATCGAAAATCGC
```

## Concatenating or adding sequences

Like JavaScript strings, `Seq` also has a `.concat` method:

```ts
const seq1 = new Seq("ACGT");
const seq2 = new Seq("AACCGG");
console.log(seq1.concat(seq2));
// Seq { sequence: "ACGTAACCGG" }
```

`@bio/seq` does not check the sequence contents and will not raise an exception
if for example you concatenate a protein sequence and a DNA sequence (which is
likely a mistake):

```ts
const proteinSeq = new Seq("EVRNAK");
const dnaSeq = new Seq("ACGT");
console.log(proteinSeq.concat(dnaSeq));
// Seq { sequence: "EVRNAKACGT" }
```

You may often have many sequences to add together, which can be done with a for
loop like this:

```ts
const listOfSeqs = [new Seq("ACGT"), new Seq("AACC"), new Seq("GGTT")];
let concatenated = new Seq("");
for (const s of listOfSeqs) {
  concatenated = concatenated.concat(s);
}
console.log(concatenated);
// Seq { sequence: "ACGTAACCGGTT" }
```

## Changing case

JavaScript strings have very useful `toUpperCase` and `toLowerCase` methods for
changing the case. For example,

```ts
const dnaSeqMixedCase = new Seq("acgtACGT");
console.log(dnaSeqMixedCase.toUpperCase());
// Seq { sequence: "ACGTACGT" }
console.log(dnaSeqMixedCase.toLowerCase());
// Seq { sequence: "acgtacgt" }
```

These are useful for doing case insensitive matching:

```ts
console.log(dnaSeqMixedCase.toString().includes("GTAC"));
// false
console.log(dnaSeqMixedCase.toUpperCase().toString().includes("GTAC"));
// true
```

## Nucleotide sequences and (reverse) complements

For nucleotide sequences, you can easily obtain the complement or reverse
complement of a `Seq` object using its built-in methods:

```ts
mySeq = new Seq("GATCGATGGGCCTATATAGGATCGAAAATCGC");
console.log(mySeq.complement());
// Seq { sequence: "CTAGCTACCCGGATATATCCTAGCTTTTAGCG" }
console.log(mySeq.reverseComplement());
// Seq { sequence: "GCGATTTTCGATCCTATATAGGCCCATCGATC" }
```

An easy way to just reverse a `Seq` object (or a JavaScript string) is to use
the `reverse` method:

```ts
console.log(mySeq.reverse());
// Seq { sequence: "CGCTAAAAGCTAGGATATATCCGGGTAGCTAG" }
```

## Transcription

Transcription of a DNA sequence produces the corresponding RNA sequence:

```ts
const codingDna = new Seq("ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG");
const messengerRna = codingDna.transcribe();
console.log(messengerRna);
// Seq { sequence: "AUGGCCAUUGUAAUGGGCCGCUGAAAGGGUGCCCGAUAG" }
```

The `Seq` object also includes a back-transcription method for going from the
mRNA to the coding strand of the DNA:

```ts
console.log(messengerRna.backTranscribe());
// Seq { sequence: "ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG" }
```

## Translation

Translate an mRNA sequence into the corresponding protein sequence:

```ts
console.log(messengerRna.translate());
// Seq { sequence: "MAIVMGR*KGAR*" }
```

You can also translate directly from the coding strand DNA sequence:

```ts
console.log(codingDna.translate());
// Seq { sequence: "MAIVMGR*KGAR*" }
```

You may want to translate the nucleotides up to the first in-frame stop codon,
and then stop:

```ts
console.log(codingDna.translate(true));
// Seq { sequence: "MAIVMGR" }
```

## Comparing Seq objects

Sequence comparison is actually a very complicated topic, and there is no easy
way to decide if two sequences are equal. The basic problem is the meaning of
the letters in a sequence are context dependent - the letter “A” could be part
of a DNA, RNA or protein sequence.

Should a DNA fragment “ACG” and an RNA fragment “ACG” be equal? What about the
peptide “ACG”? Or the JavaScript string “ACG”? In everyday use, your sequences
will generally all be the same type of (all DNA, all RNA, or all protein). Well,
sequence comparison only looks at the sequence and compares like the JavaScript
string.

```ts
const seq3 = new Seq("ACGT");
console.log(seq3.equals("ACGT"));
// true
console.log("ACGT" === seq3.toString());
// true
```

## MutableSeq objects

Just like the normal JavaScript string, the `Seq` object is “read only”, or in
JavaScript terminology, immutable. Apart from wanting the `Seq` object to act
like a string, this is also a useful default since in many biological
applications you want to ensure you are not changing your sequence data.

However, you can convert it into a mutable sequence (a `MutableSeq` object) and
do pretty much anything you want with it:

```ts
import { MutableSeq } from "@bio/seq";

const mutableSeq = new MutableSeq("GCCATTGTAATGGGCCGCTGAAAGGGTGCCCGA");
console.log(mutableSeq);
// MutableSeq { sequence: "GCCATTGTAATGGGCCGCTGAAAGGGTGCCCGA" }

mutableSeq.set(5, "C");
console.log(mutableSeq);
// MutableSeq { sequence: "GCCATCGTAATGGGCCGCTGAAAGGGTGCCCGA" }

mutableSeq.remove("T");
console.log(mutableSeq);
// MutableSeq { sequence: "GCCACGTAATGGGCCGCTGAAAGGGTGCCCGA" }

mutableSeq.reverse();
console.log(mutableSeq);
// MutableSeq { sequence: "AGCCCGTGGGAAAGTCGCCGGGTAATGCACCG" }
```

Once you have finished editing your `MutableSeq` object, it’s easy to get back
to a read-only `Seq` object should you need to:

```ts
const newSeq = new Seq(mutableSeq.toString());
console.log(newSeq);
// Seq { sequence: "AGCCCGTGGGAAAGTCGCCGGGTAATGCACCG" }
```

## Finding subsequences

Sequence objects have `index` and `lastIndexOf` methods that perform the same
function as the corresponding methods on plain string objects:

```ts
const seq = new Seq("GCCATTGTAATGGGCCGCTGAAAGGGTGCCCGA");
console.log(seq.indexOf("ATGGGCCGC"));
// 9
console.log(seq.lastIndexOf("CC"));
// 29
```

A `RangeError` is raised if the subsequence is not found:

```ts
try {
  console.log(seq.indexOf("ACTG"));
} catch (e) {
  console.error(e);
  // RangeError: Subsequence not found
}
```

## Working with strings directly

To close this chapter, for those you who _really_ don’t want to use the sequence
objects (or who prefer a functional programming style to an object orientated
one), there are module level functions in `@bio/seq` that will accept plain
JavaScript strings, `Seq` objects or `MutableSeq` objects:

```ts
import {
  backTranscribe,
  reverseComplement,
  transcribe,
  translate,
} from "@bio/seq";

const myString = "GCTGTTATGGGTCGTTGGAAGGGTGGTCGTGCTGCTGGTTAG";
console.log(reverseComplement(myString));
// CTAACCAGCAGCACGACCACCCTTCCAACGACCCATAACAGC
console.log(transcribe(myString));
// GCUGUUAUGGGUCGUUGGAAGGGUGGUCGUGCUGCUGGUUAG
console.log(backTranscribe(myString));
// GCTGTTATGGGTCGTTGGAAGGGTGGTCGTGCTGCTGGTTAG
console.log(translate(myString));
// AVMGRWKGGRAAG*
```

You are, however, encouraged to work with `Seq` objects by default.
