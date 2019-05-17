# PersTool
Collaboration with Northstar Civic Foundation

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