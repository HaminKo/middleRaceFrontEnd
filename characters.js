var Characters = [
  {
  characterName: 'SwagAbhi',
  characterDescription: "We all know Abhi's got swag. In fact, he's got so much swag that he can pull anyone into his rhythm without them realizing it.",
  powerType: 'active' ,//active or passive
  abilityDescription: "If you discard a card and give up a turn, you can pick a player and drag them towards you. If the player is in front of you, that player will be placed one space ahead of you. If the player is behind you, that player will be placed one space behind you. You cannot target the same player twice in a row." ,//ability description
  ability: 'gravity' ,//ability name
  picture: 'CardSwag',
  orderPriority: 1
  },
  {
  characterName: 'WolfAbhi',
  characterDescription: "Sometimes, Abhi's animalistic side comes out. Like a wolf, he becomes protective of his territory. No one is allowed near the wolf Abhi.",
  powerType: 'passive' ,//active or passive
  abilityDescription: "When sharing the same space with another character, you will push them either one space ahead of you or one space behind of you." ,//ability description
  ability: 'push' ,//ability name
  picture: 'CardWolf',
  orderPriority: 2
  },
  {
  characterName: 'GangsterAbhi',
  characterDescription: "In times of crisis Abhi can get down and dirty. He isn't afraid of using his muscles to do what needs to be done.",
  powerType: 'passive' ,//active or passive
  abilityDescription: "When you are moved by another character's ability, you will pick a player, and after checking their move cards, get rid of the rest except one. In other words, choose the one card they get to keep. You cannot target the same player twice in a row." ,//ability description
  ability: 'delete' ,//ability name
  picture: 'CardGanster',
  orderPriority: 3
  },
  {
  characterName: 'WorkAbhi',
  characterDescription: "When the time calls for it, Abhi can crunch down and get the work done. No matter the situation, Abhi will deliver.",
  powerType: 'passive' ,//active or passive
  abilityDescription: "When your cards are reset, you will give a move card of your choice to another player. You cannot give cards to the same player twice in a row." ,//ability description
  ability: 'offer' ,//ability name
  picture: 'CardWork',
  orderPriority: 4
  },
  {
  characterName: 'A',
  characterDescription: "A",
  powerType: 'passive' ,//active or passive
  abilityDescription: "When moving with your last remaining move card, you will pick another player to move as many spaces forward as you do. You cannot target the same player twice in a row." ,//ability description
  ability: 'with' ,//ability name
  picture: 'A',
  orderPriority: 5
  },
  {
  characterName: 'ClassicAbhi',
  characterDescription: "The Abhi we all know and love. Abhi will always watch your back and make sure that we are all on the same page. If he chooses to, anyways.",
  powerType: 'passive' ,//active or passive
  abilityDescription: "You can choose to move any player one space ahead of you behind" ,//ability description
  ability: 'union' ,//ability name
  picture: 'CardClassic',
  orderPriority: 6
  },
  {
  characterName: 'SmallAbhi',
  characterDescription: "Abhi wasn't always the big hunky man he is today. Like many other greats, he too had humble beginnings. This allows Abhi to relate situations that others might scoff as simply small matters.",
  powerType: 'passive' ,//active or passive
  abilityDescription: "Whenever a '1' card is used to move during another player's turn, you will choose to move one space forward or back." ,//ability description
  ability: 'one' ,//ability name
  picture: 'CardSmall',
  orderPriority: 7
  },
  {
  characterName: 'BeanAbhi',
  characterDescription: "Sometimes Abhi will surprise you with his actions. Like when he wears a hoodie and ends up looking like a bean.",
  powerType: 'passive' ,//active or passive
  abilityDescription: "When moved by another player's ability, you will choose another palyer to move the same number of spots in the opposite direction. You cannot target the same player twice in a row." ,//ability description
  ability: 'mirror' ,//ability name
  picture: 'CardBean',
  orderPriority: 8
  },
  {
  characterName: 'NotAbhi',
  characterDescription: "We all want to be Abhi. The unfortunate reality is that there can only be one true Abhi. But it doesn't stop you from trying.",
  powerType: 'active' ,//active or passive
  abilityDescription: "When your cards are reset, copy another character's ability. You will use this ability until your next reset. You cannot target the same player twice in a row.",//ability description
  ability: 'copy' ,//ability name
  picture: 'CardNot',
  orderPriority: 9
  },
  {
  characterName: 'B',
  characterDescription: "B",
  powerType: 'passive' ,//active or passive
  abilityDescription: "When moving with your own card, you will jump over spaces with other players. You also get a move 0 card, and reset your cards when you have 2 cards left." ,//ability description
  ability: 'jump' ,//ability name
  picture: 'B',
  orderPriority: 10
  },
  {
  characterName: 'C',
  characterDescription: "C",
  powerType: 'passive' ,//active or passive
  abilityDescription: "When you move backwards, you will pick anoher player and reset their move cards.  You cannot target the same player twice in a row." ,//ability description
  ability: 'reset' ,//ability name
  picture: 'C',
  orderPriority: 11
  },
  {
  characterName: 'MozartAbhi',
  characterDescription: "In addition to being an athlete, programmer, and entrepreneur, Abhi is a musician. His violin skills are so good that if you hear it, you will forget what you were doing and you will be left unable to do anything other than the most basic of human motor abiltieis. That's how good Ahbi's music is.",
  powerType: 'active' ,//active or passive
  abilityDescription: "Before submitting a move card, you will pick a player and disable their ability until your same turn. You cannot target the same player twice in a row." ,//ability description
  ability: 'silence' ,//ability name
  picture: 'CardMozart',
  orderPriority: 12
  },
  {
  characterName: 'BoltAbhi',
  characterDescription: "",
  powerType: 'active' ,//active or passive
  abilityDescription: "You can move double the amount of every move card. However, you may only use up to 2 cards to move forward. The remaining cards will be used to move backwards." ,//ability description
  ability: 'quick' ,//ability name
  picture: 'CardBolt',
  orderPriority: 13
  },
]

module.exports = {
  Characters: Characters
};