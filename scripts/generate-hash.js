const bcrypt = require('bcryptjs');

// Change this to your desired admin password
const password = 'YourStrongPasswordHere2026!';

const salt = bcrypt.genSaltSync(12);
const hash = bcrypt.hashSync(password, salt);

console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nAdd this to your .env.local:');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
