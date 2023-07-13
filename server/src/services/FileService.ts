import csv from "csvtojson";

export interface Row {
  [key: string]: string;
}

export default class FileService {
  static async readCsvFile(filePath: string, delimiter = '\t'): Promise<Row[]> {
    const data: Row[] = await csv({
      delimiter: [delimiter],
    }).fromFile(filePath);
    return data;
  }
}
