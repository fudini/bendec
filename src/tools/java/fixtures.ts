export const marketTypes = [
  {
    kind: "Struct",
    name: "Head",
    description: "Message header.",
    fields: [
      {
        name: "len",
        type: "MessageLength",
        description: "Message length.",
      },
    ],
  },
  {
    kind: "Alias",
    name: "MessageLength",
    alias: "u16",
    description: "Length of the message.",
  },
  {
    kind: "Array",
    name: "Char3",
    type: "char",
    length: 3,
  },
  {
    kind: "Enum",
    name: "AnimalKind",
    underlying: "u16",
    offset: "0x1000",
    variants: [
      ["Zebra", 1],
      ["Toucan", 2],
    ],
  },
  {
    kind: "Union",
    name: "Animal",
    members: ["Zebra", "Toucan"],
    discriminator: ["kind"],
  },
];
