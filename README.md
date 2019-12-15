# PersTool

Collaboration with Northstar Civic Foundation

## To Run on Master

[https://docs.python-guide.org/dev/virtualenvs/](https://docs.python-guide.org/dev/virtualenvs/)

This project was created using python 3.7 and node 10.13.0. In the root directory, run:

`pip3 install virtualenv`

`virtualenv venv`

`source venv/bin/activate`

`pip3 install -r requirements.txt`

`gunicorn pers.wsgi:app`

<!-- In Development:

`pip3 install --user pipenv`

`pipenv install`

`FLASK_APP=$PWD/__init__.py FLASK_ENV=development pipenv run python3 -m flask run` -->

In another window, in the client directory, run:

`npm install`

`npm start`

Make sure that the `client/src/App.js` handleSubmit function points to `'http://127.0.0.1:8000/api'`

## To deploy (Heroku)

This app uses [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

### Install Heroku Cli

`brew tap heroku/brew && brew install heroku`

`heroku login`

Make your changes, then:

Make sure that the `client/src/App.js` handleSubmit function points to `'https://perstool.herokuapp.com/api'`

```bash
git add .
git commit -am "make it better"
git push heroku master
```

## To Run calculator.py

This uses python3. The following packages are required:

* numpy
* matplotlib
* pandas

Usage: ```./calculator2.py <question> <question_param> <ual> <sual> <return_rate> <inflation> <tax>```
Where:

1. ```question``` is in the set {1,2,3} where 1 calculates based on amortization, 2 calculates based on contribution rate, and 3 calculates based on contribution dollar value.
1. ```question_param``` is different depending on the input for ```question```:
    1. When ```question = 1```, this is the amortization period in years. Suggested input: 20
    1. When ```question = 2```, this is the contribution rate as a fraction of 1. Suggested input: .29
    1. When ```question = 3```, this is the contribution as a dollar value in millions. Suggested input: 4200
1. ```ual``` is the ual value in millions. Suggested input: 26600
1. ```sual``` is the sequestered ual value in millions. Suggested input: 0
1. ```return_rate``` is the expected return rate. Suggested input: 1.042
1. ```inflation``` is the expected inflation rate. Suggested value: 1.03
1. ```tax``` is the proposed tax value in millions. Suggested input: 0

Additionally, there is a variable that is hard-coded in, called ual_growth, which is set to 1.072. This is because we need the UAL to grow at a constant rate, even if inflation
and/or return_rate go negative (for example).

A sample usage is: ```./calculator2.py 1 20 26600 0 1.042 1.03 0```
