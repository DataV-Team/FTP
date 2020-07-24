import Client from 'ftp';
declare function getList(ftp: Client, src: string): Promise<Client.ListingElement[]>;
declare function rmDir(ftp: Client, src: string, recusive?: boolean): Promise<void>;
declare function deleteFile(ftp: Client, src: string): Promise<void>;
declare function emptyDir(ftp: Client, src: string, except?: string[]): Promise<void>;
declare function put(ftp: Client, src: string, dest: string): Promise<void>;
declare function mkDir(ftp: Client, src: string, recusive?: boolean): Promise<void>;
export { put, rmDir, mkDir, getList, emptyDir, deleteFile };
