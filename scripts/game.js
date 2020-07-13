(function(){ // no cheating allowed >:)

function getRandomIndex(array){return Math.floor(Math.random() * array.length)}
function getRandomElement(array){return array[Math.floor(Math.random() * array.length)]}
function sleep(ms){return new Promise(resolve=>setTimeout(resolve, ms))}
function loadImage(src){
    var img = new Image();
    return new Promise(resolve=>{
        img.src = src;
        img.onload = ()=>resolve(img);
    });
}
function progress(percentage, mode){
    document.querySelectorAll('.progress-bar')[mode-1].style.width = percentage + '%';
}
function colorProgress(color, mode){
    document.querySelectorAll('.progress-bar')[mode-1].style.backgroundColor = color;
}

window.addEventListener('load', async function(){
    let loading_screen = document.querySelector('.loading-msg');
    let game_start = document.getElementById('game-start');
    let welcome_msg_wrapper = document.getElementById('welcome-msg-wrapper');
    let game_btn = document.getElementById('game-btn');

    let img_list = await (await fetch('/img_data.json')).json();
    let number_of_cached_images = 20;
    cached_images = {correct: [], incorrect: []};
    for(let c = 0; c < number_of_cached_images; c++){ // get 500 correct and incorrect pictures and store into memory
        loading_screen.textContent = `Loading ${c+1} out of ${number_of_cached_images} assets`;
        cached_images.correct.push(await loadImage('small_'+img_list.correct.splice(getRandomIndex(img_list.correct), 1)[0]));
        cached_images.incorrect.push(await loadImage('small_'+img_list.incorrect.splice(getRandomIndex(img_list.incorrect), 1)[0]));
    }

    loading_screen.style.opacity = 0;
    await sleep(500); // wait for css transition
    loading_screen.style.display = 'none';

    // Game start //
    game_start.style.display = 'initial';
    await sleep(500); // wait for display:initial to render
    welcome_msg_wrapper.style.opacity = 1;
    
    game_btn.onclick = async function(){
        welcome_msg_wrapper.style.opacity = 0;
        await sleep(1000);
        game_start.style.display = 'none';

        start_game();
    };
});

var cached_images;
var score = 0;
var number_of_rounds = 0; // speed will depend on this
var speed = 0.1;
var red = '#ff4e67';
var blue = '#5672ff';
var did_user_die = false;
var is_it_done_yet;

function start_game(mode){
    switch(mode){ // for now there is only one mode
        case 2:
            break;
        case 3:
            break;
        default:
            mode_1();
    }
}
async function mode_1(){ // click on people wearing masks
    let mode_1_wrapper = document.getElementById('game-mode-1');
    let img_wrapper = document.getElementById('game-mode-1-img-wrapper');
    let correct_img_count = 0;
    for(let c = 0; c < 10; c++){
        if(Math.random() > 0.5){
            correct_img_count++;
            let img = getRandomElement(cached_images.correct);
            img.onclick = function(){
                if(did_user_die) return;
                correct_img_count--;
                score += 10;
                this.style.opacity = 0;
                this.onclick = null;
                is_it_done_yet()
            };
            img_wrapper.appendChild(getRandomElement(cached_images.correct));
        }else{
            let img = getRandomElement(cached_images.incorrect);
            img.onclick = flunk_the_user;
            img_wrapper.appendChild(getRandomElement(cached_images.incorrect));
        }
    }
    mode_1_wrapper.style.display = 'initial';
    await sleep(500);
    mode_1_wrapper.style.opacity = 1;
    let timer = 0;
    let countdown_interval = setInterval(() => {
        progress(timer, 1);
        timer+= speed;
        if(timer >= 100){
            // bye bye //
            colorProgress(red, 1);
            flunk_the_user();
        }else if(timer >= 90 ){
            colorProgress(blue, 1);
        }else if(timer >= 80){
            colorProgress(red, 1);
        }else if(timer >= 70 ){
            colorProgress(blue, 1);
        }else if(timer >= 60){
            colorProgress(red, 1);
        }
    }, 10);
    is_it_done_yet = function(){
        if(correct_img_count === 0){
            clearInterval(countdown_interval);
            mode_1_wrapper.style.opacity = 0;
            number_of_rounds += 1;
            setTimeout(()=>start_game, 0);
        }
    };
}
function flunk_the_user(){
    did_user_die = true;
    clearInterval(is_it_done_yet)
    document.getElementById('try-again').style.display = 'initial';
    document.getElementById('score').textContent = score;
}

})();