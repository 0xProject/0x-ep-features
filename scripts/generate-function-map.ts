import * as artifacts from "@0x/contract-artifacts";
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";

function getFunctionName(functionSignature: string): string {
  return functionSignature.substring(0, functionSignature.indexOf("("));
}

function getFunctionSelector(functionSignature: string): string {
  return keccak256(toUtf8Bytes(functionSignature)).substring(0, 10);
}

function main() {
  for (const functionSignature of Object.keys(
    artifacts.IZeroEx.compilerOutput.devdoc.methods
  )) {
    if (functionSignature.startsWith("_")) {
      continue;
    }
    const selector = getFunctionSelector(functionSignature);
    const name = getFunctionName(functionSignature);
    console.log(`["${selector}", "${name}"],`);
  }
}

main();
