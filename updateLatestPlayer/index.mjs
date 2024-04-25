import mysql from 'mysql';

const connection = mysql.createConnection({
  host: process.env.RDS_ENDPOINT, 
  user: process.env.RDS_USERNAME, 
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE_NAME 
});

const updateLatestPlayer = async (id) => {
    try {
      // RegistrationSequence 테이블에서 playerId = id 인 플레이어의 정보를 가져와, LatestPlayer 테이블의 latestPlayerSequenceNo를 업데이트
      const getPlayerSequenceQuery = `
        SELECT playerSequenceNo
        FROM RegistrationSequence
        WHERE playerId = ?
      `;
      const updateQuery = `
        UPDATE LatestPlayer 
        SET latestPlayerSequenceNo = ?;
      `;
      const playerSequenceNo = await executeQuery(getPlayerSequenceQuery, [id]);
    
      if (playerSequenceNo === null) { // 해당 ID를 가진 유저가 없는 경우
        throw new Error(`User with ID [${id}] not found`);
      }
      await executeQuery(updateQuery, [playerSequenceNo]);
      
      return playerSequenceNo;
    } catch (err) {
      console.error('Error updating LatestPlayer:', err);
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
    const id = event.id; // Lambda 함수에 전달된 id 값
  
    try {
        const playerSequenceNo = await updateLatestPlayer(id);
        return { message: 'LatestPlayer updated successfully: ' + playerSequenceNo };  
          // e.g. { "message": "LatestPlayer updated successfully: 3" }
    } catch (err) {
        return { error: err.message };
    }
  };