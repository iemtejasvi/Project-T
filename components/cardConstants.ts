// Shared data for MemoryCard and DesktopMemoryCard

export const DESTRUCTED_MESSAGES = [
  "This memory has faded. The words are gone.",
  "Only silence remains where this message used to be.",
  "This message has been destructed. Nothing can be recovered.",
  "What was here is gone now.",
  "The message is gone, but the memory remains.",
  "This message disappeared when its time ran out.",
  "These words are no longer here.",
  "This memory holds an empty space where the message once lived.",
  "The message has vanished.",
  "Gone. Like it was never written.",
  "This message was meant to disappear.",
  "Nothing is left to read.",
  "The ink is gone. The feeling stays.",
  "This message is no longer available.",
  "This space is all that remains.",
  "The message has been erased by time.",
  "Only the outline of a memory remains.",
  "This message has slipped away.",
  "Some words don't last. This one didn't.",
  "A quiet end: this message is gone.",
  "You arrived after the ending.",
  "The page is blank now.",
  "There's nothing left to recover.",
  "The words didn't survive.",
  "Time took the message first.",
  "You missed it by a moment—or a lifetime.",
  "The message expired. The space stayed.",
  "This was here. Now it isn't.",
  "It ended before you opened it.",
  "A message that chose to vanish.",
  "This line is all that's left.",
  "It's gone, and it won't come back.",
  "Nothing to read. Only the fact it existed.",
  "The message ran out of time.",
  "You're late. The words are gone.",
  "The message has already left.",
  "An empty place where meaning used to be.",
  "This memory kept its shape, not its words.",
  "The message is beyond reach now."
];

export const allowedColors = new Set([
  "default", "aqua", "azure", "berry", "brass", "bronze", "clay", "cloud",
  "copper", "coral", "cream", "cyan", "dune", "garnet", "gold", "honey",
  "ice", "ivory", "jade", "lilac", "mint", "moss", "night", "ocean",
  "olive", "peach", "pearl", "pine", "plum", "rose", "rouge", "ruby",
  "sage", "sand", "sepia", "sky", "slate", "steel", "sunny", "teal", "wine"
]);

export const colorMapping: Record<string, string> = {
  plain: "default", cherry: "ruby", sapphire: "azure", lavender: "lilac",
  turquoise: "cyan", amethyst: "pearl", midnight: "night", emerald: "jade",
  periwinkle: "sky", lemon: "sunny", graphite: "steel", "dusty-rose": "rose",
  "vintage-blue": "ice", terracotta: "clay", mustard: "honey", parchment: "ivory",
  burgundy: "wine", "antique-brass": "brass", "forest-green": "pine",
  maroon: "garnet", navy: "ocean", khaki: "sand"
};

export const colorBgMap: Record<string, string> = {
  default: "#E8E0D0", aqua: "#B8D8D8", azure: "#C0D0DB", berry: "#D1C3D8",
  brass: "#E0D8C8", bronze: "#DDC7B0", clay: "#E0C5B2", cloud: "#DCDFF1",
  copper: "#E0C8B3", coral: "#E3C6B2", cream: "#E5E3CD", cyan: "#C2DCDC",
  dune: "#E2DECA", garnet: "#D8C0C0", gold: "#E3E0C4", honey: "#E3CDC3",
  ice: "#C7CBCD", ivory: "#E6E5D2", jade: "#C5DCC8", lilac: "#DBC8DD",
  mint: "#C9E0C9", moss: "#C6D8C2", night: "#C1C3D9", ocean: "#C2C6DA",
  olive: "#DCDAC2", peach: "#E5CDC7", pearl: "#DCC9DE", pine: "#C2D6C3",
  plum: "#D7C2C4", rose: "#E2CACB", rouge: "#E0C6C8", ruby: "#E1C3C3",
  sage: "#DADCC8", sand: "#E5E2CA", sepia: "#D9D5C2", sky: "#DBDFE4",
  slate: "#D6D8DA", steel: "#D8D9DA", sunny: "#E6E4C9", teal: "#C2DBDA",
  wine: "#D9C3C4"
};
