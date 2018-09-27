const https = require('https');
const fs = require('fs');

let config = {
    token: '',
    channel: '@',
    file: '',
    bufferSize: 2000
};

for (let i = 0, arr = process.argv.slice(2), l = arr.length; i < l; i++) {
    let spl = arr[i].split('=');
    config[spl[0]] = spl[1];
}

fs.watchFile(config.file, (curr, prev) => {
    fs.open(config.file, 'r', (err, fd) => {
        if (err) throw err;

        let buffer = Buffer.alloc(+config.bufferSize);
        fs.read(fd, buffer, 0, curr.size - prev.size, prev.size, (err, num) => {
            let msg = buffer.toString('utf8', 0, num);
            https.get(
                `https://api.telegram.org/bot${
                    config.token
                }/sendMessage?chat_id=${config.channel}&text=${msg}`
            );
        });
    });
});
