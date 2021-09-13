export interface Uri {
  protocol: string
  host: string
  port: number
}

export interface User {
  firstName: string
  lastName: string
  age: number
  uri: Uri
}

export interface Header {
  msgType: number
}

export interface UserAdd {
  header: Header
  user: User
}

