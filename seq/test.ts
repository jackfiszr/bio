import { assertEquals } from "@std/assert";
import { Seq } from "./mod.ts";

Deno.test("Seq: complement", () => {
  const seq = new Seq("ATGC");
  assertEquals(seq.complement().toString(), "TACG");
});

Deno.test("Seq: reverseComplement", () => {
  const seq = new Seq("ATGC");
  assertEquals(seq.reverseComplement().toString(), "GCAT");
});

Deno.test("Seq: transcribe", () => {
  const seq = new Seq("ATGC");
  assertEquals(seq.transcribe().toString(), "AUGC");
});

Deno.test("Seq: backTranscribe", () => {
  const seq = new Seq("AUGC");
  assertEquals(seq.backTranscribe().toString(), "ATGC");
});

Deno.test("Seq: translate", () => {
  const seq = new Seq("ATGGCC");
  assertEquals(seq.translate().toString(), "MA");
});
