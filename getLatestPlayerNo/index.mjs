import mysql from 'mysql';

const connection = mysql.createConnection({
  host: process.env.RDS_ENDPOINT, 
  user: process.env.RDS_USERNAME, 
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE_NAME 
});

const getLatestPlayerNo = async () => {
    try {
      // LatestPlayer의 순서 정보 리턴
      const query = 'SELECT latestPlayerSequenceNo FROM LatestPlayer';
      const latestPlayerNo = await executeQuery(query, []);
      return latestPlayerNo;
    } catch (err) {
      console.error('Error getting latest player number:', err);
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
    try {
        const latestPlayerNo = await getLatestPlayerNo();
        return { latestPlayerNo }; // e.g. { "latestPlayerNo": 3 }
    } catch (err) {
        return { error: err.message };
    }
  };