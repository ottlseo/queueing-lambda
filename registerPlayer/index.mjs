import mysql from 'mysql';

const connection = mysql.createConnection({
  host: process.env.RDS_ENDPOINT, 
  user: process.env.RDS_USERNAME, 
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE_NAME 
});


const registerPlayer = async (id) => {
	try {
    // 1. player 정보를 MySQL DB에 등록 // playerSequenceNo는 자동 생성됨
    const insertQuery = 'INSERT INTO RegistrationSequence (playerId) VALUES (?)';
    const result = await executeQuery(insertQuery, [id]);
    return result.insertId;     // 자동 생성된 playerSequenceNo 값 반환

  } catch (err) {
    console.error('Error registering player:', err);
    throw err;
  }
};

const executeQuery = (query, values) => {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};


export const handler = async (event) => {
    const id = event.id; // Lambda 함수에 전달된 id 값
  
    try {
      const playerSequenceNo = await registerPlayer(id);
      return { playerSequenceNo }; // e.g. { "playerSequenceNo": 3 }
    } catch (err) {
      return { error: err.message };
    }
  };