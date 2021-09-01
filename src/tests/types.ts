export interface Uri {
  protocol: string;
  host: string;
  port: number;
}

export interface User {
  firstName: string;
  lastName: string;
  age: number;
  uri: Uri;
}

export interface Header {
  msgType: number;
}

export interface UserAdd {
  header: Header;
  user: User;
}

export interface Login {
  header: Header;
  connectionId: number; // "u16"
  token: string; // Array(8) of type AnsiChar (u8)
}

// "fields": [
//       {
//         "name": "length",
//         "type": "MsgLength"
//       },
//       {
//         "name": "version",
//         "type": "MsgVersion"
//       },
//       {
//         "name": "msgType",
//         "type": "MsgType"
//       },
//       {
//         "name": "seqNum",
//         "type": "SeqNum"
//       }
//     ]
