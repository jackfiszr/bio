export class Seq {
  private sequence: string;

  constructor(seq: string) {
    this.sequence = seq.toUpperCase();
  }

  get length(): number {
    return this.sequence.length;
  }

  at(index: number): string | undefined {
    return this.sequence.at(index);
  }

  toString(): string {
    return this.sequence;
  }

  count(subseq: string): number {
    return (this.sequence.match(new RegExp(subseq, "g")) || []).length;
  }

  complement(): Seq {
    const complementMap: Record<string, string> = {
      A: "T",
      T: "A",
      C: "G",
      G: "C",
      U: "A", // For RNA compatibility
    };
    return new Seq(
      this.sequence.replace(/[ATCGU]/g, (nuc) => complementMap[nuc] || nuc),
    );
  }

  reverseComplement(): Seq {
    return new Seq(this.complement().toString().split("").reverse().join(""));
  }

  transcribe(): Seq {
    return new Seq(this.sequence.replace(/T/g, "U"));
  }

  backTranscribe(): Seq {
    return new Seq(this.sequence.replace(/U/g, "T"));
  }

  translate(toStop = false, stopSymbol = "*"): Seq {
    const codonTable: Record<string, string> = {
      "TTT": "F",
      "TTC": "F",
      "TTA": "L",
      "TTG": "L",
      "CTT": "L",
      "CTC": "L",
      "CTA": "L",
      "CTG": "L",
      "ATT": "I",
      "ATC": "I",
      "ATA": "I",
      "ATG": "M",
      "GTT": "V",
      "GTC": "V",
      "GTA": "V",
      "GTG": "V",
      "TCT": "S",
      "TCC": "S",
      "TCA": "S",
      "TCG": "S",
      "CCT": "P",
      "CCC": "P",
      "CCA": "P",
      "CCG": "P",
      "ACT": "T",
      "ACC": "T",
      "ACA": "T",
      "ACG": "T",
      "GCT": "A",
      "GCC": "A",
      "GCA": "A",
      "GCG": "A",
      "TAT": "Y",
      "TAC": "Y",
      "TAA": stopSymbol,
      "TAG": stopSymbol,
      "TGA": stopSymbol,
      "CAT": "H",
      "CAC": "H",
      "CAA": "Q",
      "CAG": "Q",
      "AAT": "N",
      "AAC": "N",
      "AAA": "K",
      "AAG": "K",
      "GAT": "D",
      "GAC": "D",
      "GAA": "E",
      "GAG": "E",
      "TGT": "C",
      "TGC": "C",
      "TGG": "W",
      "CGT": "R",
      "CGC": "R",
      "CGA": "R",
      "CGG": "R",
      "AGT": "S",
      "AGC": "S",
      "AGA": "R",
      "AGG": "R",
      "GGT": "G",
      "GGC": "G",
      "GGA": "G",
      "GGG": "G",
    };
    let protein = "";
    for (let i = 0; i < this.sequence.length - 2; i += 3) {
      const codon = this.sequence.substring(i, i + 3);
      const aminoAcid = codonTable[codon] || "X";
      if (toStop && aminoAcid === stopSymbol) break;
      protein += aminoAcid;
    }
    return new Seq(protein);
  }

  slice(start: number, end?: number): Seq {
    return new Seq(this.sequence.slice(start, end));
  }

  toUpperCase(): Seq {
    return new Seq(this.sequence.toUpperCase());
  }

  toLowerCase(): Seq {
    return new Seq(this.sequence.toLowerCase());
  }

  concat(other: Seq): Seq {
    return new Seq(this.sequence + other.toString());
  }

  reverse(): Seq {
    return new Seq(this.sequence.split("").reverse().join(""));
  }

  equals(other: string | Seq): boolean {
    return this.sequence ===
      (typeof other === "string" ? other : other.toString());
  }

  indexOf(subseq: string): number {
    const index = this.sequence.indexOf(subseq);
    if (index === -1) throw new RangeError("Subsequence not found");
    return index;
  }

  lastIndexOf(subseq: string): number {
    const index = this.sequence.lastIndexOf(subseq);
    if (index === -1) throw new RangeError("Subsequence not found");
    return index;
  }
}

export class MutableSeq {
  private sequence: string;

  constructor(sequence: string) {
    this.sequence = sequence;
  }

  set(index: number, char: string): void {
    if (index < 0 || index >= this.sequence.length) {
      throw new RangeError("Index out of bounds");
    }
    if (char.length !== 1) {
      throw new Error("Only a single character can be set");
    }
    this.sequence = this.sequence.substring(0, index) + char +
      this.sequence.substring(index + 1);
  }

  remove(char: string): void {
    this.sequence = this.sequence.split(char).join("");
  }

  reverse(): void {
    this.sequence = this.sequence.split("").reverse().join("");
  }

  toString(): string {
    return this.sequence;
  }

  toJSON(): object {
    return { sequence: this.sequence };
  }
}

// Module-level functions
export function reverseComplement(seq: string | Seq): string {
  return new Seq(typeof seq === "string" ? seq : seq.toString())
    .reverseComplement().toString();
}

export function transcribe(seq: string | Seq): string {
  return new Seq(typeof seq === "string" ? seq : seq.toString()).transcribe()
    .toString();
}

export function backTranscribe(seq: string | Seq): string {
  return new Seq(typeof seq === "string" ? seq : seq.toString())
    .backTranscribe().toString();
}

export function translate(seq: string | Seq): string {
  return new Seq(typeof seq === "string" ? seq : seq.toString()).translate()
    .toString();
}
