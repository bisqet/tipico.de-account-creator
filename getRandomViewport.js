const randomWidthList = {
  list: [360, 320, 375, 425, 768, 1024, 1440],//default viewport width for different devices
  getRandom() {
    return this.list[randomInteger(0, this.list.length - 1)];
  }
};
const randomHeightList = {
  list: [896, 812, 736, 667, 568, 1024, 732, 847, 824, 740, 853, 640, 850, 1280],//default viewport height for different devices
  getRandom() {
    return this.list[randomInteger(0, this.list.length - 1)]
  }
};

const randomWidth = () => {
  return randomWidthList.getRandom();
};

const randomHeight = () => {
  return randomHeightList.getRandom();
};

const randomMobile = () => {
  return false//!!randomInteger(0,1)//get true/false
};


function randomInteger(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

module.exports = {randomWidth, randomHeight, randomMobile};