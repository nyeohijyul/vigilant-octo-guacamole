// const obj = JSON.parse(jsonData);

function cvrtDt2n(yyyymmdd) {
  // MMDD → MM, DD 추출
    const year = yyyymmdd.slice(0,4);
  const month = parseInt(yyyymmdd.slice(4, 6), 10);
  const day = parseInt(yyyymmdd.slice(6, 8), 10);

  // 해당 년도의 1월 1일과 날짜 객체 생성
  const date = new Date(year, month - 1, day);
  const startOfYear = new Date(year, 0, 1);

  // 밀리초 차이를 '일(day)'로 변환
  const dayOfYear = Math.floor((date - startOfYear) / (1000 * 60 * 60 * 24)) + 1;

  return dayOfYear;
}

const jsonData = fetch('./data.json').then(res => {if (!res) {throw new Error("망함");} return res.json();}).then(dt => {document.getElementById("result").innerHTML = 성공";}).catch(error => { document.getElementById("result").innerHTML = `"에러남" ${ error}`;});
const NO2xArr = jsonData.DATA.slice(0,168).map(entry => [entry.no2 * 1000])
const NO2yArr = jsonData.DATA.slice(0,168).map(entry => [cvrtDt2n(entry.msrdt)])

async function run() {
  // Create a simple model.
  const model = tf.sequential();
  model.add(tf.layers.dense({units: 1, inputShape: [1]}));

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

  // Generate some synthetic data for training. (y = 2x - 1)
  const xs = tf.tensor2d(NO2yArr, [NO2yArr.length, 1]);
  const ys = tf.tensor2d(NO2xArr, [NO2xArr.length, 1]);

  // Train the model using the data.
  await model.fit(xs, ys, {epochs: 50});

  // Use the model to do inference on a data point the model hasn't seen.
  // Should print approximately 39.
  document.getElementById('result').innerText =
      model.predict(tf.tensor2d([160], [1, 1])).dataSync();
}

run();


