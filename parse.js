// after downloading this dataset: https://www.kaggle.com/wobotintelligence/face-mask-detection-dataset
// and unzipping, run this //
// this will create a folder called images/ and a file named img_data.json
/**
 * List of classifications kept (isProtected=true will not be kept):
 * gas_mask
 * face_with_mask
 * mask_surgical
 * mask_colorful
 * 
 * face_with_mask_incorrect
 * face_no_mask
 * hijab_niqab
 * face_other_covering
 * scarf_bandana
 * helmet
 */

const fs = require('fs');

let dataset_root = 'Medical mask/Medical mask/Medical Mask';
let list_annotations = fs.readdirSync(dataset_root+'/annotations');
let good_masks = ['gas_mask', 'face_with_mask', 'mask_surgical', 'mask_colorful'];
let bad_masks = ['face_with_mask_incorrect', 'face_no_mask', 'hijab_niqab', 'face_other_covering', 'scarf_bandana', 'helmet'];

let img_data = {correct: [], incorrect: []};
fs.mkdirSync('images/');
fs.mkdirSync('images/correct');
fs.mkdirSync('images/incorrect');
main_loop: for(let each_annotation_file of list_annotations){
    let parsed = JSON.parse(fs.readFileSync(dataset_root+'/annotations/'+each_annotation_file));
    let is_good = false;
    let is_bad = false;
    for(let each_annotation of parsed.Annotations){
        if(!each_annotation.isProtected){
            if(good_masks.includes(each_annotation.classname)){
                if(is_bad) continue main_loop;
                is_good = true;
            }else if(bad_masks.includes(each_annotation.classname)){
                if(is_good) continue main_loop;
                is_bad = true;
            }else{
                continue main_loop;
            }
        }
    }
    if(is_good){
        fs.copyFileSync(dataset_root+'/images/'+parsed.FileName, 'images/correct/'+parsed.FileName);
        img_data.correct.push('images/correct/'+parsed.FileName);
    }else if(is_bad){
        fs.copyFileSync(dataset_root+'/images/'+parsed.FileName, 'images/incorrect/'+parsed.FileName);
        img_data.incorrect.push('images/incorrect/'+parsed.FileName);
    }
}
fs.writeFileSync('img_data.json', JSON.stringify(img_data), 'utf8');