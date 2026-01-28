const mongoose = require('mongoose');
const User = require('./models/User');
const TempUser = require('./models/TempUser');
const dotenv = require('dotenv');

dotenv.config();

console.log('Mongo URI:', process.env.MONGO_URI ? 'Defined' : 'Undefined');

// Connect to DB to get OTP
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for usage in test'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });

async function runTest() {
    try {
        const email = `testuser_${Date.now()}@example.com`;
        const password = 'password123';

        console.log(`\n1. Registering user: ${email}`);
        const regRes = await fetch('http://localhost:5001/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test User', email, password })
        });
        const regData = await regRes.json();
        console.log('Registration Response:', regData);

        if (!regRes.ok) throw new Error('Registration failed');

        // Wait a bit for DB to update
        await new Promise(r => setTimeout(r, 1000));

        // CHECK TEMP USER
        console.log(`\n2. Checking TempUser for ${email}`);
        const tempUser = await TempUser.findOne({ email });
        if (!tempUser) {
            throw new Error('User NOT found in TempUser collection!');
        }
        const otp = tempUser.otp;
        console.log('OTP Found in TempUser:', otp);

        // CHECK MAIN USER (Should NOT exist)
        console.log(`\n3. Checking User (Main) for ${email} (Should NOT exist)`);
        const mainUserBefore = await User.findOne({ email });
        if (mainUserBefore) {
            throw new Error('User FOUND in Main User collection prematurely!');
        }
        console.log('User correctly NOT found in Main DB.');

        // Verify
        console.log(`\n4. Verifying Email with OTP: ${otp}`);
        const verifyRes = await fetch('http://localhost:5001/api/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        const verifyData = await verifyRes.json();
        console.log('Verification Response:', verifyData);

        if (!verifyRes.ok) throw new Error('Verification failed');

        // CHECK TEMP USER (Should NOT exist)
        console.log(`\n5. Checking TempUser for ${email} (Should be deleted)`);
        const tempUserAfter = await TempUser.findOne({ email });
        if (tempUserAfter) {
            throw new Error('TempUser NOT deleted after verification!');
        }
        console.log('TempUser correctly deleted.');

        // CHECK MAIN USER (Should exist)
        console.log(`\n6. Checking User (Main) for ${email} (Should exist)`);
        const mainUserAfter = await User.findOne({ email });
        if (!mainUserAfter) {
            throw new Error('User NOT found in Main User collection after verification!');
        }
        console.log('User correctly found in Main DB.');

        // Login
        console.log('\n7. Attempting Login (Expected Success)');
        const successLoginRes = await fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        console.log('Login Status:', successLoginRes.status);
        const successLoginData = await successLoginRes.json();
        console.log('Login Response:', successLoginData);

        if (!successLoginRes.ok) throw new Error('Login failed');

        console.log('\nTest Complete');
        process.exit(0);
    } catch (e) {
        console.error('Test Failed Exception:', e);
        process.exit(1);
    }
}

runTest();
