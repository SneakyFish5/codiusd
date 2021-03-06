/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface Manifest {
  name: string;
  version: string;
  port?: string;
  machine?: "small";
  containers: {
    id: string;
    image: string;
    command?: string[];
    workdir?: string;
    environment?: {
      [k: string]: string;
    };
  }[];
  vars?: {
    [k: string]: {
      encoding?: "private:sha256";
      value: string;
    };
  };
  debug?: boolean;
}
