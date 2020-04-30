function shuffle(passedArray) {
    let counter = passedArray.length;

    const array = [
        ...passedArray
    ];

    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);

        counter--;

        // Do not use destructuring - performance impact
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

module.exports = {
    shuffle,
};