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

  upper(): Seq {
    return new Seq(this.sequence.toUpperCase());
  }

  lower(): Seq {
    return new Seq(this.sequence.toLowerCase());
  }

  concat(other: Seq): Seq {
    return new Seq(this.sequence + other.toString());
  }
}
