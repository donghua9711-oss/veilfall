// Card definitions: creatures have atk/hp, spells have spell:[kind, amount].
// Keywords: guard (must be attacked first), charge (attacks on arrival), bc (battlecry).
const CARDS = [
  {id:'cinderkit', name:'Cinderkit', el:'fire', kind:'sprite', cost:1, atk:2, hp:1, text:'Tiny, hungry, always warm.'},
  {id:'mossback', name:'Mossback', el:'grove', kind:'golem', cost:2, atk:1, hp:4, guard:1, text:'Guard. Moss grows where it stands.'},
  {id:'nixie', name:'Tide Nixie', el:'tide', kind:'mage', cost:2, atk:2, hp:2, bc:['heal',2], text:'Heal your Ward 2 on arrival.'},
  {id:'stormfang', name:'Stormfang', el:'storm', kind:'wolf', cost:3, atk:3, hp:2, bc:['hit',1], text:'Deal 1 to the enemy Ward on arrival.'},
  {id:'witch', name:'Gloom Witch', el:'void', kind:'mage', cost:3, atk:2, hp:3, bc:['draw',1], text:'Draw a card on arrival.'},
  {id:'paladin', name:'Dawn Paladin', el:'light', kind:'knight', cost:4, atk:3, hp:5, guard:1, text:'Guard. Her shield never dims.'},
  {id:'roc', name:'Thunder Roc', el:'storm', kind:'bird', cost:4, atk:4, hp:3, bc:['hit',1], text:'Deal 1 to the enemy Ward.'},
  {id:'drake', name:'Ashwing Drake', el:'fire', kind:'dragon', cost:5, atk:5, hp:4, bc:['hit',2], text:'Deal 2 to the enemy Ward.'},
  {id:'serpent', name:'Abyss Serpent', el:'tide', kind:'serpent', cost:5, atk:4, hp:6, text:'Rises from the dark in silence.'},
  {id:'phoenix', name:'Sunfeather', el:'light', kind:'bird', cost:6, atk:5, hp:5, bc:['heal',4], text:'Heal your Ward 4 on arrival.'},
  {id:'colossus', name:'Star Colossus', el:'void', kind:'golem', cost:7, atk:7, hp:7, guard:1, text:'Guard. Born of a collapsed star.'},
  {id:'spark', name:'Spark Bolt', el:'storm', kind:'bolt', cost:1, spell:['bolt',2], text:'Deal 2 to any enemy target.'},
  {id:'fireball', name:'Fireball', el:'fire', kind:'orb', cost:4, spell:['bolt',5], text:'Deal 5 to any enemy target.'},
  {id:'mend', name:'Rejuvenate', el:'grove', kind:'ring', cost:2, spell:['heal',5], text:'Heal your Ward 5.'},
  {id:'nova', name:'Nebula Nova', el:'void', kind:'burst', cost:5, spell:['nova',3], text:'Deal 3 to all enemy creatures.'}
];
