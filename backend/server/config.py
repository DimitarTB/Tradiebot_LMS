from flask import Flask
import pymongo
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os
from flask_mail import Mail

config = {
    'ORIGINS': "*",
    'SECRET_KEY': "123456"
}

app = Flask(__name__)
cors = CORS(app, resources={
        r'/*': {
            "Access-Control-Allow-Origin": config["ORIGINS"],
            "Access-Control-Allow-Credentials": True,
            'supports_credentials': True
        },
    },
    supports_credentials = True,
    expose_headers = "*"
)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['JWT_SECRET_KEY'] = 'secret!'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 28800
jwt = JWTManager(app)

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'flaskmailstest@gmail.com'
app.config['MAIL_PASSWORD'] = 'flaskmail1+'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)


app.config["SECRET_KEY"] = "asd"
client = pymongo.MongoClient(host="localhost", port=27017)
db = client['test-database']