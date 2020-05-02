import Client from 'ftp';
declare function getList(ftp: Client, src: string): Promise<Client.ListingElement[] | false>;
declare function rmDir(ftp: Client, src: string, recusive?: boolean): Promise<boolean>;
declare function deleteFile(ftp: Client, src: string): Promise<boolean>;
declare function emptyDir(ftp: Client, src: string, except?: string[]): Promise<boolean>;
declare function put(ftp: Client, src: string, dest: string): Promise<boolean>;
declare function mkDir(ftp: Client, src: string, recusive?: boolean): Promise<boolean>;
export { put, rmDir, mkDir, getList, emptyDir, deleteFile };
