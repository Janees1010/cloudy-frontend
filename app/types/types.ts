


// export interface 

export interface RecentFiles {
    today:FileData[],
    lastWeek:FileData[],
    lastMonth:FileData[]
}

export interface binType {
    _id:number
    name:string,
    size:number,
    type:string
}

export interface FileData {
    _id:string,
    name: string,
    size: number,
    type: string,
    parentId:string | null,
    s3Url:string,
    lastAccessed:Date,
    owner:string
  }

  export interface Folder {
     _id:string,
     name:string,
     owner:string,
     type:string
  }

  export interface UserType  {
    _id:string,
    username:string,
    email:string,
  }

  export interface SharedFiles {
    _id:string,
    name:string,
    owner:string,
    type:string,
    createdAt:string,
    s3Url:string,
    size:number,
    userDetails?:{
      username:string
    }
  }
  