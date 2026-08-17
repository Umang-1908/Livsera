from dotenv import load_dotenv
import os
load_dotenv()
SECRETKEY=os.getenv("SECRETKEY")
ALGORITHM=os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_TIME=os.getenv("ACCESS_TOKEN_EXPIRE_TIME")
DATABASEURL=os.getenv("DATABASEURL")
