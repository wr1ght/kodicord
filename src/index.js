require('dotenv').config();
const { spawn } = require('child_process');
async function startRPC() {
    if (process.env.API_ABUSE === 'true') console.log('NOTICE: You have the API_ABUSE setting enabled. This puts your account at risk of being suspended/deleted, the project maintainer is not at fault if your account is deleted.');
    console.log('Spawning RPC process...')
    let spawnedProcess = spawn('node', ['./src/core']);
    spawnedProcess.stdout.on('data', data => {
        console.log(data.toString());
    });

    spawnedProcess.stderr.on('data', data => {
        console.log(data.toString());
    });

    spawnedProcess.on('exit', code => {
        console.log('Song changed, restarting RPC process.');
        delete(spawnedProcess);
        startRPC()
    });
}

startRPC();