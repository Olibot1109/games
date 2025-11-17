window.setVDynamic = function (entity, value) {
    entity.vDynamic = value;
    let children = entity.children;
    for (let i in children) {
        window.setVDynamic(children[i], value);
    }
};

window.ucWords = function (str) {
    //Make the first letter of each word in this string uppercase
    const words = str.split(' ');
    for (let j = 0; j < words.length; j++) {
        words[j] = words[j].charAt(0).toUpperCase() + words[j].slice(1);
    }
    return words.join(' ');
};

window.formatTimeS = function (timeS) {
    const minutes = Math.floor(timeS / 60);
    const seconds = Math.floor(timeS % 60);
    const milliseconds = Math.floor((timeS - Math.floor(timeS)) * 10);
    return timeS >= 60 
        ? `${minutes}:${seconds.toString().padStart(2, '0')}`
        : `${Math.floor(timeS)}.${milliseconds}`;
};