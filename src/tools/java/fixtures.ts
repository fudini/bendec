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
];
