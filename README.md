# queueing-lambda
Queueing mechanism using AWS Lambda (nodejs 20.x) and mysql

## 1. Deploying database for queueing (RDS for Mysql)

#### `RegistrationSequence` table
```sql
CREATE TABLE RegistrationSequence (
    playerId VARCHAR(100) NOT NULL,
    playerSequenceNo INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (playerSequenceNo)
);
```

- **Schema**

    | Field name | Description |
    | --- | --- |
    | playerId | DDB와 연동되는 정보 |
    | playerSequenceNo | 등록 순서  (*AUTO_INCREMENT) |


#### `LatestPlayer` table

```sql
CREATE TABLE LatestPlayer (
    latestPlayerSequenceNo INT NOT NULL,
    PRIMARY KEY (latestPlayerSequenceNo)
);
```

- **Schema**

    | Field name | Description |
    | --- | --- |
    | latestPlayerSequenceNo | 마지막으로 플레이한 사용자의 playerSequence. 람다 함수 (updateLatestPlayer)를 이용하여 계속 업데이트 |


## 2. Deploying Lambda functions for updating DB

### How to generate
TBD (CDK code will be added)

```bash
cd LAMBDA_DIRECTORY_YOU_WANT

zip -r function.zip node_modules index.mjs   

# then upload the function.zip to your AWS Lambda console
```


#### `registerPlayer` 
Calling when a player is registered in the queue - add user to RegistrationSequence table

####  `updateLatestPlayer`
TBD

#### `getQueuePosition`
TBD

#### `getLatestPlayerNo`
TBD

