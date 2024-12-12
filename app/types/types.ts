


// export interface 

export interface RecentFiles {
    today:FileData[],
    lastWeek:FileData[],
    lastMonth:FileData[]
}

export interface FileData {
    _id:number,
    name: string,
    size: number,
    type: string,
    parentId:string | null,
    userId:string,
    s3Url:string,
    lastAccessed:string
  }
  