const convertTileToNewIndex = (oldId, oldTilesPerRow, newTilesPerRow) => (Math.floor(oldId / oldTilesPerRow) * newTilesPerRow) + (oldId % oldTilesPerRow);

const oldIdSet = [];
const newIdSet = [];

for (let i = 0; i < oldIdSet.length; i += 1) {
  newIdSet.push(convertTileToNewIndex(oldIdSet[i]), 6, 12);
}
