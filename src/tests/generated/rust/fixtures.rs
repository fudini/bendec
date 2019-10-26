pub type Age = u8;

#[repr(packed)]
#[derive(Debug)]
pub struct Header {
  pub msg_type: u8,
}

pub struct Uri {
  pub protocol: [char; 10],
  pub host: [char; 32],
  pub port: u16,
}

pub struct User {
  pub first_name: [char; 16],
  pub last_name: [char; 16],
  pub uri: Uri,
  pub age: Age,
}

pub struct UserExtra {
  pub first_name: [char; 16],
  pub last_name: [char; 16],
  pub uri: Uri,
  pub age: Age,
  pub uris: [Uri; 4],
}

pub struct UserAdd {
  pub header: Header,
  pub user: User,
}

pub type CustomerAdd = UserAdd;

pub struct Group {
  pub header: Header,
  pub ints: [u8; 8],
  pub users: [User; 5],
}

pub type Price = u32;

pub struct Person {
  pub a: u16,
  pub b: u32,
  pub c: u32,
  pub d: u8,
}

pub struct LargeMessage {
  pub header: Header,
  pub person1: Person,
  pub person2: Person,
  pub aaa: u32,
  pub bbb: Price,
  pub ccc: u32,
  pub ddd: u32,
  pub eee: u32,
  pub fff: u8,
  pub ggg: u8,
  pub name1: [char; 64],
  pub name2: [char; 64],
  pub name3: [char; 64],
  pub name4: [char; 64],
}