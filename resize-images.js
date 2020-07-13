/**
 * run this after parse.js. Also be sure to run"npm install jimp"
 * before hand
 */

const fs = require('fs');
const Jimp = require('jimp');

let count = 0;
async function resize_all_in_folder(folder, new_folder, height){
    let items = fs.readdirSync(folder);
    for(let each_item of items){
        let image = await Jimp.read(folder+'/'+each_item);
        await image.resize(Jimp.AUTO, height);
        await image.writeAsync(new_folder+'/'+each_item);
        console.log(++count);
    }
}
fs.mkdirSync('small_images');
fs.mkdirSync('small_images/correct');
fs.mkdirSync('small_images/incorrect');
resize_all_in_folder('images/correct', 'small_images/correct', 100);
resize_all_in_folder('images/incorrect', 'small_images/incorrect', 100);