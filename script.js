function cvrtDt2n(yyyymmdd) {
  const year = yyyymmdd.slice(0, 4);
  const month = parseInt(yyyymmdd.slice(4, 6), 10);
  const day = parseInt(yyyymmdd.slice(6, 8), 10);
  const date = new Date(year, month - 1, day);
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((date - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
  return dayOfYear;
}

async function run() {
  console.log("lets goooo");

  // JSON 파일 비동기 로딩 (await 사용!)
  let jsonData;
  try {
    const response = await fetch('./data.json');
    jsonData = await response.json();
    document.getElementById("result").innerText = "성공";
  } catch (error) {
    document.getElementById("result").innerText = `에러남: ${error}`;
    return; // 에러 났으면 이후 코드 실행 안 함
  }

  // x, y 데이터 준비
  const NO2yArr = jsonData.DATA.slice(0, 168).map(entry => entry.no2 * 1000);
  const NO2xArr = jsonData.DATA.slice(0, 168).map(entry =>
    cvrtDt2n(entry.msrdt.slice(0, 8))  // 날짜 문자열이 "202506091000"일 경우 대비
  );

  console.log("good");

  // TensorFlow.js 모델 구성
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

  const xs = tf.tensor2d(NO2xArr, [NO2xArr.length, 1]);
  const ys = tf.tensor2d(NO2yArr, [NO2yArr.length, 1]);

  await model.fit(xs, ys, { epochs: 50 });

  console.log("hehehehe");

  const prediction = model.predict(tf.tensor2d([160], [1, 1])).dataSync();
  document.getElementById('result').innerText = `예측값: ${prediction[0].toFixed(2)}`;
}

run();


/*async function run() {
  console.log("🚀 run() 시작");

  try {
    const res = await fetch('./data.json');
    if (!res.ok) throw new Error("데이터 요청 실패");

    const jsonData = await res.json();

    console.log("✅ 데이터 불러오기 성공");

    const NO2yArr = jsonData.DATA.slice(0, 168).map(entry => entry.no2 * 1000);
    const NO2xArr = jsonData.DATA.slice(0, 168).map(entry => cvrtDt2n(entry.msrdt.slice(0, 8)));

    console.log("📊 학습 데이터 준비 완료");

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

    const xs = tf.tensor2d(NO2xArr, [NO2xArr.length, 1]);
    const ys = tf.tensor2d(NO2yArr, [NO2yArr.length, 1]);

    console.log("🔁 학습 시작...");
    await model.fit(xs, ys, { epochs: 50 });

    console.log("✅ 학습 완료");

    const prediction = model.predict(tf.tensor2d([160], [1, 1])).dataSync();
    document.getElementById('result').innerText = `예측값: ${prediction}`;
    console.log("🎉 예측 완료:", prediction);

  } catch (error) {
    document.getElementById('result').innerText = `❌ 에러: ${error.message}`;
    console.error("에러 발생:", error);
  }
}

run();

// const obj = JSON.parse(jsonData);
/*
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

  console.log("yay")

  return dayOfYear;
}
console.log("hello")
async function run() {
  console.log("lets goooo")

  const jsonData = fetch('./data.json').then(res => {
  if (!res) {throw new Error("망함");}
  return res.json();
  // document.getElementById("result").innerHTML = "망함"
}).then(dt => {
  document.getElementById("result").innerHTML = "성공";
    const NO2yArr = dt.DATA.slice(0,168).map(entry => entry.no2 * 1000)
  const NO2xArr = dt.DATA.slice(0,168).map(entry => cvrtDt2n(entry.msrdt.slice(0,8)))

  console.log("good")

  // Create a simple model.
  const model = tf.sequential();
  model.add(tf.layers.dense({units: 1, inputShape: [1]}));

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

  // Generate some synthetic data for training. (y = 2x - 1)
  const xs = tf.tensor2d(NO2xArr, [NO2xArr.length, 1]);
  const ys = tf.tensor2d(NO2yArr, [NO2yArr.length, 1]);

  // Train the model using the data.
  await model.fit(xs, ys, {epochs: 50});

  console.log("hehehehe")
  
  // Use the model to do inference on a data point the model hasn't seen.
  // Should print approximately 39.
  document.getElementById('result').innerText =
      model.predict(tf.tensor2d([160], [1, 1])).dataSync();
}).catch(error => { 
  document.getElementById("result").innerHTML = `에러남 ${ error}`;
});
  /*
  const NO2yArr = jsonData.DATA.slice(0,168).map(entry => entry.no2 * 1000)
  const NO2xArr = jsonData.DATA.slice(0,168).map(entry => cvrtDt2n(entry.msrdt))

  console.log("good")

  // Create a simple model.
  const model = tf.sequential();
  model.add(tf.layers.dense({units: 1, inputShape: [1]}));

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

  // Generate some synthetic data for training. (y = 2x - 1)
  const xs = tf.tensor2d(NO2xArr, [NO2xArr.length, 1]);
  const ys = tf.tensor2d(NO2yArr, [NO2yArr.length, 1]);

  // Train the model using the data.
  await model.fit(xs, ys, {epochs: 50});

  console.log("hehehehe")
  
  // Use the model to do inference on a data point the model hasn't seen.
  // Should print approximately 39.
  document.getElementById('result').innerText =
      model.predict(tf.tensor2d([160], [1, 1])).dataSync();
  */
}
/*
run();
*/

