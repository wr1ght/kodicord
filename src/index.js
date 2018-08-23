require('dotenv').config();
const { spawn } = require('child_process');
async function startRPC() {
    console.log('Spawning RPC process...')
    let spawnedProcess = spawn('node', ['./src/connect.js']);
    spawnedProcess.stdout.on('data', data => {
        console.log(data.toString());
    });

    spawnedProcess.stderr.on('data', data => {
        console.log(data.toString());
    });

    spawnedProcess.on('exit', code => {
        console.log('Song changed, restarting RPC process.');
        delete(spawnedProcess);
        setTimeout(startRPC, 1000);
    });
}

startRPC();