import mysql from 'mysql';

const connection = mysql.createConnection({
  host: process.env.RDS_ENDPOINT, 
  user: process.env.RDS_USERNAME, 
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE_NAME 
});

const getQueuePosition = async (id) => {
  try {
    // 1. id를 가진 player의 순서 정보를 playerSequenceNo 변수에 저장
    const playerSequenceQuery = 'SELECT playerSequenceNo FROM RegistrationSequence WHERE playerId = ?';
    const playerSequenceNo = await executeQuery(playerSequenceQuery, [id]);

    // 2. LatestPlayer의 순서 정보를 currentPlayerSequenceNo 변수에 저장
    const currentPlayerSequenceQuery = 'SELECT latestPlayerSequenceNo FROM LatestPlayer';
    const currentPlayerSequenceNo = await executeQuery(currentPlayerSequenceQuery, []);
    
    if (!playerSequenceNo) { // player의 순서를 불러올 수 없는 경우
      throw new Error(`Error finding user with ID [${id}]`);
    } else if ( !currentPlayerSequenceNo) {
      throw new Error(`Error getting latest player info`);
    }
    // 3. 두 값을 빼서 리턴
    return (playerSequenceNo - currentPlayerSequenceNo);
  } catch (err) {
    console.error('Error getting queue position:', err);
    throw err;
  }
};

const executeQuery = (query, values) => {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (err, result) => {
      if (err) {
        return reject(err);
      }
      // 첫 번째 행의 첫 번째 열 값을 반환
      resolve(result.length > 0 ? result[0][Object.keys(result[0])[0]] : null);
    });
  });
};

export const handler = async (event) => {
  const id = event.id; // Lambda 함수에 request body로 전달된 id 값

  try {
    const queuePosition = await getQueuePosition(id);
    return { queuePosition };  // e.g. { "queuePosition": 15 }
  } catch (err) {
    return { error: err.message };
  }
};