const bcrypt = require('bcrypt');

const hash = '$2b$10$orjXgwQXSkrLHix88TxtfOMbhecktg2pAbyhYL.ftYnj6gTjuToUC';
const plain = 'DKg@020487';

async function test() {
  const match = await bcrypt.compare(plain, hash);
  console.log('Matches:', match);
}

test();
